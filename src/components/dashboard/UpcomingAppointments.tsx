"use client";

import React from "react";
import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/currency";
import { VENDOR_DASHBOARD_CURRENCY } from "@/lib/mapVendorDashboard";
import type { VendorDashboardView } from "@/types/vendor-dashboard";

interface UpcomingAppointmentsProps {
  appointments: VendorDashboardView["latestAppointments"];
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-zinc-100 text-zinc-600",
  rejected: "bg-red-100 text-red-800",
};

export const UpcomingAppointments = React.memo(function UpcomingAppointments({
  appointments,
}: UpcomingAppointmentsProps) {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight mb-1">
            Latest Appointments
          </h2>
          <p className="font-unageo text-accent-60 text-sm font-medium">
            Your most recent bookings
          </p>
        </div>
        <Link
          href="/appointments"
          className="flex items-center gap-2 font-unageo text-xs font-bold text-primary-100 border border-primary-100/20 px-4 py-2 rounded-xl hover:bg-primary-100/5 transition-all"
        >
          View All
        </Link>
      </div>

      {appointments.length === 0 ? (
        <p className="font-unageo text-sm text-accent-60 py-8 text-center">
          No appointments yet. New bookings will appear here.
        </p>
      ) : (
        <div className="flex flex-col gap-4 flex-1">
          {appointments.map((appointment) => (
            <Link
              key={appointment.id}
              href={`/appointments?appointmentId=${appointment.id}`}
              className="group flex flex-row items-center justify-between gap-5 p-5 bg-accent-10/30 rounded-xl border border-accent-10/50 hover:bg-white hover:border-accent-20 hover:shadow-md transition-all duration-300"
            >
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-unbounded text-sm font-bold text-secondary-000">
                    {appointment.customerName}
                  </h4>
                  <span
                    className={`font-unageo text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      STATUS_STYLES[appointment.status] ??
                      "bg-accent-10 text-accent-60"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
                <p className="font-unageo text-xs text-accent-60 font-medium truncate">
                  {appointment.service}
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 font-unageo text-[11px] font-bold text-accent-40 uppercase tracking-wider">
                    <Calendar size={13} className="text-primary-100" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center gap-1.5 font-unageo text-[11px] font-bold text-accent-40 uppercase tracking-wider">
                    <Clock size={13} className="text-primary-100" />
                    {appointment.time}
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <div className="bg-white border border-accent-10 px-4 py-2 rounded-xl shadow-sm">
                  <span className="font-unbounded text-sm font-black text-secondary-000 whitespace-nowrap">
                    {formatMoney(
                      appointment.price,
                      VENDOR_DASHBOARD_CURRENCY
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
});
