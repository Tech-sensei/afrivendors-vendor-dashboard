"use client";

import React from 'react';
import { 
  Bell, Check, Trash2, Calendar, DollarSign, MessageSquare, Star, 
  Package, Clock, Pin, CalendarCheck 
} from 'lucide-react';
import { VendorNotification, NotificationType } from '@/data/notifications';

interface NotificationItemProps {
  notification: VendorNotification;
  onRead: (id: string) => void;
  onDelete?: (id: string) => void;
  onNavigate?: (notification: VendorNotification) => void;
  onAction?: (notification: VendorNotification, actionType: 'sync' | 'reminder') => void;
  isMarkingRead?: boolean;
}

export function NotificationItem({
  notification,
  onRead,
  onDelete,
  onNavigate,
  onAction,
  isMarkingRead = false,
}: NotificationItemProps) {
  
  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const Icon = getIcon(notification.type);
  const iconBgColor = getIconColor(notification.type, notification.isRead);

  const handleRowClick = () => {
    if (!notification.isRead) {
      onRead(notification.id);
    }
    if (onNavigate) {
      onNavigate(notification);
    }
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group relative p-5 border-b border-accent-10 transition-all duration-200 cursor-pointer
        ${notification.isRead 
          ? 'bg-white hover:bg-accent-10/10' 
          : 'bg-primary-100/10 hover:bg-primary-100/15'
        }
      `}
    >
      <div className="flex gap-4 items-start">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${iconBgColor}`}>
           <Icon size={20} className={notification.isRead ? "text-accent-40" : "text-white"} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-4 mb-1.5">
             <div className="flex items-center gap-2">
                <h4 className={`font-unageo text-[15px] leading-snug ${notification.isRead ? 'text-secondary-000 font-semibold' : 'text-secondary-000 font-bold'}`}>
                  {notification.title}
                </h4>
                {notification.isPinned && (
                   <Pin size={14} className="text-primary-100 fill-primary-100/10" />
                )}
             </div>
             <span className="text-[13px] font-unageo text-accent-60 whitespace-nowrap shrink-0">
               {getTimeAgo(notification.timestamp)}
             </span>
          </div>

          <p className={`font-unageo text-sm leading-relaxed mb-3 ${notification.isRead ? 'text-accent-60' : 'text-secondary-000'}`}>
            {notification.message}
          </p>

          {/* Metadata Badges */}
          {(notification.reminderDate || notification.eventDate) && (
            <div className="flex gap-2 mb-3">
               {notification.reminderDate && (
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-700 font-unageo text-xs font-bold border border-amber-100/50">
                    <Clock size={12} />
                    {notification.reminderDate}
                 </span>
               )}
               {notification.eventDate && (
                 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-green-50 text-green-700 font-unageo text-xs font-bold border border-green-100/50">
                    <CalendarCheck size={12} />
                    {notification.eventDate}
                 </span>
               )}
            </div>
          )}

          {/* Action Buttons (Visible on Hover or if Unread) */}
          <div className="flex flex-wrap gap-2 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
             {!notification.isRead && (
               <button
                 type="button"
                 disabled={isMarkingRead}
                 onClick={(e) => { e.stopPropagation(); onRead(notification.id); }}
                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-accent-20 hover:border-primary-100 hover:text-primary-100 text-accent-60 font-unageo text-xs font-bold transition-all shadow-sm disabled:opacity-50"
               >
                 <Check size={14} />
                 {isMarkingRead ? 'Marking…' : 'Mark Read'}
               </button>
             )}

             {(notification.type === 'booking' || notification.type === 'calendar-event') && (
               <button
                 onClick={(e) => { e.stopPropagation(); onAction?.(notification, 'sync'); }}
                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-accent-20 hover:border-green-500 hover:text-green-600 text-accent-60 font-unageo text-xs font-bold transition-all shadow-sm"
               >
                 <CalendarCheck size={14} />
                 Sync Calendar
               </button>
             )}

             {(notification.type === 'message' || notification.type === 'pinned-message') && (
               <button
                 onClick={(e) => { e.stopPropagation(); onAction?.(notification, 'reminder'); }}
                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-accent-20 hover:border-amber-500 hover:text-amber-600 text-accent-60 font-unageo text-xs font-bold transition-all shadow-sm"
               >
                 <Clock size={14} />
                 Set Reminder
               </button>
             )}

             {onDelete && (
               <button
                 type="button"
                 onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }}
                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-accent-20 hover:border-red-500 hover:text-red-500 text-accent-60 font-unageo text-xs font-bold transition-all shadow-sm"
               >
                 <Trash2 size={14} />
                 Delete
               </button>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions moved outside component or to a utils file ideally, but kept here for simplicity
function getIcon(type: NotificationType) {
  switch (type) {
    case 'booking': return Calendar;
    case 'payment': return DollarSign;
    case 'message': return MessageSquare;
    case 'review': return Star;
    case 'update': return Package;
    case 'reminder': return Clock;
    case 'calendar-event': return CalendarCheck;
    case 'pinned-message': return Pin;
    default: return Bell;
  }
}

function getIconColor(type: NotificationType, isRead: boolean): string {
  if (isRead) return 'bg-accent-10 text-accent-40';
  
  switch (type) {
    case 'reminder': return 'bg-amber-500'; 
    case 'calendar-event': return 'bg-green-500';
    case 'pinned-message': return 'bg-purple-500';
    case 'payment': return 'bg-emerald-600';
    case 'review': return 'bg-amber-500';
    default: return 'bg-primary-100';
  }
}
