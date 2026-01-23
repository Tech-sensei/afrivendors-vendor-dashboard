export type RFSStatus = 'new' | 'accepted' | 'ignored' | 'price-pending';

export interface RFSRequest {
  id: string;
  customerName: string;
  customerInitials: string;
  serviceCategory: string;
  serviceTitle: string;
  description: string;
  budget: string;
  date: string;
  time: string;
  location: string;
  status: RFSStatus;
  submittedDate: string;
  quoteAmount?: string;
  quoteMessage?: string;
  quoteSentDate?: string;
}

export const mockRFSRequests: RFSRequest[] = [
  {
    id: 'rfs-001',
    customerName: 'Nia Kamara',
    customerInitials: 'NK',
    serviceCategory: 'Massage Therapy',
    serviceTitle: 'Deep Tissue Sports Massage',
    description: 'Looking for a professional deep tissue massage focusing on back and shoulders. I have chronic tension from desk work and need someone experienced with therapeutic massage techniques.',
    budget: '$80 - $120',
    date: 'Jan 5, 2025',
    time: '2:00 PM - 4:00 PM',
    location: 'Customer Location (Lagos)',
    status: 'new',
    submittedDate: 'Dec 24, 2024'
  },
  {
    id: 'rfs-002',
    customerName: 'Kofi Mensah',
    customerInitials: 'KM',
    serviceCategory: 'Hair Styling',
    serviceTitle: 'Loc Maintenance & Styling',
    description: 'Need maintenance for my locs - retwisting, grooming, and a fresh style. I have medium-length locs that need professional care. Prefer someone experienced with natural hair.',
    budget: '$100 - $150',
    date: 'Jan 3, 2025',
    time: '10:00 AM - 1:00 PM',
    location: 'ZuriGlow Studio',
    status: 'new',
    submittedDate: 'Dec 23, 2024'
  },
  {
    id: 'rfs-003',
    customerName: 'Amara Okafor',
    customerInitials: 'AO',
    serviceCategory: 'Facial Treatments',
    serviceTitle: 'Bridal Facial Package',
    description: 'Getting married in February and need a comprehensive bridal facial treatment. Looking for a multi-session package including deep cleansing, hydration, and brightening treatments.',
    budget: '$200 - $300',
    date: 'Jan 8, 2025',
    time: 'Flexible',
    location: 'ZuriGlow Studio',
    status: 'new',
    submittedDate: 'Dec 22, 2024'
  },
  {
    id: 'rfs-004',
    customerName: 'Thandiwe Mkhize',
    customerInitials: 'TM',
    serviceCategory: 'Spa Treatments',
    serviceTitle: 'Full Body Scrub & Wrap',
    description: 'Interested in a luxurious spa experience with body scrub and wrap treatment. Prefer natural and organic products. Have sensitive skin so need gentle products.',
    budget: '$90 - $130',
    date: 'Jan 6, 2025',
    time: '3:00 PM - 5:00 PM',
    location: 'ZuriGlow Studio',
    status: 'new',
    submittedDate: 'Dec 21, 2024'
  },
  {
    id: 'rfs-005',
    customerName: 'Zainab Ibrahim',
    customerInitials: 'ZI',
    serviceCategory: 'Nails & Manicure',
    serviceTitle: 'Gel Nails with Art Design',
    description: 'Want a full set of gel nails with custom African-inspired art design. Looking for intricate patterns and vibrant colors for a special event.',
    budget: '$60 - $90',
    date: 'Dec 30, 2024',
    time: '11:00 AM',
    location: 'ZuriGlow Studio',
    status: 'price-pending',
    submittedDate: 'Dec 18, 2024',
    quoteAmount: '75.00',
    quoteMessage: 'Hi Zainab! I\'d be delighted to create your custom African-inspired nail design. My quote includes: full gel nail set with intricate patterns, premium gel polish, nail art with vibrant colors, and full nail care.',
    quoteSentDate: 'Dec 19, 2024'
  },
  {
    id: 'rfs-006',
    customerName: 'Sekou Touré',
    customerInitials: 'ST',
    serviceCategory: 'Wellness & Therapy',
    serviceTitle: 'Aromatherapy & Relaxation',
    description: 'Dealing with high stress levels and need a relaxing aromatherapy session. Prefer essential oils that help with anxiety and sleep. First-time client.',
    budget: '$70 - $100',
    date: 'Jan 2, 2025',
    time: 'Evening',
    location: 'ZuriGlow Studio',
    status: 'price-pending',
    submittedDate: 'Dec 19, 2024',
    quoteAmount: '85.00',
    quoteMessage: 'Hello Sekou, I\'m thrilled to help you manage stress through aromatherapy. My package includes: 60-minute aromatherapy massage, custom essential oil blend, and calming environment.',
    quoteSentDate: 'Dec 20, 2024'
  },
  {
    id: 'rfs-007',
    customerName: 'Adebayo Okonkwo',
    customerInitials: 'AO',
    serviceCategory: 'Massage Therapy',
    serviceTitle: 'Hot Stone Massage Therapy',
    description: 'Experienced with hot stone massage and would like a 90-minute session. Have back pain and muscle tension. Regular customer seeking quality service.',
    budget: '$100 - $140',
    date: 'Jan 10, 2025',
    time: '1:00 PM',
    location: 'ZuriGlow Studio',
    status: 'accepted',
    submittedDate: 'Dec 20, 2024'
  }
];
