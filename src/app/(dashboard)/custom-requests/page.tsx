"use client";

import { useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { VENDOR_CUSTOM_REQUEST_TABS } from "@/lib/vendorCustomRequestFilters";
import { formatMoney } from "@/lib/vendorCustomRequestUi";
import type {
  VendorCustomRequest,
  VendorCustomRequestTabId,
} from "@/types/vendorCustomRequests";
import type { VendorSendQuotePayload } from "@/lib/validations/vendorCustomRequestSchemas";
import { VendorCustomRequestListCard } from "@/components/custom-requests/VendorCustomRequestListCard";
import { VendorCustomRequestEmptyState } from "@/components/custom-requests/VendorCustomRequestEmptyState";
import { VendorCustomRequestDetailDrawer } from "@/components/custom-requests/VendorCustomRequestDetailDrawer";
import { VendorSendQuoteDrawer } from "@/components/custom-requests/VendorSendQuoteDrawer";
import { MessageCustomRequestDrawer } from "@/components/custom-requests/MessageCustomRequestDrawer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  getVendorCustomRequestErrorMessage,
  useCompleteVendorCustomRequest,
  useSendVendorCustomRequestQuote,
  useVendorCustomRequestDetail,
  useVendorCustomRequests,
  useVendorCustomRequestTabCounts,
  VENDOR_CUSTOM_REQUEST_DETAIL_KEY,
  VENDOR_CUSTOM_REQUEST_COUNTS_KEY,
  VENDOR_CUSTOM_REQUESTS_KEY,
  useVendorEscalateCustomRequestDispute,
  useVendorRefundCustomRequestDispute,
} from "@/services/useVendorCustomRequests";
import { DisputeResolutionDialog } from "@/components/appointments/DisputeResolutionDialog";
import { EscalateDisputeDialog } from "@/components/appointments/EscalateDisputeDialog";

export default function CustomRequestsPage() {
  const [activeTab, setActiveTab] =
    useState<VendorCustomRequestTabId>("incoming");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteEditMode, setQuoteEditMode] = useState(false);
  const [passTargetId, setPassTargetId] = useState<string | null>(null);
  const [completeTargetId, setCompleteTargetId] = useState<string | null>(
    null
  );
  const [refundTargetId, setRefundTargetId] = useState<string | null>(null);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [escalateTargetId, setEscalateTargetId] = useState<string | null>(null);
  const [isEscalateOpen, setIsEscalateOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageRequest, setMessageRequest] = useState<VendorCustomRequest | null>(null);

  const { data: requests = [], isLoading } = useVendorCustomRequests(activeTab);
  const { data: tabCounts } = useVendorCustomRequestTabCounts();
  const sendQuote = useSendVendorCustomRequestQuote();
  const completeRequest = useCompleteVendorCustomRequest();
  const { mutate: refundCustomer, isPending: isRefunding } =
    useVendorRefundCustomRequestDispute();
  const { mutate: escalateDispute, isPending: isEscalating } =
    useVendorEscalateCustomRequestDispute();

  const selectedFromList = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId]
  );

  const shouldFetchDetail =
    detailOpen && selectedId != null && activeTab !== "incoming";

  const { data: selectedDetail, isLoading: detailLoading } =
    useVendorCustomRequestDetail(
      selectedId ? Number(selectedId) : null,
      shouldFetchDetail
    );

  const selectedLive = shouldFetchDetail
    ? selectedDetail ?? selectedFromList
    : selectedFromList;

  const filteredRequests = useMemo(() => {
    if (!search.trim()) return requests;
    const q = search.toLowerCase();
    return requests.filter(
      (request) =>
        request.title.toLowerCase().includes(q) ||
        request.customerName.toLowerCase().includes(q) ||
        request.orderReferenceId.toLowerCase().includes(q) ||
        request.description.toLowerCase().includes(q)
    );
  }, [requests, search]);

  const openDetail = (request: VendorCustomRequest) => {
    setSelectedId(request.id);
    setDetailOpen(true);
  };

  const openMessageCustomer = (request: VendorCustomRequest) => {
    setMessageRequest(request);
    setIsMessageOpen(true);
  };

  const closeMessageDrawer = () => {
    setIsMessageOpen(false);
    setMessageRequest(null);
  };

  const openSendQuote = (request: VendorCustomRequest, edit = false) => {
    setSelectedId(request.id);
    setQuoteEditMode(edit);
    setDetailOpen(false);
    setQuoteOpen(true);
  };

  const handleConfirmQuote = async (payload: VendorSendQuotePayload) => {
    if (!selectedId) return;
    const total = payload.breakdown.reduce((sum, row) => sum + row.price, 0);

    try {
      await sendQuote.mutateAsync({
        requestId: Number(selectedId),
        payload,
        isEdit: quoteEditMode,
      });

      toast.success(
        quoteEditMode
          ? "Quote updated. The client can review your new price."
          : `Quote of ${formatMoney(total)} sent. Awaiting client decision.`
      );
      setQuoteOpen(false);
      setActiveTab("quoted");
    } catch (err) {
      toast.error("Could not send quote", {
        description: getVendorCustomRequestErrorMessage(err),
      });
    }
  };

  const confirmPass = () => {
    toast.message("Pass is not available via API yet.");
    setPassTargetId(null);
    setDetailOpen(false);
  };

  const confirmComplete = async () => {
    const targetId = completeTargetId;
    if (!targetId) return;

    try {
      await completeRequest.mutateAsync(Number(targetId));
      toast.success(
        "Job marked complete. The client will be notified to release escrow."
      );
      setCompleteTargetId(null);
      setDetailOpen(false);
      setActiveTab("completed");
    } catch (err) {
      toast.error("Could not mark job complete", {
        description: getVendorCustomRequestErrorMessage(err),
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
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
          const count = tabCounts?.[tab.id] ?? 0;
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

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <VendorCustomRequestListCard
              key={request.id}
              request={request}
              onViewDetails={openDetail}
              onSendQuote={(request) => openSendQuote(request, false)}
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
        onClose={() => {
          setDetailOpen(false);
          setSelectedId(null);
        }}
        request={detailLoading ? null : selectedLive}
        onSendQuote={() =>
          selectedLive && openSendQuote(selectedLive, false)
        }
        onEditQuote={() => selectedLive && openSendQuote(selectedLive, true)}
        onPass={() => selectedLive && setPassTargetId(selectedLive.id)}
        onMarkComplete={() =>
          selectedLive && setCompleteTargetId(selectedLive.id)
        }
        onRefundCustomer={() => {
          if (!selectedLive) return;
          setRefundTargetId(selectedLive.id);
          setIsRefundOpen(true);
        }}
        onEscalateDispute={() => {
          if (!selectedLive) return;
          setEscalateTargetId(selectedLive.id);
          setIsEscalateOpen(true);
        }}
        onMessageCustomer={() => {
          if (!selectedLive) return;
          openMessageCustomer(selectedLive);
        }}
      />

      <MessageCustomRequestDrawer
        isOpen={isMessageOpen}
        onClose={closeMessageDrawer}
        request={messageRequest}
      />

      <DisputeResolutionDialog
        open={isRefundOpen}
        onOpenChange={setIsRefundOpen}
        title="Refund customer & close dispute"
        description="You agree to refund the customer and close this dispute. Add a short note about what you agreed."
        confirmLabel="Refund customer"
        isPending={isRefunding}
        onConfirm={(resolution) => {
          if (!refundTargetId) return;
          refundCustomer(
            {
              type: "custom_request",
              orderId: Number(refundTargetId),
              resolution,
            },
            {
              onSuccess: () => {
                setIsRefundOpen(false);
                setRefundTargetId(null);
              },
            }
          );
        }}
      />

      <EscalateDisputeDialog
        open={isEscalateOpen}
        onOpenChange={setIsEscalateOpen}
        isPending={isEscalating}
        onConfirm={() => {
          if (!escalateTargetId) return;
          escalateDispute(
            { type: "custom_request", orderId: Number(escalateTargetId) },
            {
              onSuccess: () => {
                setIsEscalateOpen(false);
                setEscalateTargetId(null);
              },
            }
          );
        }}
      />

      <VendorSendQuoteDrawer
        isOpen={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        request={selectedLive}
        isEditMode={quoteEditMode}
        onConfirm={handleConfirmQuote}
        isSubmitting={sendQuote.isPending}
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
        confirmText={
          completeRequest.isPending ? "Marking complete…" : "Mark complete"
        }
        cancelText="Cancel"
      />
    </div>
  );
}
