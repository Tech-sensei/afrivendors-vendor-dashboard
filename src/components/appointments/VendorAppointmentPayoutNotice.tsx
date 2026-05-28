"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import type { VendorAppointment } from "@/types/appointments";
import {
  getVendorPayoutNotice,
  type VendorPayoutNoticeTone,
} from "@/lib/vendorAppointmentPayment";

const TONE_STYLES: Record<
  VendorPayoutNoticeTone,
  { box: string; icon: string; Icon: typeof Clock }
> = {
  neutral: {
    box: "border-accent-20/80 bg-accent-10/40",
    icon: "text-accent-60",
    Icon: Clock,
  },
  warning: {
    box: "border-amber-200 bg-amber-50/80",
    icon: "text-amber-700",
    Icon: ShieldAlert,
  },
  success: {
    box: "border-green-200 bg-green-50/80",
    icon: "text-green-700",
    Icon: CheckCircle2,
  },
  danger: {
    box: "border-red-200 bg-red-50/80",
    icon: "text-red-700",
    Icon: AlertTriangle,
  },
};

type Props = {
  appointment: VendorAppointment;
  variant?: "compact" | "full";
};

export function VendorAppointmentPayoutNotice({
  appointment,
  variant = "full",
}: Props) {
  const notice = getVendorPayoutNotice(appointment);
  if (!notice) return null;

  const styles = TONE_STYLES[notice.tone];
  const Icon = styles.Icon;
  const isCompact = variant === "compact";

  return (
    <div
      className={`rounded-xl border px-4 py-3 ${styles.box} ${isCompact ? "mb-3" : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${styles.icon}`} />
        <div className="min-w-0 flex-1">
          <p
            className={`font-unageo font-bold text-secondary-000 ${isCompact ? "text-xs" : "text-sm"}`}
          >
            {notice.title}
          </p>
          <p
            className={`mt-1 font-unageo leading-relaxed text-accent-80 ${isCompact ? "text-xs" : "text-sm"}`}
          >
            {notice.body}
          </p>
          {appointment.dispute?.reason && !isCompact && (
            <p className="mt-2 rounded-lg bg-white/60 px-3 py-2 font-unageo text-xs text-secondary-000/90">
              <span className="font-semibold">Customer reason: </span>
              {appointment.dispute.reason}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
