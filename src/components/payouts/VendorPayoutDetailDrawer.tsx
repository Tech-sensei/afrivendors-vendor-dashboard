"use client";

import {
  X,
  ArrowUpRight,
  Copy,
  Receipt,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/currency";
import type { VendorPayoutDetail, VendorPayoutUiStatus } from "@/lib/mapVendorPayout";

interface VendorPayoutDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  payout: VendorPayoutDetail | null;
  isLoading?: boolean;
}

function getStatusStyle(status: VendorPayoutUiStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "pending":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "rejected":
      return "bg-red-50 text-red-600 border-red-100";
    default:
      return "bg-zinc-50 text-zinc-600 border-zinc-100";
  }
}

export function VendorPayoutDetailDrawer({
  isOpen,
  onClose,
  payout,
  isLoading,
}: VendorPayoutDetailDrawerProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const currency = payout?.ledgerCurrency ?? "GBP";
  const summaryAmount = payout
    ? formatMoney(payout.amount, currency)
    : "—";

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-[#231305]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed z-50 flex transform flex-col overflow-hidden bg-white shadow-2xl transition-transform duration-300 ease-out max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:h-[92vh] max-sm:rounded-t-[24px] sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] ${
          isOpen
            ? "max-sm:translate-y-0 sm:translate-x-0"
            : "max-sm:translate-y-full sm:translate-x-full"
        }`}
      >
        <div className="mb-3 flex shrink-0 items-start justify-between border-b border-zinc-200 px-8 py-6">
          <div>
            <h2 className="font-unbounded mb-1 text-2xl font-bold text-secondary-000">
              Payout Details
            </h2>
            <p className="font-unageo text-[15px] text-accent-80">
              {payout?.payoutRef ?? "Complete overview of this payout request"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-secondary-700 p-2.5 transition-all duration-200 hover:bg-secondary-600"
          >
            <X className="h-5 w-5 text-secondary-000" />
          </button>
        </div>

        <div className="custom-scrollbar flex-1 space-y-7 overflow-y-auto px-8 pb-8 pt-4">
          {isLoading || !payout ? (
            <p className="font-unageo text-sm text-accent-80">Loading payout…</p>
          ) : (
            <>
              <div className="group relative overflow-hidden rounded-[32px] border border-secondary-600 bg-secondary-700 p-8">
                <div className="absolute right-0 top-0 p-8 opacity-10 transition-transform duration-500 group-hover:scale-110">
                  <ArrowUpRight className="h-8 w-8 text-blue-600" />
                </div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50">
                    <ArrowUpRight className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-unbounded text-3xl font-bold tracking-tight text-secondary-000">
                      {summaryAmount}
                    </h3>
                    <div
                      className={`inline-flex rounded-full border-[1.5px] px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest ${getStatusStyle(payout.status)}`}
                    >
                      {payout.statusLabel}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-8">
                <div className="space-y-4">
                  <h4 className="px-1 font-unageo text-xs font-bold uppercase tracking-widest text-zinc-400">
                    Basic Information
                  </h4>
                  <div className="overflow-hidden rounded-2xl border border-secondary-600 bg-white">
                    <div className="flex items-center justify-between border-b border-secondary-600 p-5 text-sm">
                      <div className="flex items-center gap-3 text-accent-80">
                        <Receipt className="h-4 w-4 text-primary-100" />
                        Payout ID
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(payout.id)}
                        className="flex cursor-pointer items-center gap-2 font-bold text-secondary-000 transition-colors hover:text-primary-100"
                      >
                        <span className="font-mono">{payout.id}</span>
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    {payout.transactionId ? (
                      <div className="flex items-center justify-between border-b border-secondary-600 p-5 text-sm">
                        <div className="flex items-center gap-3 text-accent-80">
                          <Receipt className="h-4 w-4 text-primary-100" />
                          Transaction ID
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(payout.transactionId!)}
                          className="flex cursor-pointer items-center gap-2 font-bold text-secondary-000 transition-colors hover:text-primary-100"
                        >
                          <span className="font-mono">{payout.transactionId}</span>
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}
                    {payout.transactionRef ? (
                      <div className="flex items-center justify-between border-b border-secondary-600 p-5 text-sm">
                        <div className="flex items-center gap-3 text-accent-80">
                          <Receipt className="h-4 w-4 text-primary-100" />
                          Transaction ref
                        </div>
                        <span className="font-bold text-secondary-000">
                          {payout.transactionRef}
                        </span>
                      </div>
                    ) : null}
                    <div className="flex items-center justify-between border-b border-secondary-600 p-5 text-sm">
                      <div className="flex items-center gap-3 text-accent-80">
                        <Calendar className="h-4 w-4 text-primary-100" />
                        Date requested
                      </div>
                      <span className="font-bold text-secondary-000">
                        {payout.requestedDate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-5 text-sm">
                      <div className="flex items-center gap-3 text-accent-80">
                        <Clock className="h-4 w-4 text-primary-100" />
                        Time
                      </div>
                      <span className="font-bold text-secondary-000">
                        {payout.requestedTime}
                      </span>
                    </div>
                  </div>
                </div>

                {payout.rejectionReason ? (
                  <div className="space-y-4">
                    <h4 className="px-1 font-unageo text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Rejection
                    </h4>
                    <div className="overflow-hidden rounded-2xl border border-red-200 bg-red-50">
                      <div className="flex gap-3 p-5 text-sm">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                        <p className="font-bold leading-relaxed text-red-800">
                          {payout.rejectionReason}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {payout.ledgerTypeLabel ||
                payout.ledgerStatus ||
                payout.ledgerDescription ? (
                  <div className="space-y-4">
                    <h4 className="px-1 font-unageo text-xs font-bold uppercase tracking-widest text-zinc-400">
                      Ledger Transaction
                    </h4>
                    <div className="overflow-hidden rounded-2xl border border-secondary-600 bg-white">
                      {payout.ledgerTypeLabel ? (
                        <div className="flex items-center justify-between gap-4 border-b border-secondary-600 p-5 text-sm">
                          <div className="flex shrink-0 items-center gap-3 text-accent-80">
                            <ShieldCheck className="h-4 w-4 text-primary-100" />
                            Type
                          </div>
                          <span className="text-right font-bold text-secondary-000">
                            {payout.ledgerTypeLabel}
                          </span>
                        </div>
                      ) : null}
                      {payout.ledgerStatus ? (
                        <div className="flex items-center justify-between gap-4 border-b border-secondary-600 p-5 text-sm">
                          <div className="flex items-center gap-3 text-accent-80">
                            <ShieldCheck className="h-4 w-4 text-primary-100" />
                            Ledger status
                          </div>
                          <span className="font-bold capitalize text-secondary-000">
                            {payout.ledgerStatus}
                          </span>
                        </div>
                      ) : null}
                      {payout.ledgerDescription ? (
                        <div className="flex flex-col gap-2 p-5 text-sm">
                          <div className="flex items-center gap-3 text-accent-80">
                            <ShieldCheck className="h-4 w-4 text-primary-100" />
                            Description
                          </div>
                          <p className="font-bold leading-relaxed text-secondary-000">
                            {payout.ledgerDescription}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        <div className="sticky bottom-0 mt-auto shrink-0 border-t border-secondary-600 bg-secondary-800 px-8 py-6">
          <button
            type="button"
            onClick={onClose}
            className="font-unageo w-full cursor-pointer rounded-xl border border-accent-20 bg-white px-6 py-4 text-center text-[15px] font-bold text-secondary-000 shadow-sm transition-all duration-200 hover:border-accent-40 hover:bg-secondary-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
