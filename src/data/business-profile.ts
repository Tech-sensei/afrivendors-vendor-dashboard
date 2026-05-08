
export interface OpeningHours {
  isOpen: boolean;
  open: string;
  close: string;
}

export interface BusinessProfile {
  businessName: string;
  ownerName: string;
  category: string;
  description: string;
  logo: string;
  bannerImage: string;
  gallery: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  openingHours: {
    [key: string]: OpeningHours;
  };
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export const initialProfile: BusinessProfile = {
  businessName: 'ZuriGlow Beauty Hub',
  ownerName: 'Zuri Adebayo',
  category: 'Beauty & Wellness',
  description: 'Premium beauty and wellness services specializing in natural hair care, relaxing massages, and rejuvenating facials. We bring authentic African beauty traditions to modern wellness practices.',
  logo: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400',
  bannerImage: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1200',
  gallery: [
    'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=400',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'
  ],
  address: '123 Wellness Avenue',
  city: 'Lagos',
  state: 'Lagos State',
  zipCode: '100001',
  phone: '+234 801 234 5678',
  email: 'hello@zuriglow.com',
  openingHours: {
    monday: { isOpen: true, open: '09:00', close: '18:00' },
    tuesday: { isOpen: true, open: '09:00', close: '18:00' },
    wednesday: { isOpen: true, open: '09:00', close: '18:00' },
    thursday: { isOpen: true, open: '09:00', close: '18:00' },
    friday: { isOpen: true, open: '09:00', close: '18:00' },
    saturday: { isOpen: true, open: '10:00', close: '16:00' },
    sunday: { isOpen: false, open: '10:00', close: '16:00' }
  },
  socialLinks: {
    facebook: 'facebook.com/zuriglow',
    instagram: 'instagram.com/zuriglow',
    twitter: 'twitter.com/zuriglow'
  }
};

export const businessCategories = [
  'Beauty & Wellness',
  'Hair Styling',
  'Massage & Spa',
  'Nails & Manicure',
  'Makeup Artist',
  'Skincare',
  'Barbering',
  'Health & Fitness'
];
