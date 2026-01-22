"use client";

import React, { useState } from "react";
import { Wallet, Eye, EyeOff, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export function DashboardWalletCard() {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 3847.50;

  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight mb-1">
            Wallet Balance
          </h2>
          <p className="font-unageo text-accent-60 text-sm font-medium">
            Available funds
          </p>
        </div>
        <button 
          onClick={() => setShowBalance(!showBalance)}
          className="w-10 h-10 bg-accent-10/50 hover:bg-accent-10 rounded-xl flex items-center justify-center text-accent-80 transition-all cursor-pointer"
        >
          {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>

      <div className="bg-[#BC6D39] rounded-xl p-8 mb-6 shadow-xl shadow-[#BC6D39]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl transition-all duration-700" />
        <div className="relative z-10">
          <p className="font-unageo text-sm font-bold text-white/80 mb-2">
            Total Balance
          </p>
          <div className="flex items-center justify-between">
            <h2 className="font-unbounded text-4xl font-black text-white tracking-tighter">
              {showBalance ? `$${balance.toLocaleString()}` : "****"}
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          className="w-full py-4 bg-[#140C06] hover:bg-black text-white font-unbounded text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          onClick={() => window.location.href = '/wallet'}
        >
          Withdraw Funds
        </button>
        <button 
          className="w-full py-4 bg-white border border-accent-20 hover:bg-accent-10 text-secondary-000 font-unbounded text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer"
          onClick={() => window.location.href = '/wallet'}
        >
          View Transactions
        </button>
      </div>
    </div>
  );
}
