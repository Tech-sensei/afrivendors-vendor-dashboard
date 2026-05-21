"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useMobile } from "@/hooks/useMobile";
import type { VendorCustomRequest, VendorQuoteLineItem } from "@/types/vendorCustomRequests";
import { vendorSendQuoteSchema } from "@/lib/validations/vendorCustomRequestSchemas";
import { firstZodIssueMessage } from "@/lib/validations/zodHelpers";
import { formatMoney } from "@/lib/vendorCustomRequestUi";

type LineItemRow = { description: string; amount: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  request: VendorCustomRequest | null;
  isEditMode: boolean;
  onConfirm: (payload: {
    lineItems: VendorQuoteLineItem[];
    message: string;
    validUntil: string;
  }) => void;
};

const defaultValidUntil = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().slice(0, 10);
};

export function VendorSendQuoteDrawer({
  isOpen,
  onClose,
  request,
  isEditMode,
  onConfirm,
}: Props) {
  const isMobile = useMobile();
  const [lineItems, setLineItems] = useState<LineItemRow[]>([
    { description: "", amount: "" },
  ]);
  const [message, setMessage] = useState("");
  const [validUntil, setValidUntil] = useState(defaultValidUntil());

  useEffect(() => {
    if (!isOpen || !request) return;
    if (isEditMode && request.myQuote) {
      setLineItems(
        request.myQuote.lineItems.map((item) => ({
          description: item.description,
          amount: String(item.amount),
        }))
      );
      setMessage(request.myQuote.message ?? "");
      setValidUntil(request.myQuote.validUntil);
    } else {
      setLineItems([{ description: "", amount: "" }]);
      setMessage("");
      setValidUntil(defaultValidUntil());
    }
  }, [isOpen, request, isEditMode]);

  const total = useMemo(
    () =>
      lineItems.reduce((sum, row) => {
        const n = Number(row.amount);
        return sum + (Number.isFinite(n) ? n : 0);
      }, 0),
    [lineItems]
  );

  if (!request) return null;

  const handleSubmit = () => {
    const parsed = vendorSendQuoteSchema.safeParse({
      lineItems,
      message,
      validUntil,
    });
    if (!parsed.success) {
      toast.error(firstZodIssueMessage(parsed.error));
      return;
    }
    onConfirm({
      lineItems: parsed.data.lineItems.map((row) => ({
        description: row.description,
        amount: Number(row.amount),
      })),
      message: parsed.data.message,
      validUntil: parsed.data.validUntil,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[1001] bg-secondary-000/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={isMobile ? { y: "100%" } : { x: "100%" }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: "100%" } : { x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed z-[1002] flex flex-col overflow-hidden bg-white shadow-2xl ${
              isMobile
                ? "bottom-0 left-0 right-0 max-h-[92vh] rounded-t-[24px]"
                : "top-0 right-0 bottom-0 w-[90%] max-w-[560px] rounded-l-2xl"
            }`}
          >
            <div className="border-b border-accent-20 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="font-unbounded text-xl font-semibold text-secondary-000">
                    {isEditMode ? "Edit quote" : "Send quote"}
                  </h2>
                  <p className="mt-1 text-sm text-accent-80">
                    {request.orderReferenceId} · {request.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-800"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              <div className="rounded-xl border border-accent-20 bg-secondary-800 p-4 text-sm">
                <p className="font-semibold text-secondary-000">
                  {request.customerName}
                </p>
                <p className="text-accent-80">
                  Budget {formatMoney(request.budget)} · {request.location}
                </p>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-secondary-000">
                    Quote breakdown
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setLineItems((prev) => [
                        ...prev,
                        { description: "", amount: "" },
                      ])
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-primary-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add line
                  </button>
                </div>
                <div className="space-y-3">
                  {lineItems.map((row, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Description"
                        value={row.description}
                        onChange={(e) => {
                          const next = [...lineItems];
                          next[idx] = {
                            ...next[idx],
                            description: e.target.value,
                          };
                          setLineItems(next);
                        }}
                        className="flex-1 rounded-xl border border-accent-20 px-3 py-2.5 text-sm outline-none focus:border-primary-100"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="£"
                        value={row.amount}
                        onChange={(e) => {
                          const next = [...lineItems];
                          next[idx] = { ...next[idx], amount: e.target.value };
                          setLineItems(next);
                        }}
                        className="w-24 rounded-xl border border-accent-20 px-3 py-2.5 text-sm outline-none focus:border-primary-100"
                      />
                      {lineItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setLineItems((prev) =>
                              prev.filter((_, i) => i !== idx)
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center text-accent-60 hover:text-destructive"
                          aria-label="Remove line"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-right font-unbounded text-lg font-semibold text-primary-100">
                  Total {formatMoney(total)}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-secondary-000">
                  Message to client
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's included, availability, and why you're a good fit…"
                  className="w-full resize-y rounded-xl border border-accent-20 p-3 text-sm outline-none focus:border-primary-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-secondary-000">
                  Quote valid until
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full rounded-xl border border-accent-20 px-3 py-2.5 text-sm outline-none focus:border-primary-100"
                />
              </div>

              <p className="rounded-xl border border-accent-20 bg-[#FAF7F5] px-3 py-2.5 text-xs text-accent-80">
                The client compares quotes and pays when they accept one. You
                will be notified when they choose your quote.
              </p>
            </div>

            <div className="flex gap-3 border-t border-accent-20 bg-secondary-800 p-6">
              <button
                type="button"
                onClick={onClose}
                className="h-11 flex-1 rounded-[18px] border border-accent-20 font-semibold text-accent-80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={total <= 0}
                className="h-11 flex-1 rounded-[18px] bg-primary-100 font-semibold text-white hover:bg-primary-100/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isEditMode ? "Update quote" : "Send quote"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
