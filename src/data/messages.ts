// Types
export interface Customer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  totalBookings: number;
  totalSpent: string;
  lastBooking: string;
  rating: number;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isOnline: boolean;
  isTyping?: boolean;
}

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
  hasReminder?: boolean;
  reminderDate?: string;
  hasCalendarSync?: boolean;
  calendarDate?: string;
}

// Mock customer data
export const mockCustomers: Customer[] = [
  {
    id: 'cust-001',
    name: 'Amara Okon',
    avatar: '',
    email: 'amara.okon@email.com',
    phone: '+234 801 234 5678',
    location: 'Lagos, Nigeria',
    joinedDate: 'Jan 15, 2024',
    totalBookings: 8,
    totalSpent: '680.00',
    lastBooking: 'Deep Tissue Massage - Nov 27, 2024',
    rating: 5.0
  },
  {
    id: 'cust-002',
    name: 'Zainab Ibrahim',
    avatar: '',
    email: 'zainab.ibrahim@email.com',
    phone: '+234 802 345 6789',
    location: 'Abuja, Nigeria',
    joinedDate: 'Feb 20, 2024',
    totalBookings: 5,
    totalSpent: '425.00',
    lastBooking: 'Gel Manicure with Nail Art - Nov 27, 2024',
    rating: 4.8
  },
  {
    id: 'cust-003',
    name: 'Thandiwe Mkhize',
    avatar: '',
    email: 'thandiwe.m@email.com',
    phone: '+27 71 234 5678',
    location: 'Johannesburg, South Africa',
    joinedDate: 'Mar 10, 2024',
    totalBookings: 12,
    totalSpent: '1240.00',
    lastBooking: 'Hydrating Facial Treatment - Nov 26, 2024',
    rating: 5.0
  },
  {
    id: 'cust-004',
    name: 'Kofi Mensah',
    avatar: '',
    email: 'kofi.mensah@email.com',
    phone: '+233 24 123 4567',
    location: 'Accra, Ghana',
    joinedDate: 'Apr 5, 2024',
    totalBookings: 6,
    totalSpent: '720.00',
    lastBooking: 'Loc Maintenance & Styling - Nov 26, 2024',
    rating: 4.9
  },
  {
    id: 'cust-005',
    name: 'Fatima Hassan',
    avatar: '',
    email: 'fatima.hassan@email.com',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    joinedDate: 'May 12, 2024',
    totalBookings: 4,
    totalSpent: '340.00',
    lastBooking: 'Swedish Massage - Nov 21, 2024',
    rating: 4.7
  }
];

// Mock conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    customerId: 'cust-001',
    customerName: 'Amara Okon',
    lastMessage: 'Thank you so much! Looking forward to my next session.',
    lastMessageTime: '2:45 PM',
    unreadCount: 0,
    isPinned: true,
    isOnline: true
  },
  {
    id: 'conv-002',
    customerId: 'cust-002',
    customerName: 'Zainab Ibrahim',
    lastMessage: 'Hi! Can I book for tomorrow at 3 PM?',
    lastMessageTime: '11:20 AM',
    unreadCount: 2,
    isPinned: false,
    isTyping: false,
    isOnline: true
  },
  {
    id: 'conv-003',
    customerId: 'cust-003',
    customerName: 'Thandiwe Mkhize',
    lastMessage: 'Perfect! See you then.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isPinned: true,
    isOnline: false
  },
  {
    id: 'conv-004',
    customerId: 'cust-004',
    customerName: 'Kofi Mensah',
    lastMessage: 'Thank you! My locs are looking great.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isPinned: false,
    isOnline: false
  },
  {
    id: 'conv-005',
    customerId: 'cust-005',
    customerName: 'Fatima Hassan',
    lastMessage: 'Do you have any availability next week?',
    lastMessageTime: 'Nov 23',
    unreadCount: 1,
    isPinned: false,
    isOnline: false
  }
];

// Mock messages for each conversation
export const mockMessagesData: Record<string, Message[]> = {
  'conv-001': [
    {
      id: 'msg-001',
      senderId: 'cust-001',
      senderName: 'Amara Okon',
      content: 'Hi! I would like to book a deep tissue massage for next Wednesday at 2 PM. Is that available?',
      timestamp: '10:15 AM',
      isVendor: false,
      hasCalendarSync: true,
      calendarDate: 'Dec 4, 2024 at 2:00 PM'
    },
    {
      id: 'msg-002',
      senderId: 'vendor',
      senderName: 'ZuriGlow Beauty Hub',
      content: 'Hi Amara! Yes, that works perfectly. I have you scheduled for Wednesday, December 4th at 2:00 PM for a 60-minute deep tissue massage.',
      timestamp: '10:18 AM',
      isVendor: true,
      isRead: true
    },
    {
      id: 'msg-003',
      senderId: 'cust-001',
      senderName: 'Amara Okon',
      content: 'Perfect! Also, could you focus on my lower back and shoulders? They have been really tight lately.',
      timestamp: '10:20 AM',
      isVendor: false,
      hasReminder: true,
      reminderDate: 'Dec 3, 2024 at 6:00 PM'
    },
    {
      id: 'msg-004',
      senderId: 'vendor',
      senderName: 'ZuriGlow Beauty Hub',
      content: 'Absolutely! I will make sure to spend extra time on those areas. Is there anything else I should know before your appointment?',
      timestamp: '10:22 AM',
      isVendor: true,
      isRead: true
    },
    {
      id: 'msg-005',
      senderId: 'cust-001',
      senderName: 'Amara Okon',
      content: 'Thank you so much! Looking forward to my next session.',
      timestamp: '2:45 PM',
      isVendor: false
    }
  ],
  'conv-002': [
    {
      id: 'msg-006',
      senderId: 'cust-002',
      senderName: 'Zainab Ibrahim',
      content: 'Hi! Can I book for tomorrow at 3 PM?',
      timestamp: '11:20 AM',
      isVendor: false
    },
    {
      id: 'msg-007',
      senderId: 'cust-002',
      senderName: 'Zainab Ibrahim',
      content: 'I would love to get another gel manicure with some new nail art designs!',
      timestamp: '11:21 AM',
      isVendor: false
    }
  ],
  'conv-003': [
    {
      id: 'msg-008',
      senderId: 'cust-003',
      senderName: 'Thandiwe Mkhize',
      content: 'Hi! Can I schedule my monthly facial for next Friday?',
      timestamp: '3:15 PM',
      isVendor: false
    },
    {
      id: 'msg-009',
      senderId: 'vendor',
      senderName: 'ZuriGlow Beauty Hub',
      content: 'Of course! I have Friday, December 6th at 2:00 PM available. Does that work?',
      timestamp: '3:18 PM',
      isVendor: true,
      isRead: true
    },
    {
      id: 'msg-010',
      senderId: 'cust-003',
      senderName: 'Thandiwe Mkhize',
      content: 'Perfect! See you then.',
      timestamp: '3:20 PM',
      isVendor: false
    }
  ],
  'conv-004': [
    {
      id: 'msg-011',
      senderId: 'cust-004',
      senderName: 'Kofi Mensah',
      content: 'Thank you! My locs are looking great.',
      timestamp: '10:30 AM',
      isVendor: false
    }
  ],
  'conv-005': [
    {
      id: 'msg-012',
      senderId: 'cust-005',
      senderName: 'Fatima Hassan',
      content: 'Do you have any availability next week?',
      timestamp: '9:45 AM',
      isVendor: false
    }
  ]
};
