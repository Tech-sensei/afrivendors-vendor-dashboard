/** GET /vendor/dashboard response (shape may be wrapped in `data`). */

export interface VendorDashboardPerformanceDay {
  date: string;
  amount: number;
}

export interface VendorDashboardWallet {
  balance: number | null;
  implemented: boolean;
}

export interface VendorDashboardRatingsBreakdown {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

export interface VendorDashboardRatings {
  averageRating: number;
  totalReviews: number;
  breakdown: VendorDashboardRatingsBreakdown;
}

export interface VendorDashboardAppointmentService {
  id: number;
  serviceName: string;
  price: number;
}

export interface VendorDashboardLatestAppointment {
  id: number;
  date: string;
  time: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  specificRequest: string;
  rescheduleDate: string | null;
  rescheduleTime: string | null;
  createdAt: string;
  services: VendorDashboardAppointmentService[];
  totalAmount: number;
}

export interface VendorDashboardApiResponse {
  totalAppointments: number;
  totalRevenueYear: number;
  revenueYear: number;
  pendingRequests: number;
  completedServices: number;
  last7DaysPerformance: VendorDashboardPerformanceDay[];
  wallet: VendorDashboardWallet;
  ratings: VendorDashboardRatings;
  latestAppointments: VendorDashboardLatestAppointment[];
}

/** Normalized view model for dashboard UI. */
export interface VendorDashboardView {
  stats: {
    appointments: number;
    revenue: number;
    revenueYear: number;
    pending: number;
    completed: number;
  };
  chartData: { day: string; earnings: number; date: string }[];
  wallet: {
    balance: number | null;
    implemented: boolean;
  };
  ratings: {
    averageRating: number;
    totalReviews: number;
    breakdown: { stars: number; count: number; percentage: number }[];
  };
  latestAppointments: {
    id: number;
    customerName: string;
    service: string;
    time: string;
    date: string;
    price: number;
    status: string;
  }[];
}
