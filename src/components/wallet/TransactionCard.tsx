"use client";

import React from "react";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Percent, 
  AlertCircle,
  ChevronRight 
} from "lucide-react";
import { Transaction } from "@/data/wallet";
import { formatMoney } from "@/lib/currency";

interface TransactionCardProps {
  transaction: Transaction;
  onClick: (id: string) => void;
}

export function TransactionCard({ transaction, onClick }: TransactionCardProps) {
  const displayAmount =
    transaction.amountDisplay ??
    formatMoney(parseFloat(transaction.amount) || 0, transaction.currency ?? "GBP");

  const getIcon = () => {
    switch (transaction.type) {
      case "payment":
        return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />;
      case "withdrawal":
        return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
      case "commission":
        return <Percent className="w-5 h-5 text-red-600" />;
      case "reversal":
        return <AlertCircle className="w-5 h-5 text-amber-600" />;
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

  const getAmountColor = () => {
    if (transaction.type === "payment" && transaction.status === "success") {
      return "text-emerald-600";
    }
    if (transaction.type === "commission" || transaction.type === "reversal") {
      return "text-red-600";
    }
    return "text-secondary-000";
  };

  const getAmountPrefix = () => {
    if (transaction.type === "payment") return "+";
    if (transaction.type === "commission" || transaction.type === "withdrawal" || transaction.type === "reversal") return "-";
    return "";
  };

  const getStatusBadge = () => {
    const baseClasses = "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider";
    switch (transaction.status) {
      case "success":
        return <div className={`${baseClasses} bg-emerald-100 text-emerald-700`}>Completed</div>;
      case "pending":
        return <div className={`${baseClasses} bg-blue-100 text-blue-700`}>Pending</div>;
      case "warning":
        return <div className={`${baseClasses} bg-amber-100 text-amber-700`}>Review</div>;
      case "error":
        return <div className={`${baseClasses} bg-red-100 text-red-700`}>Failed</div>;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={() => onClick(transaction.id)}
      className="flex items-start justify-between p-5 bg-white border border-zinc-100 rounded-2xl hover:border-primary-100/30 hover:shadow-sm transition-all cursor-pointer group active:scale-[0.99]"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getIconBg()}`}>
          {getIcon()}
        </div>
        <div className="space-y-1">
          <h4 className="font-unageo text-base font-bold text-secondary-000 group-hover:text-primary-100 transition-colors">
            {transaction.title}
          </h4>
          <p className="font-unageo text-sm text-zinc-500 line-clamp-1">
            {transaction.description}
          </p>
          <div className="flex items-center gap-2">
            <p className="font-unageo text-xs text-zinc-400">
              {transaction.time}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between self-stretch min-h-[48px]">
        <p className={`font-unbounded text-base font-bold ${getAmountColor()}`}>
          {getAmountPrefix()}
          {displayAmount}
        </p>
        <div className="mt-2">
          {getStatusBadge()}
        </div>
      </div>
    </div>
  );
}
