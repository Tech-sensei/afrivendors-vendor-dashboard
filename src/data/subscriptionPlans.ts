export const VENDOR_TRIAL_MONTHS = 6;

export type VendorBillingIntervalId =
  | "monthly"
  | "quarterly"
  | "biannual"
  | "yearly";

export type VendorSubscriptionStatus =
  | "trialing"
  | "active"
  | "expired"
  | "cancelled";

export interface VendorBillingInterval {
  id: VendorBillingIntervalId;
  label: string;
  months: number;
  price: number;
  priceLabel: string;
  perMonthLabel: string;
  saveLabel?: string;
  popular?: boolean;
  /** Stripe Price ID for `POST /subscription/create-subscription` (`duration`). */
  stripePriceId?: string;
}

export const VENDOR_BILLING_INTERVALS: VendorBillingInterval[] = [
  {
    id: "monthly",
    label: "Monthly",
    months: 1,
    price: 29,
    priceLabel: "£29",
    perMonthLabel: "£29/mo",
    stripePriceId: "price_1TcsUXDerFCGYUKF7atmHrl4",
  },
  {
    id: "quarterly",
    label: "3 months",
    months: 3,
    price: 79,
    priceLabel: "£79",
    perMonthLabel: "~£26/mo",
    saveLabel: "Save 9%",
    popular: true,
    stripePriceId: "price_1TcsWkDerFCGYUKFe1PHbnTd",
  },
  {
    id: "biannual",
    label: "6 months",
    months: 6,
    price: 149,
    priceLabel: "£149",
    perMonthLabel: "~£25/mo",
    saveLabel: "Save 14%",
    stripePriceId: "price_1TcsWkDerFCGYUKF3v3hTxHT",
  },
  {
    id: "yearly",
    label: "Yearly",
    months: 12,
    price: 249,
    priceLabel: "£249",
    perMonthLabel: "~£21/mo",
    saveLabel: "Save 28%",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY,
  },
];

export function getStripePriceIdForInterval(
  intervalId: VendorBillingIntervalId
): string | null {
  const interval = VENDOR_BILLING_INTERVALS.find((i) => i.id === intervalId);
  const id = interval?.stripePriceId?.trim();
  return id || null;
}

export const VENDOR_SUBSCRIPTION_FEATURES = [
  "Marketplace visibility in your category",
  "Unlimited service listings",
  "Bookings & custom requests",
  "Wallet & payouts",
  "Messages & notifications",
];

export const SUBSCRIPTION_STORAGE_KEY = "afrivendors_vendor_subscription";
