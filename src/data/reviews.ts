export interface Review {
  id: string;
  /** Numeric id from API — required for POST /vendor/reply-to-review */
  reviewId?: number;
  customerName: string;
  customerAvatar: string;
  rating: number;
  date: string;
  reviewText: string;
  vendorReply?: {
    text: string;
    date: string;
  };
}

export const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Amara Okafor',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    date: '2025-11-20',
    reviewText: 'Absolutely wonderful experience! The service was exceptional and the attention to detail was outstanding. I felt pampered and relaxed throughout my visit. Highly recommend!',
    vendorReply: {
      text: 'Thank you so much Amara! We\'re thrilled you enjoyed your experience with us. Looking forward to seeing you again soon! 💕',
      date: '2025-11-21'
    }
  },
  {
    id: '2',
    customerName: 'Chioma Nwosu',
    customerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100',
    rating: 5,
    date: '2025-11-18',
    reviewText: 'Best beauty service I\'ve had in Lagos! The staff is professional, the ambiance is perfect, and the results were exactly what I wanted. Worth every penny!',
  },
  {
    id: '3',
    customerName: 'Blessing Adeyemi',
    customerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    rating: 4,
    date: '2025-11-15',
    reviewText: 'Great service overall! The massage was very relaxing and the therapist was skilled. Only minor issue was the wait time, but everything else was perfect.',
    vendorReply: {
      text: 'Thank you for your feedback Blessing! We apologize for the wait and are working on improving our scheduling. We appreciate your patience and hope to serve you better next time!',
      date: '2025-11-16'
    }
  },
  {
    id: '4',
    customerName: 'Nneka Eze',
    customerAvatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100',
    rating: 5,
    date: '2025-11-12',
    reviewText: 'ZuriGlow never disappoints! I\'ve been coming here for months and every visit is consistently excellent. The team knows exactly what I like and always delivers.',
  },
  {
    id: '5',
    customerName: 'Funke Bakare',
    customerAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
    rating: 4,
    date: '2025-11-10',
    reviewText: 'Very good experience! The facial was amazing and my skin feels incredible. The products they use are high quality. Would definitely come back!',
  },
  {
    id: '6',
    customerName: 'Yetunde Oluwole',
    customerAvatar: 'https://images.unsplash.com/photo-1592621385612-4d7129426394?w=100',
    rating: 3,
    date: '2025-11-08',
    reviewText: 'Decent service but not exceptional. The treatment was good but I expected more based on the reviews. Maybe I caught them on an off day.',
  },
  {
    id: '7',
    customerName: 'Zainab Ibrahim',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    rating: 5,
    date: '2025-11-05',
    reviewText: 'Incredible! The natural hair care service is unmatched. They truly understand African hair and the stylist was so knowledgeable. My hair has never looked better!',
  },
  {
    id: '8',
    customerName: 'Mercy Ogundele',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    rating: 5,
    date: '2025-11-03',
    reviewText: 'A gem in Lagos! Clean facility, friendly staff, and top-notch services. The ambiance is so calming and the results speak for themselves.',
  }
];
