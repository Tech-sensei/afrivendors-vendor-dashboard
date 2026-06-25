export type VendorDisputeOrderType = "appointment" | "custom_request";

export interface VendorOrderDispute {
  id: number;
  reason: string;
  resolution: string | null;
  status: string;
  resolver: string | null;
  resolvedBy: number | null;
  resolvedAt: string | null;
  escalatedBy: string | null;
  escalatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function isVendorOrderDisputeOpen(
  dispute: VendorOrderDispute | null | undefined
): boolean {
  if (!dispute) return false;
  const s = dispute.status.toLowerCase();
  return s !== "resolved" && s !== "closed" && s !== "cancelled";
}

export function isVendorOrderDisputeEscalated(
  dispute: VendorOrderDispute | null | undefined
): boolean {
  if (!dispute) return false;
  if (dispute.escalatedBy != null || dispute.escalatedAt != null) return true;
  const s = dispute.status.toLowerCase();
  const resolverKey = String(dispute.resolver ?? "").toLowerCase();
  return s === "escalated" || resolverKey === "admin";
}
