"use client";

import React, { useState } from "react";
import { Wallet, ArrowUpRight, CreditCard, Calendar, Eye, EyeOff } from "lucide-react";

interface BalanceCardsProps {
  availableBalance: number;
  lifetimeEarnings: number;
  totalCommissions: number;
  totalWithdrawals: number;
  onWithdraw: () => void;
  onViewPayouts: () => void;
}

export function BalanceCards({
  availableBalance,
  lifetimeEarnings,
  totalCommissions,
  totalWithdrawals,
  onWithdraw,
  onViewPayouts,
}: BalanceCardsProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatBalance = (amount: number) => {
    if (!showBalance) return "***";
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
      {/* Available Balance */}
      <div className="p-7 bg-primary-100 rounded-2xl shadow-lg shadow-primary-100/20 relative overflow-hidden group">
        {/* Glow effect */}
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
        <h2 className="font-unbounded text-4xl font-bold text-white mb-5 relative z-10">
          {formatBalance(availableBalance)}
        </h2>
        <div className="flex gap-3 relative z-10">
          <button
            onClick={onWithdraw}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-primary-100 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            Withdraw
          </button>
          <button
            onClick={onViewPayouts}
            className="flex items-center gap-2 py-3 px-4 rounded-xl bg-white/20 border border-white/30 text-white text-sm font-semibold transition-all hover:bg-white/25 active:scale-95 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            Payouts
          </button>
        </div>
      </div>

      {/* Lifetime Earnings */}
      <div className="p-7 bg-white border border-zinc-200 rounded-2xl group transition-all hover:border-primary-100/30">
        <div className="flex items-center gap-2.5 mb-3">
          <Calendar className="w-5.5 h-5.5 text-zinc-400 group-hover:text-primary-100 transition-colors" />
          <span className="font-unageo text-sm font-medium text-zinc-500">
            Lifetime Earnings
          </span>
        </div>
        <h2 className="font-unbounded text-4xl font-bold text-secondary-000 mb-5">
          {formatBalance(lifetimeEarnings)}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="font-unageo text-[12px] text-zinc-500">
              Total Commissions
            </p>
            <p className="font-unageo text-base font-semibold text-red-500">
              {showBalance ? `-$${totalCommissions.toFixed(2)}` : "***"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-unageo text-[12px] text-zinc-500">
              Withdrawn
            </p>
            <p className="font-unageo text-base font-semibold text-blue-500">
              {showBalance ? `$${totalWithdrawals.toFixed(2)}` : "***"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
