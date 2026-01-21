"use client";

import React from "react";
import { 
  X, 
  Building2, 
  Smartphone, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft 
} from "lucide-react";
import { PayoutAccount } from "@/data/wallet";

interface PayoutAccountDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  account: PayoutAccount | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

export function PayoutAccountDetailsDrawer({
  isOpen,
  onClose,
  account,
  onEdit,
  onDelete,
  onSetDefault,
}: PayoutAccountDetailsDrawerProps) {
  if (!account) return null;

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
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-secondary-000" />
            </button>
            <div>
              <h2 className="font-unbounded text-xl font-bold text-secondary-000 mb-0.5">
                Account Details
              </h2>
              <p className="font-unageo text-[13px] text-accent-80">
                View and manage payout method
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(account.id)}
              className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all cursor-pointer"
              title="Edit Account"
            >
              <Edit2 className="w-5 h-5 text-secondary-000" />
            </button>
            <button
              onClick={() => onDelete(account.id)}
              className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
              title="Delete Account"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-7 custom-scrollbar pt-4">
          {/* Main Info Card */}
          <div className="p-8 rounded-[32px] bg-secondary-700 border border-secondary-600 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              {account.type === "bank" ? (
                <Building2 className="w-32 h-32 text-secondary-000" />
              ) : (
                <Smartphone className="w-32 h-32 text-secondary-000" />
              )}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  account.type === "bank" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {account.type === "bank" ? <Building2 className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-unageo text-xs font-bold text-accent-80 uppercase tracking-widest">
                    {account.type === "bank" ? "Bank Account" : "Mobile Money"}
                  </p>
                  <h3 className="font-unbounded text-xl font-bold text-secondary-000">
                    {account.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="font-unageo text-xs font-bold text-accent-80 uppercase tracking-widest mb-1">
                    Details
                  </p>
                  <p className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight">
                    {account.details}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1.5 rounded-full font-unageo text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    account.isDefault ? "bg-primary-100 text-white" : "bg-zinc-200 text-zinc-500"
                  }`}>
                    {account.isDefault && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {account.isDefault ? "Primary Account" : "Secondary Account"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!account.isDefault && (
            <button
              onClick={() => onSetDefault(account.id)}
              className="w-full p-6 rounded-2xl border border-dashed border-secondary-600 bg-white hover:bg-secondary-700 transition-all cursor-pointer group flex items-center justify-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-secondary-700 flex items-center justify-center group-hover:bg-primary-100 group-hover:text-white transition-all">
                <CheckCircle2 className="w-5 h-5 text-accent-80 group-hover:text-white" />
              </div>
              <span className="font-unageo text-[15px] font-bold text-secondary-000">Set as Primary Account</span>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-secondary-600 px-8 py-6 mt-auto">
          <button
            onClick={onClose}
            className="w-full py-4 px-6 border border-secondary-600 text-secondary-000 font-unageo text-[15px] font-bold rounded-xl transition-all duration-200 hover:bg-secondary-700 hover:border-secondary-100 cursor-pointer text-center"
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}
