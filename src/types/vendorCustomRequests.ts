import type { VendorOrderDispute } from "@/types/dispute";
import type { VendorCustomRequestPaymentStatus } from "@/lib/vendorCustomRequestPayment";

export type VendorRequestStatus =
  | "incoming"
  | "quoted"
  | "active"
  | "completed"
  | "closed"
  | "lost"
  | "passed";

export type VendorQuoteStatus = "pending" | "accepted" | "rejected";

export interface VendorQuoteLineItem {
  item: string;
  price: number;
}

export interface VendorQuote {
  id: string;
  lineItems: VendorQuoteLineItem[];
  totalAmount: number;
  note?: string;
  validUntil: string;
  sentAt: string;
  status: VendorQuoteStatus;
}

export interface VendorRequestTimelineEvent {
  at: string;
  label: string;
}

export interface VendorCustomRequest {
  id: string;
  orderReferenceId: string;
  title: string;
  category: string;
  description: string;
  customerName: string;
  customerUserId: number | null;
  customerInitials: string;
  budget: number;
  location: string;
  preferredDate: string;
  preferredTime: string;
  flexibleDates?: { start: string; end: string };
  urgency: "normal" | "priority";
  createdAt: string;
  status: VendorRequestStatus;
  myQuote?: VendorQuote;
  /** Quotes from other vendors on the same request (when client allows multiple). */
  competitorQuoteCount?: number;
  escrowAmount?: number;
  paymentStatus?: VendorCustomRequestPaymentStatus;
  paymentMethod?: "online" | "wallet";
  dispute?: VendorOrderDispute | null;
  scheduledAt?: string;
  timeline: VendorRequestTimelineEvent[];
}

export type VendorCustomRequestTabId =
  | "all"
  | "incoming"
  | "quoted"
  | "active"
  | "completed"
  | "passed";
