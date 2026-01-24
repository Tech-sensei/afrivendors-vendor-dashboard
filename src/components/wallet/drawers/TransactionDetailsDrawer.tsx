"use client";

import React from "react";
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Percent, 
  AlertCircle,
  Copy,
  Receipt,
  User,
  Calendar,
  Clock,
  ShieldCheck
} from "lucide-react";
import { Transaction } from "@/data/wallet";
import { toast } from "sonner";

interface TransactionDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export function TransactionDetailsDrawer({
  isOpen,
  onClose,
  transaction,
}: TransactionDetailsDrawerProps) {
  if (!transaction) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getIcon = () => {
    switch (transaction.type) {
      case "payment":
        return <ArrowDownLeft className="w-8 h-8 text-emerald-600" />;
      case "withdrawal":
        return <ArrowUpRight className="w-8 h-8 text-blue-600" />;
      case "commission":
        return <Percent className="w-8 h-8 text-red-600" />;
      case "reversal":
        return <AlertCircle className="w-8 h-8 text-amber-600" />;
      default:
        return null;
    }
  };

  const getIconBg = () => {
    switch (transaction.type) {
      case "payment":
        return "bg-emerald-50";
      case "withdrawal":
        return "bg-blue-50";
      case "commission":
        return "bg-red-50";
      case "reversal":
        return "bg-amber-50";
      default:
        return "bg-zinc-50";
    }
  };

  const getStatusStyle = () => {
    switch (transaction.status) {
      case "success":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "warning":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "error":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-100";
    }
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
        className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-4 max-sm:right-4 max-sm:h-[92vh] max-sm:rounded-t-[32px] sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] overflow-hidden ${
          isOpen 
            ? "max-sm:translate-y-0 sm:translate-x-0" 
            : "max-sm:translate-y-full sm:translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-start justify-between flex-shrink-0 border-b border-zinc-200 mb-3">
          <div>
            <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
              Transaction Details
            </h2>
            <p className="font-unageo text-[15px] text-accent-80">
              Complete overview of this transaction
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-secondary-000" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-7 custom-scrollbar pt-4">
          {/* Top Summary Card */}
          <div className="p-8 rounded-[32px] bg-secondary-700 border border-secondary-600 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              {getIcon()}
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-4 ${getIconBg()}`}>
                {getIcon()}
              </div>
              <div className="space-y-2">
                <h3 className="font-unbounded text-3xl font-bold text-secondary-000 tracking-tight">
                  {transaction.type === "payment" ? "+" : "-"} ${transaction.amount}
                </h3>
                <div className={`inline-flex px-4 py-1.5 rounded-full border-[1.5px] text-[11px] font-bold uppercase tracking-widest ${getStatusStyle()}`}>
                  {transaction.status}
                </div>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid gap-8">
            <div className="space-y-4">
              <h4 className="font-unageo text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
                Basic Information
              </h4>
              <div className="bg-white border border-secondary-600 rounded-2xl overflow-hidden">
                <div className="p-5 flex justify-between items-center text-sm border-b border-secondary-600">
                  <div className="flex items-center gap-3 text-accent-80">
                    <Receipt className="w-4 h-4 text-primary-100" />
                    Transaction ID
                  </div>
                  <button 
                    onClick={() => copyToClipboard(transaction.id)}
                    className="flex items-center gap-2 font-bold text-secondary-000 hover:text-primary-100 transition-colors cursor-pointer"
                  >
                    <span className="font-mono">{transaction.id}</span>
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-5 flex justify-between items-center text-sm border-b border-secondary-600">
                  <div className="flex items-center gap-3 text-accent-80">
                    <Calendar className="w-4 h-4 text-primary-100" />
                    Date
                  </div>
                  <span className="font-bold text-secondary-000">{transaction.date}</span>
                </div>
                <div className="p-5 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3 text-accent-80">
                    <Clock className="w-4 h-4 text-primary-100" />
                    Time
                  </div>
                  <span className="font-bold text-secondary-000">{transaction.time}</span>
                </div>
              </div>
            </div>

            {transaction.type === "payment" && (
              <div className="space-y-4">
                <h4 className="font-unageo text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
                  Payment Details
                </h4>
                <div className="bg-white border border-secondary-600 rounded-2xl overflow-hidden">
                  <div className="p-5 flex justify-between items-center text-sm border-b border-secondary-600">
                    <div className="flex items-center gap-3 text-accent-80">
                      <User className="w-4 h-4 text-primary-100" />
                      Customer
                    </div>
                    <span className="font-bold text-secondary-000">{transaction.customerName}</span>
                  </div>
                  <div className="p-5 flex justify-between items-center text-sm border-b border-secondary-600">
                    <div className="flex items-center gap-3 text-accent-80">
                      <ShieldCheck className="w-4 h-4 text-primary-100" />
                      Service
                    </div>
                    <span className="font-bold text-secondary-000">{transaction.serviceName}</span>
                  </div>
                  {transaction.receiptId && (
                    <div className="p-5 flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3 text-accent-80">
                        <Receipt className="w-4 h-4 text-primary-100" />
                        Receipt No.
                      </div>
                      <span className="font-bold text-secondary-000">{transaction.receiptId}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {transaction.type === "commission" && transaction.commissionRate && (
              <div className="space-y-4">
                <h4 className="font-unageo text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
                  Commission Details
                </h4>
                <div className="bg-white border border-secondary-600 rounded-2xl overflow-hidden">
                  <div className="p-5 flex justify-between items-center text-sm">
                    <div className="text-accent-80">Platform Rate</div>
                    <span className="font-bold text-secondary-000">{transaction.commissionRate}</span>
                  </div>
                </div>
              </div>
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
