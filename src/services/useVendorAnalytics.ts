"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { mapVendorAnalyticsApi, type VendorAnalyticsView } from "@/lib/mapVendorAnalytics";

export const VENDOR_ANALYTICS_QUERY_KEY = ["vendor-analytics"] as const;

export function useVendorAnalytics() {
  return useQuery<VendorAnalyticsView>({
    queryKey: VENDOR_ANALYTICS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get("/vendor/analytics");
      return mapVendorAnalyticsApi(data);
    },
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}
