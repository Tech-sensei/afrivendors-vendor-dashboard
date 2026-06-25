import type { VendorCustomRequest } from "@/types/vendorCustomRequests";
import {
  isVendorOrderDisputeEscalated,
  isVendorOrderDisputeOpen,
  type VendorOrderDispute,
} from "@/types/dispute";

export type VendorCustomRequestPaymentStatus =
  | "pending"
  | "paid"
  | "released"
  | "disputed"
  | "refunded"
  | "failed";

export function normalizeVendorCustomRequestPaymentStatus(
  status: string
): VendorCustomRequestPaymentStatus {
  const key = status.toLowerCase();
  if (
    key === "paid" ||
    key === "released" ||
    key === "disputed" ||
    key === "refunded" ||
    key === "failed"
  ) {
    return key;
  }
  return "pending";
}

export function isVendorCustomRequestCompleted(
  request: VendorCustomRequest
): boolean {
  return request.status === "completed" || request.status === "closed";
}

export function isVendorCustomRequestPayoutDisputed(
  request: VendorCustomRequest
): boolean {
  return (
    isVendorOrderDisputeOpen(request.dispute) ||
    request.paymentStatus === "disputed"
  );
}

export function canVendorRefundCustomRequestDispute(
  request: VendorCustomRequest
): boolean {
  return (
    request.status === "completed" &&
    isVendorCustomRequestPayoutDisputed(request) &&
    request.paymentStatus === "paid" &&
    !isVendorOrderDisputeEscalated(request.dispute)
  );
}

export function canVendorEscalateCustomRequestDispute(
  request: VendorCustomRequest
): boolean {
  return (
    request.status === "completed" &&
    isVendorCustomRequestPayoutDisputed(request) &&
    !isVendorOrderDisputeEscalated(request.dispute) &&
    (request.dispute?.status.toLowerCase() === "pending" ||
      request.dispute?.status.toLowerCase() === "open")
  );
}

export type VendorPayoutNoticeTone = "neutral" | "warning" | "success" | "danger";

export type VendorPayoutNotice = {
  tone: VendorPayoutNoticeTone;
  title: string;
  body: string;
};

export function getVendorCustomRequestPayoutNotice(
  request: VendorCustomRequest
): VendorPayoutNotice | null {
  if (!isVendorCustomRequestCompleted(request)) return null;

  const earnings = request.escrowAmount
    ? `£${request.escrowAmount.toFixed(2)}`
    : request.myQuote
      ? `£${request.myQuote.totalAmount.toFixed(2)}`
      : "your payout";
  const dispute = request.dispute;

  if (
    request.paymentStatus === "released" &&
    !isVendorCustomRequestPayoutDisputed(request)
  ) {
    return {
      tone: "success",
      title: "Paid out",
      body: `${earnings} has been added to your balance for this job.`,
    };
  }

  if (request.paymentStatus === "refunded") {
    return {
      tone: "danger",
      title: "No payout — refunded to customer",
      body: "This dispute was resolved in the customer's favour. You will not receive payment for this job.",
    };
  }

  if (isVendorCustomRequestPayoutDisputed(request) && dispute) {
    const reason = dispute.reason.trim() || "Not specified";

    if (isVendorOrderDisputeEscalated(dispute)) {
      return {
        tone: "warning",
        title: "Escalated to Afrivendors",
        body: `Customer reason: "${reason}". Our team is reviewing this dispute. Your ${earnings} payout remains on hold until Afrivendors decides.`,
      };
    }

    if (canVendorRefundCustomRequestDispute(request)) {
      return {
        tone: "warning",
        title: "Payout on hold — customer dispute",
        body: `The customer reported: "${reason}". Message them to resolve it together, refund the customer if you agree, or escalate to Afrivendors.`,
      };
    }

    if (!isVendorOrderDisputeOpen(dispute)) {
      return {
        tone: "success",
        title: "Dispute closed",
        body: dispute.resolution
          ? `Resolution: ${dispute.resolution}`
          : "This dispute has been closed. Check payment status below.",
      };
    }

    return {
      tone: "warning",
      title: "Payout on hold — dispute under review",
      body: `Customer reason: "${reason}". Afrivendors is reviewing; your ${earnings} payout is paused.`,
    };
  }

  if (request.paymentStatus === "paid" || request.status === "completed") {
    return {
      tone: "neutral",
      title: "Payout pending",
      body: `The client has paid. ${earnings} will be sent after they release escrow, unless they open a dispute.`,
    };
  }

  return null;
}

export function vendorCustomRequestPaymentLabel(
  request: VendorCustomRequest
): string {
  if (isVendorOrderDisputeEscalated(request.dispute)) {
    return "Under admin review";
  }
  if (isVendorCustomRequestPayoutDisputed(request)) {
    return "Dispute open — payout on hold";
  }
  switch (request.paymentStatus) {
    case "paid":
      return "Paid — in escrow";
    case "released":
      return "Paid to you";
    case "disputed":
      return "Disputed — payout on hold";
    case "refunded":
      return "Refunded to customer";
    default:
      return "Pending";
  }
}

export function getDisputeReason(
  dispute?: VendorOrderDispute | null
): string | null {
  const reason = dispute?.reason?.trim();
  return reason || null;
}

export type VendorCustomRequestBadgeConfig = {
  label: string;
  className: string;
};

const JOB_STATUS_BADGE: Record<
  VendorCustomRequest["status"],
  VendorCustomRequestBadgeConfig
> = {
  incoming: {
    label: "New request",
    className: "bg-sky-50 text-sky-800 border-sky-200",
  },
  quoted: {
    label: "Awaiting client",
    className: "bg-amber-50 text-amber-900 border-amber-200",
  },
  active: {
    label: "Active job",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  completed: {
    label: "Awaiting release",
    className: "bg-violet-50 text-violet-800 border-violet-200",
  },
  closed: {
    label: "Paid out",
    className: "bg-green-50 text-green-800 border-green-200",
  },
  lost: {
    label: "Not selected",
    className: "bg-red-50 text-red-800 border-red-200",
  },
  passed: {
    label: "Passed",
    className: "bg-accent-10 text-accent-80 border-accent-20",
  },
};

/** Payment + dispute aware label — never show "Awaiting release" when disputed or refunded. */
export function getVendorCustomRequestStatusBadgeConfig(
  request: VendorCustomRequest
): VendorCustomRequestBadgeConfig {
  const payment = request.paymentStatus;

  if (payment === "refunded") {
    return {
      label: "Refunded",
      className: "bg-red-50 text-red-800 border-red-200",
    };
  }

  if (isVendorOrderDisputeEscalated(request.dispute)) {
    return {
      label: "Admin review",
      className: "bg-blue-50 text-blue-800 border-blue-200",
    };
  }

  if (isVendorCustomRequestPayoutDisputed(request)) {
    return {
      label: "Payout on hold",
      className: "bg-amber-50 text-amber-900 border-amber-200",
    };
  }

  if (request.dispute && !isVendorOrderDisputeOpen(request.dispute)) {
    return {
      label: "Dispute closed",
      className: "bg-slate-50 text-slate-700 border-slate-200",
    };
  }

  if (payment === "released" || request.status === "closed") {
    return JOB_STATUS_BADGE.closed;
  }

  return JOB_STATUS_BADGE[request.status];
}
