"use client";

import React from "react";
import { X, AlertTriangle, XCircle } from "lucide-react";
import { VendorAppointment } from "@/data/appointments";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";

interface CancelAppointmentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: VendorAppointment | null;
  onConfirm: (id: string) => void;
}

export function CancelAppointmentDrawer({ 
  isOpen, 
  onClose, 
  appointment, 
  onConfirm 
}: CancelAppointmentDrawerProps) {
  const isMobile = useMobile();
  if (!appointment) return null;

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
            className={`fixed ${isMobile ? 'bottom-0 left-0 right-0 h-[60vh] rounded-t-3xl' : 'top-0 right-0 bottom-0 w-[90%] max-w-[440px] rounded-l-2xl'} bg-white shadow-2xl z-[1000] flex flex-col overflow-hidden`}
          >
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
                    <AlertTriangle size={28} className="text-red-500" />
                  </div>
                  
                  <h2 className="font-unbounded text-xl font-bold text-secondary-000 mb-2">
                    Cancel Appointment?
                  </h2>
                  <p className="font-unageo text-sm text-accent-60 leading-relaxed max-w-[280px] mb-8">
                    Are you sure you want to cancel the appointment with <span className="font-bold text-secondary-000">{appointment.customerName}</span>? This action cannot be undone.
                  </p>

                  <div className="w-full space-y-3">
                     <button 
                        onClick={() => onConfirm(appointment.id)}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-unbounded text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
                      >
                        Yes, Cancel Appointment
                      </button>
                      <button 
                        onClick={onClose}
                        className="w-full py-4 bg-white border border-accent-20 hover:bg-accent-10 text-secondary-000 rounded-xl font-unbounded text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                      >
                        No, Go Back
                      </button>
                  </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
