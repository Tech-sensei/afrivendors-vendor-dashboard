"use client";

import { Download } from 'lucide-react';

interface AnalyticsHeaderProps {
  onExport: () => void;
}

export function AnalyticsHeader({ onExport }: AnalyticsHeaderProps) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
      <div>
        <h1 className="font-unbounded text-3xl font-semibold text-secondary-000 mb-2">
          Analytics
        </h1>
        <p className="font-unageo text-base text-accent-60">
          Track your business performance and insights
        </p>
        <p className="font-unageo text-sm text-accent-60 mt-1">
          Showing last 7 days
        </p>
      </div>

      <button
        onClick={onExport}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-100 text-white font-unageo text-sm font-semibold hover:brightness-105 hover:-translate-y-px transition-all duration-150 shadow-md shadow-primary-100/20 cursor-pointer"
      >
        <Download className="w-[18px] h-[18px]" />
        Export Report
      </button>
    </div>
  );
}
