"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, Smartphone, Save, Globe, CheckCircle2 } from "lucide-react";
import { PayoutAccount } from "@/data/wallet";

interface AddEditPayoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PayoutAccount>) => void;
}

export function AddEditPayoutDrawer({
  isOpen,
  onClose,
  onSave,
}: AddEditPayoutDrawerProps) {
  const [formData, setFormData] = useState<Partial<PayoutAccount>>({
    type: "bank",
    name: "",
    details: "",
    isDefault: false,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        type: "bank",
        name: "",
        details: "",
        isDefault: false,
      });
    }
  }, [isOpen]);

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
        className={`absolute inset-0 bg-[#231305]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:h-[92vh] max-sm:rounded-t-[32px] sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] overflow-hidden ${
          isOpen 
            ? "max-sm:translate-y-0 sm:translate-x-0" 
            : "max-sm:translate-y-full sm:translate-x-full"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-8 flex items-start justify-between flex-shrink-0 border-b border-zinc-100 mb-2">
            <div>
              <h2 className="font-unbounded text-3xl font-extrabold text-secondary-000">
                Add Account
              </h2>
              <p className="font-unageo text-base text-zinc-500">
                Add a new way to receive your earnings
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-all duration-200 cursor-pointer"
            >
              <X className="w-6 h-6 text-zinc-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-7 custom-scrollbar pt-6">
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
                      : "border-zinc-200 bg-white hover:border-primary-100/20"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    formData.type === "bank" ? "bg-primary-100 text-white" : "bg-zinc-50 text-zinc-400"
                  }`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className={`font-unageo text-sm font-bold ${
                    formData.type === "bank" ? "text-primary-100" : "text-zinc-500"
                  }`}>Bank Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "mobile_money" })}
                  className={`flex flex-col items-center gap-3 p-5 rounded-[24px] border-2 transition-all active:scale-95 cursor-pointer ${
                    formData.type === "mobile_money"
                      ? "border-primary-100 bg-primary-100/5 ring-4 ring-primary-100/5"
                      : "border-zinc-200 bg-white hover:border-primary-100/20"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    formData.type === "mobile_money" ? "bg-primary-100 text-white" : "bg-zinc-50 text-zinc-400"
                  }`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className={`font-unageo text-sm font-bold ${
                    formData.type === "mobile_money" ? "text-primary-100" : "text-zinc-500"
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
                  className="w-full pl-13 pr-5 py-4 bg-white border border-zinc-200 rounded-2xl font-unageo text-[16px] text-secondary-000 placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5 group shadow-sm"
                />
              </div>
              <p className="font-unageo text-[11px] text-zinc-400 italic">
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
                  className="w-full pl-13 pr-5 py-4 bg-white border border-zinc-200 rounded-2xl font-unageo text-[16px] text-secondary-000 placeholder:text-zinc-400 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5 group shadow-sm"
                />
              </div>
            </div>

            {/* Default Option */}
            <label className="flex items-center justify-between p-6 rounded-[24px] border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-primary-100/20 transition-all cursor-pointer group shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:text-primary-100 group-hover:border-primary-100/20 transition-all">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-unageo font-bold text-secondary-000">Set as Default</p>
                  <p className="font-unageo text-[11px] text-zinc-500">Automatically select for future withdrawals</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-6 h-6 rounded-lg border-2 border-zinc-200 text-primary-100 focus:ring-primary-100/20 cursor-pointer transition-all"
              />
            </label>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-zinc-100 px-8 py-6 flex gap-4 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-zinc-200 text-secondary-000 font-unageo text-[16px] font-bold rounded-2xl transition-all duration-200 hover:bg-zinc-50 cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-[1.5] py-4 px-6 font-unageo text-[16px] font-bold rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 bg-primary-100 text-white hover:brightness-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-100/20 cursor-pointer group active:translate-y-0 active:scale-95"
            >
              <Save className="w-5 h-5" />
              Save Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
