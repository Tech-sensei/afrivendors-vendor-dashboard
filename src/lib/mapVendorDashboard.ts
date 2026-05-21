import type {
  VendorDashboardApiResponse,
  VendorDashboardView,
} from "@/types/vendor-dashboard";

const CURRENCY = "GBP";

function unwrapDashboardPayload(body: unknown): VendorDashboardApiResponse {
  if (body && typeof body === "object" && "data" in (body as object)) {
    const inner = (body as { data: unknown }).data;
    if (inner && typeof inner === "object" && !Array.isArray(inner)) {
      return inner as VendorDashboardApiResponse;
    }
  }
  return body as VendorDashboardApiResponse;
}

function formatTime12h(time: string): string {
  const part = time.trim().slice(0, 5);
  const [hStr, mStr] = part.split(":");
  let h = Number(hStr);
  const m = mStr ?? "00";
  if (!Number.isFinite(h)) return time;
  const period = h >= 12 ? "PM" : "AM";
  if (h === 0) h = 12;
  else if (h > 12) h -= 12;
  return `${h}:${m} ${period}`;
}

function formatAppointmentDateLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";

  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

function formatChartDayLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { weekday: "short" });
}

export function mapVendorDashboardApi(
  body: unknown
): VendorDashboardView {
  const raw = unwrapDashboardPayload(body);

  const chartData = (raw.last7DaysPerformance ?? []).map((row) => ({
    date: row.date,
    day: formatChartDayLabel(row.date),
    earnings: Number(row.amount) || 0,
  }));

  const totalReviews = Number(raw.ratings?.totalReviews ?? 0);
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const key = String(stars) as keyof typeof raw.ratings.breakdown;
    const count = Number(raw.ratings?.breakdown?.[key] ?? 0);
    const percentage =
      totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { stars, count, percentage };
  });

  const latestAppointments = (raw.latestAppointments ?? []).map((apt) => {
    const primaryService =
      apt.services?.[0]?.serviceName ??
      (apt.services?.length
        ? `${apt.services.length} services`
        : "Service");
    return {
      id: apt.id,
      customerName: apt.customerName,
      service: primaryService,
      time: formatTime12h(apt.time),
      date: formatAppointmentDateLabel(apt.date),
      price: Number(apt.totalAmount) || 0,
      status: apt.status,
    };
  });

  return {
    stats: {
      appointments: Number(raw.totalAppointments) || 0,
      revenue: Number(raw.totalRevenueYear) || 0,
      revenueYear: Number(raw.revenueYear) || new Date().getFullYear(),
      pending: Number(raw.pendingRequests) || 0,
      completed: Number(raw.completedServices) || 0,
    },
    chartData,
    wallet: {
      balance:
        raw.wallet?.balance != null ? Number(raw.wallet.balance) : null,
      implemented: Boolean(raw.wallet?.implemented),
    },
    ratings: {
      averageRating: Number(raw.ratings?.averageRating) || 0,
      totalReviews,
      breakdown,
    },
    latestAppointments,
  };
}

export { CURRENCY as VENDOR_DASHBOARD_CURRENCY };
