import type { LucideIcon } from 'lucide-react';

export type TimeFilter = '7days' | '30days' | 'custom';
export type ExportFormat = 'csv' | 'pdf' | 'jpg';

export interface EarningsDataPoint {
  date: string;
  earnings: number;
  appointments: number;
}

export interface ProfileViewsDataPoint {
  date: string;
  views: number;
  clicks: number;
}

export interface TopService {
  service: string;
  bookings: number;
  revenue: number;
}

export interface ConversionStep {
  name: string;
  value: number;
  color: string;
}

export interface AnalyticsStat {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
  icon: LucideIcon;
  color: string;
}
