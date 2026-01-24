"use client";

import React from 'react';
import { X, User, Phone, Mail, MapPin, Calendar, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any; // Using any for simplicity as per page.tsx mock
}

export function CustomerInfoDrawer({ isOpen, onClose, customer }: CustomerInfoDrawerProps) {
  if (!customer) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-secondary-000/20 backdrop-blur-[1px] z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-[320px] bg-white shadow-2xl z-[70] flex flex-col border-l border-accent-20"
          >
            <div className="p-6 border-b border-accent-20 flex justify-between items-center">
              <h3 className="font-unbounded text-lg font-bold text-secondary-000">Customer Info</h3>
              <button onClick={onClose}>
                <X size={20} className="text-secondary-000" />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
               <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-white font-unbounded text-2xl font-bold mb-3 shadow-md">
                     {customer.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                  </div>
                  <h2 className="font-unbounded text-xl font-bold text-secondary-000 text-center">{customer.name}</h2>
                  <div className="flex items-center gap-1 mt-1">
                     <Star size={14} className="fill-amber-400 text-amber-400" />
                     <span className="text-sm font-bold text-secondary-000">{customer.rating}</span>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-sm text-secondary-000">
                        <Mail size={16} className="text-accent-40" />
                        <span className="truncate">{customer.email}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-secondary-000">
                        <Phone size={16} className="text-accent-40" />
                        <span>{customer.phone}</span>
                     </div>
                     <div className="flex items-center gap-3 text-sm text-secondary-000">
                        <MapPin size={16} className="text-accent-40" />
                        <span>{customer.location}</span>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-accent-20">
                     <h4 className="font-unbounded text-sm font-bold text-secondary-000 mb-3">Stats</h4>
                     <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-accent-10/50 rounded-lg">
                           <p className="text-xs text-accent-60 mb-1">Total Bookings</p>
                           <p className="font-unbounded text-lg font-bold text-primary-100">{customer.totalBookings}</p>
                        </div>
                        <div className="p-3 bg-accent-10/50 rounded-lg">
                           <p className="text-xs text-accent-60 mb-1">Total Spent</p>
                           <p className="font-unbounded text-lg font-bold text-primary-100">${customer.totalSpent}</p>
                        </div>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-accent-20">
                     <h4 className="font-unbounded text-sm font-bold text-secondary-000 mb-3">Last Visit</h4>
                     <div className="flex items-start gap-3">
                        <Calendar size={16} className="text-accent-40 mt-0.5" />
                        <span className="text-sm text-secondary-000 leading-relaxed">{customer.lastBooking}</span>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
