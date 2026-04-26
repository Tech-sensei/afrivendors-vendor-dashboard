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
import type { EarningsDataPoint } from '@/data/analytics';

interface EarningsChartProps {
  data: EarningsDataPoint[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="font-unageo text-lg font-semibold text-secondary-000 mb-1">
          Earnings Over Time
        </h3>
        <p className="font-unageo text-sm text-accent-60">
          Daily revenue breakdown for the last 7 days
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c56c31" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#c56c31" stopOpacity={0} />
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
            dataKey="earnings"
            stroke="#c56c31"
            strokeWidth={3}
            fill="url(#colorEarnings)"
            animationDuration={1000}
            name="Earnings"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
