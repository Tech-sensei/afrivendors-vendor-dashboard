import type { VendorApiSubscription } from "@/types/subscription";

/** Normalise login, refresh, `/vendor/me`, and `GET /subscription` payload shapes. */
export function unwrapVendorSubscription(
  data: unknown
): VendorApiSubscription | null {
  if (!data || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;

  // `GET /subscription` → `{ subscription: { ... } }`
  if (root.subscription && typeof root.subscription === "object") {
    return root.subscription as VendorApiSubscription;
  }

  // `{ data: { subscription } }` or `{ data: { ...fields } }`
  const inner = root.data;
  if (inner && typeof inner === "object") {
    const nested = inner as Record<string, unknown>;
    if (nested.subscription && typeof nested.subscription === "object") {
      return nested.subscription as VendorApiSubscription;
    }
    if ("status" in nested && "currentPeriodEnd" in nested) {
      return nested as unknown as VendorApiSubscription;
    }
  }

  // Login / refresh → `subscription` fields at root
  if ("status" in root && "currentPeriodEnd" in root) {
    return root as unknown as VendorApiSubscription;
  }

  return null;
}
