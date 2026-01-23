"use client";

import React from "react";
import { Calendar, Clock, User, DollarSign, MessageSquare, Tag, CheckCircle, XCircle, Send, ChevronRight, MapPin } from 'lucide-react';
import { RFSRequest, RFSStatus } from "@/data/rfs";

interface RFSCardProps {
  request: RFSRequest;
  onViewDetails: (id: string) => void;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  onSendQuote: (id: string) => void;
}

export function RFSCard({
  request,
  onViewDetails,
  onAccept,
  onDecline,
  onSendQuote
}: RFSCardProps) {
  const isNew = request.status === 'new';
  const isAccepted = request.status === 'accepted';
  const isIgnored = request.status === 'ignored';
  const isPricePending = request.status === 'price-pending';

  const statusConfig: Record<RFSStatus, { label: string; color: string; bg: string }> = {
    new: { label: 'New Request', color: 'text-primary-100', bg: 'bg-primary-100/10' },
    accepted: { label: 'Accepted', color: 'text-green-600', bg: 'bg-green-50' },
    ignored: { label: 'Declined', color: 'text-red-500', bg: 'bg-red-50' },
    'price-pending': { label: 'Quote Sent', color: 'text-amber-500', bg: 'bg-amber-50' }
  };

  const status = statusConfig[request.status];

  return (
    <div
      onClick={() => onViewDetails(request.id)}
      className="bg-white border border-accent-20/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-primary-100 hover:shadow-lg hover:shadow-primary-100/5 group"
    >
      {/* Header Row */}
      <div className="flex items-start gap-4 mb-6">
        {/* Customer Avatar */}
        <div className="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 shadow-lg shadow-primary-100/20">
          <span className="font-unbounded text-lg font-bold text-white uppercase">
            {request.customerInitials}
          </span>
        </div>

        {/* Customer & Service Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-unbounded text-base font-bold text-secondary-000 truncate">
              {request.customerName}
            </h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-lg font-unageo text-[10px] font-bold uppercase tracking-widest ${status.bg} ${status.color}`}>
              {status.label}
            </span>
          </div>
          <p className="font-unageo text-sm text-accent-60">
            Submitted {request.submittedDate}
          </p>
        </div>
      </div>

      {/* Service Details */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2 text-primary-100">
          <Tag size={14} className="fill-current/20" />
          <span className="font-unageo text-[11px] font-bold uppercase tracking-widest">
            {request.serviceCategory}
          </span>
        </div>
        <h4 className="font-unbounded text-[15px] font-bold text-secondary-000 mb-2 leading-tight">
          {request.serviceTitle}
        </h4>
        <p className="font-unageo text-sm text-accent-80 leading-relaxed line-clamp-2 font-medium">
          {request.description}
        </p>
      </div>

      {/* Meta Information Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-t border-accent-10/50}`}>
        <div className="flex items-center gap-2 text-accent-100">
          <Calendar size={14} className="text-accent-40" />
          <span className="font-unageo text-sm font-semibold">{request.date}</span>
        </div>
        <div className="flex items-center gap-2 text-accent-100">
          <Clock size={14} className="text-accent-40" />
          <span className="font-unageo text-sm font-semibold">{request.time}</span>
        </div>
        <div className="flex items-center gap-2 text-accent-100">
          <DollarSign size={14} className="text-accent-40" />
          <span className="font-unageo text-sm font-bold ">Budget: {request.budget}</span>
        </div>
      </div>

      {/* Action Buttons (Only for New Requests) */}
      {isNew && (
        <div
          className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-accent-10/50"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onSendQuote(request.id)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#BC6D39] hover:bg-[#A55B2A] text-white rounded-xl font-unbounded text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Send size={15} />
            Send Quote
          </button>
          <button
            onClick={() => onAccept(request.id)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-accent-20 hover:bg-green-100/20 text-green-600 rounded-xl font-unbounded text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <CheckCircle size={15} />
            Accept
          </button>
          <button
            onClick={() => onDecline(request.id)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-accent-20 hover:text-red-500 hover:border-red-100 hover:bg-red-50 text-[#9c2e2e] rounded-xl font-unbounded text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <XCircle size={15} />
            Decline
          </button>
        </div>
      )}

      {/* Quick View Button for non-new cards */}
      {!isNew && (
        <div className="flex justify-end pt-2">
            <div className="flex items-center gap-1.5 text-primary-100 font-unbounded text-[9px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                View Details
                <ChevronRight size={14} />
            </div>
        </div>
      )}
    </div>
  );
}
