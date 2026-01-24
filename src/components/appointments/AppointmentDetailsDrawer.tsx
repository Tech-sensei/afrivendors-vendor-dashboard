"use client";

import React from 'react';
import { X, User, Calendar, Clock, DollarSign, MapPin, MessageSquare, Edit, XCircle, CheckCircle, Phone, Mail, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VendorAppointment } from "@/data/appointments";
import { useMobile } from "@/hooks/useMobile";

interface AppointmentDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: VendorAppointment | null;
  onMessage?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  onMarkComplete?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
}

export function AppointmentDetailsDrawer({
  isOpen,
  onClose,
  appointment,
  onMessage,
  onReschedule,
  onCancel,
  onMarkComplete,
  onAccept,
  onReject
}: AppointmentDetailsDrawerProps) {
  const isMobile = useMobile();

  if (!isOpen || !appointment) return null;

  const isPending = appointment.status === 'pending';
  const isUpcoming = appointment.status === 'upcoming';
  const isCompleted = appointment.status === 'completed';
  const isCancelled = appointment.status === 'cancelled';

  // Mock customer details (derived from user request)
  const customerDetails = {
    phone: '+234 803 456 7890',
    email: appointment.customerName.toLowerCase().replace(/\s+/g, '.') + '@email.com',
    bookingDate: 'Dec 15, 2024',
    notes: 'Customer prefers gentle pressure and lavender aromatherapy. First-time visitor.'
  };

  // Timeline data logic
  const getTimeline = () => {
    const baseTimeline = [
      {
        label: 'Request Submitted',
        date: customerDetails.bookingDate,
        status: 'completed'
      }
    ];

    if (isPending) {
      baseTimeline.push({
        label: 'Awaiting Approval',
        date: 'Pending',
        status: 'current'
      });
    } else if (isUpcoming || isCompleted) {
      baseTimeline.push({
        label: 'Request Accepted',
        date: customerDetails.bookingDate,
        status: 'completed'
      });
      if (isCompleted) {
        baseTimeline.push({
          label: 'Service Completed',
          date: appointment.date,
          status: 'completed'
        });
      } else {
        baseTimeline.push({
          label: 'Scheduled',
          date: appointment.date,
          status: 'current'
        });
      }
    } else if (isCancelled) {
      baseTimeline.push({
        label: 'Cancelled',
        date: customerDetails.bookingDate,
        status: 'cancelled'
      });
    }

    return baseTimeline;
  };

  const timeline = getTimeline();

  // Status Badge Config
  const statusConfig = {
    pending: { label: 'Pending Approval', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    upcoming: { label: 'Upcoming', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    completed: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' }
  };
  const status = statusConfig[appointment.status];

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
            className={`fixed ${isMobile ? 'bottom-0 left-4 right-4 h-[90vh] max-h-[90vh] rounded-t-3xl' : 'top-0 right-0 bottom-0 w-[480px] rounded-l-2xl'} bg-white shadow-2xl z-[1000] flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-accent-10/50 bg-white sticky top-0 z-10">
              <h2 className="font-unbounded text-xl font-bold text-secondary-000">
                Appointment Details
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center bg-transparent hover:bg-accent-10 rounded-lg transition-colors"
              >
                <X size={20} className="text-secondary-000" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Status Badge */}
              <div className="flex justify-start">
                 <span className={`inline-flex items-center px-4 py-1.5 rounded-full font-unageo text-sm font-bold border ${status.bg} ${status.color} ${status.border}`}>
                    {status.label}
                 </span>
              </div>

              {/* Customer Information */}
              <section>
                <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-4">
                  Customer Information
                </h4>
                <div className="p-4 bg-accent-10/30 rounded-xl flex items-center gap-4 border border-accent-10/50">
                   <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center shrink-0 shadow-sm text-white border-2 border-white">
                      <span className="font-unbounded text-lg font-bold">
                        {appointment.customerInitials}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-unbounded text-base font-bold text-secondary-000 mb-1">
                        {appointment.customerName}
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-accent-60">
                           <Phone size={14} className="text-accent-40" />
                           <span className="font-unageo text-sm font-medium">{customerDetails.phone}</span>
                        </div>
                         <div className="flex items-center gap-2 text-accent-60">
                           <Mail size={14} className="text-accent-40" />
                           <span className="font-unageo text-sm font-medium truncate max-w-[200px]">{customerDetails.email}</span>
                        </div>
                      </div>
                    </div>
                </div>
              </section>

              {/* Service Details */}
              <section>
                 <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-4">
                  Service Details
                </h4>
                <div className="p-5 bg-accent-10/30 rounded-xl border border-accent-10/50 space-y-4">
                   <div>
                       <h5 className="font-unbounded text-base font-bold text-secondary-000 leading-tight mb-2">
                          {appointment.serviceName}
                       </h5>
                       <span className="inline-block px-2.5 py-1 rounded-md bg-white border border-accent-10 text-accent-60 font-unageo text-xs font-semibold">
                          {appointment.category}
                       </span>
                   </div>

                   <div className="space-y-3 pt-4 border-t border-accent-10/50">
                      <div className="flex items-center gap-3 text-secondary-000">
                          <Calendar size={18} className="text-accent-40" />
                          <span className="font-unageo text-sm font-medium">{appointment.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-secondary-000">
                          <Clock size={18} className="text-accent-40" />
                          <span className="font-unageo text-sm font-medium">
                            {appointment.time} <span className="text-accent-60">({appointment.duration})</span>
                          </span>
                      </div>
                      <div className="flex items-center gap-3 text-secondary-000">
                          <MapPin size={18} className="text-accent-40" />
                          <span className="font-unageo text-sm font-medium">{appointment.location}</span>
                      </div>
                   </div>
                </div>
              </section>

              {/* Payment Information */}
              <section>
                 <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-4">
                  Payment Information
                </h4>
                <div className="p-5 bg-accent-10/30 rounded-xl border border-accent-10/50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="font-unageo text-sm text-accent-60 font-medium">Service Fee</span>
                        <span className="font-unbounded text-base font-bold text-secondary-000">
                           ${appointment.price.toFixed(2)}
                        </span>
                    </div>
                    <div className="pt-4 border-t border-accent-10/50 flex justify-between items-center">
                        <span className="font-unageo text-sm text-accent-60 font-medium">Payment Type</span>
                        <span className={`inline-flex px-2.5 py-1 rounded-md font-unageo text-sm font-bold ${appointment.paymentType === 'Prepaid' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                           {appointment.paymentType}
                        </span>
                    </div>
                </div>
              </section>

              {/* Customer Notes */}
              {customerDetails.notes && (
                <section>
                   <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-4">
                    Customer Notes
                  </h4>
                  <div className="p-4 bg-accent-10/30 rounded-xl border border-accent-10/50">
                     <p className="font-unageo text-sm text-secondary-000 leading-relaxed">
                        {customerDetails.notes}
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
                   {timeline.map((item, index) => (
                      <div key={index} className="flex gap-4 relative">
                          {/* Timeline Line */}
                          <div className="flex flex-col items-center w-6">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 
                                  ${item.status === 'completed' 
                                    ? 'border-primary-100 bg-primary-100 text-white' 
                                    : item.status === 'current'
                                    ? 'border-blue-500 bg-white text-blue-500' 
                                    : item.status === 'cancelled'
                                    ? 'border-red-500 bg-red-50 text-white'
                                    : 'border-accent-20 bg-white'}
                              `}>
                                  {item.status === 'completed' && <CheckCheck size={14} />}
                                  {item.status === 'current' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                                  {/* Cancelled state in mockup is empty circle with red border/fill, no icon implies just status */}
                              </div>
                              {index < timeline.length - 1 && (
                                <div className="w-[2px] flex-1 min-h-[32px] bg-accent-20/50 my-1" />
                              )}
                          </div>
                          
                          <div className={`flex-1 pb-${index < timeline.length - 1 ? '6' : '0'}`}>
                              <p className="font-unageo text-sm font-bold text-secondary-000 leading-none mb-1.5 pt-1">
                                {item.label}
                              </p>
                              <p className="font-unageo text-xs text-accent-60">
                                {item.date}
                              </p>
                          </div>
                      </div>
                   ))}
                </div>
              </section>

            </div>

             {/* Footer Actions */}
             <div className="p-6 border-t border-accent-10/50 bg-secondary-800 space-y-3">
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

                {isUpcoming && (
                  <>
                     <button
                      onClick={onMarkComplete}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary-100 hover:bg-primary-100/90 text-white rounded-xl font-unageo text-sm font-bold transition-all shadow-sm active:scale-95"
                    >
                      <CheckCircle size={18} />
                      Mark as Completed
                    </button>
                     <button
                      onClick={onReschedule}
                      className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-accent-20 hover:bg-accent-10 text-secondary-000 rounded-xl font-unageo text-sm font-bold transition-all active:scale-95"
                    >
                      <Edit size={18} />
                      Reschedule Appointment
                    </button>
                  </>
                )}

                 <button
                    onClick={onMessage}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-white border border-accent-20 hover:bg-accent-10 text-secondary-000 rounded-xl font-unageo text-sm font-bold transition-all active:scale-95"
                  >
                    <MessageSquare size={18} />
                    Message Customer
                  </button>

                  {isUpcoming && (
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
