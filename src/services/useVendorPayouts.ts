import { keepPreviousData, useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import {
  normalizeVendorPayoutBreakdown,
} from "@/lib/normalizeVendorPayoutBreakdown";
import {
  mapVendorPayoutApiToRow,
  mapVendorPayoutDetailToUi,
  type VendorPayoutDetail,
  type VendorPayoutRow,
} from "@/lib/mapVendorPayout";
import type {
  VendorPayoutDetailApi,
  VendorPayoutListStatusParam,
  VendorPayoutsBreakdown,
  VendorPayoutsListResponse,
} from "@/types/vendor-payouts";

export const VENDOR_PAYOUTS_LIST_QUERY_KEY = ["vendor", "wallet", "payouts"] as const;
export const VENDOR_PAYOUTS_BREAKDOWN_QUERY_KEY = [
  "vendor",
  "wallet",
  "payouts",
  "breakdown",
] as const;
export const VENDOR_PAYOUT_DETAIL_QUERY_KEY = [
  "vendor",
  "wallet",
  "payouts",
  "detail",
] as const;

function normalizePayoutsList(payload: unknown): VendorPayoutsListResponse | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  const inner =
    p.data &&
    typeof p.data === "object" &&
    !Array.isArray(p.data) &&
    Array.isArray((p.data as Record<string, unknown>).data)
      ? (p.data as Record<string, unknown>)
      : p;
  if (!Array.isArray(inner.data)) return null;
  const meta = inner.meta;
  if (!meta || typeof meta !== "object") return null;
  const m = meta as Record<string, unknown>;
  return {
    data: inner.data as VendorPayoutsListResponse["data"],
    meta: {
      page: Number(m.page ?? 1),
      limit: Number(m.limit ?? 10),
      total: Number(m.total ?? 0),
      totalPages: Number(m.totalPages ?? 1),
    },
  };
}

function normalizePayoutDetail(payload: unknown): VendorPayoutDetailApi | null {
  if (!payload || typeof payload !== "object") return null;
  const p = payload as Record<string, unknown>;
  const inner: unknown =
    p.data && typeof p.data === "object" && !Array.isArray(p.data) && "id" in (p.data as object)
      ? p.data
      : p;
  const item = inner as VendorPayoutDetailApi;
  if (typeof item.id !== "number") return null;
  return item;
}

export function useVendorPayoutsBreakdown() {
  return useQuery({
    queryKey: [...VENDOR_PAYOUTS_BREAKDOWN_QUERY_KEY],
    queryFn: async (): Promise<VendorPayoutsBreakdown> => {
      const { data } = await http.get<unknown>("/wallet/payouts/breakdown");
      const normalized = normalizeVendorPayoutBreakdown(data);
      if (!normalized) throw new Error("Invalid payouts breakdown response");
      return normalized;
    },
  });
}

export function useVendorPayoutsList(params: {
  page: number;
  limit: number;
  status?: VendorPayoutListStatusParam;
}) {
  return useQuery({
    queryKey: [
      ...VENDOR_PAYOUTS_LIST_QUERY_KEY,
      params.page,
      params.limit,
      params.status ?? "",
    ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/wallet/payouts", {
        params: {
          page: params.page,
          limit: params.limit,
          ...(params.status ? { status: params.status } : {}),
        },
      });
      const normalized = normalizePayoutsList(data);
      if (!normalized) throw new Error("Invalid payouts list response");
      return {
        payouts: normalized.data.map(mapVendorPayoutApiToRow),
        meta: normalized.meta,
      };
    },
  });
}

export function useVendorPayoutDetail(payoutId: string | null) {
  return useQuery<VendorPayoutDetail>({
    queryKey: [...VENDOR_PAYOUT_DETAIL_QUERY_KEY, payoutId ?? ""],
    enabled: Boolean(payoutId),
    queryFn: async () => {
      const { data } = await http.get<unknown>(`/wallet/payouts/${payoutId}`);
      const normalized = normalizePayoutDetail(data);
      if (!normalized) throw new Error("Invalid payout detail response");
      return mapVendorPayoutDetailToUi(normalized);
    },
  });
}

export type { VendorPayoutRow, VendorPayoutDetail, VendorPayoutListStatusParam };
