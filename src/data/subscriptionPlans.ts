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
}

export const VENDOR_BILLING_INTERVALS: VendorBillingInterval[] = [
  {
    id: "monthly",
    label: "Monthly",
    months: 1,
    price: 29,
    priceLabel: "£29",
    perMonthLabel: "£29/mo",
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
  },
  {
    id: "biannual",
    label: "6 months",
    months: 6,
    price: 149,
    priceLabel: "£149",
    perMonthLabel: "~£25/mo",
    saveLabel: "Save 14%",
  },
  {
    id: "yearly",
    label: "Yearly",
    months: 12,
    price: 249,
    priceLabel: "£249",
    perMonthLabel: "~£21/mo",
    saveLabel: "Save 28%",
  },
];

export const VENDOR_SUBSCRIPTION_FEATURES = [
  "Marketplace visibility in your category",
  "Unlimited service listings",
  "Bookings & custom requests",
  "Wallet & payouts",
  "Messages & notifications",
];

export const SUBSCRIPTION_STORAGE_KEY = "afrivendors_vendor_subscription";
