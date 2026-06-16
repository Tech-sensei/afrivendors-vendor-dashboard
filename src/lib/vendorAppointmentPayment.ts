import type {
  VendorAppointment,
  VendorAppointmentDispute,
  VendorAppointmentStatus,
  VendorPaymentStatus,
} from "@/types/appointments";
import { isVendorDisputeOpen, isVendorDisputeEscalated } from "@/types/appointments";

export function normalizeVendorPaymentStatus(status: string): VendorPaymentStatus {
  const key = status.toLowerCase();
  if (
    key === "paid" ||
    key === "released" ||
    key === "disputed" ||
    key === "refunded" ||
    key === "failed"
  ) {
    return key as VendorPaymentStatus;
  }
  return "pending";
}

function normalizeDisputeFromApi(
  raw: unknown
): VendorAppointmentDispute | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (typeof d.reason !== "string") return null;

  return {
    id: Number(d.id),
    reason: d.reason,
    resolution: (d.resolution as string | null) ?? null,
    status: String(d.status ?? "pending"),
    resolver: (d.resolver as string | null) ?? null,
    resolvedBy: d.resolvedBy != null ? Number(d.resolvedBy) : null,
    resolvedAt: (d.resolvedAt as string | null) ?? null,
    escalatedBy: d.escalatedBy != null ? String(d.escalatedBy) : null,
    escalatedAt: (d.escalatedAt as string | null) ?? null,
    createdAt: String(d.createdAt ?? ""),
    updatedAt: String(d.updatedAt ?? ""),
  };
}

export function normalizeVendorAppointment(
  raw: VendorAppointment & Record<string, unknown>
): VendorAppointment {
  const paymentStatus = normalizeVendorPaymentStatus(
    String(raw.paymentStatus ?? "pending")
  );
  const dispute = normalizeDisputeFromApi(raw.dispute);

  return {
    ...raw,
    paymentStatus,
    dispute,
  };
}

export function isVendorAppointmentCompleted(
  status: VendorAppointmentStatus
): boolean {
  return status === "completed";
}

/** Open customer dispute — payout frozen even when paymentStatus is still `paid`. */
export function isVendorPayoutDisputed(appointment: VendorAppointment): boolean {
  return isVendorDisputeOpen(appointment.dispute);
}

export function isVendorAwaitingClientRelease(
  appointment: VendorAppointment
): boolean {
  return (
    isVendorAppointmentCompleted(appointment.status) &&
    appointment.paymentStatus === "paid" &&
    !isVendorPayoutDisputed(appointment)
  );
}

export function canVendorRefundDispute(appointment: VendorAppointment): boolean {
  return (
    isVendorAppointmentCompleted(appointment.status) &&
    isVendorPayoutDisputed(appointment) &&
    appointment.paymentStatus === "paid" &&
    !isVendorDisputeEscalated(appointment.dispute)
  );
}

export function canVendorEscalateDispute(appointment: VendorAppointment): boolean {
  return (
    isVendorAppointmentCompleted(appointment.status) &&
    isVendorPayoutDisputed(appointment) &&
    !isVendorDisputeEscalated(appointment.dispute) &&
    (appointment.dispute?.status.toLowerCase() === "pending" ||
      appointment.dispute?.status.toLowerCase() === "open")
  );
}

export type VendorPayoutNoticeTone = "neutral" | "warning" | "success" | "danger";

export type VendorPayoutNotice = {
  tone: VendorPayoutNoticeTone;
  title: string;
  body: string;
  showRespondAction: boolean;
};

export function getVendorPayoutNotice(
  appointment: VendorAppointment
): VendorPayoutNotice | null {
  if (!isVendorAppointmentCompleted(appointment.status)) return null;

  const earnings = `£${appointment.vendorAmount.toFixed(2)}`;
  const dispute = appointment.dispute;

  if (appointment.paymentStatus === "released" && !isVendorPayoutDisputed(appointment)) {
    return {
      tone: "success",
      title: "Paid out",
      body: `${earnings} has been added to your balance for this booking.`,
      showRespondAction: false,
    };
  }

  if (appointment.paymentStatus === "refunded") {
    return {
      tone: "danger",
      title: "No payout — refunded to customer",
      body: "This dispute was resolved in the customer's favour. You will not receive payment for this booking.",
      showRespondAction: false,
    };
  }

  if (isVendorPayoutDisputed(appointment) && dispute) {
    const reason = dispute.reason.trim() || "Not specified";

    if (isVendorDisputeEscalated(dispute)) {
      return {
        tone: "warning",
        title: "Escalated to Afrivendors",
        body: `Customer reason: "${reason}". Our team is reviewing this dispute. Your ${earnings} payout remains on hold until Afrivendors decides — you can still message the customer.`,
        showRespondAction: false,
      };
    }

    if (canVendorRefundDispute(appointment)) {
      return {
        tone: "warning",
        title: "Payout on hold — customer dispute",
        body: `The customer reported: "${reason}". Message them to resolve it together, refund the customer if you agree, or escalate to Afrivendors.`,
        showRespondAction: false,
      };
    }

    if (!isVendorDisputeOpen(dispute)) {
      return {
        tone: "success",
        title: "Dispute closed",
        body: dispute.resolution
          ? `Resolution: ${dispute.resolution}`
          : "This dispute has been closed. Check payment status below.",
        showRespondAction: false,
      };
    }

    return {
      tone: "warning",
      title: "Payout on hold — dispute under review",
      body: `Customer reason: "${reason}". Afrivendors is reviewing; your ${earnings} payout is paused.`,
      showRespondAction: false,
    };
  }

  if (appointment.paymentStatus === "paid") {
    return {
      tone: "neutral",
      title: "Payout pending",
      body: `The customer has paid. Your ${earnings} will be sent after they confirm the service, unless they open a dispute.`,
      showRespondAction: false,
    };
  }

  return null;
}

export function vendorPaymentStatusLabel(
  appointment: VendorAppointment
): string {
  if (isVendorDisputeEscalated(appointment.dispute)) {
    return "Under admin review";
  }
  if (isVendorPayoutDisputed(appointment)) {
    return "Dispute open — payout on hold";
  }
  switch (appointment.paymentStatus) {
    case "paid":
      return "Paid";
    case "released":
      return "Paid to you";
    case "disputed":
      return "Disputed — payout on hold";
    case "refunded":
      return "Refunded to customer";
    case "failed":
      return "Payment failed";
    default:
      return "Pending";
  }
}

export function vendorPaymentStatusClass(
  appointment: VendorAppointment
): string {
  if (isVendorDisputeEscalated(appointment.dispute)) {
    return "bg-blue-50 text-blue-800";
  }
  if (isVendorPayoutDisputed(appointment)) {
    return "bg-amber-50 text-amber-900";
  }
  switch (appointment.paymentStatus) {
    case "released":
      return "bg-green-50 text-green-700";
    case "disputed":
      return "bg-amber-50 text-amber-900";
    case "refunded":
      return "bg-red-50 text-red-700";
    case "paid":
      return "bg-green-50 text-green-700";
    case "failed":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}
