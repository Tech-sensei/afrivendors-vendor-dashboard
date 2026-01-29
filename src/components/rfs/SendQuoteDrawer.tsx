"use client";

import { X, DollarSign, MessageSquare, Send, Tag, Calendar, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { RFSRequest } from '@/data/rfs';
import { useMobile } from '@/hooks/useMobile';

interface SendQuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: RFSRequest | null;
  onConfirm: (requestId: string, quoteAmount: string, message: string) => void;
}

export function SendQuoteDrawer({
  isOpen,
  onClose,
  request,
  onConfirm
}: SendQuoteDrawerProps) {
  const isMobile = useMobile();
  const [quoteAmount, setQuoteAmount] = useState('');
  const [message, setMessage] = useState('');

  const isEditMode = request?.status === 'price-pending' && request?.quoteAmount;

  // Pre-fill form when editing existing quote
  useEffect(() => {
    if (isOpen && request) {
      if (isEditMode) {
        setQuoteAmount(request.quoteAmount || '');
        setMessage(request.quoteMessage || '');
      } else {
        setQuoteAmount('');
        setMessage('');
      }
    }
  }, [isOpen, request, isEditMode]);

  if (!request) return null;

  const handleSubmit = () => {
    if (quoteAmount && message) {
      onConfirm(request.id, quoteAmount, message);
      // Reset form
      setQuoteAmount('');
      setMessage('');
    }
  };

  const isFormValid = quoteAmount && message;

  // Get customer initials
  const customerInitials = request.customerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

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
            className="fixed inset-0 bg-secondary-000/40 backdrop-blur-[2px] z-[999]"
          />

          {/* Drawer */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed z-[1001] bg-white shadow-2xl flex flex-col overflow-hidden ${
              isMobile
                ? 'bottom-0 left-0 right-0 h-[92vh] max-h-[92vh] rounded-t-[24px]' 
                : 'top-0 right-0 bottom-0 w-[90%] max-w-[600px] rounded-l-3xl shadow-[-20px_0_50px_rgba(0,0,0,0.1)]'
            }`}
          >
            {/* Header */}
            <div className="p-6 border-b border-accent-20 bg-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="font-unbounded text-2xl font-semibold text-secondary-000 mb-2">
                    Send Quote
                  </h2>
                  <p className="font-unageo text-sm text-accent-60">
                    Provide a quote for this service request
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center bg-secondary-800 hover:bg-accent-20 rounded-xl transition-colors shrink-0 ml-4"
                >
                  <X className="w-5 h-5 text-secondary-000" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Request Summary */}
              <div className="p-4 bg-secondary-800 rounded-xl mb-6">
                <div className="flex gap-3 items-start mb-3">
                  {/* Customer Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                    <span className="font-unbounded text-base font-semibold text-white">
                      {customerInitials}
                    </span>
                  </div>

                  {/* Request Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-unageo text-sm font-semibold text-secondary-000 mb-1">
                      {request.customerName}
                    </p>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Tag className="w-3 h-3 text-primary-100" />
                      <span className="font-unageo text-[13px] text-primary-100 font-medium">
                        {request.serviceCategory}
                      </span>
                    </div>
                    <p className="font-unageo text-sm font-medium text-accent-70 mb-2">
                      {request.serviceTitle}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-accent-60" />
                        <span className="font-unageo text-xs text-accent-60">
                          {request.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-accent-60" />
                        <span className="font-unageo text-xs text-accent-60">
                          {request.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer's Budget */}
                <div className="mt-3 pt-3 border-t border-accent-20 flex items-center justify-between">
                  <span className="font-unageo text-[13px] text-accent-60">
                    Customer's Budget Range
                  </span>
                  <span className="font-unageo text-sm font-semibold text-secondary-000">
                    {request.budget}
                  </span>
                </div>
              </div>

              {/* Quote Amount Input */}
              <div className="mb-6">
                <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000 mb-2">
                  <DollarSign className="w-4 h-4 text-primary-100" />
                  Quote Amount (USD)
                  <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-unageo text-base font-semibold text-accent-70">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3.5 bg-white border border-accent-20 rounded-xl font-unageo text-base font-semibold text-secondary-000 outline-none transition-all focus:border-primary-100 focus:ring-4 focus:ring-primary-100/10"
                  />
                </div>
                <p className="font-unageo text-xs text-accent-60 mt-1.5">
                  Enter your total service price including all fees
                </p>
              </div>

              {/* Message Input */}
              <div className="mb-6">
                <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000 mb-2">
                  <MessageSquare className="w-4 h-4 text-primary-100" />
                  Message to Customer
                  <span className="text-red-600">*</span>
                </label>
                <textarea
                  placeholder="Introduce yourself and explain what's included in your quote..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full p-3.5 bg-white border border-accent-20 rounded-xl font-unageo text-sm text-secondary-000 outline-none transition-all resize-y min-h-[120px] focus:border-primary-100 focus:ring-4 focus:ring-primary-100/10"
                />
                <p className="font-unageo text-xs text-accent-60 mt-1.5">
                  Share details about your service, availability, and what makes your offer special
                </p>
              </div>

              {/* Info Box */}
              <div className="p-3.5 bg-secondary-800 border border-accent-20 rounded-[10px] flex gap-3">
                <Send className="w-[18px] h-[18px] text-primary-100 shrink-0 mt-0.5" />
                <div>
                  <p className="font-unageo text-[13px] font-semibold text-secondary-000 mb-1">
                    What happens next?
                  </p>
                  <ul className="font-unageo text-[13px] text-accent-70 m-0 pl-[18px] space-y-0.5">
                    <li>Customer will receive your quote via email and notification</li>
                    <li>They can accept, decline, or negotiate the price</li>
                    <li>You'll be notified of their response</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-accent-20 bg-secondary-800 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3.5 rounded-[10px] bg-transparent border border-accent-20 cursor-pointer font-unageo text-[15px] font-semibold text-accent-70 transition-all hover:bg-secondary-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-[10px] border-none cursor-pointer font-unageo text-[15px] font-semibold transition-all ${
                  isFormValid
                    ? 'bg-primary-100 text-white hover:opacity-90'
                    : 'bg-accent-20 text-accent-60 cursor-not-allowed opacity-60'
                }`}
              >
                <Send className="w-[18px] h-[18px]" />
                {isEditMode ? 'Update Quote' : 'Send Quote'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
