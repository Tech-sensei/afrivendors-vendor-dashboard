import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "@/lib/http";
import type { VendorAppointment, VendorAppointmentStatus } from "@/types/appointments";

const QUERY_KEY = ["vendor-appointments"] as const;

export const useVendorAppointments = () =>
  useQuery<VendorAppointment[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get("/vendor/appointments");
      return (data?.data ?? data) as VendorAppointment[];
    },
  });

export const useVendorAppointmentDetail = (id: number | undefined, enabled: boolean) =>
  useQuery<VendorAppointment>({
    queryKey: ["vendor-appointment-detail", id],
    queryFn: async () => {
      const { data } = await http.get(`/vendor/appointments/${id}`);
      return (data?.data ?? data) as VendorAppointment;
    },
    enabled: enabled && !!id,
    staleTime: 30_000,
  });

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: Exclude<VendorAppointmentStatus, "pending"> }) => {
      const { data } = await http.patch(`/vendor/appointments/${id}/status`, { status });
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["vendor-appointment-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard"] });
    },
  });
};
