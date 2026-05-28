import { format, parseISO } from "date-fns";
import { Calendar, DollarSign, Eye, TrendingUp } from "lucide-react";
import type {
  AnalyticsStat,
  ConversionStep,
  EarningsDataPoint,
  ProfileViewsDataPoint,
  TopService,
} from "@/data/analytics";
import type { VendorAnalyticsApiResponse } from "@/types/vendor-analytics";

export type VendorAnalyticsView = {
  stats: AnalyticsStat[];
  earningsSeries: EarningsDataPoint[];
  profileViewsSeries: ProfileViewsDataPoint[];
  topServices: TopService[];
  conversionFunnel: ConversionStep[];
};

function unwrapAnalyticsPayload(body: unknown): VendorAnalyticsApiResponse {
  if (body && typeof body === "object" && "data" in (body as object)) {
    const inner = (body as { data: unknown }).data;
    if (inner && typeof inner === "object" && !Array.isArray(inner)) {
      return inner as VendorAnalyticsApiResponse;
    }
  }
  return body as VendorAnalyticsApiResponse;
}

function formatChartDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), "MMM d");
  } catch {
    return isoDate;
  }
}

function buildEarningsSeries(api: VendorAnalyticsApiResponse): EarningsDataPoint[] {
  const { earnings, appointments } = api.last7Days;
  const apptByDate = new Map(appointments.map((a) => [a.date, a.count]));

  return earnings.map((row) => ({
    date: formatChartDate(row.date),
    earnings: row.amount,
    appointments: apptByDate.get(row.date) ?? 0,
  }));
}

function buildProfileViewsSeries(
  api: VendorAnalyticsApiResponse
): ProfileViewsDataPoint[] {
  return api.last7Days.profileViews.map((row) => ({
    date: formatChartDate(row.date),
    views: row.count,
    clicks: 0,
  }));
}

function buildTopServices(api: VendorAnalyticsApiResponse): TopService[] {
  return [...api.serviceBookings]
    .sort((a, b) => b.bookingCount - a.bookingCount)
    .slice(0, 8)
    .map((s) => ({
      service: s.serviceName,
      bookings: s.bookingCount,
      revenue: 0,
    }));
}

function buildConversionFunnel(api: VendorAnalyticsApiResponse): ConversionStep[] {
  return [
    { name: "Profile views", value: api.profileViews, color: "#c56c31" },
    { name: "Bookings", value: api.totalAppointments, color: "#231305" },
  ];
}

function buildStats(api: VendorAnalyticsApiResponse): AnalyticsStat[] {
  return [
    {
      label: "Total revenue",
      value: `£${api.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "#10B981",
    },
    {
      label: "Total appointments",
      value: String(api.totalAppointments),
      icon: Calendar,
      color: "#3B82F6",
    },
    {
      label: "Profile views",
      value: api.profileViews.toLocaleString(),
      icon: Eye,
      color: "#F59E0B",
    },
    {
      label: "Conversion rate",
      value: `${api.conversionRatePercent.toFixed(1)}%`,
      icon: TrendingUp,
      color: "#c56c31",
    },
  ];
}

export function mapVendorAnalyticsApi(body: unknown): VendorAnalyticsView {
  const api = unwrapAnalyticsPayload(body);

  return {
    stats: buildStats(api),
    earningsSeries: buildEarningsSeries(api),
    profileViewsSeries: buildProfileViewsSeries(api),
    topServices: buildTopServices(api),
    conversionFunnel: buildConversionFunnel(api),
  };
}
