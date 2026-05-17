import type { VendorPayoutsBreakdown } from "@/types/vendor-payouts";

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function normalizeVendorPayoutBreakdown(
  payload: unknown,
): VendorPayoutsBreakdown | null {
  if (!payload || typeof payload !== "object") return null;

  const root = payload as Record<string, unknown>;
  const source =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root;

  if ("totalPayoutRequests" in source) {
    return {
      totalPayoutRequests: num(source.totalPayoutRequests),
      pendingPayouts: num(source.pendingPayouts),
      rejectedPayouts: num(source.rejectedPayouts),
      acceptedPayouts: num(source.acceptedPayouts),
    };
  }

  return null;
}
