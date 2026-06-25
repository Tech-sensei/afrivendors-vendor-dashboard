import type {
  CustomRequestApi,
  CustomRequestQuoteApi,
} from "@/types/customRequestApi";
import type {
  VendorCustomRequest,
  VendorQuote,
  VendorRequestStatus,
} from "@/types/vendorCustomRequests";
import { normalizeDisputeFromApi } from "@/lib/normalizeDispute";
import { normalizeVendorCustomRequestPaymentStatus } from "@/lib/vendorCustomRequestPayment";

function formatDisplayDate(value?: string | null): string {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getCategoryName(api: CustomRequestApi): string {
  if (typeof api.category === "string") return api.category;
  if (api.category && typeof api.category === "object") {
    return api.category.name ?? "Category";
  }
  return api.categoryName ?? "Category";
}

function getCustomerName(api: CustomRequestApi): string {
  const user = api.user ?? api.customer;
  if (!user) return "Client";
  const full = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return full || user.name || "Client";
}

function customerInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "CL";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function pickVendorQuote(api: CustomRequestApi): CustomRequestQuoteApi | undefined {
  return api.myQuote ?? api.vendorQuote ?? api.quote ?? api.quotes?.[0];
}

function normalizeVendorQuote(quote: CustomRequestQuoteApi): VendorQuote {
  const lineItems = (quote.breakdown ?? quote.lineItems ?? []).map((row) => ({
    item: row.item ?? row.description ?? "Item",
    price: Number(row.price ?? row.amount ?? 0),
  }));
  const totalAmount = Number(
    quote.totalAmount ??
      quote.total ??
      quote.amount ??
      lineItems.reduce((sum, row) => sum + row.price, 0)
  );

  return {
    id: String(quote.id),
    lineItems,
    totalAmount,
    note: quote.note ?? quote.message ?? undefined,
    validUntil: quote.validUntil ?? "",
    sentAt: formatDisplayDate(quote.createdAt),
    status:
      String(quote.status ?? "pending").toLowerCase() === "accepted"
        ? "accepted"
        : String(quote.status ?? "pending").toLowerCase() === "rejected"
          ? "rejected"
          : "pending",
  };
}

function mapAssignedStatus(
  api: CustomRequestApi,
  myQuote?: VendorQuote
): VendorRequestStatus {
  const status = String(api.status ?? "pending").toLowerCase();
  const paymentStatus = String(api.paymentStatus ?? "").toLowerCase();

  switch (status) {
    case "pending":
      return myQuote ? "quoted" : "incoming";
    case "accepted":
      if (paymentStatus === "released") return "closed";
      return "active";
    case "completed":
      if (paymentStatus === "released" || paymentStatus === "refunded") {
        return "closed";
      }
      return "completed";
    case "rejected":
    case "cancelled":
      return myQuote ? "lost" : "passed";
    default:
      return myQuote ? "quoted" : "incoming";
  }
}

function buildTimeline(
  api: CustomRequestApi,
  status: VendorRequestStatus,
  myQuote?: VendorQuote
) {
  const createdAt = formatDisplayDate(api.createdAt);
  const events = [
    {
      at: createdAt,
      label:
        status === "incoming"
          ? "New request in your category"
          : "Request received in your category",
    },
  ];

  if (myQuote) {
    events.push({
      at: myQuote.sentAt || createdAt,
      label: `Your quote sent · £${myQuote.totalAmount.toFixed(2)}`,
    });
  }

  if (status === "active" && api.escrowAmount) {
    events.push({
      at: formatDisplayDate(api.updatedAt) || createdAt,
      label: `Client paid · £${Number(api.escrowAmount).toFixed(2)} in escrow`,
    });
  }

  if (status === "closed") {
    events.push({
      at: formatDisplayDate(api.fundsReleasedAt ?? api.updatedAt) || createdAt,
      label: "Payment released · job closed",
    });
  }

  const dispute = normalizeDisputeFromApi(api.dispute);
  if (dispute) {
    events.push({
      at: formatDisplayDate(dispute.createdAt) || createdAt,
      label: "Customer opened a dispute",
    });
    if (dispute.escalatedAt) {
      events.push({
        at: formatDisplayDate(dispute.escalatedAt),
        label: "Dispute escalated to Afrivendors",
      });
    }
    if (dispute.resolvedAt) {
      events.push({
        at: formatDisplayDate(dispute.resolvedAt),
        label: "Dispute resolved",
      });
    }
  }

  return events;
}

export function mapCustomRequestToVendorRequest(
  api: CustomRequestApi,
  source: "pending" | "assigned" = "assigned"
): VendorCustomRequest {
  const myQuoteRaw = pickVendorQuote(api);
  const myQuote = myQuoteRaw ? normalizeVendorQuote(myQuoteRaw) : undefined;
  const status: VendorRequestStatus =
    source === "pending" ? "incoming" : mapAssignedStatus(api, myQuote);

  const priority = String(api.priority ?? "medium").toLowerCase();
  const customerName = getCustomerName(api);
  const categoryName = getCategoryName(api);

  return {
    id: String(api.id),
    orderReferenceId:
      api.referenceId ??
      api.reference ??
      `CR-${String(api.id).padStart(4, "0")}`,
    title: api.requestTitle ?? api.title ?? "Custom request",
    category: categoryName,
    description: api.description ?? "",
    customerName,
    customerInitials: customerInitials(customerName),
    budget: Number(api.budget ?? 0),
    location: api.location ?? "",
    preferredDate: api.date ?? "",
    preferredTime: api.time ?? "",
    urgency: priority === "high" ? "priority" : "normal",
    createdAt: formatDisplayDate(api.createdAt),
    status,
    myQuote,
    competitorQuoteCount: api.competitorQuoteCount ?? api.quoteCount,
    escrowAmount: api.escrowAmount ?? myQuote?.totalAmount,
    paymentStatus: normalizeVendorCustomRequestPaymentStatus(
      String(api.paymentStatus ?? "pending")
    ),
    paymentMethod:
      api.paymentMethod === "wallet" || api.paymentMethod === "online"
        ? api.paymentMethod
        : undefined,
    dispute: normalizeDisputeFromApi(api.dispute),
    timeline: buildTimeline(api, status, myQuote),
  };
}
