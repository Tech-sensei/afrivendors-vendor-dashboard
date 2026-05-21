import React from "react";

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm"
        >
          <div className="w-14 h-14 bg-zinc-200 rounded-xl mb-6" />
          <div className="h-4 bg-zinc-100 rounded w-28 mb-3" />
          <div className="h-10 bg-zinc-200 rounded w-24" />
        </div>
      ))}
    </div>
  );
}

export function WalletCardSkeleton() {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-zinc-200 rounded w-36 mb-2" />
      <div className="h-4 bg-zinc-100 rounded w-28 mb-6" />
      <div className="h-36 bg-zinc-200 rounded-xl mb-6" />
      <div className="h-12 bg-zinc-100 rounded-xl mb-3" />
      <div className="h-12 bg-zinc-100 rounded-xl" />
    </div>
  );
}

export function AppointmentsListSkeleton() {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-zinc-200 rounded w-48 mb-8" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-zinc-50 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function EarningsChartSkeleton() {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="mb-10">
        <div className="h-6 bg-zinc-200 rounded w-40 mb-2"></div>
        <div className="h-4 bg-zinc-100 rounded w-32"></div>
      </div>
      <div className="w-full h-[320px] bg-zinc-50 rounded-lg"></div>
    </div>
  );
}

export function MessagesSkeleton() {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="mb-6">
        <div className="h-6 bg-zinc-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-zinc-100 rounded w-40"></div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 p-4 bg-zinc-50 rounded-xl">
            <div className="w-12 h-12 bg-zinc-200 rounded-full shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-zinc-200 rounded w-24"></div>
              <div className="h-3 bg-zinc-100 rounded w-full"></div>
              <div className="h-3 bg-zinc-100 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RatingCardSkeleton() {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="mb-6">
        <div className="h-6 bg-zinc-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-zinc-100 rounded w-40"></div>
      </div>
      <div className="flex items-center justify-center py-8">
        <div className="w-32 h-32 bg-zinc-200 rounded-full"></div>
      </div>
      <div className="space-y-3 mt-6">
        <div className="h-4 bg-zinc-100 rounded w-full"></div>
        <div className="h-4 bg-zinc-100 rounded w-3/4"></div>
      </div>
    </div>
  );
}
