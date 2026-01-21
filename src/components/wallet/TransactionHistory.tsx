"use client";

import React from "react";
import { SlidersHorizontal, Calendar, X } from "lucide-react";
import { Transaction } from "@/data/wallet";
import { TransactionCard } from "./TransactionCard";

interface TransactionHistoryProps {
  transactions: Transaction[];
  dateFilter: string;
  onDateFilterChange: (filter: any) => void;
  showCustomDateInputs: boolean;
  onCustomDateClick: () => void;
  customDateFrom: string;
  setCustomDateFrom: (val: string) => void;
  customDateTo: string;
  setCustomDateTo: (val: string) => void;
  onApplyCustomRange: () => void;
  onClearFilters: () => void;
  onViewTransaction: (id: string) => void;
}

export function TransactionHistory({
  transactions,
  dateFilter,
  onDateFilterChange,
  showCustomDateInputs,
  onCustomDateClick,
  customDateFrom,
  setCustomDateFrom,
  customDateTo,
  setCustomDateTo,
  onApplyCustomRange,
  onClearFilters,
  onViewTransaction,
}: TransactionHistoryProps) {
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const filterOptions = [
    { label: "All Time", value: "all" },
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "This Week", value: "week" },
    { label: "This Month", value: "month" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-unageo text-xl font-semibold text-secondary-000">
          Transaction History
        </h3>
      </div>

      {/* Date Filter */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4.5 h-4.5 text-zinc-400" />
            <span className="font-unageo text-sm font-medium text-zinc-600">
              Filter by Date:
            </span>
          </div>

          <div className="flex gap-2 p-1 bg-zinc-50 rounded-xl border border-zinc-100 flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onDateFilterChange(opt.value)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                  dateFilter === opt.value
                    ? "bg-primary-100 text-white shadow-sm"
                    : "text-zinc-500 hover:text-secondary-000"
                }`}
              >
                {opt.label}
              </button>
            ))}
            <button
              onClick={onCustomDateClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all active:scale-95 cursor-pointer ${
                dateFilter === "custom"
                  ? "bg-primary-100 text-white shadow-sm"
                  : "text-zinc-500 hover:text-secondary-000"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              Custom Range
            </button>
          </div>

          {dateFilter !== "all" && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-primary-100 hover:bg-primary-100/5 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filter
            </button>
          )}
        </div>

        {/* Custom Range Inputs */}
        {showCustomDateInputs && (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-4 p-5 bg-zinc-50/50 border border-zinc-100 rounded-2xl animate-in fade-in slide-in-from-top-2">
            <div className="space-y-1.5">
              <label className="block font-unageo text-[12px] font-semibold text-secondary-000">
                From Date
              </label>
              <input
                type="date"
                value={customDateFrom}
                onChange={(e) => setCustomDateFrom(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5 transition-all cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block font-unageo text-[12px] font-semibold text-secondary-000">
                To Date
              </label>
              <input
                type="date"
                value={customDateTo}
                onChange={(e) => setCustomDateTo(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5 transition-all cursor-pointer"
              />
            </div>
            <button
              onClick={onApplyCustomRange}
              disabled={!customDateFrom || !customDateTo}
              className={`self-end px-6 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                customDateFrom && customDateTo
                  ? "bg-primary-100 text-white shadow-sm hover:opacity-90 cursor-pointer"
                  : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
              }`}
            >
              Apply
            </button>
          </div>
        )}

        {/* Active Filter Info */}
        {dateFilter !== "all" && (
          <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
            <p className="font-unageo text-xs text-blue-700">
              Showing <strong>{transactions.length}</strong> transactions for{" "}
              <strong>
                {dateFilter === "today" ? "Today" : 
                 dateFilter === "yesterday" ? "Yesterday" :
                 dateFilter === "week" ? "This Week" :
                 dateFilter === "month" ? "This Month" :
                 `Custom range: ${customDateFrom} to ${customDateTo}`}
              </strong>
            </p>
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-8">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-5 bg-white border border-dashed border-zinc-200 rounded-3xl">
            <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-zinc-300" />
            </div>
            <h4 className="font-unageo text-base font-semibold text-secondary-000 mb-1.5">
              No transactions found
            </h4>
            <p className="font-unageo text-sm text-zinc-500 text-center max-w-[280px]">
              We couldn't find any transactions for the selected date range.
            </p>
          </div>
        ) : (
          Object.entries(groupedTransactions).map(([date, dateTransactions]) => (
            <div key={date}>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-unageo text-xs font-bold text-secondary-000 uppercase tracking-widest whitespace-nowrap">
                  {date}
                </span>
                <div className="h-[1px] w-full bg-secondary-600" />
              </div>
              <div className="grid gap-3">
                {dateTransactions.map((tx) => (
                  <TransactionCard
                    key={tx.id}
                    transaction={tx}
                    onClick={onViewTransaction}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
