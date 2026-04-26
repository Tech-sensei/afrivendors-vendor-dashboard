"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import type { TopService } from '@/data/analytics';

interface TopServicesChartProps {
  data: TopService[];
}

export function TopServicesChart({ data }: TopServicesChartProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="font-unageo text-lg font-semibold text-secondary-000 mb-1">
          Top Booked Services
        </h3>
        <p className="font-unageo text-sm text-accent-60">
          Most popular services by bookings
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            type="number"
            tick={{ fill: '#a59e9b', fontSize: 12 }}
            stroke="#E5E7EB"
          />
          <YAxis
            type="category"
            dataKey="service"
            tick={{ fill: '#a59e9b', fontSize: 11 }}
            stroke="#E5E7EB"
            width={120}
          />
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="bookings"
            fill="#c56c31"
            radius={[0, 8, 8, 0]}
            animationDuration={1000}
            name="Bookings"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
