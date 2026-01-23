"use client";

import React, { useState } from "react";
import { X, Building2, Smartphone, Plus } from "lucide-react";

interface AddPayoutMethodDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function AddPayoutMethodDrawer({
  isOpen,
  onClose,
  onSubmit,
}: AddPayoutMethodDrawerProps) {
  const [data, setData] = useState({
    type: "bank" as "bank" | "mobile-money",
    bankName: "",
    accountNumber: "",
    accountName: "",
    phoneNumber: "",
  });

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#231305]/40 backdrop-blur-[2px] z-[100] animate-in fade-in duration-300"
      />
      <div className="fixed right-0 top-0 bottom-0 w-full lg:max-w-[560px] bg-white z-[101] shadow-2xl flex flex-col animate-in duration-500 ease-out sm:slide-in-from-right max-sm:slide-in-from-bottom sm:rounded-l-[32px] max-sm:rounded-t-[32px] sm:h-full max-sm:h-[92dvh] max-sm:top-auto sm:bottom-0">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-unbounded text-xl font-semibold text-zinc-900">
            Add Payout Method
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Type Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-zinc-700">
              Payout Method Type
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => setData({ ...data, type: "bank" })}
                className={`flex-1 p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group active:scale-[0.98] ${
                  data.type === "bank"
                    ? "border-emerald-500 bg-emerald-50/50"
                    : "border-zinc-100 hover:border-zinc-200"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    data.type === "bank" ? "bg-emerald-500 text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"
                  }`}
                >
                  <Building2 className="w-6 h-6" />
                </div>
                <span
                  className={`text-sm font-bold font-unageo transition-colors ${
                    data.type === "bank" ? "text-emerald-700" : "text-zinc-500"
                  }`}
                >
                  Bank Account
                </span>
              </button>
              <button
                onClick={() => setData({ ...data, type: "mobile-money" })}
                className={`flex-1 p-5 rounded-xl border-2 transition-all flex flex-col items-center gap-2 group active:scale-[0.98] ${
                  data.type === "mobile-money"
                    ? "border-amber-500 bg-amber-50/50"
                    : "border-zinc-100 hover:border-zinc-200"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    data.type === "mobile-money" ? "bg-amber-500 text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                </div>
                <span
                  className={`text-sm font-bold font-unageo transition-colors ${
                    data.type === "mobile-money" ? "text-amber-700" : "text-zinc-500"
                  }`}
                >
                  Mobile Money
                </span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {data.type === "bank" ? (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={data.bankName}
                    onChange={(e) => setData({ ...data, bankName: e.target.value })}
                    placeholder="e.g., GTBank Nigeria"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-primary-100 outline-none transition-all font-unageo text-[15px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={data.accountNumber}
                    onChange={(e) => setData({ ...data, accountNumber: e.target.value })}
                    placeholder="Enter account number"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-primary-100 outline-none transition-all font-unageo text-[15px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={data.accountName}
                    onChange={(e) => setData({ ...data, accountName: e.target.value })}
                    placeholder="Full name on account"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-primary-100 outline-none transition-all font-unageo text-[15px]"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={data.phoneNumber}
                  onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
                  placeholder="+234 803 456 7890"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:border-primary-100 outline-none transition-all font-unageo text-[15px]"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-all active:scale-95 font-unageo cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(data)}
            className="px-6 py-3 rounded-xl bg-primary-100 text-white text-sm font-semibold hover:bg-primary-100/90 transition-all shadow-lg shadow-primary-100/10 flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Method
          </button>
        </div>
      </div>
    </>
  );
}
