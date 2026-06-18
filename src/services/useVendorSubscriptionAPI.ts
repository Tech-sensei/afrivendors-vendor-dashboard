"use client";

import { useMutation } from "@tanstack/react-query";
import {
  cancelVendorSubscriptionAtPeriodEnd,
  patchSubscriptionAutoRenewal,
  postCreateVendorSubscription,
  type CreateSubscriptionInput,
} from "@/lib/vendorSubscriptionApi";

export function useCreateVendorSubscription() {
  return useMutation({
    mutationFn: (input: CreateSubscriptionInput) =>
      postCreateVendorSubscription(input),
  });
}

export function useCancelVendorSubscription() {
  return useMutation({
    mutationFn: cancelVendorSubscriptionAtPeriodEnd,
  });
}

export function useUpdateSubscriptionAutoRenewal() {
  return useMutation({
    mutationFn: patchSubscriptionAutoRenewal,
  });
}
