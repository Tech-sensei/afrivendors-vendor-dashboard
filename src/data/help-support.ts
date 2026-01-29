export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface TicketMessage {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
  senderName: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
  messages?: TicketMessage[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'support';
  message: string;
  timestamp: string;
  senderName: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: 'How do I update my business hours?',
    answer: 'Go to Business Profile → Opening Hours section. Click "Edit" and adjust your hours for each day. Don\'t forget to save your changes!'
  },
  {
    question: 'How do I receive payments from customers?',
    answer: 'Set up your payout methods in Settings → Payout Settings. You can add bank accounts or mobile money. Payments are processed automatically after service completion.'
  },
  {
    question: 'How do I respond to customer reviews?',
    answer: 'Navigate to Reviews & Ratings page. Click the "Reply" button under any review to respond. Your replies help build trust with potential customers.'
  },
  {
    question: 'Can I cancel or reschedule appointments?',
    answer: 'Yes! Go to Appointments, find the booking you want to modify, and click "Reschedule" or "Cancel". Customers will be notified automatically.'
  },
  {
    question: 'How do I add new services to my profile?',
    answer: 'Go to Services Management → Click "Add Service". Fill in the service details, pricing, duration, and upload images. Make sure to activate it when ready!'
  },
  {
    question: 'What are RFS requests and how do I handle them?',
    answer: 'RFS (Request for Service) are custom service requests from customers. Review them in RFS Management, send quotes, and if accepted, they become bookings.'
  },
  {
    question: 'How do I withdraw my earnings?',
    answer: 'Go to Wallet → Click "Withdraw Funds". Select your payout method and enter the amount. Withdrawals are typically processed within 1-3 business days.'
  },
  {
    question: 'How can I improve my vendor visibility?',
    answer: 'Keep your profile complete, respond to reviews promptly, maintain high ratings, update your gallery regularly, and respond quickly to booking requests.'
  }
];

export const sampleTickets: SupportTicket[] = [
  {
    id: 'TICK-001',
    subject: 'Payment not received for booking #12345',
    message: 'I completed a service 3 days ago but haven\'t received payment yet. Can you help?',
    status: 'in-progress',
    priority: 'high',
    category: 'Payments',
    createdAt: '2025-11-25T10:30:00',
    updatedAt: '2025-11-26T14:20:00',
    messages: [
      {
        id: '1',
        sender: 'user',
        message: 'I completed a service 3 days ago but haven\'t received payment yet. Can you help?',
        timestamp: '2025-11-25T10:30:00',
        senderName: 'You'
      },
      {
        id: '2',
        sender: 'support',
        message: 'Hello! Thank you for reaching out. I\'m looking into your payment for booking #12345. Can you confirm the completion date and payment method used?',
        timestamp: '2025-11-25T11:15:00',
        senderName: 'Support Team'
      },
      {
        id: '3',
        sender: 'user',
        message: 'The service was completed on November 22nd and the customer paid via online payment.',
        timestamp: '2025-11-25T11:30:00',
        senderName: 'You'
      },
      {
        id: '4',
        sender: 'support',
        message: 'Thank you for the details. I\'ve escalated this to our payments team. They typically process payments within 24-48 hours after completion. I\'ll follow up with you shortly.',
        timestamp: '2025-11-26T14:20:00',
        senderName: 'Support Team'
      }
    ]
  },
  {
    id: 'TICK-002',
    subject: 'Cannot upload images to gallery',
    message: 'When I try to upload photos to my gallery, I get an error message.',
    status: 'open',
    priority: 'medium',
    category: 'Technical',
    createdAt: '2025-11-24T15:45:00',
    updatedAt: '2025-11-24T15:45:00',
    attachments: ['screenshot.png'],
    messages: [
      {
        id: '1',
        sender: 'user',
        message: 'When I try to upload photos to my gallery, I get an error message. I\'ve attached a screenshot of the error.',
        timestamp: '2025-11-24T15:45:00',
        senderName: 'You'
      }
    ]
  },
  {
    id: 'TICK-003',
    subject: 'How to change my business category?',
    message: 'I need to update my business category but can\'t find the option.',
    status: 'resolved',
    priority: 'low',
    category: 'Account',
    createdAt: '2025-11-23T09:15:00',
    updatedAt: '2025-11-24T11:30:00',
    messages: [
      {
        id: '1',
        sender: 'user',
        message: 'I need to update my business category but can\'t find the option.',
        timestamp: '2025-11-23T09:15:00',
        senderName: 'You'
      },
      {
        id: '2',
        sender: 'support',
        message: 'Hi! To update your business category, go to Business Profile → Edit → Category dropdown. Select your new category and click Save.',
        timestamp: '2025-11-23T10:00:00',
        senderName: 'Support Team'
      },
      {
        id: '3',
        sender: 'user',
        message: 'Perfect! Found it. Thank you so much!',
        timestamp: '2025-11-23T10:15:00',
        senderName: 'You'
      },
      {
        id: '4',
        sender: 'support',
        message: 'You\'re welcome! Is there anything else I can help you with?',
        timestamp: '2025-11-24T11:30:00',
        senderName: 'Support Team'
      }
    ]
  }
];

export const sampleChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'support',
    message: 'Hello! Welcome to Afrivendor Support. How can I help you today?',
    timestamp: '2025-11-27T10:00:00',
    senderName: 'Support Team'
  },
  {
    id: '2',
    sender: 'user',
    message: 'Hi, I have a question about payment processing times.',
    timestamp: '2025-11-27T10:02:00',
    senderName: 'You'
  },
  {
    id: '3',
    sender: 'support',
    message: 'I\'d be happy to help! Typically, payments are processed within 24-48 hours after service completion. Is there a specific payment you\'re inquiring about?',
    timestamp: '2025-11-27T10:03:00',
    senderName: 'Support Team'
  }
];

export const ticketCategories = ['General', 'Payments', 'Technical', 'Account', 'Bookings', 'Other'];
