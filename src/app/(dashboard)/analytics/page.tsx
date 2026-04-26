"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader';
import { AnalyticsFilters } from '@/components/analytics/AnalyticsFilters';
import { AnalyticsStats } from '@/components/analytics/AnalyticsStats';
import { EarningsChart } from '@/components/analytics/EarningsChart';
import { AppointmentTrendsChart } from '@/components/analytics/AppointmentTrendsChart';
import { TrafficEngagementChart } from '@/components/analytics/TrafficEngagementChart';
import { TopServicesChart } from '@/components/analytics/TopServicesChart';
import { ConversionFunnel } from '@/components/analytics/ConversionFunnel';
import { ExportModal } from '@/components/analytics/ExportModal';
import {
  analyticsStats,
  analyticsCategories,
  earningsData,
  profileViewsData,
  topServicesData,
  conversionData,
  type TimeFilter,
  type ExportFormat,
} from '@/data/analytics';

export default function AnalyticsPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('7days');
  const [selectedCategory, setSelectedCategory] = useState('all-categories');
  const [showExportModal, setShowExportModal] = useState(false);
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });

  const handleExport = (format: ExportFormat) => {
    setShowExportModal(false);
    const labels: Record<ExportFormat, string> = {
      csv: 'CSV',
      pdf: 'PDF',
      jpg: 'JPG',
    };
    toast.success(`Analytics exported as ${labels[format]}!`);
  };

  return (
    <>
      <div className="max-w-[1400px] mx-auto">
        <AnalyticsHeader onExport={() => setShowExportModal(true)} />

        <AnalyticsFilters
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          customDateRange={customDateRange}
          setCustomDateRange={setCustomDateRange}
          categories={analyticsCategories}
        />

        <AnalyticsStats stats={analyticsStats} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
          <EarningsChart data={earningsData} />
          <AppointmentTrendsChart data={earningsData} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
          <TrafficEngagementChart data={profileViewsData} />
          <TopServicesChart data={topServicesData} />
        </div>

        <ConversionFunnel data={conversionData} />
      </div>

      {showExportModal && (
        <ExportModal onExport={handleExport} onClose={() => setShowExportModal(false)} />
      )}
    </>
  );
}
