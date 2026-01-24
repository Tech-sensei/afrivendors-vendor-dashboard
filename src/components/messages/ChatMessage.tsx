"use client";

import React from 'react';
import { Check, CheckCheck, FileText, Calendar, Clock } from 'lucide-react';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isVendor: boolean;
  isRead?: boolean;
  hasAttachment?: boolean;
  attachmentUrl?: string;
  attachmentName?: string;
  // Enhanced features
  hasReminder?: boolean;
  reminderDate?: string;
  hasCalendarSync?: boolean;
  calendarDate?: string;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`flex flex-col mb-4 ${message.isVendor ? 'items-end' : 'items-start'}`}>
      
      {/* Message Bubble */}
      <div 
        className={`max-w-[75%] px-4 py-3 rounded-2xl relative group ${
          message.isVendor 
            ? 'bg-primary-100 text-white rounded-br-none' 
            : 'bg-white border border-accent-20 text-secondary-000 rounded-bl-none shadow-sm'
        }`}
      >
        {/* Attachment View */}
        {message.hasAttachment && (
          <div className={`flex items-center gap-3 mb-2 p-2 rounded-lg ${message.isVendor ? 'bg-white/10' : 'bg-accent-10'}`}>
             <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
               <FileText size={16} className="text-primary-100" />
             </div>
             <div className="flex-1 min-w-0">
               <p className={`text-xs font-medium truncate ${message.isVendor ? 'text-white' : 'text-secondary-000'}`}>
                 {message.attachmentName || 'Attachment'}
               </p>
               <p className={`text-[10px] ${message.isVendor ? 'text-white/70' : 'text-accent-60'}`}>
                 Click to view
               </p>
             </div>
          </div>
        )}

        {/* Text Content */}
        <p className="text-sm font-unageo leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>

        {/* Special States Icons (Reminder/Calendar) */}
        {(message.hasReminder || message.hasCalendarSync) && (
           <div className={`flex gap-2 mt-2 pt-2 border-t ${message.isVendor ? 'border-white/20' : 'border-accent-20'} text-[10px]`}>
              {message.hasReminder && (
                <span className="flex items-center gap-1 opacity-90">
                  <Clock size={10} />
                  Reminder set: {message.reminderDate}
                </span>
              )}
              {message.hasCalendarSync && (
                <span className="flex items-center gap-1 opacity-90">
                  <Calendar size={10} />
                  Synced: {message.calendarDate}
                </span>
              )}
           </div>
        )}
      </div>

      {/* Meta Data (Time + Read Receipt) */}
      <div className={`flex items-center gap-1 mt-1 px-1 ${message.isVendor ? 'justify-end' : 'justify-start'}`}>
        <span className="text-[10px] text-accent-60 font-unageo">
          {message.timestamp}
        </span>
        {message.isVendor && (
          <span className="text-primary-100">
            {message.isRead ? (
              <CheckCheck size={12} className="text-primary-100" />
            ) : (
              <Check size={12} className="text-accent-40" />
            )}
          </span>
        )}
      </div>
    </div>
  );
}
