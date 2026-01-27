"use client";

import React, { useState, Suspense, lazy } from 'react';
import { 
  statsBreakdown, 
  earningsData, 
  upcomingAppointments, 
  recentMessages,
  StatsBreakdown
} from '@/data/dashboard';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { DashboardWalletCard } from '@/components/dashboard/DashboardWalletCard';
import { 
  EarningsChartSkeleton, 
  MessagesSkeleton, 
  RatingCardSkeleton 
} from '@/components/dashboard/SkeletonLoaders';

// Lazy load heavy components
const EarningsChart = lazy(() => import('@/components/dashboard/EarningsChart').then(mod => ({ default: mod.EarningsChart })));
const RecentMessages = lazy(() => import('@/components/dashboard/RecentMessages').then(mod => ({ default: mod.RecentMessages })));
const BusinessRatingCard = lazy(() => import('@/components/dashboard/BusinessRatingCard').then(mod => ({ default: mod.BusinessRatingCard })));

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<keyof StatsBreakdown>('weekly');

  return (
      <div className="max-w-360 mx-auto">
        {/* Header Area with Filter */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
          <div>
            <h1 className="font-unbounded text-3xl md:text-3xl font-bold text-secondary-000 tracking-tight mb-2">
             Welcome back, Zuri!
            </h1>
            <p className="font-unageo text-zinc-500 text-base md:text-lg">
              Here&apos;s a quick snapshot of your business performance today.
            </p>
          </div>

          {/* Time Filter Controls */}
          <div className="flex bg-white p-1 rounded-xl border border-zinc-200/60 shadow-sm w-full md:w-auto">
            {(['daily', 'weekly', 'monthly'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`flex-1 md:flex-none px-6 md:px-8 py-2.5 rounded-lg font-unageo text-sm font-bold capitalize transition-all duration-300 ${
                  timeFilter === filter 
                    ? "bg-[#140C06] text-white shadow-lg shadow-zinc-200/50" 
                    : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <DashboardStats stats={statsBreakdown[timeFilter]} />

        {/* Wallet Card - Shows right after stats on mobile */}
        <div className="lg:hidden mb-8">
          <DashboardWalletCard />
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Large Content Column (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <Suspense fallback={<EarningsChartSkeleton />}>
              <EarningsChart data={earningsData} />
            </Suspense>
            <UpcomingAppointments appointments={upcomingAppointments} />
          </div>

          {/* Actionable Sidebar (1/3) */}
          <div className="flex flex-col gap-8">
            {/* Wallet Card - Shows in sidebar on desktop */}
            <div className="hidden lg:block">
              <DashboardWalletCard />
            </div>
            <Suspense fallback={<RatingCardSkeleton />}>
              <BusinessRatingCard />
            </Suspense>
            <Suspense fallback={<MessagesSkeleton />}>
              <RecentMessages messages={recentMessages} />
            </Suspense>
          </div>
        </div>
      </div>
  
  );
}