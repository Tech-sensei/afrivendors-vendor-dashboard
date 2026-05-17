"use client";

import { useEffect, useState } from 'react';
import type { TimeFilter } from '@/data/analytics';
import { customDateRangeSchema } from '@/lib/validations/analyticsSchemas';
import { zodFieldErrors } from '@/lib/validations/zodHelpers';

interface AnalyticsFiltersProps {
  timeFilter: TimeFilter;
  setTimeFilter: (filter: TimeFilter) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  customDateRange: { start: string; end: string };
  setCustomDateRange: (range: { start: string; end: string }) => void;
  categories: string[];
}

export function AnalyticsFilters({
  timeFilter,
  setTimeFilter,
  selectedCategory,
  setSelectedCategory,
  customDateRange,
  setCustomDateRange,
  categories,
}: AnalyticsFiltersProps) {
  const [dateErrors, setDateErrors] = useState<{ start?: string; end?: string }>({});

  useEffect(() => {
    if (timeFilter !== 'custom') {
      setDateErrors({});
      return;
    }
    const result = customDateRangeSchema.safeParse(customDateRange);
    if (!result.success) {
      setDateErrors(zodFieldErrors(result.error));
    } else {
      setDateErrors({});
    }
  }, [timeFilter, customDateRange]);

  const timePeriods: { id: TimeFilter; label: string }[] = [
    { id: '7days', label: '7 Days' },
    { id: '30days', label: '30 Days' },
    { id: 'custom', label: 'Custom' },
  ];

  return (
    <div className="flex gap-4 mb-6 flex-wrap p-5 bg-white border border-accent-20 rounded-xl">
      {/* Time Period */}
      <div className="flex-1 min-w-[200px]">
        <label className="block font-unageo text-xs font-medium text-accent-60 mb-2">
          Time Period
        </label>
        <div className="flex gap-2">
          {timePeriods.map((period) => (
            <button
              key={period.id}
              onClick={() => setTimeFilter(period.id)}
              className={`flex-1 py-2 px-3 rounded-lg font-unageo text-[13px] font-medium border transition-all duration-150 cursor-pointer ${
                timeFilter === period.id
                  ? 'bg-primary-100 border-primary-100 text-white'
                  : 'bg-transparent border-accent-20 text-secondary-300 hover:border-primary-100 hover:text-primary-100'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range */}
      {timeFilter === 'custom' && (
        <div className="flex-1 min-w-[200px]">
          <label className="block font-unageo text-xs font-medium text-accent-60 mb-2">
            Date Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) =>
                setCustomDateRange({ ...customDateRange, start: e.target.value })
              }
              className={`flex-1 py-2 px-3 rounded-lg border font-unageo text-[13px] text-secondary-000 bg-white outline-none focus:border-primary-100 transition-colors ${
                dateErrors.start ? 'border-red-500' : 'border-accent-20'
              }`}
            />
            <span className="font-unageo text-sm text-accent-60">to</span>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) =>
                setCustomDateRange({ ...customDateRange, end: e.target.value })
              }
              className={`flex-1 py-2 px-3 rounded-lg border font-unageo text-[13px] text-secondary-000 bg-white outline-none focus:border-primary-100 transition-colors ${
                dateErrors.end ? 'border-red-500' : 'border-accent-20'
              }`}
            />
              </div>
          {(dateErrors.start || dateErrors.end) && (
            <p className="mt-1 text-xs text-red-600">
              {dateErrors.start ?? dateErrors.end}
            </p>
          )}
              </div>
      )}

      {/* Category */}
      <div className="flex-1 min-w-[200px]">
        <label className="block font-unageo text-xs font-medium text-accent-60 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full py-2 px-3 rounded-lg border border-accent-20 font-unageo text-[13px] font-medium text-secondary-000 bg-white outline-none cursor-pointer focus:border-primary-100 transition-colors"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat.toLowerCase().replace(/\s+/g, '-')}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
