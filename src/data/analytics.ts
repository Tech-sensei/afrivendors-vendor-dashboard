import { TrendingUp, Calendar, Eye, DollarSign } from 'lucide-react';
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
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
}

export const earningsData: EarningsDataPoint[] = [
  { date: 'Nov 20', earnings: 1200, appointments: 8 },
  { date: 'Nov 21', earnings: 1500, appointments: 10 },
  { date: 'Nov 22', earnings: 1800, appointments: 12 },
  { date: 'Nov 23', earnings: 1400, appointments: 9 },
  { date: 'Nov 24', earnings: 2000, appointments: 14 },
  { date: 'Nov 25', earnings: 1700, appointments: 11 },
  { date: 'Nov 26', earnings: 2200, appointments: 15 },
  { date: 'Nov 27', earnings: 1900, appointments: 13 },
];

export const profileViewsData: ProfileViewsDataPoint[] = [
  { date: 'Nov 20', views: 145, clicks: 89 },
  { date: 'Nov 21', views: 178, clicks: 112 },
  { date: 'Nov 22', views: 203, clicks: 134 },
  { date: 'Nov 23', views: 167, clicks: 98 },
  { date: 'Nov 24', views: 234, clicks: 156 },
  { date: 'Nov 25', views: 198, clicks: 121 },
  { date: 'Nov 26', views: 267, clicks: 178 },
  { date: 'Nov 27', views: 245, clicks: 167 },
];

export const topServicesData: TopService[] = [
  { service: 'Natural Hair Care', bookings: 45, revenue: 6750 },
  { service: 'Massage Therapy', bookings: 38, revenue: 5700 },
  { service: 'Facial Treatment', bookings: 32, revenue: 4800 },
  { service: 'Manicure & Pedicure', bookings: 28, revenue: 2800 },
  { service: 'Hair Braiding', bookings: 24, revenue: 3600 },
];

export const conversionData: ConversionStep[] = [
  { name: 'Profile Views', value: 1537, color: '#c56c31' },
  { name: 'Service Clicks', value: 1055, color: '#E8956F' },
  { name: 'Bookings', value: 167, color: '#231305' },
];

export const analyticsStats: AnalyticsStat[] = [
  {
    label: 'Total Earnings',
    value: '$12,700',
    change: '+15.3%',
    trend: 'up',
    icon: DollarSign,
    color: '#10B981',
  },
  {
    label: 'Total Appointments',
    value: '92',
    change: '+8.2%',
    trend: 'up',
    icon: Calendar,
    color: '#3B82F6',
  },
  {
    label: 'Profile Views',
    value: '1,537',
    change: '+12.5%',
    trend: 'up',
    icon: Eye,
    color: '#F59E0B',
  },
  {
    label: 'Conversion Rate',
    value: '10.9%',
    change: '+2.1%',
    trend: 'up',
    icon: TrendingUp,
    color: '#c56c31',
  },
];

export const analyticsCategories = [
  'All Categories',
  'Beauty & Wellness',
  'Hair Styling',
  'Massage & Spa',
  'Nails & Manicure',
];
