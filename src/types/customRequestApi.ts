/** Shared custom-request API shapes (vendor + client dashboards). */

export type CustomRequestApiStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export type CustomRequestApiPriority = "low" | "medium" | "high";

export interface CustomRequestQuoteLineItemApi {
  item?: string;
  description?: string;
  price?: number;
  amount?: number;
}

export interface CustomRequestQuoteApi {
  id: number;
  vendorId?: number | string;
  breakdown?: CustomRequestQuoteLineItemApi[];
  lineItems?: CustomRequestQuoteLineItemApi[];
  totalAmount?: number;
  total?: number;
  amount?: number;
  note?: string | null;
  message?: string | null;
  validUntil?: string | null;
  status?: string;
  createdAt?: string;
}

export interface CustomRequestUserApi {
  id?: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  profilePhoto?: string | null;
}

export interface CustomRequestApi {
  id: number;
  requestTitle?: string;
  title?: string;
  referenceId?: string;
  reference?: string;
  categoryId?: number;
  category?: { id?: number; name?: string } | string;
  categoryName?: string;
  description?: string;
  budget?: number;
  date?: string;
  time?: string;
  location?: string;
  priority?: CustomRequestApiPriority | string;
  imageUrl?: string | null;
  status?: CustomRequestApiStatus | string;
  paymentStatus?: string | null;
  paymentMethod?: "online" | "wallet" | string | null;
  user?: CustomRequestUserApi;
  customer?: CustomRequestUserApi;
  myQuote?: CustomRequestQuoteApi;
  quote?: CustomRequestQuoteApi;
  vendorQuote?: CustomRequestQuoteApi;
  quotes?: CustomRequestQuoteApi[];
  quoteCount?: number;
  competitorQuoteCount?: number;
  escrowAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string | null;
  fundsReleasedAt?: string | null;
  dispute?: unknown;
}

export type DropCustomRequestQuotePayload = {
  breakdown: { item: string; price: number }[];
  note?: string;
  validUntil?: string;
};
