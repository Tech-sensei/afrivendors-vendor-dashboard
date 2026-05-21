"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatMoney } from "@/lib/currency";
import { VENDOR_DASHBOARD_CURRENCY } from "@/lib/mapVendorDashboard";
import type { VendorDashboardView } from "@/types/vendor-dashboard";

interface DashboardWalletCardProps {
  wallet: VendorDashboardView["wallet"];
}

export const DashboardWalletCard = React.memo(function DashboardWalletCard({
  wallet,
}: DashboardWalletCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const isAvailable = wallet.implemented && wallet.balance != null;
  const balanceLabel = isAvailable
    ? formatMoney(wallet.balance!, VENDOR_DASHBOARD_CURRENCY)
    : "—";

  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight mb-1">
            Wallet Balance
          </h2>
          <p className="font-unageo text-accent-60 text-sm font-medium">
            {isAvailable ? "Available funds" : "Wallet coming soon"}
          </p>
        </div>
        {isAvailable && (
          <button
            type="button"
            onClick={() => setShowBalance(!showBalance)}
            className="w-10 h-10 bg-accent-10/50 hover:bg-accent-10 rounded-xl flex items-center justify-center text-accent-80 transition-all cursor-pointer"
            aria-label={showBalance ? "Hide balance" : "Show balance"}
          >
            {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>

      <div className="bg-[#BC6D39] rounded-xl p-8 mb-6 shadow-xl shadow-[#BC6D39]/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl transition-all duration-700" />
        <div className="relative z-10">
          <p className="font-unageo text-sm font-bold text-white/80 mb-2">
            Total Balance
          </p>
          <h2 className="font-unbounded text-4xl font-black text-white tracking-tighter">
            {isAvailable && showBalance ? balanceLabel : isAvailable ? "****" : "—"}
          </h2>
          {!isAvailable && (
            <p className="font-unageo text-xs text-white/70 mt-3 max-w-[240px]">
              Wallet payouts are not enabled for your account yet. Check back
              later or visit Settings.
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          disabled={!isAvailable}
          className="w-full py-4 bg-[#140C06] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed text-white font-unbounded text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          onClick={() => {
            if (isAvailable) window.location.href = "/wallet";
          }}
        >
          Withdraw Funds
        </button>
        <button
          type="button"
          className="w-full py-4 bg-white border border-accent-20 hover:bg-accent-10 text-secondary-000 font-unbounded text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 cursor-pointer"
          onClick={() => {
            window.location.href = isAvailable ? "/wallet" : "/settings";
          }}
        >
          {isAvailable ? "View Transactions" : "Account Settings"}
        </button>
      </div>
    </div>
  );
});
