"use client";

import { cn } from "@/lib/utils";
import type { VendorCustomRequest } from "@/types/vendorCustomRequests";
import { getVendorCustomRequestStatusBadgeConfig } from "@/lib/vendorCustomRequestPayment";

type Props = {
  request: VendorCustomRequest;
};

export function VendorCustomRequestStatusBadge({ request }: Props) {
  const config = getVendorCustomRequestStatusBadgeConfig(request);

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
