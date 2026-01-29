"use client";

import React from "react";
import { X, Building2, Smartphone, Plus, Check, CreditCard } from "lucide-react";
import { PayoutAccount } from "@/data/wallet";

interface PayoutAccountsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: PayoutAccount[];
  onAddAccount: () => void;
}

export function PayoutAccountsDrawer({
  isOpen,
  onClose,
  accounts,
  onAddAccount,
}: PayoutAccountsDrawerProps) {
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
        className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:h-[92vh] max-sm:rounded-t-[24px] sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] overflow-hidden ${
          isOpen 
            ? "max-sm:translate-y-0 sm:translate-x-0" 
            : "max-sm:translate-y-full sm:translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-8 py-8 flex items-start justify-between flex-shrink-0 border-b border-zinc-200 mb-4">
          <div className="space-y-1">
            <h2 className="font-unbounded text-3xl font-extrabold text-secondary-000">
              Payout Accounts
            </h2>
            <p className="font-unageo text-base text-zinc-500">
              Manage where you receive your earnings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-all duration-200 cursor-pointer"
          >
            <X className="w-6 h-6 text-zinc-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          {/* Add New Account Button */}
          <button
            onClick={onAddAccount}
            className="w-full mb-6 py-4 px-6 bg-primary-100 text-white font-unageo text-base font-bold rounded-[16px] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-primary-100/20"
          >
            <Plus className="w-5 h-5" />
            Add New Payout Account
          </button>

          <div className="grid gap-4">
            {accounts.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-zinc-200 rounded-[24px] text-center bg-zinc-50/30">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100 shadow-sm text-zinc-300">
                  <Plus className="w-8 h-8" />
                </div>
                <p className="font-unageo text-sm text-zinc-500 max-w-[200px] mx-auto">No payout accounts found. Add one to start withdrawing.</p>
              </div>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-5 rounded-[24px] border border-zinc-200 bg-white transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-[16px] flex items-center justify-center shrink-0 ${
                      account.type === "bank" ? "bg-blue-50 text-blue-500" : "bg-green-50 text-green-500"
                    }`}>
                      {account.type === "bank" ? <CreditCard className="w-7 h-7" /> : <Smartphone className="w-7 h-7" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-0.5 w-full">
                        <p className="font-unageo text-[17px] font-bold text-secondary-000">
                          {account.name}
                        </p>
                        {account.isDefault && (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary-100 text-white text-[11px] font-bold shrink-0">
                            <Check className="w-3 h-3" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="font-unageo text-sm text-zinc-400 mb-0.5">
                        {account.type === "bank" ? "Bank Account" : "Mobile Money"}
                      </p>
                      <p className="font-unageo text-sm text-zinc-500">
                        {account.details}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-secondary-800 border-t border-secondary-600 px-8 py-6 mt-auto">
          <button
            onClick={onClose}
            className="w-full py-4 px-6 bg-white border border-accent-20 text-secondary-000 font-unageo text-[15px] font-bold rounded-xl transition-all duration-200 hover:bg-secondary-700 hover:border-accent-40 cursor-pointer text-center shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
