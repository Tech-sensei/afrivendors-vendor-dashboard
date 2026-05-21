"use client";

import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { mapVendorDashboardApi } from "@/lib/mapVendorDashboard";
import type { VendorDashboardView } from "@/types/vendor-dashboard";

export const VENDOR_DASHBOARD_QUERY_KEY = ["vendor-dashboard"] as const;

export function useVendorDashboard() {
  return useQuery<VendorDashboardView>({
    queryKey: VENDOR_DASHBOARD_QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get("/vendor/dashboard");
      return mapVendorDashboardApi(data);
    },
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}
