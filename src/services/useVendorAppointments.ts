import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/http";
import {
  vendorAppointmentTabToApiStatuses,
  type VendorAppointment,
  type VendorAppointmentStatus,
  type VendorAppointmentTabId,
  type VendorAppointmentsApiStatus,
} from "@/types/appointments";
import { normalizeVendorAppointment } from "@/lib/vendorAppointmentPayment";

const APPOINTMENTS_QUERY_KEY = "vendor-appointments";
const APPOINTMENTS_COUNTS_KEY = "vendor-appointments-counts";

function mapAppointmentsList(raw: unknown): VendorAppointment[] {
  const list = (raw as VendorAppointment[]) ?? [];
  return list.map((a) =>
    normalizeVendorAppointment(a as VendorAppointment & Record<string, unknown>)
  );
}

async function fetchVendorAppointmentsByStatuses(
  statuses: VendorAppointmentsApiStatus[]
): Promise<VendorAppointment[]> {
  const fetchOne = async (status: VendorAppointmentsApiStatus) => {
    const { data } = await http.get("/vendor/appointments", {
      params: { status },
    });
    const list = (data?.data ?? data) as VendorAppointment[];
    return Array.isArray(list) ? list : [];
  };

  if (statuses.length === 1) {
    return mapAppointmentsList(await fetchOne(statuses[0]));
  }

  const batches = await Promise.all(statuses.map(fetchOne));
  const byId = new Map<number, VendorAppointment>();
  for (const batch of batches) {
    for (const row of batch) {
      const normalized = normalizeVendorAppointment(
        row as VendorAppointment & Record<string, unknown>
      );
      byId.set(normalized.id, normalized);
    }
  }
  return Array.from(byId.values());
}

function invalidateVendorAppointmentLists(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
  queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_COUNTS_KEY] });
}

export function useVendorAppointments(tab: VendorAppointmentTabId) {
  const statuses = vendorAppointmentTabToApiStatuses(tab);

  return useQuery<VendorAppointment[]>({
    queryKey: [APPOINTMENTS_QUERY_KEY, tab],
    queryFn: () => fetchVendorAppointmentsByStatuses(statuses),
  });
}

export function useVendorAppointmentTabCounts() {
  return useQuery<Record<VendorAppointmentTabId, number>>({
    queryKey: [APPOINTMENTS_COUNTS_KEY],
    queryFn: async () => {
      const tabs: VendorAppointmentTabId[] = [
        "pending",
        "upcoming",
        "past",
        "cancelled",
      ];
      const entries = await Promise.all(
        tabs.map(async (tab) => {
          const list = await fetchVendorAppointmentsByStatuses(
            vendorAppointmentTabToApiStatuses(tab)
          );
          return [tab, list.length] as const;
        })
      );
      return Object.fromEntries(entries) as Record<VendorAppointmentTabId, number>;
    },
    staleTime: 30_000,
  });
}

export async function fetchVendorAppointmentById(
  id: number
): Promise<VendorAppointment> {
  const { data } = await http.get(`/vendor/appointments/${id}`);
  const raw = (data?.data ?? data) as VendorAppointment;
  return normalizeVendorAppointment(
    raw as VendorAppointment & Record<string, unknown>
  );
}

export const useVendorAppointmentDetail = (id: number | undefined, enabled: boolean) =>
  useQuery<VendorAppointment>({
    queryKey: ["vendor-appointment-detail", id],
    queryFn: () => fetchVendorAppointmentById(id!),
    enabled: enabled && !!id,
    staleTime: 30_000,
  });

export type RespondToAppointmentDisputePayload = {
  appointmentId: number;
  message: string;
};

export function useResolveDisputeRefundCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      resolution,
    }: {
      appointmentId: number;
      resolution: string;
    }) => {
      const { data } = await http.post(
        `/vendor/appointments/${appointmentId}/dispute/resolve/refund`,
        { resolution }
      );
      return data;
    },
    onSuccess: (_, { appointmentId }) => {
      toast.success("Customer refunded. This dispute is now closed.");
      invalidateVendorAppointmentLists(queryClient);
      queryClient.invalidateQueries({
        queryKey: ["vendor-appointment-detail", appointmentId],
      });
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Could not process refund. Please try again."
      );
    },
  });
}

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number;
      status: Exclude<VendorAppointmentStatus, "pending">;
    }) => {
      const { data } = await http.patch(`/vendor/appointments/${id}/status`, {
        status,
      });
      return data;
    },
    onSuccess: (_, { id }) => {
      invalidateVendorAppointmentLists(queryClient);
      queryClient.invalidateQueries({ queryKey: ["vendor-appointment-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard"] });
    },
  });
};
