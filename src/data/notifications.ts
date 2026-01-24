export type NotificationType = 'booking' | 'payment' | 'message' | 'review' | 'update' | 'reminder' | 'calendar-event' | 'pinned-message';

export interface VendorNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string; // Route to navigate to
  isPinned?: boolean;
  eventDate?: string;
  reminderDate?: string;
}

export const mockNotifications: VendorNotification[] = [
  {
    id: 'notif-001',
    type: 'reminder',
    title: 'Appointment Reminder',
    message: 'Amara Okon has a Deep Tissue Massage appointment today at 2:00 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    isRead: false,
    reminderDate: 'Today at 2:00 PM'
  },
  {
    id: 'notif-002',
    type: 'booking',
    title: 'New Booking Request',
    message: 'Zainab Ibrahim requested a Gel Manicure for Dec 30, 2024 at 3:00 PM',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    isRead: false,
    actionUrl: 'vendor-appointments'
  },
  {
    id: 'notif-003',
    type: 'pinned-message',
    title: 'Pinned Message from Thandiwe Mkhize',
    message: 'Hi! Can I schedule my monthly facial for next Friday?',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    isRead: false,
    isPinned: true,
    actionUrl: 'vendor-messages'
  },
  {
    id: 'notif-004',
    type: 'calendar-event',
    title: 'Upcoming Calendar Event',
    message: 'Hydrating Facial Treatment with Kofi Mensah - Dec 29, 2024 at 10:00 AM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    isRead: false,
    eventDate: 'Dec 29, 2024 at 10:00 AM'
  },
  {
    id: 'notif-005',
    type: 'message',
    title: 'New Message',
    message: 'Fatima Hassan sent you a message about their upcoming appointment',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    isRead: true,
    actionUrl: 'vendor-messages'
  },
  {
    id: 'notif-006',
    type: 'payment',
    title: 'Payment Received',
    message: 'You received $120.00 from Chidinma Nwankwo for Facial Treatment',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    isRead: true,
    actionUrl: 'vendor-wallet'
  },
  {
    id: 'notif-007',
    type: 'review',
    title: 'New 5-Star Review',
    message: 'Adeola Williams left a glowing review: "Amazing service! Highly recommend!"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    isRead: true,
    actionUrl: 'vendor-reviews'
  },
  {
    id: 'notif-008',
    type: 'reminder',
    title: 'Follow-up Reminder',
    message: 'Follow up with Amara Okon about rebooking next month',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    isRead: true,
    reminderDate: 'Dec 27, 2024 at 9:00 AM'
  },
  {
    id: 'notif-009',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Kwame Mensah confirmed their Loc Maintenance appointment for Jan 2, 2025',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    isRead: true,
    actionUrl: 'vendor-appointments'
  },
  {
    id: 'notif-010',
    type: 'update',
    title: 'Service Completed',
    message: 'Thandiwe Mkhize marked their Swedish Massage appointment as complete',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
    isRead: true,
    actionUrl: 'vendor-appointments'
  },
  {
    id: 'notif-011',
    type: 'calendar-event',
    title: 'Appointment Tomorrow',
    message: 'Aromatherapy Session with Zainab Ibrahim - Tomorrow at 11:00 AM',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 24 hours ago
    isRead: true,
    eventDate: 'Tomorrow at 11:00 AM'
  },
  {
    id: 'notif-012',
    type: 'pinned-message',
    title: 'Pinned Message from Fatima Hassan',
    message: 'Do you have any availability for next week? I would love to book another massage.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
    isRead: true,
    isPinned: true,
    actionUrl: 'vendor-messages'
  }
];
