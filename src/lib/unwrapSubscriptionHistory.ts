import type { SubscriptionHistoryEvent } from "@/types/subscription";

export function unwrapSubscriptionHistory(data: unknown): SubscriptionHistoryEvent[] {
  if (!data || typeof data !== "object") return [];

  const root = data as Record<string, unknown>;
  const list =
    root.history ??
    (root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>).history
      : null);

  if (!Array.isArray(list)) return [];

  return list
    .filter((item): item is SubscriptionHistoryEvent => {
      return (
        item !== null &&
        typeof item === "object" &&
        "id" in item &&
        "eventType" in item &&
        "createdAt" in item
      );
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}
