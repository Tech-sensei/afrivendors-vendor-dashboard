import http from "@/lib/http";
import { unwrapSubscriptionHistory } from "@/lib/unwrapSubscriptionHistory";
import { unwrapVendorSubscription } from "@/lib/unwrapVendorSubscription";
import type { VendorApiSubscription, SubscriptionHistoryEvent } from "@/types/subscription";

export const VENDOR_SUBSCRIPTION_QUERY_KEY = ["vendor", "subscription"] as const;
export const VENDOR_SUBSCRIPTION_HISTORY_QUERY_KEY = [
  "vendor",
  "subscription",
  "history",
] as const;

export async function fetchVendorSubscription(): Promise<VendorApiSubscription | null> {
  try {
    const { data } = await http.get<unknown>("/subscription");
    return unwrapVendorSubscription(data);
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) return null;
    throw error;
  }
}

export async function fetchSubscriptionHistory(): Promise<SubscriptionHistoryEvent[]> {
  try {
    const { data } = await http.get<unknown>("/subscription/history");
    return unwrapSubscriptionHistory(data);
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) return [];
    throw error;
  }
}
