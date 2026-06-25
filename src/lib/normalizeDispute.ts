import type { VendorOrderDispute } from "@/types/dispute";

export function normalizeDisputeFromApi(raw: unknown): VendorOrderDispute | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (typeof d.reason !== "string") return null;

  return {
    id: Number(d.id),
    reason: d.reason,
    resolution: (d.resolution as string | null) ?? null,
    status: String(d.status ?? "pending"),
    resolver: d.resolver != null ? String(d.resolver) : null,
    resolvedBy: d.resolvedBy != null ? Number(d.resolvedBy) : null,
    resolvedAt: (d.resolvedAt as string | null) ?? null,
    escalatedBy: d.escalatedBy != null ? String(d.escalatedBy) : null,
    escalatedAt: (d.escalatedAt as string | null) ?? null,
    createdAt: String(d.createdAt ?? ""),
    updatedAt: String(d.updatedAt ?? ""),
  };
}
