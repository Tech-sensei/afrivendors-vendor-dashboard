import type { VendorCustomRequest } from "@/types/vendorCustomRequests";

export function formatMoney(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

export function getVendorRequestSummary(request: VendorCustomRequest): string {
  switch (request.status) {
    case "incoming":
      return "Send a quote to compete for this job";
    case "quoted":
      return request.myQuote
        ? `Quote sent · ${formatMoney(request.myQuote.totalAmount)} · awaiting client`
        : "Awaiting client decision";
    case "active":
      return request.escrowAmount
        ? `Paid · ${formatMoney(request.escrowAmount)} in escrow`
        : "Job in progress";
    case "completed":
      return "Awaiting client fund release";
    case "closed":
      return "Payment released · job closed";
    case "lost":
      return "Client chose another vendor";
    case "passed":
      return "You passed on this request";
    default:
      return request.category;
  }
}

export function canSendQuote(request: VendorCustomRequest): boolean {
  return request.status === "incoming";
}

export function canEditQuote(request: VendorCustomRequest): boolean {
  return (
    request.status === "quoted" && request.myQuote?.status === "pending"
  );
}

export function canPassRequest(request: VendorCustomRequest): boolean {
  return request.status === "incoming";
}

export function canMarkComplete(request: VendorCustomRequest): boolean {
  return request.status === "active";
}
