"use client";

import React, { useState } from "react";
import { X, ArrowRight, Building2, Smartphone, Plus, AlertCircle } from "lucide-react";
import { PayoutAccount } from "@/data/wallet";
import { getCurrencySymbol } from "@/lib/currency";

interface WithdrawFundsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: string;
  /** ISO 4217 for input prefix and labels */
  currencyCode?: string;
  payoutAccounts: PayoutAccount[];
  onConfirm: (amount: string, accountId: string) => void;
  onAddPayoutAccount: () => void;
}

export function WithdrawFundsDrawer({
  isOpen,
  onClose,
  availableBalance,
  currencyCode = "GBP",
  payoutAccounts,
  onConfirm,
  onAddPayoutAccount,
}: WithdrawFundsDrawerProps) {
  const currencySymbol = getCurrencySymbol(currencyCode);
  const [amount, setAmount] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState(
    payoutAccounts.find((a) => a.isDefault)?.id || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && selectedAccountId) {
      onConfirm(amount, selectedAccountId);
      setAmount("");
    }
  };

  const handleMaxClick = () => {
    setAmount(availableBalance);
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-6 flex items-start justify-between flex-shrink-0 border-b border-zinc-200 mb-3">
            <div>
              <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
                Withdraw Funds
              </h2>
              <p className="font-unageo text-[15px] text-accent-80">
                Transfer your earnings to your bank or mobile money
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200 cursor-pointer"
            >
              <X className="w-5 h-5 text-secondary-000" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-7 custom-scrollbar">
            {/* Amount Section */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000 font-bold uppercase tracking-widest text-zinc-400">
                Amount to Withdraw
              </label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-unageo text-2xl font-bold text-zinc-400">
                  $
                </span>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || parseFloat(val) >= 0) {
                      setAmount(val);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") e.preventDefault();
                  }}
                  placeholder="0.00"
                  max={availableBalance}
                  className="w-full pl-10 pr-24 py-5 bg-zinc-50 border-2 border-zinc-100 rounded-2xl font-unbounded text-2xl font-bold text-secondary-000 outline-none focus:border-primary-100 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className="absolute right-5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-primary-100/10 text-primary-100 text-[10px] font-bold uppercase tracking-wider hover:bg-primary-100/20 transition-all cursor-pointer"
                >
                  Max Amnt
                </button>
              </div>
              <p className="text-right font-unageo text-xs text-zinc-500">
                Available:{" "}
                <span className="font-bold text-secondary-000">
                  {currencySymbol}
                  {availableBalance}
                </span>
              </p>
            </div>

            {/* Payout Account Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block font-unageo text-sm font-bold text-secondary-000 uppercase tracking-widest">
                Payout Account
                </label>
                <button
                  type="button"
                  onClick={onAddPayoutAccount}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary-100 hover:text-primary-100/80 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New
                </button>
              </div>

              <div className="grid gap-3">
                {payoutAccounts.length === 0 ? (
                  <div className="p-10 border-2 border-dashed border-zinc-200 rounded-2xl text-center">
                    <p className="font-unageo text-sm text-zinc-500">No payout accounts found.</p>
                  </div>
                ) : (
                  payoutAccounts.map((account) => (
                    <label
                      key={account.id}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer active:scale-[0.98] ${
                        selectedAccountId === account.id
                          ? "border-primary-100 bg-primary-100/5 shadow-sm"
                          : "border-zinc-100 bg-white hover:border-zinc-200"
                      }`}
                    >
                      <input
                        type="radio"
                        className="hidden"
                        name="payoutAccount"
                        value={account.id}
                        checked={selectedAccountId === account.id}
                        onChange={() => setSelectedAccountId(account.id)}
                      />
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          account.type === "bank" ? "bg-emerald-50" : "bg-amber-50"
                        }`}>
                          {account.type === "bank" ? (
                            <Building2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <Smartphone className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-unageo text-sm font-semibold text-secondary-000 line-clamp-1">
                            {account.name}
                          </p>
                          <p className="font-unageo text-xs text-zinc-400 italic">
                            {account.details}
                          </p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedAccountId === account.id
                          ? "border-primary-100"
                          : "border-zinc-200"
                      }`}>
                        {selectedAccountId === account.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-100" />
                        )}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Processing Time Hint Box */}
            <div className="p-6 bg-[#E8F1FF] rounded-[24px] border border-[#B8D4FF] flex gap-5 items-start">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-[#B8D4FF] shadow-sm">
                <AlertCircle className="w-6 h-6 text-[#2B6CB0]" />
              </div>
              <div className="space-y-1">
                <p className="font-unageo text-[16px] font-bold text-[#2B6CB0]">Processing Time</p>
                <p className="font-unageo text-[14px] text-[#4A5568] leading-relaxed">
                  Withdrawals typically process within 2-5 business days. You&apos;ll receive a confirmation email once the transfer is complete.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-secondary-800 border-t border-secondary-600 px-8 py-6 flex gap-4 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 bg-white border border-accent-20 text-secondary-000 font-unageo text-[15px] font-bold rounded-xl transition-all duration-200 hover:bg-secondary-700 hover:border-accent-40 cursor-pointer text-center shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!amount || !selectedAccountId || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(availableBalance)}
              className={`flex-[1.5] py-4 px-6 font-unageo text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${(!amount || !selectedAccountId || parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(availableBalance)) ? 'bg-accent-20 text-accent-60 border border-accent-20 cursor-not-allowed' : 'bg-primary-100 text-white hover:bg-primary-100/90 hover:shadow-lg hover:shadow-primary-100/20 cursor-pointer'} active:scale-95`}
            >
              Confirm Withdrawal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
