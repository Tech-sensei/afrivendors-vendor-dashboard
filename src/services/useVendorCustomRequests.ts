import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import { mapCustomRequestToVendorRequest } from "@/lib/vendorCustomRequestFromApi";
import {
  vendorTabToAssignedStatuses,
  vendorTabUsesPendingPool,
} from "@/lib/vendorCustomRequestTabApi";
import { filterVendorRequestsByTab } from "@/lib/vendorCustomRequestFilters";
import {
  unwrapCustomRequest,
  unwrapCustomRequestList,
} from "@/lib/unwrapCustomRequest";
import type {
  CustomRequestApiStatus,
  DropCustomRequestQuotePayload,
} from "@/types/customRequestApi";
import type {
  VendorCustomRequest,
  VendorCustomRequestTabId,
} from "@/types/vendorCustomRequests";
import type { VendorSendQuotePayload } from "@/lib/validations/vendorCustomRequestSchemas";
import {
  useVendorEscalateDispute,
  useVendorResolveDisputeRefundUser,
} from "@/services/useVendorDisputes";

export const VENDOR_CUSTOM_REQUESTS_KEY = "vendor-custom-requests";
export const VENDOR_CUSTOM_REQUEST_COUNTS_KEY = "vendor-custom-request-counts";
export const VENDOR_CUSTOM_REQUEST_DETAIL_KEY = "vendor-custom-request-detail";

function getErrorMessage(err: unknown): string {
  const ax = err as {
    response?: { data?: { message?: string; responseMessage?: string } };
  };
  return (
    ax?.response?.data?.responseMessage ||
    ax?.response?.data?.message ||
    "Something went wrong. Please try again."
  );
}

async function fetchPendingCustomRequests(): Promise<VendorCustomRequest[]> {
  const { data } = await http.get("/custom-request/pending");
  return unwrapCustomRequestList(data).map((row) =>
    mapCustomRequestToVendorRequest(row, "pending")
  );
}

async function fetchAssignedCustomRequests(
  statuses?: CustomRequestApiStatus[]
): Promise<VendorCustomRequest[]> {
  const fetchOne = async (status?: CustomRequestApiStatus) => {
    const { data } = await http.get("/custom-request/vendor/assigned", {
      params: status ? { status } : undefined,
    });
    return unwrapCustomRequestList(data);
  };

  if (!statuses || statuses.length === 0) {
    const list = await fetchOne();
    return list.map((row) => mapCustomRequestToVendorRequest(row, "assigned"));
  }

  if (statuses.length === 1) {
    const list = await fetchOne(statuses[0]);
    return list.map((row) => mapCustomRequestToVendorRequest(row, "assigned"));
  }

  const batches = await Promise.all(statuses.map((status) => fetchOne(status)));
  const byId = new Map<string, VendorCustomRequest>();
  for (const batch of batches) {
    for (const row of batch) {
      byId.set(String(row.id), mapCustomRequestToVendorRequest(row, "assigned"));
    }
  }
  return Array.from(byId.values());
}

async function fetchVendorCustomRequestsByTab(
  tab: VendorCustomRequestTabId
): Promise<VendorCustomRequest[]> {
  if (tab === "incoming") {
    return fetchPendingCustomRequests();
  }

  const assignedStatuses = vendorTabToAssignedStatuses(tab);

  if (tab === "all") {
    const [pending, assigned] = await Promise.all([
      fetchPendingCustomRequests(),
      fetchAssignedCustomRequests(),
    ]);
    const byId = new Map<string, VendorCustomRequest>();
    for (const row of [...pending, ...assigned]) {
      byId.set(row.id, row);
    }
    return Array.from(byId.values());
  }

  const assigned = await fetchAssignedCustomRequests(assignedStatuses);
  if (!vendorTabUsesPendingPool(tab)) {
    return assigned;
  }

  return assigned;
}

export async function fetchVendorCustomRequestById(
  id: number
): Promise<VendorCustomRequest> {
  const { data } = await http.get(`/custom-request/vendor/${id}`);
  const row = unwrapCustomRequest(data);
  if (!row) {
    throw new Error("Custom request not found");
  }
  return mapCustomRequestToVendorRequest(row, "assigned");
}

export function useVendorCustomRequests(tab: VendorCustomRequestTabId) {
  return useQuery<VendorCustomRequest[]>({
    queryKey: [VENDOR_CUSTOM_REQUESTS_KEY, tab],
    queryFn: async () => {
      const list = await fetchVendorCustomRequestsByTab(tab);
      if (tab === "all" || tab === "incoming") return list;
      return filterVendorRequestsByTab(list, tab);
    },
  });
}

export function useVendorCustomRequestTabCounts() {
  return useQuery<Record<VendorCustomRequestTabId, number>>({
    queryKey: [VENDOR_CUSTOM_REQUEST_COUNTS_KEY],
    queryFn: async () => {
      const tabs: VendorCustomRequestTabId[] = [
        "all",
        "incoming",
        "quoted",
        "active",
        "completed",
        "passed",
      ];
      const entries = await Promise.all(
        tabs.map(async (tab) => {
          const list = await fetchVendorCustomRequestsByTab(tab);
          const filtered =
            tab === "all" || tab === "incoming"
              ? list
              : filterVendorRequestsByTab(list, tab);
          return [tab, filtered.length] as const;
        })
      );
      return Object.fromEntries(entries) as Record<VendorCustomRequestTabId, number>;
    },
    staleTime: 30_000,
  });
}

export function useVendorCustomRequestDetail(id: number | null, enabled: boolean) {
  return useQuery<VendorCustomRequest>({
    queryKey: [VENDOR_CUSTOM_REQUEST_DETAIL_KEY, id],
    queryFn: () => fetchVendorCustomRequestById(id!),
    enabled: enabled && id != null,
    staleTime: 15_000,
  });
}

function toQuotePayload(payload: VendorSendQuotePayload): DropCustomRequestQuotePayload {
  const body: DropCustomRequestQuotePayload = {
    breakdown: payload.breakdown,
  };
  if (payload.note?.trim()) {
    body.note = payload.note.trim();
  }
  if (payload.validUntil?.trim()) {
    body.validUntil = payload.validUntil.trim();
  }
  return body;
}

export function useSendVendorCustomRequestQuote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      requestId,
      payload,
      isEdit,
    }: {
      requestId: number;
      payload: VendorSendQuotePayload;
      isEdit: boolean;
    }) => {
      const body = toQuotePayload(payload);
      const { data } = isEdit
        ? await http.patch(`/custom-request/${requestId}/quote`, body)
        : await http.post(`/custom-request/${requestId}/quote`, body);
      const row = unwrapCustomRequest(data);
      return row
        ? mapCustomRequestToVendorRequest(row, "assigned")
        : null;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: [VENDOR_CUSTOM_REQUESTS_KEY] });
      void queryClient.invalidateQueries({
        queryKey: [VENDOR_CUSTOM_REQUEST_COUNTS_KEY],
      });
      void queryClient.invalidateQueries({
        queryKey: [VENDOR_CUSTOM_REQUEST_DETAIL_KEY, variables.requestId],
      });
    },
  });
}

export function useCompleteVendorCustomRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId: number) => {
      const { data } = await http.patch(`/custom-request/${requestId}/complete`, {
        status: "completed",
      });
      const row = unwrapCustomRequest(data);
      return row
        ? mapCustomRequestToVendorRequest(row, "assigned")
        : null;
    },
    onSuccess: (_data, requestId) => {
      void queryClient.invalidateQueries({ queryKey: [VENDOR_CUSTOM_REQUESTS_KEY] });
      void queryClient.invalidateQueries({
        queryKey: [VENDOR_CUSTOM_REQUEST_COUNTS_KEY],
      });
      void queryClient.invalidateQueries({
        queryKey: [VENDOR_CUSTOM_REQUEST_DETAIL_KEY, requestId],
      });
    },
  });
}

function invalidateVendorCustomRequestQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  requestId?: number
) {
  void queryClient.invalidateQueries({ queryKey: [VENDOR_CUSTOM_REQUESTS_KEY] });
  void queryClient.invalidateQueries({
    queryKey: [VENDOR_CUSTOM_REQUEST_COUNTS_KEY],
  });
  if (requestId != null) {
    void queryClient.invalidateQueries({
      queryKey: [VENDOR_CUSTOM_REQUEST_DETAIL_KEY, requestId],
    });
  }
}

export function useVendorRefundCustomRequestDispute() {
  const queryClient = useQueryClient();
  return useVendorResolveDisputeRefundUser({
    onSuccess: ({ orderId }) =>
      invalidateVendorCustomRequestQueries(queryClient, orderId),
  });
}

export function useVendorEscalateCustomRequestDispute() {
  const queryClient = useQueryClient();
  return useVendorEscalateDispute({
    onSuccess: ({ orderId }) =>
      invalidateVendorCustomRequestQueries(queryClient, orderId),
  });
}

export { getErrorMessage as getVendorCustomRequestErrorMessage };
