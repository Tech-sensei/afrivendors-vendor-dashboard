"use client";

import React, { useState } from 'react';
import { X, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { reminderFormSchema } from '@/lib/validations/messageSchemas';
import { firstZodIssueMessage } from '@/lib/validations/zodHelpers';
import { toast } from 'sonner';

interface SetReminderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messageContent: string;
  onSave: (date: string, time: string, note: string) => void;
}

export function SetReminderDrawer({ isOpen, onClose, messageContent, onSave }: SetReminderDrawerProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  const handleSave = () => {
    const parsed = reminderFormSchema.safeParse({ date, time, note });
    if (!parsed.success) {
      toast.error(firstZodIssueMessage(parsed.error));
      return;
    }
    onSave(parsed.data.date, parsed.data.time, parsed.data.note ?? '');
    setDate('');
    setTime('');
    setNote('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-secondary-000/20 backdrop-blur-[1px] z-60"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-0 sm:bottom-0 sm:top-0 sm:w-[400px] bg-white shadow-2xl z-70 flex flex-col rounded-t-[24px] sm:rounded-none sm:rounded-l-2xl"
          >
            <div className="p-6 border-b border-accent-20 flex justify-between items-center">
              <h3 className="font-unbounded text-lg font-bold text-secondary-000 flex items-center gap-2">
                <Clock size={20} className="text-primary-100" />
                Set Reminder
              </h3>
              <button onClick={onClose}>
                <X size={20} className="text-secondary-000" />
              </button>
            </div>

            <div className="p-6 flex-1 space-y-6">
              <div className="p-3 bg-accent-10/50 rounded-lg text-sm text-secondary-000 italic border-l-2 border-primary-100">
                "{messageContent.substring(0, 100)}{messageContent.length > 100 ? '...' : ''}"
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-secondary-000 mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 rounded-xl border border-accent-20 bg-white focus:border-primary-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary-000 mb-2">Time</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-3 rounded-xl border border-accent-20 bg-white focus:border-primary-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-secondary-000 mb-2">Note (Optional)</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full p-3 rounded-xl border border-accent-20 bg-white focus:border-primary-100 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-accent-20">
              <button
                onClick={handleSave}
                disabled={!date || !time}
                className={`w-full py-3.5 rounded-xl font-unbounded text-sm font-bold transition-all
                   ${date && time
                    ? 'bg-primary-100 text-white hover:opacity-90 shadow-md'
                    : 'bg-accent-20 text-accent-60 cursor-not-allowed'}
                 `}
              >
                Set Reminder
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
