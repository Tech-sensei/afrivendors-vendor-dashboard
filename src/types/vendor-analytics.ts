export type VendorAnalyticsDailyAmount = {
  date: string;
  amount: number;
};

export type VendorAnalyticsDailyCount = {
  date: string;
  count: number;
};

export type VendorAnalyticsLast7Days = {
  earnings: VendorAnalyticsDailyAmount[];
  appointments: VendorAnalyticsDailyCount[];
  profileViews: VendorAnalyticsDailyCount[];
};

export type VendorAnalyticsServiceBooking = {
  serviceId: number;
  serviceName: string;
  bookingCount: number;
};

export type VendorAnalyticsApiResponse = {
  totalRevenue: number;
  totalAppointments: number;
  profileViews: number;
  conversionRatePercent: number;
  last7Days: VendorAnalyticsLast7Days;
  serviceBookings: VendorAnalyticsServiceBooking[];
};
