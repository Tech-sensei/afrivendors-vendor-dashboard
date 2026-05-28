"use client";

import { ArrowUp, ArrowDown } from 'lucide-react';
import type { AnalyticsStat } from '@/data/analytics';

interface AnalyticsStatsProps {
  stats: AnalyticsStat[];
}

export function AnalyticsStats({ stats }: AnalyticsStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const hasChange = stat.change != null && stat.trend != null;
        const isUp = stat.trend === 'up';

        return (
          <div
            key={index}
            className="bg-white border border-accent-20 rounded-2xl p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}18` }}
              >
                <Icon className="w-[22px] h-[22px]" style={{ color: stat.color }} />
              </div>

              {hasChange && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md ${
                    isUp ? 'bg-emerald-50' : 'bg-red-50'
                  }`}
                >
                  {isUp ? (
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span
                    className={`font-unageo text-xs font-semibold ${
                      isUp ? 'text-emerald-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              )}
            </div>

            <h3 className="font-unbounded text-[28px] font-bold text-secondary-000 mb-1">
              {stat.value}
            </h3>
            <p className="font-unageo text-sm text-accent-60">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}
