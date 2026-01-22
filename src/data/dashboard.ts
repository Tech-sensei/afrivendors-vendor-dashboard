export interface DashboardStat {
  appointments: number;
  revenue: number;
  pending: number;
  completed: number;
}

export interface StatsBreakdown {
  daily: DashboardStat;
  weekly: DashboardStat;
  monthly: DashboardStat;
}

export interface EarningData {
  day: string;
  earnings: number;
}

export interface UpcomingAppointment {
  id: number;
  customerName: string;
  service: string;
  time: string;
  date: string;
  price: number;
}

export interface RecentMessage {
  id: number;
  customerName: string;
  message: string;
  time: string;
  unread: boolean;
}

export const statsBreakdown: StatsBreakdown = {
  daily: {
    appointments: 8,
    revenue: 780,
    pending: 3,
    completed: 5
  },
  weekly: {
    appointments: 42,
    revenue: 4970,
    pending: 12,
    completed: 30
  },
  monthly: {
    appointments: 168,
    revenue: 19840,
    pending: 28,
    completed: 140
  }
};

export const earningsData: EarningData[] = [
  { day: 'Mon', earnings: 450 },
  { day: 'Tue', earnings: 680 },
  { day: 'Wed', earnings: 520 },
  { day: 'Thu', earnings: 890 },
  { day: 'Fri', earnings: 1200 },
  { day: 'Sat', earnings: 1450 },
  { day: 'Sun', earnings: 780 },
];

export const upcomingAppointments: UpcomingAppointment[] = [
  {
    id: 1,
    customerName: 'Amara Okafor',
    service: 'Deep Tissue Massage',
    time: '10:00 AM',
    date: 'Today',
    price: 85
  },
  {
    id: 2,
    customerName: 'Chioma Adeyemi',
    service: 'Facial Treatment',
    time: '2:30 PM',
    date: 'Today',
    price: 120
  },
  {
    id: 3,
    customerName: 'Kwame Mensah',
    service: 'Hair Styling & Cut',
    time: '11:00 AM',
    date: 'Tomorrow',
    price: 65
  },
];

export const recentMessages: RecentMessage[] = [
  {
    id: 1,
    customerName: 'Zainab Ibrahim',
    message: 'Hi! Can I reschedule my appointment to Friday?',
    time: '5 min ago',
    unread: true
  },
  {
    id: 2,
    customerName: 'Thabo Nkosi',
    message: 'Thank you for the amazing service yesterday!',
    time: '1 hour ago',
    unread: true
  },
  {
    id: 3,
    customerName: 'Fatima Hassan',
    message: 'Do you offer couples massage packages?',
    time: '3 hours ago',
    unread: false
  },
];
