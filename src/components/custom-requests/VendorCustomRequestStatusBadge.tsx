"use client";

import { cn } from "@/lib/utils";
import type { VendorRequestStatus } from "@/types/vendorCustomRequests";

const styles: Record<
  VendorRequestStatus,
  { label: string; className: string }
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
    label: "Completed",
    className: "bg-accent-10 text-accent-80 border-accent-20",
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

export function VendorCustomRequestStatusBadge({
  status,
}: {
  status: VendorRequestStatus;
}) {
  const config = styles[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
