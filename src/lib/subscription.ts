import {
  VENDOR_BILLING_INTERVALS,
  VENDOR_TRIAL_MONTHS,
  type VendorBillingIntervalId,
} from "@/data/subscriptionPlans";
import type {
  VendorApiSubscription,
  VendorSubscriptionRecord,
  VendorSubscriptionStatus,
  VendorSubscriptionView,
} from "@/types/subscription";

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function toIsoDate(d: Date): string {
  return d.toISOString();
}

function daysUntil(isoEnd: string): number {
  const msLeft = new Date(isoEnd).getTime() - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
}

export function isSkippedSubscriptionPlan(
  subscription: VendorApiSubscription
): boolean {
  return subscription.plan === "skipped" || subscription.duration === "skipped";
}

export function mapDurationToIntervalId(
  duration: string
): VendorBillingIntervalId | null {
  if (!duration || duration === "skipped") return null;
  const byPrice = VENDOR_BILLING_INTERVALS.find(
    (i) => i.stripePriceId === duration
  );
  if (byPrice) return byPrice.id;
  const byId = VENDOR_BILLING_INTERVALS.find((i) => i.id === duration);
  return byId?.id ?? null;
}

/** Preview trial dates before a subscription record exists (onboarding). */
export function buildPreviewSubscriptionView(
  accountCreatedAt: string | undefined
): VendorSubscriptionView {
  const now = new Date();
  const trialStart = accountCreatedAt ? new Date(accountCreatedAt) : now;
  const trialEnds = addMonths(trialStart, VENDOR_TRIAL_MONTHS);

  return {
    status: "trialing",
    isVisible: true,
    trialStartedAt: toIsoDate(trialStart),
    trialEndsAt: toIsoDate(trialEnds),
    daysLeftInTrial: daysUntil(toIsoDate(trialEnds)),
    trialMonthsTotal: VENDOR_TRIAL_MONTHS,
    subscription: null,
    selectedIntervalId: null,
    isSkippedPlan: false,
    hasSubscription: false,
    autoRenewal: false,
  };
}

export function buildSubscriptionViewFromApi(
  api: VendorApiSubscription | null | undefined,
  accountCreatedAt?: string
): VendorSubscriptionView {
  if (!api) {
    return buildPreviewSubscriptionView(accountCreatedAt);
  }

  const skipped = isSkippedSubscriptionPlan(api);
  const intervalId = skipped ? null : mapDurationToIntervalId(api.duration);
  const trialEnds = api.currentPeriodEnd;
  const trialStart = api.currentPeriodStart;

  let status: VendorSubscriptionStatus;
  if (api.trialExpired) {
    status = "expired";
  } else if (api.status === "trial" || (api.hasTrial && !api.stripeSubscriptionId)) {
    status = "trialing";
  } else if (
    api.status === "active" ||
    api.stripeSubscriptionId
  ) {
    status = api.cancelAtPeriodEnd ? "cancelled" : "active";
  } else {
    status = "expired";
  }

  const isVisible =
    (status === "trialing" && !api.trialExpired) || status === "active";

  const paidRecord: VendorSubscriptionRecord | null =
    !skipped && intervalId
      ? {
          intervalId,
          status: api.cancelAtPeriodEnd ? "cancelled" : "active",
          startedAt: api.currentPeriodStart,
          currentPeriodEnd: api.currentPeriodEnd,
          cancelAtPeriodEnd: api.cancelAtPeriodEnd,
        }
      : null;

  return {
    status,
    isVisible,
    trialStartedAt: trialStart,
    trialEndsAt: trialEnds,
    daysLeftInTrial: api.trialExpired ? 0 : daysUntil(trialEnds),
    trialMonthsTotal: VENDOR_TRIAL_MONTHS,
    subscription: paidRecord,
    selectedIntervalId: intervalId,
    isSkippedPlan: skipped,
    hasSubscription: true,
    autoRenewal: api.autoRenewal,
  };
}

export function formatSubscriptionDate(iso: string | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
