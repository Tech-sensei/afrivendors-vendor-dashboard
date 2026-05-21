"use client";

import React, { Suspense, lazy } from "react";
import { useAppSelector } from "@/store/hooks";
import { useVendorDashboard } from "@/services/useVendorDashboard";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { UpcomingAppointments } from "@/components/dashboard/UpcomingAppointments";
import { DashboardWalletCard } from "@/components/dashboard/DashboardWalletCard";
import { MessagesQuickLink } from "@/components/dashboard/MessagesQuickLink";
import {
  EarningsChartSkeleton,
  RatingCardSkeleton,
  DashboardStatsSkeleton,
  WalletCardSkeleton,
  AppointmentsListSkeleton,
} from "@/components/dashboard/SkeletonLoaders";

const EarningsChart = lazy(() =>
  import("@/components/dashboard/EarningsChart").then((mod) => ({
    default: mod.EarningsChart,
  }))
);
const BusinessRatingCard = lazy(() =>
  import("@/components/dashboard/BusinessRatingCard").then((mod) => ({
    default: mod.BusinessRatingCard,
  }))
);

export default function DashboardPage() {
  const { profile } = useAppSelector((state) => state.auth);
  const { data, isLoading, isError, refetch, isFetching } = useVendorDashboard();

  const displayName =
    profile?.kyc?.businessName ||
    `${profile?.vendor?.firstName ?? ""} ${profile?.vendor?.lastName ?? ""}`.trim() ||
    "Vendor";

  if (isError) {
    return (
      <div className="max-w-360 mx-auto py-16 text-center">
        <p className="font-unageo text-accent-60 mb-6">
          We couldn&apos;t load your dashboard. Please try again.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="px-8 py-3 bg-[#140C06] text-white font-unbounded text-xs font-bold uppercase tracking-widest rounded-xl cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-360 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
        <div>
          <h1 className="font-unbounded text-3xl md:text-3xl font-bold text-secondary-000 tracking-tight mb-2">
            Welcome back, {displayName}!
          </h1>
          <p className="font-unageo text-zinc-500 text-base md:text-lg">
            Here&apos;s a quick snapshot of your business performance today.
          </p>
        </div>
        {isFetching && !isLoading && data && (
          <span className="font-unageo text-xs font-bold text-accent-60 uppercase tracking-widest">
            Updating…
          </span>
        )}
      </div>

      {isLoading || !data ? (
        <>
          <DashboardStatsSkeleton />
          <div className="lg:hidden mb-8">
            <WalletCardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <EarningsChartSkeleton />
              <AppointmentsListSkeleton />
            </div>
            <div className="flex flex-col gap-8">
              <div className="hidden lg:block">
                <WalletCardSkeleton />
              </div>
              <RatingCardSkeleton />
              <div className="h-40 bg-white border border-accent-20/60 rounded-xl animate-pulse" />
            </div>
          </div>
        </>
      ) : (
        <>
          <DashboardStats stats={data.stats} />

          <div className="lg:hidden mb-8">
            <DashboardWalletCard wallet={data.wallet} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <Suspense fallback={<EarningsChartSkeleton />}>
                <EarningsChart data={data.chartData} />
              </Suspense>
              <UpcomingAppointments appointments={data.latestAppointments} />
            </div>

            <div className="flex flex-col gap-8">
              <div className="hidden lg:block">
                <DashboardWalletCard wallet={data.wallet} />
              </div>
              <Suspense fallback={<RatingCardSkeleton />}>
                <BusinessRatingCard ratings={data.ratings} />
              </Suspense>
              <MessagesQuickLink />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
