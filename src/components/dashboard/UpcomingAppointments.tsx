"use client";

import React from "react";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { UpcomingAppointment } from "@/data/dashboard";
import Link from "next/link";

interface UpcomingAppointmentsProps {
  appointments: UpcomingAppointment[];
}

export const UpcomingAppointments = React.memo(function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6  shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight mb-1">
            Upcoming Appointments
          </h2>
          <p className="font-unageo text-accent-60 text-sm font-medium">
            Next 3 scheduled bookings
          </p>
        </div>
        <Link 
          href="/appointments"
          className="flex items-center gap-2 font-unageo text-xs font-bold text-primary-100 border border-primary-100/20 px-4 py-2 rounded-xl hover:bg-primary-100/5 transition-all"
        >
          View All
        </Link>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {appointments.map((appointment) => (
          <div 
            key={appointment.id}
            className="group flex flex-row items-center justify-between gap-5 p-5 bg-accent-10/30 rounded-xl border border-accent-10/50 hover:bg-white hover:border-accent-20 hover:shadow-md transition-all duration-300"
          >
            <div className="flex-1 space-y-2">
              <div className="flex flex-col">
                <h4 className="font-unbounded text-sm font-bold text-secondary-000">
                  {appointment.customerName}
                </h4>
                <p className="font-unageo text-xs text-accent-60 font-medium">
                  {appointment.service}
                </p>
              </div>
              <div className="flex items-center gap-4">
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
            
            <div className="flex items-center justify-end">
              <div className="bg-white border border-accent-10 px-4 py-2 rounded-xl shadow-sm">
                <span className="font-unbounded text-sm font-black text-secondary-000">
                  ${appointment.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
