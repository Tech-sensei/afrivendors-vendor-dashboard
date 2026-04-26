import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosHeaders } from "axios";
import http from "@/lib/http";
import type { SupportTicket, TicketMessage, TicketStatus } from "@/data/help-support";

const TICKETS_QUERY_KEY = ["vendor-support-tickets"] as const;

function unwrapData<T>(payload: unknown, fallback: T): T {
  if (payload && typeof payload === "object" && "data" in (payload as object)) {
    return ((payload as { data: unknown }).data as T) ?? fallback;
  }
  return (payload as T) ?? fallback;
}

function normalizeStatus(status: unknown): TicketStatus {
  const value = String(status ?? "open").toLowerCase().replace(/_/g, "-");
  if (value === "in-progress" || value === "inprogress") return "in-progress";
  if (value === "resolved") return "resolved";
  if (value === "closed") return "closed";
  return "open";
}

function mapMessage(row: Record<string, unknown>): TicketMessage {
  const senderObj = (row.sender ?? {}) as Record<string, unknown>;
  const accountType = String(senderObj.accountType ?? "user").toLowerCase();
  const sender = accountType === "user" ? "user" : "support";
  const firstName = String(senderObj.firstName ?? "");
  const lastName = String(senderObj.lastName ?? "");
  const senderName =
    `${firstName} ${lastName}`.trim() ||
    (sender === "support" ? "Support Team" : "You");

  return {
    id: String(row.id ?? `${Date.now()}`),
    sender,
    message: String(row.message ?? ""),
    timestamp: String(row.createdAt ?? new Date().toISOString()),
    senderName,
  };
}

function mapTicket(row: Record<string, unknown>): SupportTicket {
  const createdAt = String(row.createdAt ?? row.created_at ?? new Date().toISOString());
  const updatedAt = String(row.updatedAt ?? row.updated_at ?? createdAt);
  const description = String(row.message ?? row.description ?? row.subject ?? "");

  const messages = Array.isArray(row.messages)
    ? row.messages.map((m) => mapMessage(m as Record<string, unknown>))
    : description
      ? [
          {
            id: "1",
            sender: "user" as const,
            message: description,
            timestamp: createdAt,
            senderName: "You",
          },
        ]
      : [];

  return {
    id: String(row.id ?? ""),
    subject: String(row.subject ?? ""),
    message: description,
    status: normalizeStatus(row.status),
    priority: (String(row.priority ?? "medium").toLowerCase() as SupportTicket["priority"]) ?? "medium",
    category: String(row.category ?? "General"),
    createdAt,
    updatedAt,
    attachments: Array.isArray(row.attachments)
      ? row.attachments.map((a) => String(a))
      : [],
    messages,
  };
}

export function useSupportTickets() {
  return useQuery<SupportTicket[]>({
    queryKey: TICKETS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get("/tickets");
      const body = data as Record<string, unknown>;
      const raw = Array.isArray(body?.data) ? body.data : unwrapData<unknown[]>(data, []);
      return raw.map((row) => mapTicket(row as Record<string, unknown>));
    },
  });
}

export function useTicketMessages(ticketId: string | null, enabled: boolean) {
  return useQuery<TicketMessage[]>({
    queryKey: ["vendor-support-ticket-messages", ticketId],
    queryFn: async () => {
      if (!ticketId) return [];
      const { data } = await http.get(`/tickets/${ticketId}/messages`);
      const raw = unwrapData<unknown[]>(data, []);
      return raw.map((row) => mapMessage(row as Record<string, unknown>));
    },
    enabled: Boolean(ticketId) && enabled,
    staleTime: 30_000,
  });
}

export function useCreateSupportTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      subject: string;
      message: string;
      priority: SupportTicket["priority"];
      category: string;
      attachments: File[];
    }) => {
      const fd = new FormData();
      fd.append("subject", input.subject.trim());
      fd.append("message", input.message.trim());
      fd.append("priority", input.priority);
      fd.append("category", input.category);
      input.attachments.forEach((file) => fd.append("attachments", file));

      const { data } = await http.post("/tickets", fd, {
        transformRequest: [
          (payload, headers) => {
            if (payload instanceof FormData && headers) {
              if (headers instanceof AxiosHeaders) {
                headers.delete("Content-Type");
              } else {
                delete (headers as Record<string, unknown>)["Content-Type"];
              }
            }
            return payload;
          },
        ],
      });
      return mapTicket(unwrapData<Record<string, unknown>>(data, {}));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
    },
  });
}

export function useSendSupportTicketMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { ticketId: string; message: string; attachments?: string[] }) => {
      const { data } = await http.post("/tickets/message", {
        ticketId: Number(input.ticketId),
        message: input.message.trim(),
        attachments: input.attachments ?? [],
      });
      const raw = unwrapData<Record<string, unknown> | null>(data, null);
      return raw ? mapMessage(raw) : null;
    },
    onSuccess: (_msg, input) => {
      queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ["vendor-support-ticket-messages", input.ticketId],
      });
    },
  });
}

