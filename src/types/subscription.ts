import type {
  VendorBillingIntervalId,
  VendorSubscriptionStatus,
} from "@/data/subscriptionPlans";

export interface VendorSubscriptionRecord {
  intervalId: VendorBillingIntervalId;
  status: "active" | "cancelled";
  startedAt: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd?: boolean;
}

export interface VendorSubscriptionView {
  status: VendorSubscriptionStatus;
  isVisible: boolean;
  trialStartedAt: string;
  trialEndsAt: string;
  daysLeftInTrial: number;
  trialMonthsTotal: number;
  subscription: VendorSubscriptionRecord | null;
  selectedIntervalId: VendorBillingIntervalId | null;
}
