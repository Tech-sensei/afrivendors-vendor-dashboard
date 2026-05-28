"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import type { ProfileViewsDataPoint } from '@/data/analytics';

interface TrafficEngagementChartProps {
  data: ProfileViewsDataPoint[];
}

export function TrafficEngagementChart({ data }: TrafficEngagementChartProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="font-unageo text-lg font-semibold text-secondary-000 mb-1">
          Traffic & Engagement
        </h3>
        <p className="font-unageo text-sm text-accent-60">
          Profile views per day
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#a59e9b', fontSize: 12 }}
            stroke="#E5E7EB"
          />
          <YAxis tick={{ fill: '#a59e9b', fontSize: 12 }} stroke="#E5E7EB" />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="views"
            stroke="#F59E0B"
            strokeWidth={2}
            fill="url(#colorViews)"
            animationDuration={1000}
            name="Profile views"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
