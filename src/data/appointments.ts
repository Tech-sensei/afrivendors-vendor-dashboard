
export type AppointmentStatus = 'pending' | 'upcoming' | 'completed' | 'cancelled';
export type PaymentStatus = 'Pending' | 'Prepaid' | 'Pay After';

export interface VendorAppointment {
  id: string;
  customerName: string;
  customerInitials: string;
  serviceName: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  paymentType: PaymentStatus;
  status: AppointmentStatus;
  location: string;
  notes?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export const mockAppointments: VendorAppointment[] = [
  // Pending Appointments
  {
    id: 'apt-001',
    customerName: 'Amara Okafor',
    customerInitials: 'AO',
    serviceName: 'Full Body Massage',
    category: 'Massage Therapy',
    date: 'Dec 28, 2024',
    time: '2:00 PM',
    duration: '90 mins',
    price: 85.00,
    paymentType: 'Pending',
    status: 'pending',
    location: 'ZuriGlow Studio',
    customerPhone: '+234 801 234 5678',
    customerEmail: 'amara@example.com'
  },
  {
    id: 'apt-002',
    customerName: 'Kwame Mensah',
    customerInitials: 'KM',
    serviceName: 'Hair Styling & Treatment',
    category: 'Hair Styling',
    date: 'Dec 29, 2024',
    time: '10:00 AM',
    duration: '120 mins',
    price: 120.00,
    paymentType: 'Pending',
    status: 'pending',
    location: 'ZuriGlow Studio',
    customerPhone: '+234 802 345 6789'
  },
  {
    id: 'apt-003',
    customerName: 'Thandiwe Mkhize',
    customerInitials: 'TM',
    serviceName: 'Deep Tissue Massage',
    category: 'Massage Therapy',
    date: 'Dec 27, 2024',
    time: '4:00 PM',
    duration: '60 mins',
    price: 75.00,
    paymentType: 'Pending',
    status: 'pending',
    location: 'ZuriGlow Studio'
  },

  // Upcoming Appointments
  {
    id: 'apt-004',
    customerName: 'Chidinma Nwankwo',
    customerInitials: 'CN',
    serviceName: 'Luxury Facial Treatment',
    category: 'Facial Treatments',
    date: 'Dec 26, 2024',
    time: '3:00 PM',
    duration: '75 mins',
    price: 95.00,
    paymentType: 'Prepaid',
    status: 'upcoming',
    location: 'ZuriGlow Studio'
  },
  {
    id: 'apt-005',
    customerName: 'Adeola Williams',
    customerInitials: 'AW',
    serviceName: 'Aromatherapy Session',
    category: 'Spa Treatments',
    date: 'Dec 30, 2024',
    time: '11:00 AM',
    duration: '90 mins',
    price: 100.00,
    paymentType: 'Prepaid',
    status: 'upcoming',
    location: 'ZuriGlow Studio'
  },
  {
    id: 'apt-006',
    customerName: 'Fatima Diallo',
    customerInitials: 'FD',
    serviceName: 'Manicure & Pedicure',
    category: 'Nails & Manicure',
    date: 'Dec 27, 2024',
    time: '1:00 PM',
    duration: '60 mins',
    price: 55.00,
    paymentType: 'Pay After',
    status: 'upcoming',
    location: 'ZuriGlow Studio'
  },
  {
    id: 'apt-007',
    customerName: 'Kofi Asante',
    customerInitials: 'KA',
    serviceName: 'Hot Stone Massage',
    category: 'Massage Therapy',
    date: 'Jan 2, 2025',
    time: '9:00 AM',
    duration: '90 mins',
    price: 110.00,
    paymentType: 'Prepaid',
    status: 'upcoming',
    location: 'ZuriGlow Studio'
  },

  // Past Appointments
  {
    id: 'apt-008',
    customerName: 'Zainab Ibrahim',
    customerInitials: 'ZI',
    serviceName: 'Swedish Massage',
    category: 'Massage Therapy',
    date: 'Dec 20, 2024',
    time: '2:00 PM',
    duration: '60 mins',
    price: 70.00,
    paymentType: 'Prepaid',
    status: 'completed',
    location: 'ZuriGlow Studio'
  },
  {
    id: 'apt-009',
    customerName: 'Adebayo Okonkwo',
    customerInitials: 'AO',
    serviceName: 'Signature Facial',
    category: 'Facial Treatments',
    date: 'Dec 18, 2024',
    time: '4:30 PM',
    duration: '60 mins',
    price: 80.00,
    paymentType: 'Pay After',
    status: 'completed',
    location: 'ZuriGlow Studio'
  },
  {
    id: 'apt-010',
    customerName: 'Nia Kamara',
    customerInitials: 'NK',
    serviceName: 'Braiding & Styling',
    category: 'Hair Styling',
    date: 'Dec 15, 2024',
    time: '10:00 AM',
    duration: '180 mins',
    price: 150.00,
    paymentType: 'Prepaid',
    status: 'completed',
    location: 'ZuriGlow Studio'
  },

  // Cancelled Appointments
  {
    id: 'apt-011',
    customerName: 'Sekou Touré',
    customerInitials: 'ST',
    serviceName: 'Reflexology Session',
    category: 'Wellness & Therapy',
    date: 'Dec 22, 2024',
    time: '5:00 PM',
    duration: '60 mins',
    price: 65.00,
    paymentType: 'Pending',
    status: 'cancelled',
    location: 'ZuriGlow Studio'
  },
  {
    id: 'apt-012',
    customerName: 'Amina Hassan',
    customerInitials: 'AH',
    serviceName: 'Body Scrub Treatment',
    category: 'Spa Treatments',
    date: 'Dec 19, 2024',
    time: '1:00 PM',
    duration: '45 mins',
    price: 60.00,
    paymentType: 'Pending',
    status: 'cancelled',
    location: 'ZuriGlow Studio'
  }
];
