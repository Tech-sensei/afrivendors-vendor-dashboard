"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { AnalyticsStats } from "@/components/analytics/AnalyticsStats";
import { EarningsChart } from "@/components/analytics/EarningsChart";
import { AppointmentTrendsChart } from "@/components/analytics/AppointmentTrendsChart";
import { TrafficEngagementChart } from "@/components/analytics/TrafficEngagementChart";
import { TopServicesChart } from "@/components/analytics/TopServicesChart";
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";
import { ExportModal } from "@/components/analytics/ExportModal";
import type { ExportFormat } from "@/data/analytics";
import { useVendorAnalytics } from "@/services/useVendorAnalytics";

export default function AnalyticsPage() {
  const [showExportModal, setShowExportModal] = useState(false);
  const { data, isLoading, isError, refetch, isFetching } = useVendorAnalytics();

  const handleExport = (format: ExportFormat) => {
    setShowExportModal(false);
    const labels: Record<ExportFormat, string> = {
      csv: "CSV",
      pdf: "PDF",
      jpg: "JPG",
    };
    toast.success(`Analytics exported as ${labels[format]}!`);
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto">
        <AnalyticsHeader onExport={() => setShowExportModal(true)} />

        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary-100" />
          </div>
        ) : isError || !data ? (
          <div className="rounded-2xl border border-dashed border-accent-20 bg-white p-12 text-center">
            <p className="font-unageo text-sm text-accent-60">
              Could not load analytics. Please try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 font-unageo text-sm font-semibold text-primary-100 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {isFetching && (
              <p className="font-unageo text-xs text-accent-60 mb-4">Refreshing…</p>
            )}

            <AnalyticsStats stats={data.stats} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
              <EarningsChart data={data.earningsSeries} />
              <AppointmentTrendsChart data={data.earningsSeries} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
              <TrafficEngagementChart data={data.profileViewsSeries} />
              <TopServicesChart data={data.topServices} />
            </div>

            <ConversionFunnel data={data.conversionFunnel} />
          </>
        )}
      </div>

      {showExportModal && (
        <ExportModal onExport={handleExport} onClose={() => setShowExportModal(false)} />
      )}
    </>
  );
}
