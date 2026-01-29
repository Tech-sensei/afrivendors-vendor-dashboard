"use client";

import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VendorAppointment } from '@/data/appointments';
import { useMobile } from '@/hooks/useMobile';

interface Message {
  id: string;
  sender: 'vendor' | 'customer';
  text: string;
  timestamp: Date;
}

interface MessageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: VendorAppointment | null;
}

export function MessageDrawer({ isOpen, onClose, appointment }: MessageDrawerProps) {
  const isMobile = useMobile();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'customer',
      text: `Hi! I'm looking forward to my ${appointment?.serviceName} appointment. Do you have parking available?`,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: '2',
      sender: 'vendor',
      text: 'Hello! Yes, we have free parking right in front of the studio. Looking forward to seeing you!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23)
    },
    {
      id: '3',
      sender: 'customer',
      text: 'Perfect, thank you! Should I arrive a few minutes early?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22)
    },
    {
      id: '4',
      sender: 'vendor',
      text: 'Yes, arriving 5-10 minutes early would be great. This gives us time to discuss your preferences.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21)
    }
  ]);

  if (!appointment) return null;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'vendor',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
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
            className="fixed inset-0 bg-secondary-000/40 backdrop-blur-[2px] z-999"
          />

          {/* Drawer */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed ${isMobile
                ? 'bottom-0 left-0 right-0 h-[92vh] max-h-[92vh] rounded-t-[24px]'
                : 'top-0 right-0 bottom-0 w-[400px] sm:w-[500px] rounded-l-[24px]'
              } bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.12)] z-1000 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-6 border-b border-accent-20 bg-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-unbounded text-xl font-semibold text-secondary-000">
                  Messages
                </h3>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-transparent hover:bg-secondary-800 transition-colors"
                >
                  <X className="w-5 h-5 text-accent-60" />
                </button>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                  <span className="font-unbounded text-sm font-semibold text-white">
                    {appointment.customerInitials}
                  </span>
                </div>
                <div>
                  <p className="font-unbounded text-[15px] font-semibold text-secondary-000 mb-0.5">
                    {appointment.customerName}
                  </p>
                  <p className="font-unageo text-[13px] text-accent-60">
                    {appointment.serviceName}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'vendor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[75%] flex flex-col gap-1">
                    <div
                      className={`px-4 py-3 rounded-2xl ${message.sender === 'vendor'
                          ? 'bg-primary-100 text-white rounded-br-sm'
                          : 'bg-secondary-800 text-secondary-000 rounded-bl-sm'
                        }`}
                    >
                      <p className="font-unageo text-sm leading-relaxed m-0">
                        {message.text}
                      </p>
                    </div>
                    <span
                      className={`font-unageo text-xs text-accent-60 ${message.sender === 'vendor' ? 'text-right pr-2' : 'text-left pl-2'
                        }`}
                    >
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-5 border-t border-accent-20 bg-white">
              <div className="flex gap-3 items-end">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 px-4 py-3 rounded-[10px] border border-accent-20 bg-white font-unageo text-sm text-secondary-000 resize-none max-h-30 outline-none transition-all focus:border-primary-100 focus:ring-4 focus:ring-primary-100/10"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`w-12 h-12 flex items-center justify-center rounded-[10px] border-none transition-all shrink-0 ${newMessage.trim()
                      ? 'bg-primary-100 text-white hover:opacity-90 cursor-pointer'
                      : 'bg-accent-20 text-accent-60 cursor-not-allowed'
                    }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="mt-2 font-unageo text-xs text-accent-60">
                Press Enter to send, Shift + Enter for new line
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
