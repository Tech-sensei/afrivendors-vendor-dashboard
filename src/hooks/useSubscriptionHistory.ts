"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchSubscriptionHistory,
  VENDOR_SUBSCRIPTION_HISTORY_QUERY_KEY,
} from "@/services/vendorSubscriptionQueries";

/** Fetch history when mounted (parent should only render when vendor has a subscription). */
export function useSubscriptionHistory(enabled = true) {
  return useQuery({
    queryKey: VENDOR_SUBSCRIPTION_HISTORY_QUERY_KEY,
    queryFn: fetchSubscriptionHistory,
    enabled,
    staleTime: 60_000,
  });
}
