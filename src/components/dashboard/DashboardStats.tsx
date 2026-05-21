"use client";

import React from "react";
import { Calendar, DollarSign, Clock, CheckCircle2 } from "lucide-react";
import { formatMoney } from "@/lib/currency";
import { VENDOR_DASHBOARD_CURRENCY } from "@/lib/mapVendorDashboard";
import type { VendorDashboardView } from "@/types/vendor-dashboard";

interface DashboardStatsProps {
  stats: VendorDashboardView["stats"];
}

export const DashboardStats = React.memo(function DashboardStats({
  stats,
}: DashboardStatsProps) {
  const statCards = [
    {
      label: "Total Appointments",
      value: stats.appointments.toLocaleString(),
      icon: Calendar,
      color: "var(--primary)",
      bg: "rgba(188, 109, 57, 0.1)",
    },
    {
      label: `Revenue (${stats.revenueYear})`,
      value: formatMoney(stats.revenue, VENDOR_DASHBOARD_CURRENCY),
      icon: DollarSign,
      color: "#22C55E",
      bg: "rgba(34, 197, 94, 0.1)",
    },
    {
      label: "Pending Requests",
      value: stats.pending.toLocaleString(),
      icon: Clock,
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
    },
    {
      label: "Completed Services",
      value: stats.completed.toLocaleString(),
      icon: CheckCircle2,
      color: "#6366F1",
      bg: "rgba(99, 102, 241, 0.1)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="mb-6">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon size={26} style={{ color: stat.color }} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-unageo text-sm font-medium text-accent-60">
              {stat.label}
            </h3>
            <p className="font-unbounded text-3xl md:text-4xl font-black text-secondary-000">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
});
