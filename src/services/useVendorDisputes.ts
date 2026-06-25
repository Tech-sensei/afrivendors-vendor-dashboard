import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/lib/http";
import type { VendorDisputeOrderType } from "@/types/dispute";

export type VendorResolveDisputePayload = {
  type: VendorDisputeOrderType;
  orderId: number;
  resolution: string;
};

type VendorDisputeMutationOptions<TVariables = void> = {
  onSuccess?: (variables: TVariables) => void;
  successMessage?: string;
  errorMessage?: string;
};

function getErrorMessage(error: unknown, fallback: string): string {
  const ax = error as {
    response?: { data?: { message?: string; responseMessage?: string } };
  };
  return (
    ax?.response?.data?.responseMessage ||
    ax?.response?.data?.message ||
    fallback
  );
}

export function useVendorEscalateDispute(
  options?: VendorDisputeMutationOptions<{
    type: VendorDisputeOrderType;
    orderId: number;
  }>
) {
  return useMutation({
    mutationFn: async ({
      type,
      orderId,
    }: {
      type: VendorDisputeOrderType;
      orderId: number;
    }) => {
      const { data } = await http.patch(
        `/vendor/disputes/${type}/${orderId}/escalate`
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success(
        options?.successMessage ??
          "Escalated to Afrivendors. Our team will review and update you."
      );
      options?.onSuccess?.(variables);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, options?.errorMessage ?? "Could not escalate.")
      );
    },
  });
}

export function useVendorResolveDisputeRefundUser(
  options?: VendorDisputeMutationOptions<VendorResolveDisputePayload>
) {
  return useMutation({
    mutationFn: async (payload: VendorResolveDisputePayload) => {
      const { data } = await http.patch(
        `/vendor/disputes/${payload.type}/${payload.orderId}/resolve/refund-user`,
        { resolution: payload.resolution }
      );
      return data;
    },
    onSuccess: (_data, variables) => {
      toast.success(
        options?.successMessage ??
          "Customer refunded. This dispute is now closed."
      );
      options?.onSuccess?.(variables);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          options?.errorMessage ?? "Could not process refund."
        )
      );
    },
  });
}
