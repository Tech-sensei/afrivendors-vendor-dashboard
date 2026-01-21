"use client";

import React from "react";
import { X, Building2, Smartphone, Plus, ChevronRight } from "lucide-react";
import { PayoutAccount } from "@/data/wallet";

interface PayoutAccountsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: PayoutAccount[];
  onViewAccount: (id: string) => void;
  onAddAccount: () => void;
}

export function PayoutAccountsDrawer({
  isOpen,
  onClose,
  accounts,
  onViewAccount,
  onAddAccount,
}: PayoutAccountsDrawerProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:h-[92vh] max-sm:rounded-t-[32px] sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
              Payout Accounts
            </h2>
            <p className="font-unageo text-[15px] text-accent-80">
              Manage where you receive your earnings
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-secondary-000" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-7 custom-scrollbar">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-unageo text-sm font-bold text-zinc-400 uppercase tracking-widest">
              Your Accounts
            </h4>
            <button
              onClick={onAddAccount}
              className="flex items-center gap-1.5 text-xs font-bold text-primary-100 hover:text-primary-100/80 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New
            </button>
          </div>

          <div className="grid gap-4">
            {accounts.length === 0 ? (
              <div className="p-12 border-2 border-dashed border-zinc-200 rounded-3xl text-center bg-zinc-50/30">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100 shadow-sm">
                  <Plus className="w-8 h-8 text-zinc-300" />
                </div>
                <p className="font-unageo text-sm text-zinc-500 max-w-[200px] mx-auto">No payout accounts found. Add one to start withdrawing.</p>
              </div>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  onClick={() => onViewAccount(account.id)}
                  className="flex items-center justify-between p-5 rounded-2xl border border-secondary-600 bg-white hover:border-secondary-100 transition-all cursor-pointer group hover:shadow-md hover:shadow-zinc-100/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      account.type === "bank" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {account.type === "bank" ? <Building2 className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-unageo text-sm font-bold text-secondary-000 group-hover:text-primary-100 transition-colors">
                          {account.name}
                        </p>
                        {account.isDefault && (
                          <span className="px-2 py-0.5 rounded-full bg-primary-100/10 text-primary-100 text-[10px] font-bold uppercase tracking-wider">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="font-unageo text-xs text-zinc-400 italic mt-0.5">
                        {account.details}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-primary-100 group-hover:translate-x-1 transition-all" />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-secondary-600 px-8 py-6 mt-auto">
          <button
            onClick={onClose}
            className="w-full py-4 px-6 border border-secondary-600 text-secondary-000 font-unageo text-[15px] font-bold rounded-xl transition-all duration-200 hover:bg-secondary-700 hover:border-secondary-100 cursor-pointer text-center"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
