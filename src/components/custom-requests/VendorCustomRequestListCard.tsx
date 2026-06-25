"use client";

import { FileText } from "lucide-react";
import type { VendorCustomRequest } from "@/types/vendorCustomRequests";
import { VendorCustomRequestStatusBadge } from "./VendorCustomRequestStatusBadge";
import { VendorCustomRequestPayoutNotice } from "./VendorCustomRequestPayoutNotice";
import {
  canMarkComplete,
  canPassRequest,
  canSendQuote,
  formatMoney,
  getVendorRequestSummary,
} from "@/lib/vendorCustomRequestUi";
import {
  isVendorCustomRequestCompleted,
  isVendorCustomRequestPayoutDisputed,
} from "@/lib/vendorCustomRequestPayment";

type Props = {
  request: VendorCustomRequest;
  onViewDetails: (request: VendorCustomRequest) => void;
  onSendQuote: (request: VendorCustomRequest) => void;
  onPass: (requestId: string) => void;
  onMarkComplete: (requestId: string) => void;
};

export function VendorCustomRequestListCard({
  request,
  onViewDetails,
  onSendQuote,
  onPass,
  onMarkComplete,
}: Props) {
  const disputed = isVendorCustomRequestPayoutDisputed(request);
  const isCompleted = isVendorCustomRequestCompleted(request);

  let primaryLabel = "View details";
  if (canSendQuote(request)) primaryLabel = "Send quote";
  else if (canMarkComplete(request)) primaryLabel = "Mark complete";

  const showPrimaryAction =
    canSendQuote(request) || canMarkComplete(request);

  const handlePrimary = () => {
    if (canSendQuote(request)) onSendQuote(request);
    else if (canMarkComplete(request)) onMarkComplete(request.id);
    else onViewDetails(request);
  };

  return (
    <div className="rounded-2xl border border-[#EFE6E1] bg-white p-6 shadow-[0_8px_24px_rgba(35,19,5,0.06)]">
      <div className="flex items-start gap-4">
        <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-300/40 sm:flex">
          <FileText className="h-6 w-6 text-primary-100" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-start justify-between gap-4">
            <h3 className="font-unbounded text-base font-semibold text-secondary-000">
              {request.title}
            </h3>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <VendorCustomRequestStatusBadge request={request} />
            </div>
          </div>

          <p className="mb-1 text-xs font-medium text-accent-80">
            {request.orderReferenceId} · {request.createdAt}
          </p>

          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-accent-80">
            <span>{request.customerName}</span>
            <span className="text-accent-60">·</span>
            <span>{request.category}</span>
            <span className="text-accent-60">·</span>
            <span>Budget {formatMoney(request.budget)}</span>
          </div>

          <p className="mb-4 text-sm font-medium text-primary-100">
            {getVendorRequestSummary(request)}
          </p>

          {isCompleted && disputed && (
            <div className="mb-4">
              <VendorCustomRequestPayoutNotice request={request} variant="compact" />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            {showPrimaryAction ? (
              <>
                <button
                  type="button"
                  onClick={handlePrimary}
                  className="h-11 rounded-[18px] bg-primary-100 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-100/90"
                >
                  {primaryLabel}
                </button>
                <button
                  type="button"
                  onClick={() => onViewDetails(request)}
                  className="h-11 rounded-[18px] border border-accent-20 px-6 text-sm font-semibold text-secondary-000 transition-colors hover:bg-secondary-800"
                >
                  View details
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onViewDetails(request)}
                className="h-11 rounded-[18px] bg-primary-100 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-100/90"
              >
                View details
              </button>
            )}

            {canPassRequest(request) && (
              <button
                type="button"
                onClick={() => onPass(request.id)}
                className="h-11 rounded-[18px] border border-accent-20 px-5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
              >
                Pass
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
