export interface VendorAppointmentUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  profilePhoto: string | null;
  phoneNumber: string;
  accountType: string;
}

export interface VendorAppointmentService {
  id: number;
  serviceName: string;
  category: { id: number; name: string; iconName: string | null };
  price: string;
  duration: string;
  description: string;
  imageUrl: string | null;
  isPublished: boolean;
}

export type VendorAppointmentStatus = "pending" | "accepted" | "rejected" | "completed";

/** UI tabs on the vendor appointments page. */
export type VendorAppointmentTabId = "pending" | "upcoming" | "past" | "cancelled";

/** `GET /vendor/appointments?status=` — API enum. */
export type VendorAppointmentsApiStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "canceled"
  | "completed";

export function vendorAppointmentTabToApiStatuses(
  tab: VendorAppointmentTabId
): VendorAppointmentsApiStatus[] {
  switch (tab) {
    case "pending":
      return ["pending"];
    case "upcoming":
      return ["accepted"];
    case "past":
      return ["completed"];
    case "cancelled":
      return ["canceled", "rejected"];
    default:
      return ["pending"];
  }
}

export type VendorPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "released"
  | "disputed"
  | "refunded";

export type VendorDisputeStatus =
  | "pending"
  | "under_review"
  | "awaiting_vendor"
  | "resolved";

export interface VendorAppointmentDispute {
  id: number;
  reason: string;
  resolution: string | null;
  status: string;
  resolver: string | null;
  resolvedBy: number | null;
  resolvedAt: string | null;
  escalatedBy: string | null;
  escalatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function isVendorDisputeOpen(
  dispute: VendorAppointmentDispute | null | undefined
): boolean {
  if (!dispute) return false;
  const s = dispute.status.toLowerCase();
  return s !== "resolved" && s !== "closed" && s !== "cancelled";
}

export function isVendorDisputeEscalated(
  dispute: VendorAppointmentDispute | null | undefined
): boolean {
  if (!dispute) return false;
  if (dispute.escalatedBy != null || dispute.escalatedAt != null) return true;
  const s = dispute.status.toLowerCase();
  return s === "escalated" || dispute.resolver?.toLowerCase() === "admin";
}

/** Vendor may escalate when peer resolution failed (status still pending). */
export function canVendorEscalateDispute(appointment: {
  dispute?: VendorAppointmentDispute | null;
}): boolean {
  if (!isVendorDisputeOpen(appointment.dispute)) return false;
  if (isVendorDisputeEscalated(appointment.dispute)) return false;
  const s = appointment.dispute!.status.toLowerCase();
  return s === "pending" || s === "open";
}

export interface VendorAppointment {
  id: number;
  user: VendorAppointmentUser;
  vendor: VendorAppointmentUser;
  services: VendorAppointmentService[];
  date: string;
  time: string;
  rescheduleDate: string | null;
  rescheduleTime: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specificRequest: string;
  paymentMethod: "online" | "wallet";
  status: VendorAppointmentStatus;
  totalAmount: number;
  commissionAmount: number;
  vendorAmount: number;
  paymentStatus: VendorPaymentStatus;
  dispute?: VendorAppointmentDispute | null;
  createdAt: string;
  updatedAt: string;
}
