"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/store/hooks";
import { VENDOR_BILLING_INTERVALS } from "@/data/subscriptionPlans";
import { buildSubscriptionViewFromApi } from "@/lib/subscription";
import {
  fetchVendorSubscription,
  VENDOR_SUBSCRIPTION_HISTORY_QUERY_KEY,
  VENDOR_SUBSCRIPTION_QUERY_KEY,
} from "@/services/vendorSubscriptionQueries";

export function useVendorSubscription() {
  const profile = useAppSelector((s) => s.auth.profile);
  const isLoadingUser = useAppSelector((s) => s.auth.isLoadingUser);
  const createdAt = profile?.vendor?.createdAt;
  const profileSubscription = profile?.subscription;

  const { data: fetchedSubscription, isLoading: isLoadingSubscription } =
    useQuery({
      queryKey: VENDOR_SUBSCRIPTION_QUERY_KEY,
      queryFn: fetchVendorSubscription,
      enabled: Boolean(profile),
      staleTime: 60_000,
    });

  const apiSubscription = fetchedSubscription ?? profileSubscription ?? null;

  const view = useMemo(
    () => buildSubscriptionViewFromApi(apiSubscription, createdAt),
    [apiSubscription, createdAt]
  );

  const hydrated = Boolean(profile) && !isLoadingUser && !isLoadingSubscription;

  const selectedInterval = VENDOR_BILLING_INTERVALS.find(
    (i) => i.id === view.selectedIntervalId
  );

  return {
    hydrated,
    view,
    apiSubscription,
    selectedInterval,
    intervals: VENDOR_BILLING_INTERVALS,
  };
}

export function useInvalidateVendorSubscription() {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: VENDOR_SUBSCRIPTION_QUERY_KEY });
    void queryClient.invalidateQueries({
      queryKey: VENDOR_SUBSCRIPTION_HISTORY_QUERY_KEY,
    });
  };
}
