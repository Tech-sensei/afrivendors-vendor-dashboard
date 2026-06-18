import type { VendorBillingIntervalId } from "@/data/subscriptionPlans";

/** Subscription object from login, refresh, `/vendor/me`, or `GET /subscription`. */
export interface VendorApiSubscription {
  id: string;
  duration: string;
  plan: string;
  status: string;
  trialExpired: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  hasTrial: boolean;
  autoRenewal: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export interface VendorSubscriptionRecord {
  intervalId: VendorBillingIntervalId;
  status: "active" | "cancelled";
  startedAt: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd?: boolean;
}

export type VendorSubscriptionStatus =
  | "trialing"
  | "active"
  | "expired"
  | "cancelled";

export interface VendorSubscriptionView {
  status: VendorSubscriptionStatus;
  isVisible: boolean;
  trialStartedAt: string;
  trialEndsAt: string;
  daysLeftInTrial: number;
  trialMonthsTotal: number;
  subscription: VendorSubscriptionRecord | null;
  selectedIntervalId: VendorBillingIntervalId | null;
  /** `plan` / `duration` is `"skipped"` — trial without Stripe billing setup. */
  isSkippedPlan: boolean;
  hasSubscription: boolean;
  autoRenewal: boolean;
}

export interface SubscriptionHistoryEvent {
  id: number;
  eventType: string;
  oldStatus: string | null;
  newStatus: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}
