"use client";

import React from "react";
import { X, AlertTriangle, Trash2, Building2, Smartphone } from "lucide-react";
import { PayoutAccount } from "@/data/wallet";

interface DeletePayoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  account: PayoutAccount | null;
  onConfirm: (id: string) => void;
}

export function DeletePayoutDrawer({
  isOpen,
  onClose,
  account,
  onConfirm,
}: DeletePayoutDrawerProps) {
  if (!account) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 transition-opacity duration-300 h-full"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:h-[92vh] max-sm:rounded-t-[32px] max-sm:translate-y-0 sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] sm:translate-x-0 overflow-hidden`}>
        
        {/* Header */}
        <div className="px-8 py-6 flex items-start justify-between border-b border-secondary-600/30 flex-shrink-0">
          <div>
            <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
              Delete Account
            </h2>
            <p className="font-unageo text-[15px] text-accent-80">
              Confirm that you want to remove this payout method
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-secondary-000" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-8 py-10 flex flex-col items-center">
            {/* Warning Icon Container */}
            <div className="w-24 h-24 rounded-[32px] bg-red-50 flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-[24px] bg-red-100/50 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-[#A82B2B]" />
              </div>
            </div>

            <h3 className="font-unbounded text-2xl font-bold text-secondary-000 mb-2 text-center">
              Are you sure?
            </h3>
            
            <p className="font-unageo text-[15px] text-accent-80 mb-8 text-center max-w-[420px] leading-relaxed">
              You are about to remove <span className="font-bold text-secondary-000">"{account.name}"</span> from your payout methods. You will need to add it again if you wish to use it later.
            </p>

            {/* Account Preview Card */}
            <div className="w-full p-6 bg-white border border-secondary-600 rounded-[20px] mb-6 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                account.type === "bank" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}>
                {account.type === "bank" ? <Building2 className="w-7 h-7" /> : <Smartphone className="w-7 h-7" />}
              </div>
              <div>
                <h4 className="font-unbounded text-lg font-bold text-secondary-000 mb-0.5">
                  {account.name}
                </h4>
                <p className="font-unageo text-sm text-accent-80 italic">
                  {account.details}
                </p>
              </div>
            </div>

            {/* Warning Alert */}
            <div className="w-full p-5 bg-[#FFF5F5] border border-[#FFD9D9] rounded-[20px] mb-4 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Trash2 className="w-5 h-5 text-[#A82B2B]" />
              </div>
              <div>
                <p className="font-unageo text-[15px] font-bold text-[#A82B2B] mb-1">
                  Permanent Removal
                </p>
                <p className="font-unageo text-[14px] text-[#A82B2B]/80 leading-snug">
                  This account will be permanently removed. Any pending withdrawals to this account might still proceed if already initiated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-secondary-600 px-8 py-6 flex gap-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 border border-secondary-600 text-secondary-000 font-unageo text-[15px] font-bold rounded-xl transition-all duration-200 hover:bg-secondary-700 hover:border-secondary-100 cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(account.id)}
            className="flex-[1.5] py-4 px-6 bg-[#A82B2B] text-white font-unageo text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 hover:-translate-y-1 shadow-lg shadow-red-900/10 cursor-pointer active:scale-95"
          >
            <Trash2 className="w-5 h-5" />
            Yes, Remove Account
          </button>
        </div>
      </div>
    </>
  );
}
