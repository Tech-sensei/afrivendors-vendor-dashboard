"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { mockVendorCustomRequests } from "@/data/mockVendorCustomRequests";
import {
  VENDOR_CUSTOM_REQUEST_TABS,
  countVendorRequestsByTab,
  filterVendorRequestsByTab,
} from "@/lib/vendorCustomRequestFilters";
import { formatMoney } from "@/lib/vendorCustomRequestUi";
import type {
  VendorCustomRequest,
  VendorCustomRequestTabId,
  VendorQuote,
  VendorQuoteLineItem,
} from "@/types/vendorCustomRequests";
import { VendorCustomRequestListCard } from "@/components/custom-requests/VendorCustomRequestListCard";
import { VendorCustomRequestEmptyState } from "@/components/custom-requests/VendorCustomRequestEmptyState";
import { VendorCustomRequestDetailDrawer } from "@/components/custom-requests/VendorCustomRequestDetailDrawer";
import { VendorSendQuoteDrawer } from "@/components/custom-requests/VendorSendQuoteDrawer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CustomRequestsPage() {
  const [requests, setRequests] = useState<VendorCustomRequest[]>(
    mockVendorCustomRequests
  );
  const [activeTab, setActiveTab] =
    useState<VendorCustomRequestTabId>("incoming");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<VendorCustomRequest | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteEditMode, setQuoteEditMode] = useState(false);
  const [passTargetId, setPassTargetId] = useState<string | null>(null);
  const [completeTargetId, setCompleteTargetId] = useState<string | null>(
    null
  );

  const filteredByTab = useMemo(
    () => filterVendorRequestsByTab(requests, activeTab),
    [requests, activeTab]
  );

  const filteredRequests = useMemo(() => {
    if (!search.trim()) return filteredByTab;
    const q = search.toLowerCase();
    return filteredByTab.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.customerName.toLowerCase().includes(q) ||
        r.orderReferenceId.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [filteredByTab, search]);

  const openDetail = (request: VendorCustomRequest) => {
    setSelected(request);
    setDetailOpen(true);
  };

  const openSendQuote = (request: VendorCustomRequest, edit = false) => {
    setSelected(request);
    setQuoteEditMode(edit);
    setDetailOpen(false);
    setQuoteOpen(true);
  };

  const handleConfirmQuote = (payload: {
    lineItems: VendorQuoteLineItem[];
    message: string;
    validUntil: string;
  }) => {
    if (!selected) return;
    const total = payload.lineItems.reduce((s, i) => s + i.amount, 0);
    const label = todayLabel();
    const quote: VendorQuote = {
      id: selected.myQuote?.id ?? `vq-${Date.now()}`,
      lineItems: payload.lineItems,
      totalAmount: total,
      message: payload.message,
      validUntil: payload.validUntil,
      sentAt: selected.myQuote?.sentAt ?? label,
      status: "pending",
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id !== selected.id
          ? r
          : {
              ...r,
              status: "quoted" as const,
              myQuote: quote,
              timeline: quoteEditMode
                ? r.timeline.map((e, i) =>
                    i === r.timeline.length - 1
                      ? {
                          at: label,
                          label: `Quote updated · ${formatMoney(total)}`,
                        }
                      : e
                  )
                : [
                    ...r.timeline,
                    {
                      at: label,
                      label: `Your quote sent · ${formatMoney(total)}`,
                    },
                  ],
            }
      )
    );

    toast.success(
      quoteEditMode
        ? "Quote updated. The client can review your new price."
        : `Quote of ${formatMoney(total)} sent. Awaiting client decision.`
    );
    setQuoteOpen(false);
    setActiveTab("quoted");
  };

  const confirmPass = () => {
    if (!passTargetId) return;
    const label = todayLabel();
    setRequests((prev) =>
      prev.map((r) =>
        r.id !== passTargetId
          ? r
          : {
              ...r,
              status: "passed" as const,
              timeline: [
                ...r.timeline,
                { at: label, label: "You passed on this request" },
              ],
            }
      )
    );
    toast.message("Request passed");
    setPassTargetId(null);
    setDetailOpen(false);
    setActiveTab("passed");
  };

  const confirmComplete = () => {
    if (!completeTargetId) return;
    const label = todayLabel();
    setRequests((prev) =>
      prev.map((r) =>
        r.id !== completeTargetId
          ? r
          : {
              ...r,
              status: "completed" as const,
              timeline: [
                ...r.timeline,
                { at: label, label: "You marked job complete" },
              ],
            }
      )
    );
    toast.success("Job marked complete. Client will release escrow when ready.");
    setCompleteTargetId(null);
    setDetailOpen(false);
    setActiveTab("completed");
  };

  const selectedLive =
    selected && requests.find((r) => r.id === selected.id)
      ? requests.find((r) => r.id === selected.id)!
      : selected;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="mb-2 font-unbounded text-[28px] font-semibold leading-8 text-secondary-200">
          Custom requests
        </h1>
        <p className="max-w-2xl text-sm text-accent-80">
          Clients post jobs in your category. Send a quote with a breakdown —
          when they accept and pay, the job becomes active and payment is held in
          escrow until they release it.
        </p>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {VENDOR_CUSTOM_REQUEST_TABS.map((tab) => {
          const count = countVendorRequestsByTab(requests, tab.id);
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition-all",
                active
                  ? "bg-secondary-000 text-white shadow-md"
                  : "border border-accent-20 bg-white text-secondary-300 hover:border-accent-40"
              )}
            >
              {tab.label}
              {count > 0 && (
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-xs",
                    active
                      ? "bg-white/20"
                      : "bg-primary-100/10 text-primary-100"
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-60" />
        <input
          type="search"
          placeholder="Search by title, client, or reference…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-11 w-full rounded-[18px] border border-accent-20 bg-white pl-11 pr-4 text-sm outline-none focus:border-primary-100"
        />
          </div>

      {filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <VendorCustomRequestListCard
              key={request.id}
              request={request}
              onViewDetails={openDetail}
              onSendQuote={(r) => openSendQuote(r, false)}
              onPass={(id) => setPassTargetId(id)}
              onMarkComplete={(id) => setCompleteTargetId(id)}
            />
          ))}
        </div>
      ) : (
        <VendorCustomRequestEmptyState tab={activeTab} />
      )}

      <VendorCustomRequestDetailDrawer
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        request={selectedLive}
        onSendQuote={() =>
          selectedLive && openSendQuote(selectedLive, false)
        }
        onEditQuote={() => selectedLive && openSendQuote(selectedLive, true)}
        onPass={() => selectedLive && setPassTargetId(selectedLive.id)}
        onMarkComplete={() =>
          selectedLive && setCompleteTargetId(selectedLive.id)
        }
      />

      <VendorSendQuoteDrawer
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        request={selectedLive}
        isEditMode={quoteEditMode}
        onConfirm={handleConfirmQuote}
      />

      <ConfirmModal
        open={passTargetId !== null}
        onOpenChange={(open) => !open && setPassTargetId(null)}
        onConfirm={confirmPass}
        title="Pass on this request?"
        description="You will not be able to quote on this job. Other vendors in your category may still respond."
        confirmText="Pass"
        cancelText="Cancel"
      />

      <ConfirmModal
        open={completeTargetId !== null}
        onOpenChange={(open) => !open && setCompleteTargetId(null)}
        onConfirm={confirmComplete}
        title="Mark job as complete?"
        description="The client will be notified. Funds stay in escrow until they release payment."
        confirmText="Mark complete"
        cancelText="Cancel"
      />
    </div>
  );
}
