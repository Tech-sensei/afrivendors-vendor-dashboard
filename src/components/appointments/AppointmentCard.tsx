"use client";

import React from "react";
import { Calendar, Clock, PoundSterling, CheckCircle, XCircle, MessageSquare, Eye } from 'lucide-react';
import { format, parseISO } from "date-fns";
import type { VendorAppointment } from "@/types/appointments";
import { VendorAppointmentPayoutNotice } from "@/components/appointments/VendorAppointmentPayoutNotice";
import {
  canVendorRefundDispute,
  getVendorPayoutNotice,
  isVendorPayoutDisputed,
} from "@/lib/vendorAppointmentPayment";

interface AppointmentCardProps {
  appointment: VendorAppointment;
  onViewDetails?: (id: number) => void;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onReschedule?: (id: number) => void;
  onMarkComplete?: (id: number) => void;
  onMessage?: (id: number) => void;
  onRefundCustomer?: (id: number) => void;
}

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: 'text-amber-600', bg: 'bg-amber-50' },
  accepted:  { label: 'Upcoming',  color: 'text-blue-600',  bg: 'bg-blue-50' },
  completed: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-50' },
  rejected:  { label: 'Rejected',  color: 'text-red-600',   bg: 'bg-red-50' },
};


export function AppointmentCard({
  appointment,
  onViewDetails,
  onAccept,
  onReject,
  onReschedule,
  onMarkComplete,
  onMessage,
  onRefundCustomer,
}: AppointmentCardProps) {
  const isPending   = appointment.status === 'pending';
  const isAccepted  = appointment.status === 'accepted';
  const isCompleted = appointment.status === 'completed';
  const payoutNotice = getVendorPayoutNotice(appointment);
  const disputed = isVendorPayoutDisputed(appointment);
  const canRefund = canVendorRefundDispute(appointment);

  const status = STATUS_CONFIG[appointment.status];

  const initials = `${appointment.user.firstName[0]}${appointment.user.lastName[0]}`;
  const primaryService = appointment.services[0];
  const displayTime = appointment.time.slice(0, 5);
  const totalDuration = appointment.services.map(s => s.duration).join(' + ');

  const displayServiceName = appointment.services.length === 1
    ? primaryService?.serviceName
    : `${primaryService?.serviceName} +${appointment.services.length - 1} more`;

  return (
    <div
      onClick={() => onViewDetails?.(appointment.id)}
      className="bg-white border border-accent-20/60 rounded-xl p-5 hover:shadow-md hover:border-primary-100 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Customer Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center shrink-0 text-white font-unbounded text-base font-bold shadow-sm">
            {appointment.user.profilePhoto ? (
              <img src={appointment.user.profilePhoto} alt={appointment.customerName} className="w-full h-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>

          {/* Customer & Service Info */}
          <div className="min-w-0 flex-1">
            <h4 className="font-unbounded text-base font-bold text-secondary-000 leading-tight mb-1 truncate">
              {appointment.customerName}
            </h4>
            <p className="font-unageo text-sm text-accent-60 truncate mb-1">
              {displayServiceName}
            </p>
            <span className="inline-block px-2 py-0.5 rounded-md bg-accent-10 text-accent-60 font-unageo text-xs font-medium">
              {primaryService?.category.name}
            </span>
          </div>
        </div>

        {/* Status badges */}
        <div className="ml-3 flex shrink-0 flex-col items-end gap-1.5">
          <span className={`inline-flex items-center px-3 py-1 rounded-full font-unageo text-xs font-bold ${status.bg} ${status.color}`}>
            {status.label}
          </span>
          {isCompleted && disputed && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 font-unageo text-[10px] font-bold uppercase tracking-wide text-amber-900">
              Payout on hold
            </span>
          )}
        </div>
      </div>

      {/* Appointment Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={15} className="text-accent-60 shrink-0" />
          <span className="font-unageo text-sm font-semibold text-secondary-000">
            {format(parseISO(appointment.date), "MMM d, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-accent-60 shrink-0" />
          <span className="font-unageo text-sm font-semibold text-secondary-000">{displayTime} · {totalDuration}</span>
        </div>
        <div className="flex items-center gap-2">
          <PoundSterling size={15} className="text-accent-60 shrink-0" />
          <span className="font-unageo text-sm font-semibold text-secondary-000">
            {appointment.totalAmount.toFixed(2)}
          </span>
          <span className="font-unageo text-xs text-accent-60 capitalize">
            via {appointment.paymentMethod}
          </span>
        </div>
      </div>

      {isCompleted && payoutNotice && (
        <VendorAppointmentPayoutNotice appointment={appointment} variant="compact" />
      )}

      {/* Actions */}
      <div
        className="flex flex-wrap gap-2 pt-4 border-t border-accent-10"
        onClick={(e) => e.stopPropagation()}
      >
        {isCompleted && canRefund && (
          <>
            <button
              type="button"
              onClick={() => onRefundCustomer?.(appointment.id)}
              className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 font-unageo text-sm font-bold text-red-700 hover:bg-red-100 transition-all"
            >
              Refund customer
            </button>
          </>
        )}
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

        {isAccepted && (
          <button
            onClick={() => onMarkComplete?.(appointment.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-100 text-white font-unageo text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            <CheckCircle size={16} />
            Mark Complete
          </button>
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
