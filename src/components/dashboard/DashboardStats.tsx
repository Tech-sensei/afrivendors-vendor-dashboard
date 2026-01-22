"use client";

import React from "react";
import { 
  Calendar, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight 
} from "lucide-react";
import { DashboardStat } from "@/data/dashboard";

interface DashboardStatsProps {
  stats: DashboardStat;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      label: "Total Appointments",
      value: stats.appointments,
      icon: Calendar,
      trend: "12%",
      color: "var(--primary)",
      bg: "rgba(188, 109, 57, 0.1)",
      trendBg: "rgba(34, 197, 94, 0.1)",
      trendColor: "#22C55E"
    },
    {
      label: "Revenue Earned",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      trend: "18%",
      color: "#22C55E",
      bg: "rgba(34, 197, 94, 0.1)",
      trendBg: "rgba(34, 197, 94, 0.1)",
      trendColor: "#22C55E"
    },
    {
      label: "Pending Requests",
      value: stats.pending,
      icon: Clock,
      trend: "5%",
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.1)",
      trendBg: "rgba(245, 158, 11, 0.1)",
      trendColor: "#F59E0B"
    },
    {
      label: "Completed Services",
      value: stats.completed,
      icon: CheckCircle2,
      trend: "8%",
      color: "#6366F1",
      bg: "rgba(99, 102, 241, 0.1)",
      trendBg: "rgba(34, 197, 94, 0.1)",
      trendColor: "#22C55E"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      {statCards.map((stat, index) => (
        <div 
          key={index}
          className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex justify-between items-start mb-6">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300"
              style={{ backgroundColor: stat.bg }}
            >
              <stat.icon size={26} style={{ color: stat.color }} />
            </div>
            <div 
              className="flex items-center gap-1 px-3 py-1 rounded-full"
              style={{ backgroundColor: stat.trendBg }}
            >
              <ArrowUpRight size={12} style={{ color: stat.trendColor }} />
              <span 
                className="font-unageo text-xs font-bold"
                style={{ color: stat.trendColor }}
              >
                {stat.trend}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-unageo text-sm font-medium text-accent-60">
              {stat.label}
            </h3>
            <p className="font-unbounded text-4xl font-black text-secondary-000">
              {stat.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
