import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/http";
import type { Service } from "@/components/services/ServiceCard";

const QUERY_KEY = ["vendor-services"];

interface ServicesResponse {
  services: Service[];
  totalServices: number;
  publishedServices: number;
  hiddenServices: number;
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

export const useVendorServices = () => {
  return useQuery<ServicesResponse>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get("/services/vendor/me");
      const payload = data?.data ?? data;
      return {
        services: payload.services ?? [],
        totalServices: payload.totalServices ?? 0,
        publishedServices: payload.publishedServices ?? 0,
        hiddenServices: payload.hiddenServices ?? 0,
      };
    },
  });
};

// ─── Create ───────────────────────────────────────────────────────────────────

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const { data } = await http.post("/services", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: (_, __, ) => {
      toast.success("Service created successfully!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to create service"
      );
    },
  });
};

// ─── Update ───────────────────────────────────────────────────────────────────

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: FormData }) => {
      const { data } = await http.patch(`/services/${id}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Service updated successfully!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to update service"
      );
    },
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await http.delete(`/services/${id}`);
      return data;
    },
    onSuccess: () => {
      toast.success("Service deleted successfully");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to delete service"
      );
    },
  });
};

// ─── Hide ─────────────────────────────────────────────────────────────────────

export const useHideService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await http.patch(`/services/${id}/hide`);
      return data;
    },
    onSuccess: () => {
      toast.success("Service hidden from customers");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to hide service"
      );
    },
  });
};

// ─── Publish ──────────────────────────────────────────────────────────────────

export const usePublishService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await http.patch(`/services/${id}/publish`);
      return data;
    },
    onSuccess: () => {
      toast.success("Service is now visible to customers!");
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to publish service"
      );
    },
  });
};
