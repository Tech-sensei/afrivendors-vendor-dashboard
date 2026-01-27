"use client";

import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2, AlertCircle } from 'lucide-react';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from 'sonner';
import { mockNotifications, VendorNotification } from '@/data/notifications';
import { NotificationItem } from '@/components/notifications/NotificationItem';

type FilterType = 'all' | 'unread' | 'reminders' | 'appointments' | 'messages';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<VendorNotification[]>(mockNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Modal States
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
    toast.success('Marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast.success('All notifications marked as read!');
  };

  const handleDeleteClick = (id: string) => {
    setNotificationToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (notificationToDelete) {
      setNotifications(prev => prev.filter(n => n.id !== notificationToDelete));
      setNotificationToDelete(null);
      toast.error('Notification deleted');
    }
  };

  const handleClearAllClick = () => {
    setIsClearAllConfirmOpen(true);
  };

  const handleConfirmClearAll = () => {
    const readCount = notifications.filter(n => n.isRead).length;
    if (readCount === 0) {
        setIsClearAllConfirmOpen(false);
        return;
    }
    setNotifications(prev => prev.filter(n => !n.isRead));
    setIsClearAllConfirmOpen(false);
    toast.error(`${readCount} read notifications deleted`);
  };

  const handleAction = (notification: VendorNotification, actionType: 'sync' | 'reminder') => {
     if (actionType === 'sync') {
         toast.success(`"${notification.title}" synced to your calendar!`);
     } else if (actionType === 'reminder') {
         toast.success('Reminder set successfully!');
     }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.isRead;
    if (activeFilter === 'reminders') return n.type === 'reminder' || n.type === 'calendar-event';
    if (activeFilter === 'appointments') return n.type === 'booking' || n.type === 'calendar-event';
    if (activeFilter === 'messages') return n.type === 'message' || n.type === 'pinned-message';
    return true; // 'all'
  });

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-unbounded text-3xl font-black text-secondary-000 tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2.5 rounded-full bg-red-500 text-white font-unageo text-sm font-bold shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="font-unageo text-accent-60 text-lg">
              Stay updated with your business activity
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-accent-20 hover:bg-accent-10 hover:border-primary-100/50 text-secondary-000 font-unageo text-sm font-bold transition-all shadow-sm"
              >
                <CheckCheck size={18} />
                Mark All Read
              </button>
            )}
            {notifications.some(n => n.isRead) && (
              <button
                onClick={handleClearAllClick}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-accent-20 hover:bg-red-50 hover:border-red-100 text-red-600 font-unageo text-sm font-bold transition-all shadow-sm"
              >
                <Trash2 size={18} />
                Clear Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 overflow-x-auto pb-2 -mx-2 px-2">
        <div className="flex gap-2 p-1.5 bg-white border border-accent-20 rounded-xl shadow-sm shrink-0 w-max">
          {[
            { id: 'all' as FilterType, label: 'All', count: notifications.length },
            { id: 'unread' as FilterType, label: 'Unread', count: unreadCount },
            { id: 'reminders' as FilterType, label: 'Reminders', count: notifications.filter(n => n.type === 'reminder' || n.type === 'calendar-event').length },
            { id: 'appointments' as FilterType, label: 'Appointments', count: notifications.filter(n => n.type === 'booking' || n.type === 'calendar-event').length },
            { id: 'messages' as FilterType, label: 'Messages', count: notifications.filter(n => n.type === 'message' || n.type === 'pinned-message').length }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                px-5 py-2.5 rounded-[10px] font-unageo text-sm font-bold whitespace-nowrap transition-all
                ${activeFilter === filter.id 
                  ? 'bg-primary-100 text-white shadow-md' 
                  : 'bg-transparent text-accent-60 hover:text-secondary-000 hover:bg-accent-10'
                }
              `}
            >
              {filter.label} <span className="opacity-80 ml-1">({filter.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm min-h-[400px]">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-20 h-20 bg-accent-10 rounded-full flex items-center justify-center mb-6">
              <Bell size={32} className="text-accent-40" />
            </div>
            <h3 className="font-unbounded text-lg font-bold text-secondary-000 mb-2">
              No Notifications Found
            </h3>
            <p className="font-unageo text-accent-60 max-w-xs">
              {activeFilter === 'all' 
                ? "You're all caught up! Check back later for updates." 
                : `You don't have any ${activeFilter} notifications at the moment.`}
            </p>
          </div>
        ) : (
          <div>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={markAsRead}
                onDelete={handleDeleteClick}
                onAction={handleAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {notifications.length > 0 && (
        <div className="mt-6 text-center">
           <p className="font-unageo text-sm text-accent-60">
             Showing {filteredNotifications.length} of {notifications.length} notifications
           </p>
        </div>
      )}
      {/* Confirm Deletion Modal */}
      <ConfirmModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Notification?"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        icon={Trash2}
        iconColor="text-red-500"
        iconBg="bg-red-50"
        confirmButtonVariant="destructive"
      />

      {/* Confirm Clear All Modal */}
      <ConfirmModal
        open={isClearAllConfirmOpen}
        onOpenChange={setIsClearAllConfirmOpen}
        onConfirm={handleConfirmClearAll}
        title="Clear Read Notifications?"
        description="This will permanently delete all notifications that have been marked as read. Are you sure?"
        confirmText="Clear All"
        cancelText="Cancel"
        icon={AlertCircle}
        iconColor="text-red-500"
        iconBg="bg-red-50"
        confirmButtonVariant="destructive"
      />
    </div>
  );
}