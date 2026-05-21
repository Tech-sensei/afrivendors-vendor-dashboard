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
  description: string;
  amount: number;
}

export interface VendorQuote {
  id: string;
  lineItems: VendorQuoteLineItem[];
  totalAmount: number;
  message?: string;
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
  paymentMethod?: "online" | "wallet";
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
