"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, Smartphone, Save, Globe } from "lucide-react";
import { PayoutAccount } from "@/data/wallet";

interface AddEditPayoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  account: PayoutAccount | null;
  onSave: (data: Partial<PayoutAccount>) => void;
}

export function AddEditPayoutDrawer({
  isOpen,
  onClose,
  account,
  onSave,
}: AddEditPayoutDrawerProps) {
  const [formData, setFormData] = useState<Partial<PayoutAccount>>({
    type: "bank",
    name: "",
    details: "",
    isDefault: false,
  });

  useEffect(() => {
    if (account) {
      setFormData(account);
    } else {
      setFormData({
        type: "bank",
        name: "",
        details: "",
        isDefault: false,
      });
    }
  }, [account, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-6 flex items-start justify-between flex-shrink-0">
            <div>
              <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
                {account ? "Edit Account" : "Add Payout Account"}
              </h2>
              <p className="font-unageo text-[15px] text-accent-80">
                {account ? "Update your account information" : "Add a new way to receive your earnings"}
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
            {/* Account Type Toggle */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "bank" })}
                  className={`flex flex-col items-center gap-3 p-5 rounded-[24px] border-2 transition-all active:scale-95 cursor-pointer ${
                    formData.type === "bank"
                      ? "border-primary-100 bg-primary-100/5 ring-4 ring-primary-100/5"
                      : "border-secondary-600 bg-white hover:border-secondary-100"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    formData.type === "bank" ? "bg-primary-100 text-white" : "bg-secondary-700 text-accent-80"
                  }`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className={`font-unageo text-sm font-bold ${
                    formData.type === "bank" ? "text-primary-100" : "text-accent-80"
                  }`}>Bank Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "mobile_money" })}
                  className={`flex flex-col items-center gap-3 p-5 rounded-[24px] border-2 transition-all active:scale-95 cursor-pointer ${
                    formData.type === "mobile_money"
                      ? "border-primary-100 bg-primary-100/5 ring-4 ring-primary-100/5"
                      : "border-secondary-600 bg-white hover:border-secondary-100"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    formData.type === "mobile_money" ? "bg-primary-100 text-white" : "bg-secondary-700 text-accent-80"
                  }`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className={`font-unageo text-sm font-bold ${
                    formData.type === "mobile_money" ? "text-primary-100" : "text-accent-80"
                  }`}>Mobile Money</span>
                </button>
              </div>
            </div>

            {/* Account Name */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                Account Label
              </label>
              <div className="relative">
                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. My Primary Bank"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-13 pr-5 py-3.5 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5 group"
                />
              </div>
              <p className="font-unageo text-[11px] text-zinc-500 italic">
                Give this account a nickname to help you identify it later.
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                {formData.type === "bank" ? "Bank Details" : "Mobile Number"}
              </label>
              <div className="relative">
                {formData.type === "bank" ? (
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                ) : (
                  <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                )}
                <input
                  type="text"
                  required
                  placeholder={formData.type === "bank" ? "Account Number - Bank Name" : "+254 7XX XXX XXX"}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full pl-13 pr-5 py-3.5 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5 group"
                />
              </div>
            </div>

            {/* Default Option */}
            <label className="flex items-center gap-3 p-5 rounded-2xl border border-secondary-600 bg-secondary-700/30 hover:bg-secondary-700 transition-colors cursor-pointer group">
              <div className="relative flex items-center h-6">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 rounded border-2 border-secondary-600 text-primary-100 focus:ring-primary-100/20 cursor-pointer"
                />
              </div>
              <div className="text-sm">
                <p className="font-unageo font-bold text-secondary-000 group-hover:text-primary-100 transition-colors">Set as Default Account</p>
                <p className="font-unageo text-[11px] text-accent-80">Automatically select this account for future withdrawals.</p>
              </div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-secondary-600 px-8 py-6 flex gap-4 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-secondary-600 text-secondary-000 font-unageo text-[15px] font-bold rounded-xl transition-all duration-200 hover:bg-secondary-700 hover:border-secondary-100 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.5] py-4 px-6 font-unageo text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 bg-primary-100 text-white hover:brightness-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-100/20 cursor-pointer group active:translate-y-0 active:scale-95"
            >
              <Save className="w-5 h-5" />
              {account ? "Update Account" : "Save Payout Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
