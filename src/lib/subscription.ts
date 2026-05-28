import {
  SUBSCRIPTION_STORAGE_KEY,
  VENDOR_BILLING_INTERVALS,
  VENDOR_TRIAL_MONTHS,
  type VendorBillingIntervalId,
  type VendorSubscriptionStatus,
} from "@/data/subscriptionPlans";
import type {
  VendorSubscriptionRecord,
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

export function readStoredSubscription(): VendorSubscriptionRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as VendorSubscriptionRecord;
  } catch {
    return null;
  }
}

export function writeStoredSubscription(record: VendorSubscriptionRecord | null) {
  if (typeof window === "undefined") return;
  if (!record) {
    localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);
    return;
  }
  localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(record));
}

export function createSubscriptionRecord(
  intervalId: VendorBillingIntervalId,
  from = new Date()
): VendorSubscriptionRecord {
  const interval = VENDOR_BILLING_INTERVALS.find((i) => i.id === intervalId)!;
  const end = addMonths(from, interval.months);
  return {
    intervalId,
    status: "active",
    startedAt: toIsoDate(from),
    currentPeriodEnd: toIsoDate(end),
    cancelAtPeriodEnd: false,
  };
}

export function buildSubscriptionView(
  accountCreatedAt: string | undefined,
  stored: VendorSubscriptionRecord | null
): VendorSubscriptionView {
  const now = new Date();
  const trialStart = accountCreatedAt
    ? new Date(accountCreatedAt)
    : now;
  const trialEnds = addMonths(trialStart, VENDOR_TRIAL_MONTHS);

  const msLeft = trialEnds.getTime() - now.getTime();
  const daysLeftInTrial = Math.max(
    0,
    Math.ceil(msLeft / (1000 * 60 * 60 * 24))
  );

  const trialActive = now < trialEnds;
  const paidActive =
    stored?.status === "active" &&
    new Date(stored.currentPeriodEnd) > now;

  let status: VendorSubscriptionStatus;
  if (paidActive) {
    status = "active";
  } else if (trialActive) {
    status = "trialing";
  } else {
    status = "expired";
  }

  const isVisible = status === "trialing" || status === "active";

  return {
    status,
    isVisible,
    trialStartedAt: toIsoDate(trialStart),
    trialEndsAt: toIsoDate(trialEnds),
    daysLeftInTrial,
    trialMonthsTotal: VENDOR_TRIAL_MONTHS,
    subscription: paidActive ? stored : null,
    selectedIntervalId: stored?.intervalId ?? null,
  };
}

export function formatSubscriptionDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
