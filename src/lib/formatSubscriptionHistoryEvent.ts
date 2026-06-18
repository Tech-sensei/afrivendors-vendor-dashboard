import { VENDOR_BILLING_INTERVALS } from "@/data/subscriptionPlans";
import { formatSubscriptionDate } from "@/lib/subscription";
import type { SubscriptionHistoryEvent } from "@/types/subscription";

export interface SubscriptionHistoryDisplay {
  title: string;
  detail: string;
}

function planLabelFromMetadata(metadata: Record<string, unknown> | null): string | null {
  if (!metadata) return null;
  const duration = metadata.duration;
  if (typeof duration === "string" && duration !== "skipped") {
    const interval = VENDOR_BILLING_INTERVALS.find((i) => i.stripePriceId === duration);
    if (interval) return interval.label;
  }
  const plan = metadata.plan;
  if (typeof plan === "string" && plan !== "skipped") {
    const interval = VENDOR_BILLING_INTERVALS.find((i) => i.id === plan);
    if (interval) return interval.label;
    return plan;
  }
  return null;
}

function statusLabel(status: string | null): string {
  if (!status) return "";
  const map: Record<string, string> = {
    trial: "free trial",
    active: "active",
    expired: "expired",
    cancelled: "cancelled",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function formatSubscriptionHistoryEvent(
  event: SubscriptionHistoryEvent
): SubscriptionHistoryDisplay {
  const meta = event.metadata;
  const skipped = meta?.skip === true;
  const plan = planLabelFromMetadata(meta);

  switch (event.eventType) {
    case "created":
      if (skipped) {
        return {
          title: "Free trial started",
          detail: "6-month marketplace visibility — no card added",
        };
      }
      return {
        title: "Subscription created",
        detail: plan
          ? `${plan} plan selected`
          : event.newStatus
            ? `Status: ${statusLabel(event.newStatus)}`
            : "Billing plan set up",
      };
    case "renewed":
      return {
        title: "Subscription renewed",
        detail: plan ? `${plan} plan` : "Billing period renewed",
      };
    case "cancelled":
      return {
        title: "Cancellation scheduled",
        detail: "Your listing stays visible until the current period ends",
      };
    case "continued":
      return {
        title: "Cancellation reversed",
        detail: "Auto-renewal will continue at the end of the period",
      };
    case "auto_renewal_enabled":
      return {
        title: "Auto-renewal enabled",
        detail: "Your subscription will renew automatically",
      };
    case "auto_renewal_disabled":
      return {
        title: "Auto-renewal disabled",
        detail: "You will need to renew manually before the period ends",
      };
    case "payment_failed":
      return {
        title: "Payment failed",
        detail: "Update your billing details to keep your listing visible",
      };
    default:
      return {
        title: event.eventType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        detail:
          event.oldStatus && event.newStatus
            ? `${statusLabel(event.oldStatus)} → ${statusLabel(event.newStatus)}`
            : event.newStatus
              ? `Status: ${statusLabel(event.newStatus)}`
              : "",
      };
  }
}

export function formatHistoryEventDate(iso: string): string {
  return formatSubscriptionDate(iso);
}

export function formatHistoryEventTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
