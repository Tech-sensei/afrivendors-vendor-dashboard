"use client";

import React from 'react';
import { X, User, Calendar, Clock, DollarSign, MapPin, Tag, MessageSquare, Phone, Mail, Send, CheckCircle, XCircle, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RFSRequest } from "@/data/rfs";
import { useMobile } from "@/hooks/useMobile";

interface RFSDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: RFSRequest | null;
  onSendQuote: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

export function RFSDetailsDrawer({
  isOpen,
  onClose,
  request,
  onSendQuote,
  onAccept,
  onDecline
}: RFSDetailsDrawerProps) {
  const isMobile = useMobile();
  if (!request) return null;

  const isNew = request.status === 'new';
  const isAccepted = request.status === 'accepted';
  const isIgnored = request.status === 'ignored';
  const isPricePending = request.status === 'price-pending';

  // Mock customer details
  const customerDetails = {
    phone: '+234 803 456 7890',
    email: request.customerName.toLowerCase().replace(' ', '.') + '@email.com',
    preferredContact: 'Phone'
  };

  const statusConfig = {
    new: { label: 'New Request', color: 'text-primary-100', bg: 'bg-primary-100/10' },
    accepted: { label: 'Accepted', color: 'text-green-600', bg: 'bg-green-50' },
    ignored: { label: 'Declined', color: 'text-red-500', bg: 'bg-red-50' },
    'price-pending': { label: 'Quote Sent', color: 'text-amber-500', bg: 'bg-amber-50' }
  };

  const status = statusConfig[request.status];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#231305]/40 backdrop-blur-[2px] z-[999]"
          />

          {/* Drawer */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed ${isMobile ? 'bottom-0 left-0 right-0 h-[85vh] rounded-t-3xl' : 'top-0 right-0 bottom-0 w-[90%] max-w-[600px] rounded-l-2xl'} bg-white shadow-2xl z-[1000] flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-6 border-b border-accent-10/50 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-2">
                    Service Request Details
                  </h2>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg font-unageo text-xs font-bold uppercase tracking-widest ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center bg-accent-10 hover:bg-accent-20 rounded-xl transition-all active:scale-90"
                >
                  <X size={20} className="text-secondary-000" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Customer Information */}
              <section>
                <h3 className="font-unbounded text-xs font-bold text-secondary-000 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <User size={16} className="text-primary-100" />
                  Customer Information
                </h3>
                <div className="p-4 bg-accent-10/30 rounded-2xl flex gap-4 items-center border border-accent-10/50">
                  <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center shrink-0 shadow-lg shadow-primary-100/20">
                    <span className="font-unbounded text-xl font-bold text-white uppercase">
                      {request.customerInitials}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-unbounded text-base font-bold text-secondary-000 mb-1">
                      {request.customerName}
                    </p>
                    <p className="font-unageo text-xs text-accent-60 mb-2">
                      Submitted {request.submittedDate}
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-accent-60">
                        <Phone size={14} className="text-accent-40" />
                        <span className="font-unageo text-sm font-medium">{customerDetails.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-accent-60">
                        <Mail size={14} className="text-accent-40" />
                        <span className="font-unageo text-sm font-medium">{customerDetails.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Service Details */}
              <section>
                <h3 className="font-unbounded text-xs font-bold text-secondary-000 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Tag size={16} className="text-primary-100" />
                  Requested Service
                </h3>
                <div className="p-5 border border-accent-20/60 rounded-2xl bg-white shadow-sm">
                  <div className="inline-flex px-3 py-1 rounded-lg bg-accent-10 text-primary-100 font-unageo text-[10px] font-bold uppercase tracking-widest mb-3 whitespace-nowrap">
                    {request.serviceCategory}
                  </div>
                  <h4 className="font-unbounded text-lg font-bold text-secondary-000 mb-2">
                    {request.serviceTitle}
                  </h4>
                </div>
              </section>

              {/* Request Details */}
              <section className="space-y-6">
                <h3 className="font-unbounded text-xs font-bold text-secondary-000 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={16} className="text-primary-100" />
                  Request Details
                </h3>
                <div className="p-5 bg-accent-10/30 rounded-2xl border border-accent-10/50">
                  <p className="font-unageo text-sm text-accent-80 leading-relaxed font-medium transition-all group-hover:text-secondary-000">
                    {request.description}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white border border-accent-20/60 rounded-2xl shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-accent-40">
                      <Calendar size={14} />
                      <span className="font-unageo text-[10px] font-bold uppercase tracking-widest text-accent-60">Preferred Date</span>
                    </div>
                    <p className="font-unbounded text-sm font-bold text-secondary-000">{request.date}</p>
                  </div>
                  <div className="p-4 bg-white border border-accent-20/60 rounded-2xl shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-accent-40">
                      <Clock size={14} />
                      <span className="font-unageo text-[10px] font-bold uppercase tracking-widest text-accent-60">Preferred Time</span>
                    </div>
                    <p className="font-unbounded text-sm font-bold text-secondary-000">{request.time}</p>
                  </div>
                  <div className="p-4 bg-white border border-accent-20/60 rounded-2xl shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-accent-40">
                      <DollarSign size={14} />
                      <span className="font-unageo text-[10px] font-bold uppercase tracking-widest text-accent-60">Budget Range</span>
                    </div>
                    <p className="font-unbounded text-sm font-bold text-secondary-000">{request.budget}</p>
                  </div>
                  <div className="p-4 bg-white border border-accent-20/60 rounded-2xl shadow-sm space-y-2">
                    <div className="flex items-center gap-2 text-accent-40">
                      <MapPin size={14} />
                      <span className="font-unageo text-[10px] font-bold uppercase tracking-widest text-accent-60">Location</span>
                    </div>
                    <p className="font-unbounded text-sm font-bold text-secondary-000 truncate">{request.location}</p>
                  </div>
                </div>
              </section>

              {/* Quote Info (if pending) */}
              {isPricePending && request.quoteAmount && (
                <section className="bg-amber-50 p-6 rounded-2xl border border-amber-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-unbounded text-sm font-bold text-amber-600 flex items-center gap-2">
                      <Send size={18} />
                      Your Quote Sent
                    </h3>
                    {request.quoteSentDate && (
                      <span className="font-unageo text-xs font-bold text-amber-800/60 uppercase tracking-widest">
                        {request.quoteSentDate}
                      </span>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                      <div className="flex items-center gap-2 text-accent-40 mb-1">
                        <DollarSign size={14} />
                        <span className="font-unageo text-[10px] font-bold uppercase tracking-widest text-accent-60">Quote Amount</span>
                      </div>
                      <p className="font-unbounded text-2xl font-black text-primary-100">${request.quoteAmount}</p>
                    </div>

                    {request.quoteMessage && (
                      <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
                        <div className="flex items-center gap-2 text-accent-40 mb-2">
                          <MessageSquare size={14} />
                          <span className="font-unageo text-[10px] font-bold uppercase tracking-widest text-accent-60">Your Message</span>
                        </div>
                        <p className="font-unageo text-sm text-secondary-000 leading-relaxed italic font-medium">
                          "{request.quoteMessage}"
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-accent-10/50 bg-white">
              {isNew && (
                <div className="space-y-3">
                  <button
                    onClick={onSendQuote}
                    className="w-full py-4 bg-[#BC6D39] hover:bg-[#A55B2A] text-white rounded-xl font-unbounded text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Send Quote
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={onAccept}
                      className="flex items-center justify-center gap-2 py-4 bg-white border border-accent-20 hover:bg-green-100/20 text-green-600 rounded-xl font-unbounded text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                    >
                      <CheckCircle size={18} />
                      Accept
                    </button>
                    <button
                      onClick={onDecline}
                      className="flex items-center justify-center gap-2 py-4 bg-white border border-accent-20 hover:text-red-500 hover:border-red-100 hover:bg-red-50 text-[#9c2e2e] rounded-xl font-unbounded text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm"
                    >
                      <XCircle size={18} />
                      Decline
                    </button>
                  </div>
                </div>
              )}
              
              {isPricePending && (
                <button
                  onClick={onSendQuote}
                  className="w-full py-4 bg-[#BC6D39] hover:bg-[#A55B2A] text-white rounded-xl font-unbounded text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <Edit size={18} />
                  Edit Quote
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
