"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartTooltip } from './ChartTooltip';
import type { EarningsDataPoint } from '@/data/analytics';

interface AppointmentTrendsChartProps {
  data: EarningsDataPoint[];
}

export function AppointmentTrendsChart({ data }: AppointmentTrendsChartProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl p-6">
      <div className="mb-5">
        <h3 className="font-unageo text-lg font-semibold text-secondary-000 mb-1">
          Appointment Trends
        </h3>
        <p className="font-unageo text-sm text-accent-60">
          Number of bookings per day
        </p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#a59e9b', fontSize: 12 }}
            stroke="#E5E7EB"
          />
          <YAxis tick={{ fill: '#a59e9b', fontSize: 12 }} stroke="#E5E7EB" />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="appointments"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ fill: '#3B82F6', r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={1000}
            name="Appointments"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
