"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useMobile } from "@/hooks/useMobile";
import type { VendorCustomRequest } from "@/types/vendorCustomRequests";
import {
  vendorSendQuoteSchema,
  type VendorSendQuotePayload,
} from "@/lib/validations/vendorCustomRequestSchemas";
import { firstZodIssueMessage } from "@/lib/validations/zodHelpers";
import { formatMoney } from "@/lib/vendorCustomRequestUi";

type BreakdownRow = { item: string; price: string };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  request: VendorCustomRequest | null;
  isEditMode: boolean;
  onConfirm: (payload: VendorSendQuotePayload) => void;
  isSubmitting?: boolean;
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
  isSubmitting = false,
}: Props) {
  const isMobile = useMobile();
  const [breakdown, setBreakdown] = useState<BreakdownRow[]>([
    { item: "", price: "" },
  ]);
  const [note, setNote] = useState("");
  const [validUntil, setValidUntil] = useState("");

  useEffect(() => {
    if (!isOpen || !request) return;
    if (isEditMode && request.myQuote) {
      setBreakdown(
        request.myQuote.lineItems.map((row) => ({
          item: row.item,
          price: String(row.price),
        }))
      );
      setNote(request.myQuote.note ?? "");
      setValidUntil(request.myQuote.validUntil);
    } else {
      setBreakdown([{ item: "", price: "" }]);
      setNote("");
      setValidUntil(defaultValidUntil());
    }
  }, [isOpen, request, isEditMode]);

  const total = useMemo(
    () =>
      breakdown.reduce((sum, row) => {
        const n = Number(row.price);
        return sum + (Number.isFinite(n) ? n : 0);
      }, 0),
    [breakdown]
  );

  if (!request) return null;

  const handleSubmit = () => {
    const parsed = vendorSendQuoteSchema.safeParse({
      breakdown,
      note,
      validUntil,
    });
    if (!parsed.success) {
      toast.error(firstZodIssueMessage(parsed.error));
      return;
    }

    const payload: VendorSendQuotePayload = {
      breakdown: parsed.data.breakdown.map((row) => ({
        item: row.item,
        price: Number(row.price),
      })),
    };

    if (parsed.data.note) {
      payload.note = parsed.data.note;
    }
    if (parsed.data.validUntil) {
      payload.validUntil = parsed.data.validUntil;
    }

    onConfirm(payload);
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
                    Breakdown *
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setBreakdown((prev) => [...prev, { item: "", price: "" }])
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-primary-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add line
                  </button>
                </div>
                <div className="space-y-3">
                  {breakdown.map((row, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Item"
                        value={row.item}
                        onChange={(e) => {
                          const next = [...breakdown];
                          next[idx] = { ...next[idx], item: e.target.value };
                          setBreakdown(next);
                        }}
                        className="flex-1 rounded-xl border border-accent-20 px-3 py-2.5 text-sm outline-none focus:border-primary-100"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={row.price}
                        onChange={(e) => {
                          const next = [...breakdown];
                          next[idx] = { ...next[idx], price: e.target.value };
                          setBreakdown(next);
                        }}
                        className="w-28 rounded-xl border border-accent-20 px-3 py-2.5 text-sm outline-none focus:border-primary-100"
                      />
                      {breakdown.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setBreakdown((prev) =>
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
                  Note
                </label>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Includes materials and travel within Lagos."
                  className="w-full resize-y rounded-xl border border-accent-20 p-3 text-sm outline-none focus:border-primary-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-secondary-000">
                  Valid until
                </label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full rounded-xl border border-accent-20 px-3 py-2.5 text-sm outline-none focus:border-primary-100"
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-accent-20 bg-secondary-800 p-6">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-11 flex-1 rounded-[18px] border border-accent-20 font-semibold text-accent-80"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={total <= 0 || isSubmitting}
                className="h-11 flex-1 rounded-[18px] bg-primary-100 font-semibold text-white hover:bg-primary-100/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Sending…"
                  : isEditMode
                    ? "Update quote"
                    : "Send quote"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
