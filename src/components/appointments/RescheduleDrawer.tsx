"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import { VendorAppointment } from "@/data/appointments";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";

interface RescheduleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: VendorAppointment | null;
  onConfirm: (appointmentId: string, newDate: string, newTime: string, notes: string) => void;
}

export function RescheduleDrawer({ 
  isOpen, 
  onClose, 
  appointment, 
  onConfirm 
}: RescheduleDrawerProps) {
  const isMobile = useMobile();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  if (!appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(appointment.id, date, time, notes);
    onClose();
  };

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
            className={`fixed ${isMobile ? 'bottom-0 left-4 right-4 h-[85vh] max-h-[85vh] rounded-t-3xl' : 'top-0 right-0 bottom-0 w-[90%] max-w-[500px] rounded-l-2xl'} bg-white shadow-2xl z-[1000] flex flex-col overflow-hidden`}
          >
            <div className="p-6 border-b border-accent-10/50 bg-white flex items-start justify-between">
              <div>
                <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
                  Reschedule
                </h2>
                <p className="font-unageo text-sm text-accent-60">
                  Propose a new time for {appointment.customerName}
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-accent-10 hover:bg-accent-20 rounded-xl transition-all active:scale-90"
              >
                <X size={20} className="text-secondary-000" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {/* Current Time Alert */}
                <div className="mb-8 p-4 bg-accent-10/30 rounded-2xl border border-accent-10 flex items-center gap-4">
                    <div className="flex-1">
                        <span className="block text-[10px] font-bold uppercase tracking-widest text-accent-60 mb-1">Current Appointment</span>
                        <div className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                             <span>{appointment.date}</span>
                             <ArrowRight size={14} className="text-accent-40"/>
                             <span>{appointment.time}</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary-000">Select New Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-40" size={18} />
                            <input 
                                type="date" 
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-accent-20 rounded-xl font-unageo text-sm outline-none focus:border-primary-100 transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary-000">Select New Time</label>
                         <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-40" size={18} />
                            <input 
                                type="time" 
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-accent-20 rounded-xl font-unageo text-sm outline-none focus:border-primary-100 transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-widest text-secondary-000">Reason (Optional)</label>
                        <textarea 
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add a note for the customer..."
                            className="w-full p-4 bg-white border border-accent-20 rounded-xl font-unageo text-sm outline-none focus:border-primary-100 transition-all resize-none"
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        className="w-full py-4 mt-4 bg-[#BC6D39] hover:bg-[#A55B2A] text-white rounded-xl font-unbounded text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
                    >
                        Confirm Reschedule
                    </button>
                </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
