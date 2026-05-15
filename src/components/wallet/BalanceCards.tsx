"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wallet, ArrowUpRight, CreditCard, TrendingUp, Eye, EyeOff } from "lucide-react";
import { formatMoney } from "@/lib/currency";

interface BalanceCardsProps {
  availableBalance: number;
  lifetimeEarnings: number;
  currencyCode?: string;
  isLoading?: boolean;
  onWithdraw: () => void;
}

export function BalanceCards({
  availableBalance,
  lifetimeEarnings,
  currencyCode = "GBP",
  isLoading = false,
  onWithdraw,
}: BalanceCardsProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatBalance = (amount: number) => {
    if (!showBalance) return "***";
    return formatMoney(amount, currencyCode);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
      {/* Available Balance */}
      <div className="p-7 bg-primary-100 rounded-2xl shadow-lg shadow-primary-100/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:bg-white/15" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2.5 opacity-90">
            <Wallet className="w-5.5 h-5.5 text-white" />
            <span className="font-unageo text-sm font-medium text-white">
              Available Balance
            </span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            title={showBalance ? "Hide Balance" : "Show Balance"}
          >
            {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {isLoading ? (
          <div className="h-10 w-36 bg-white/20 rounded-xl animate-pulse mb-5" />
        ) : (
          <h2 className="font-unbounded text-4xl font-bold text-white mb-5 relative z-10">
            {formatBalance(availableBalance)}
          </h2>
        )}
        <div className="flex gap-3 relative z-10">
          <button
            onClick={onWithdraw}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-primary-100 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw
          </button>
          <Link
            href="/payouts"
            className="flex items-center gap-2 py-3 px-4 rounded-xl bg-white/20 border border-white/30 text-white text-sm font-semibold transition-all hover:bg-white/25 active:scale-95 cursor-pointer shrink-0"
          >
            <CreditCard className="w-4 h-4" />
            Payouts
          </Link>
        </div>
      </div>

      {/* Lifetime Earnings (escrowBalance) */}
      <div className="p-7 bg-white border border-zinc-200 rounded-2xl group transition-all hover:border-primary-100/30">
        <div className="flex items-center gap-2.5 mb-3">
          <TrendingUp className="w-5.5 h-5.5 text-zinc-400 group-hover:text-primary-100 transition-colors" />
          <span className="font-unageo text-sm font-medium text-zinc-500">
            Incoming Earnings
          </span>
        </div>
        {isLoading ? (
          <div className="h-10 w-36 bg-zinc-100 rounded-xl animate-pulse mb-3" />
        ) : (
          <h2 className="font-unbounded text-4xl font-bold text-secondary-000 mb-3">
            {formatBalance(lifetimeEarnings)}
          </h2>
        )}
        <p className="font-unageo text-sm text-zinc-500 leading-relaxed">
          Held until the client releases it, then it becomes available to withdraw.
        </p>
      </div>
    </div>
  );
}