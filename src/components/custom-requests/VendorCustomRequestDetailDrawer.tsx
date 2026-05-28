"use client";

import { X } from "lucide-react";
import { VendorCustomRequestClientCard } from "./VendorCustomRequestClientCard";
import { motion, AnimatePresence } from "motion/react";
import { useMobile } from "@/hooks/useMobile";
import type { VendorCustomRequest } from "@/types/vendorCustomRequests";
import { VendorCustomRequestStatusBadge } from "./VendorCustomRequestStatusBadge";
import {
  canEditQuote,
  canMarkComplete,
  canPassRequest,
  canSendQuote,
  formatMoney,
} from "@/lib/vendorCustomRequestUi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  request: VendorCustomRequest | null;
  onSendQuote: () => void;
  onEditQuote: () => void;
  onPass: () => void;
  onMarkComplete: () => void;
};

export function VendorCustomRequestDetailDrawer({
  isOpen,
  onClose,
  request,
  onSendQuote,
  onEditQuote,
  onPass,
  onMarkComplete,
}: Props) {
  const isMobile = useMobile();
  if (!request) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[999] bg-secondary-000/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed z-[1000] flex flex-col overflow-hidden bg-white shadow-2xl ${
              isMobile
                ? "bottom-0 left-0 right-0 max-h-[92vh] rounded-t-[24px]"
                : "top-0 right-0 bottom-0 w-[90%] max-w-[560px] rounded-l-2xl"
            }`}
          >
            <div className="flex items-start justify-between border-b border-accent-20 p-6">
              <div>
                <p className="mb-1 text-xs font-medium text-accent-80">
                  {request.orderReferenceId}
                </p>
                <h2 className="font-unbounded text-xl font-semibold text-secondary-000">
                  {request.title}
                </h2>
                <div className="mt-3">
                  <VendorCustomRequestStatusBadge status={request.status} />
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-800 transition-colors hover:bg-accent-20"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-secondary-000" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {request.status === "active" && request.escrowAmount && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-3">
                  <p className="text-sm font-semibold text-emerald-900">
                    Client paid {formatMoney(request.escrowAmount)}
                    {request.paymentMethod
                      ? ` via ${request.paymentMethod}`
                      : ""}
                    .
                  </p>
                  <p className="mt-1 text-xs text-emerald-800">
                    Funds are in escrow until the client releases them after you
                    complete the job.
                  </p>
                </div>
              )}

              <VendorCustomRequestClientCard request={request} />

              {request.myQuote && (
                <section>
                  <h3 className="mb-3 font-unbounded text-sm font-semibold text-secondary-000">
                    Your quote
                  </h3>
                  <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                    {request.myQuote.lineItems.map((item, idx) => (
                      <div
                        key={`${item.description}-${idx}`}
                        className="mb-2 flex justify-between gap-2 text-sm"
                      >
                        <span>{item.description}</span>
                        <span className="font-semibold">
                          {formatMoney(item.amount)}
                        </span>
                      </div>
                    ))}
                    <div className="mt-3 flex justify-between border-t border-amber-200/60 pt-3 font-semibold text-primary-100">
                      <span>Total</span>
                      <span>{formatMoney(request.myQuote.totalAmount)}</span>
                    </div>
                    {request.myQuote.message && (
                      <p className="mt-3 text-sm italic text-accent-80">
                        &ldquo;{request.myQuote.message}&rdquo;
                      </p>
                    )}
                  </div>
                </section>
              )}

              {request.competitorQuoteCount != null &&
                request.competitorQuoteCount > 0 && (
                  <p className="text-xs text-accent-80">
                    {request.competitorQuoteCount} other vendor
                    {request.competitorQuoteCount !== 1 ? "s have" : " has"}{" "}
                    also quoted on this request.
                  </p>
                )}

              <section>
                <h3 className="mb-3 font-unbounded text-sm font-semibold text-secondary-000">
                  Timeline
                </h3>
                <ul className="space-y-3">
                  {request.timeline.map((event, idx) => (
                    <li key={`${event.at}-${idx}`} className="text-sm">
                      <p className="text-xs text-accent-80">{event.at}</p>
                      <p className="text-secondary-000">{event.label}</p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-accent-20 bg-secondary-800 p-6">
              {canSendQuote(request) && (
                <button
                  type="button"
                  onClick={onSendQuote}
                  className="h-11 flex-1 min-w-[140px] rounded-[18px] bg-primary-100 font-semibold text-white hover:bg-primary-100/90"
                >
                  Send quote
                </button>
              )}
              {canEditQuote(request) && (
                <button
                  type="button"
                  onClick={onEditQuote}
                  className="h-11 flex-1 min-w-[140px] rounded-[18px] bg-primary-100 font-semibold text-white hover:bg-primary-100/90"
                >
                  Edit quote
                </button>
              )}
              {canMarkComplete(request) && (
                <button
                  type="button"
                  onClick={onMarkComplete}
                  className="h-11 flex-1 min-w-[140px] rounded-[18px] bg-primary-100 font-semibold text-white hover:bg-primary-100/90"
                >
                  Mark complete
                </button>
              )}
              {canPassRequest(request) && (
                <button
                  type="button"
                  onClick={onPass}
                  className="h-11 rounded-[18px] border border-accent-20 px-5 font-semibold text-destructive hover:bg-destructive/5"
                >
                  Pass
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
