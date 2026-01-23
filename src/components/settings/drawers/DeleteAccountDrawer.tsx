"use client";

import React, { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface DeleteAccountDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (confirmationText: string) => void;
}

export function DeleteAccountDrawer({
  isOpen,
  onClose,
  onConfirm,
}: DeleteAccountDrawerProps) {
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState("");

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#231305]/40 backdrop-blur-[2px] z-[100] animate-in fade-in duration-300"
      />
      <div className="fixed right-0 top-0 bottom-0 w-full lg:max-w-[560px] bg-white z-[101] shadow-2xl flex flex-col animate-in duration-500 ease-out sm:slide-in-from-right max-sm:slide-in-from-bottom sm:rounded-l-[32px] max-sm:rounded-t-[32px] sm:h-full max-sm:h-[92dvh] max-sm:top-auto sm:bottom-0">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-unbounded text-xl font-semibold text-red-600">
            Delete Account
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-50 transition-colors"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2 text-center">
                <h4 className="font-unbounded text-lg font-semibold text-zinc-900">
                  Are you sure?
                </h4>
                <p className="font-unageo text-[15px] text-zinc-500 leading-relaxed">
                  Deleting your account is permanent and cannot be undone. You will lose:
                </p>
              </div>
              <ul className="space-y-3 font-unageo text-[14px] text-zinc-600 bg-zinc-50/50 p-5 rounded-xl border border-zinc-100 list-disc pl-9">
                <li>All your business information and profile</li>
                <li>All your appointments and booking history</li>
                <li>All your reviews and ratings</li>
                <li>All your financial records</li>
                <li>Access to all pending payouts</li>
              </ul>
              <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="font-unageo text-xs text-red-800 leading-relaxed">
                  <strong>Note:</strong> You must have no pending appointments or outstanding payments before deleting your account.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-unageo text-[15px] text-zinc-600 leading-relaxed">
                To confirm deletion, please type <strong className="text-zinc-900">DELETE</strong> in the box below:
              </p>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value.toUpperCase())}
                placeholder="Type DELETE to confirm"
                className="w-full px-5 py-4 border-2 border-red-100 rounded-xl focus:border-red-500 outline-none transition-all font-unbounded text-lg tracking-widest text-center text-secondary-000 uppercase placeholder:tracking-normal placeholder:text-zinc-400"
              />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-all active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95 cursor-pointer"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={() => onConfirm(confirmation)}
              disabled={confirmation !== "DELETE"}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                confirmation === "DELETE"
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200 ring-4 ring-red-100 cursor-pointer"
                  : "bg-zinc-200 text-secondary-000 cursor-not-allowed"
              }`}
            >
              Delete My Account
            </button>
          )}
        </div>
      </div>
    </>
  );
}
