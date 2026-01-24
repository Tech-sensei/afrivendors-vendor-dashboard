"use client";

import React from "react";
import { Calendar, Clock, DollarSign, MapPin, CheckCircle, XCircle, MessageSquare, Eye, Edit } from 'lucide-react';
import { VendorAppointment, AppointmentStatus } from "@/data/appointments";

interface AppointmentCardProps {
  appointment: VendorAppointment;
  onViewDetails?: (id: string) => void;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onMarkComplete?: (id: string) => void;
  onMessage?: (id: string) => void;
}

export function AppointmentCard({
  appointment,
  onViewDetails,
  onAccept,
  onReject,
  onReschedule,
  onMarkComplete,
  onMessage
}: AppointmentCardProps) {
  const isPending = appointment.status === 'pending';
  const isUpcoming = appointment.status === 'upcoming';
  const isCompleted = appointment.status === 'completed';
  const isCancelled = appointment.status === 'cancelled';

  // Status Badge Config
  const statusConfig: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
    pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50' },
    upcoming: { label: 'Upcoming', color: 'text-blue-600', bg: 'bg-blue-50' },
    completed: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-50' },
    cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' }
  };

  const status = statusConfig[appointment.status];

  return (
    <div
      onClick={() => onViewDetails?.(appointment.id)}
      className="bg-white border border-accent-20/60 rounded-xl p-5 hover:shadow-md hover:border-primary-100 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Customer Avatar - Circular */}
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-white font-unbounded text-base font-bold shadow-sm">
             {appointment.customerInitials}
          </div>

          {/* Customer & Service Info */}
          <div className="min-w-0 flex-1">
            <h4 className="font-unbounded text-base font-bold text-secondary-000 leading-tight mb-1 truncate">
              {appointment.customerName}
            </h4>
            <p className="font-unageo text-sm text-accent-60 truncate mb-1">
              {appointment.serviceName}
            </p>
            <span className="inline-block px-2 py-0.5 rounded-md bg-accent-10 text-accent-60 font-unageo text-xs font-medium">
              {appointment.category}
            </span>
          </div>
        </div>

        {/* Status Badge - Pill */}
        <span className={`inline-flex items-center px-3 py-1 rounded-full font-unageo text-xs font-bold ${status.bg} ${status.color} whitespace-nowrap`}>
          {status.label}
        </span>
      </div>

      {/* Appointment Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {/* Date & Time */}
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-accent-80" />
          <span className="font-unageo text-sm text-accent-80">
            {appointment.date} at {appointment.time}
          </span>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-accent-80" />
          <span className="font-unageo text-sm text-accent-80">
            {appointment.duration}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <DollarSign size={16} className="text-accent-80" />
            <span className="font-unageo text-sm font-bold text-secondary-000">
                ${appointment.price.toFixed(2)}
            </span>
            <span className="font-unageo text-xs text-accent-80">
                ({appointment.paymentType})
            </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2">
           <MapPin size={16} className="text-accent-80" />
           <span className="font-unageo text-sm text-accent-80 truncate">
             {appointment.location}
           </span>
        </div>
      </div>

      {/* Actions */}
      <div 
        className="flex flex-wrap gap-2 pt-4 border-t border-accent-10"
        onClick={(e) => e.stopPropagation()}
      >
        {isPending && (
          <>
            <button
              onClick={() => onAccept?.(appointment.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-100 text-white font-unageo text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <CheckCircle size={16} />
              Accept
            </button>
            <button
              onClick={() => onReject?.(appointment.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-transparent border border-accent-20 text-red-600 font-unageo text-sm font-bold hover:bg-red-50 hover:border-red-100 transition-all"
            >
              <XCircle size={16} />
              Reject
            </button>
          </>
        )}

        {isUpcoming && (
          <>
             <button
              onClick={() => onMarkComplete?.(appointment.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-100 text-white font-unageo text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
            >
              <CheckCircle size={16} />
              Mark Complete
            </button>
            <button
              onClick={() => onReschedule?.(appointment.id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-transparent border border-accent-20 text-secondary-000 font-unageo text-sm font-bold hover:bg-accent-10 transition-all"
            >
              <Edit size={16} />
              Reschedule
            </button>
          </>
        )}
        
        <button
          onClick={() => onMessage?.(appointment.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-transparent border border-accent-20 text-secondary-000 font-unageo text-sm font-bold hover:bg-accent-10 transition-all"
        >
          <MessageSquare size={16} />
          Message
        </button>

         <button
          onClick={() => onViewDetails?.(appointment.id)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-transparent border border-accent-20 text-secondary-000 font-unageo text-sm font-bold hover:bg-accent-10 transition-all"
        >
          <Eye size={16} />
          View Details
        </button>

      </div>
    </div>
  );
}
