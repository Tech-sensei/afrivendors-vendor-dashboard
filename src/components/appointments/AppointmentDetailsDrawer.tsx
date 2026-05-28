"use client";

import React from 'react';
import {
  X, Calendar, Clock, MessageSquare, XCircle,
  CheckCircle, Phone, Mail, CheckCheck, Loader2, MessageSquareWarning,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { useMobile } from "@/hooks/useMobile";
import { useVendorAppointmentDetail } from "@/services/useVendorAppointments";
import type { VendorAppointment } from "@/types/appointments";
import { VendorAppointmentPayoutNotice } from "@/components/appointments/VendorAppointmentPayoutNotice";
import {
  canVendorRefundDispute,
  getVendorPayoutNotice,
  isVendorPayoutDisputed,
  vendorPaymentStatusClass,
  vendorPaymentStatusLabel,
} from "@/lib/vendorAppointmentPayment";

interface AppointmentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: VendorAppointment | null;
  onMessage?: () => void;
  onCancel?: () => void;
  onMarkComplete?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onRefundCustomer?: () => void;
}

const STATUS_CONFIG = {
  pending:   { label: 'Pending Approval', color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
  accepted:  { label: 'Upcoming',         color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  completed: { label: 'Completed',        color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  rejected:  { label: 'Rejected',         color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100' },
};

function SkeletonLine({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) {
  return <div className={`${w} ${h} rounded-lg bg-accent-10 animate-pulse`} />;
}

export function AppointmentDetailsDrawer({
  isOpen,
  onClose,
  appointment,
  onMessage,
  onCancel,
  onMarkComplete,
  onAccept,
  onReject,
  onRefundCustomer,
}: AppointmentDetailsDrawerProps) {
  const isMobile = useMobile();

  const { data: detail, isLoading } = useVendorAppointmentDetail(appointment?.id, isOpen);
  const appt = detail ?? appointment;

  if (!isOpen || !appt) return null;

  const isPending   = appt.status === 'pending';
  const isAccepted  = appt.status === 'accepted';
  const isCompleted = appt.status === 'completed';
  const payoutNotice = getVendorPayoutNotice(appt);
  const canRefund = appt ? canVendorRefundDispute(appt) : false;
  const disputed = appt ? isVendorPayoutDisputed(appt) : false;

  const status = STATUS_CONFIG[appt.status];
  const primaryService = appt.services[0];
  const displayTime = appt.time.slice(0, 5);
  const totalDuration = appt.services.map(s => s.duration).join(' + ');

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
            className={`fixed ${isMobile
              ? 'bottom-0 left-0 right-0 h-[92vh] max-h-[92vh] rounded-t-[24px]'
              : 'top-0 right-0 bottom-0 w-[480px] rounded-l-2xl'
            } bg-white shadow-2xl z-[1000] flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-accent-10/50 bg-white sticky top-0 z-10">
              <h2 className="font-unbounded text-xl font-bold text-secondary-000">
                Appointment Details
              </h2>
              <div className="flex items-center gap-3">
                {isLoading && <Loader2 size={16} className="animate-spin text-primary-100" />}
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center bg-transparent hover:bg-accent-10 rounded-lg transition-colors"
                >
                  <X size={20} className="text-secondary-000" />
                </button>
              </div>
            </div>

            {/* Content */}
            {isLoading && !detail ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <SkeletonLine w="w-1/3" h="h-7" />
                <div className="space-y-3">
                  <SkeletonLine w="w-1/4" h="h-5" />
                  <SkeletonLine h="h-20" />
                </div>
                <div className="space-y-3">
                  <SkeletonLine w="w-1/4" h="h-5" />
                  <SkeletonLine h="h-32" />
                </div>
                <div className="space-y-3">
                  <SkeletonLine w="w-1/4" h="h-5" />
                  <SkeletonLine h="h-24" />
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-8">

                {/* Status Badge */}
                <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-unageo text-sm font-bold border ${status.bg} ${status.color} ${status.border}`}>
                  {status.label}
                </span>

                {isCompleted && payoutNotice && (
                  <VendorAppointmentPayoutNotice appointment={appt} />
                )}

                {/* Customer Information */}
                <section>
                  <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-4">
                    Customer Information
                  </h4>
                  <div className="p-4 bg-accent-10/30 rounded-xl flex items-center gap-4 border border-accent-10/50">
                    <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden border-2 border-white">
                      {appt.user.profilePhoto ? (
                        <img src={appt.user.profilePhoto} alt={appt.customerName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-unbounded text-lg font-bold text-white">
                          {appt.user.firstName[0]}{appt.user.lastName[0]}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-unbounded text-base font-bold text-secondary-000 mb-2">
                        {appt.customerName}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-accent-60">
                          <Phone size={14} className="text-accent-40 shrink-0" />
                          <span className="font-unageo text-sm">{appt.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-accent-60">
                          <Mail size={14} className="text-accent-40 shrink-0" />
                          <span className="font-unageo text-sm truncate max-w-[220px]">{appt.customerEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Service Details */}
                <section>
                  <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-4">
                    {appt.services.length > 1 ? 'Services' : 'Service'}
                  </h4>
                  <div className="p-5 bg-accent-10/30 rounded-xl border border-accent-10/50 space-y-4">
                    {appt.services.map((service, i) => (
                      <div key={service.id} className={i > 0 ? 'pt-4 border-t border-accent-10/50' : ''}>
                        <h5 className="font-unbounded text-sm font-bold text-secondary-000 mb-1">
                          {service.serviceName}
                        </h5>
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-2.5 py-0.5 rounded-md bg-white border border-accent-10 text-accent-60 font-unageo text-xs font-semibold">
                            {service.category.name}
                          </span>
                          <span className="text-accent-40 text-xs">·</span>
                          <span className="font-unageo text-xs text-accent-60">{service.duration}</span>
                        </div>
                      </div>
                    ))}

                    <div className="space-y-3 pt-4 border-t border-accent-10/50">
                      <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-accent-40 shrink-0" />
                        <span className="font-unageo text-sm text-secondary-000">
                          {format(parseISO(appt.date), 'MMMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock size={16} className="text-accent-40 shrink-0" />
                        <span className="font-unageo text-sm text-secondary-000">
                          {displayTime} <span className="text-accent-60">({totalDuration})</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Payment Information */}
                <section>
                  <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-4">
                    Payment Information
                  </h4>
                  <div className="p-5 bg-accent-10/30 rounded-xl border border-accent-10/50 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-unageo text-sm text-accent-60">Total Amount</span>
                      <span className="font-unbounded text-base font-bold text-secondary-000">
                        £{appt.totalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-unageo text-sm text-accent-60">Platform Fee</span>
                      <span className="font-unageo text-sm text-accent-80">
                        -£{appt.commissionAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-accent-10/50">
                      <span className="font-unageo text-sm font-bold text-secondary-000">Your Earnings</span>
                      <span className="font-unbounded text-base font-bold text-primary-100">
                        £{appt.vendorAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-accent-10/50">
                      <span className="font-unageo text-sm text-accent-60">Payment Method</span>
                      <span className="font-unageo text-sm font-semibold text-secondary-000 capitalize">
                        {appt.paymentMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-unageo text-sm text-accent-60">Payment Status</span>
                      <span
                        className={`inline-flex max-w-[58%] px-2.5 py-1 rounded-md font-unageo text-xs font-bold text-right ${vendorPaymentStatusClass(appt)}`}
                      >
                        {vendorPaymentStatusLabel(appt)}
                      </span>
                    </div>
                  </div>
                </section>

                {/* Special Request */}
                {appt.specificRequest && (
                  <section>
                    <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-4">
                      Special Request
                    </h4>
                    <div className="p-4 bg-accent-10/30 rounded-xl border border-accent-10/50">
                      <p className="font-unageo text-sm text-secondary-000 leading-relaxed">
                        {appt.specificRequest}
                      </p>
                    </div>
                  </section>
                )}

                {/* Timeline */}
                <section>
                  <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-4">
                    Timeline
                  </h4>
                  <div className="space-y-0 relative">
                    {[
                      { label: 'Request Submitted', date: format(parseISO(appt.createdAt), 'MMM d, yyyy'), done: true },
                      ...(appt.status !== 'pending' && appt.status !== 'rejected'
                        ? [{ label: 'Request Accepted', date: format(parseISO(appt.updatedAt), 'MMM d, yyyy'), done: true }]
                        : []),
                      ...(appt.status === 'pending'
                        ? [{ label: 'Awaiting Approval', date: 'Pending', done: false, current: true }]
                        : []),
                      ...(appt.status === 'rejected'
                        ? [{ label: 'Request Rejected', date: format(parseISO(appt.updatedAt), 'MMM d, yyyy'), cancelled: true }]
                        : []),
                      ...(appt.status === 'accepted'
                        ? [{ label: 'Scheduled', date: format(parseISO(appt.date), 'MMM d, yyyy'), done: false, current: true }]
                        : []),
                      ...(appt.status === 'completed'
                        ? [{ label: 'Service Completed', date: format(parseISO(appt.date), 'MMM d, yyyy'), done: true }]
                        : []),
                      ...(appt.status === 'completed' && appt.paymentStatus === 'disputed'
                        ? [{
                            label: 'Customer opened a dispute',
                            date: (() => {
                              if (!appt.dispute?.createdAt) return 'Payout on hold';
                              try {
                                return format(parseISO(appt.dispute.createdAt), 'MMM d, yyyy');
                              } catch {
                                return appt.dispute.createdAt;
                              }
                            })(),
                            done: false,
                            current: appt.dispute?.status !== 'resolved',
                          }]
                        : []),
                      ...(appt.status === 'completed' && appt.paymentStatus === 'released'
                        ? [{ label: 'Payout sent to you', date: format(parseISO(appt.updatedAt), 'MMM d, yyyy'), done: true }]
                        : []),
                    ].map((item, index, arr) => (
                      <div key={index} className="flex gap-4 relative">
                        <div className="flex flex-col items-center w-6">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10
                            ${(item as any).cancelled ? 'border-red-500 bg-red-50' :
                              item.done ? 'border-primary-100 bg-primary-100 text-white' :
                              (item as any).current ? 'border-blue-500 bg-white' :
                              'border-accent-20 bg-white'}`}>
                            {item.done && <CheckCheck size={12} />}
                            {(item as any).current && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                          </div>
                          {index < arr.length - 1 && (
                            <div className="w-[2px] flex-1 min-h-[32px] bg-accent-20/50 my-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-6 last:pb-0">
                          <p className="font-unageo text-sm font-bold text-secondary-000 leading-none mb-1.5 pt-1">
                            {item.label}
                          </p>
                          <p className="font-unageo text-xs text-accent-60">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Footer Actions */}
            <div className="p-6 border-t border-accent-10/50 bg-secondary-800 space-y-3">
              {isCompleted && canRefund && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={onRefundCustomer}
                    className="col-span-2 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3.5 font-unageo text-sm font-bold text-white shadow-sm transition-all hover:bg-red-700 active:scale-95"
                  >
                    Refund customer
                  </button>
                  <button
                    type="button"
                    onClick={onMessage}
                    className="col-span-2 flex w-full items-center justify-center gap-2 rounded-xl border border-accent-20 bg-white py-3.5 font-unageo text-sm font-bold text-secondary-000 transition-all hover:bg-accent-10 active:scale-95"
                  >
                    <MessageSquare size={18} />
                    Message customer
                  </button>
                </div>
              )}

              {isPending && (
                <>
                  <button
                    onClick={onAccept}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-100 hover:bg-primary-100/90 text-white rounded-xl font-unageo text-sm font-bold transition-all shadow-sm active:scale-95"
                  >
                    <CheckCircle size={18} />
                    Accept Appointment
                  </button>
                  <button
                    onClick={onReject}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-accent-20 hover:bg-red-50 hover:text-red-600 hover:border-red-100 text-secondary-000 rounded-xl font-unageo text-sm font-bold transition-all active:scale-95"
                  >
                    <XCircle size={18} />
                    Reject Request
                  </button>
                </>
              )}

              {isAccepted && (
                <button
                  onClick={onMarkComplete}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-100 hover:bg-primary-100/90 text-white rounded-xl font-unageo text-sm font-bold transition-all shadow-sm active:scale-95"
                >
                  <CheckCircle size={18} />
                  Mark as Completed
                </button>
              )}

              <button
                onClick={onMessage}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-accent-20 hover:bg-accent-10 text-secondary-000 rounded-xl font-unageo text-sm font-bold transition-all active:scale-95"
              >
                <MessageSquare size={18} />
                Message Customer
              </button>

              {isAccepted && (
                <button
                  onClick={onCancel}
                  className="w-full flex items-center justify-center gap-2 py-2 text-red-500 hover:text-red-700 font-unageo text-sm font-bold transition-all opacity-80 hover:opacity-100 hover:bg-red-50/50 rounded-lg"
                >
                  <XCircle size={16} />
                  Cancel Appointment
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
