import { Service } from '@/components/services/ServiceCard';

export const mockServices: Service[] = [
  {
    id: 'svc-001',
    name: 'Deep Tissue Massage',
    category: 'Massage Therapy',
    price: '95.00',
    duration: '60 min',
    description: 'Therapeutic deep tissue massage targeting chronic muscle tension and pain. Perfect for stress relief and improved mobility. Includes aromatherapy oils and hot towel treatment.',
    imageUrl: 'https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwdGhlcmFweSUyMHNwYXxlbnwxfHx8fDE3NjQxNjk2NDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    isPublished: true,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    }
  },

  {
    id: 'svc-002',
    name: 'Hydrating Facial Treatment',
    category: 'Facial Treatments',
    price: '85.00',
    duration: '75 min',
    description: 'Luxurious hydrating facial with deep cleansing, exfoliation, and moisture-rich serums. Includes facial massage, steam therapy, and custom mask treatment for glowing skin.',
    imageUrl: 'https://images.unsplash.com/photo-1531299244174-d247dd4e5a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNpYWwlMjB0cmVhdG1lbnQlMjBiZWF1dHl8ZW58MXx8fHwxNzY0MTk5NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    isPublished: true,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    }
  },

  {
    id: 'svc-003',
    name: 'Loc Maintenance & Styling',
    category: 'Hair Styling',
    price: '120.00',
    duration: '2 hours',
    description: 'Professional loc retwisting, grooming, and styling service. Includes deep cleansing, conditioning treatment, and your choice of styling. Experienced with all hair textures and loc types.',
    imageUrl: 'https://images.unsplash.com/photo-1659036354224-48dd0a9a6b86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWlyJTIwc3R5bGluZyUyMHNhbG9ufGVufDF8fHx8MTc2NDExNDY3NXww&ixlib=rb-4.1.0&q=80&w=1080',
    isPublished: true,
    availability: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    }
  },

  {
    id: 'svc-004',
    name: 'Gel Manicure with Nail Art',
    category: 'Nails & Manicure',
    price: '65.00',
    duration: '90 min',
    description: 'Premium gel manicure with custom nail art design. Includes nail shaping, cuticle care, hand massage, and detailed artistic design. Long-lasting gel polish that stays chip-free for weeks.',
    imageUrl: 'https://images.unsplash.com/photo-1659391542239-9648f307c0b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5pY3VyZSUyMG5haWxzJTIwYmVhdXR5fGVufDF8fHx8MTc2NDIwMjQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    isPublished: true,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    }
  },

  {
    id: 'svc-005',
    name: 'Hot Stone Massage',
    category: 'Massage Therapy',
    price: '110.00',
    duration: '90 min',
    description: 'Relaxing hot stone massage therapy using heated volcanic stones. Relieves muscle tension, improves circulation, and promotes deep relaxation. Includes aromatherapy and calming music.',
    imageUrl: 'https://images.unsplash.com/photo-1562839938-ef837ead7478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjB3ZWxsbmVzcyUyMHJlbGF4YXRpb258ZW58MXx8fHwxNzY0MTcwMTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    isPublished: false,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: false,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    }
  },

  {
    id: 'svc-006',
    name: 'Swedish Relaxation Massage',
    category: 'Massage Therapy',
    price: '85.00',
    duration: '60 min',
    description: 'Classic Swedish massage with gentle, flowing strokes to promote relaxation and reduce stress. Perfect for first-time massage clients or anyone seeking gentle therapeutic touch.',
    imageUrl: 'https://images.unsplash.com/photo-1562839938-ef837ead7478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjB3ZWxsbmVzcyUyMHJlbGF4YXRpb258ZW58MXx8fHwxNzY0MTcwMTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    isPublished: true,
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: false
    }
  },

  {
    id: 'svc-007',
    name: 'Anti-Aging Facial',
    category: 'Facial Treatments',
    price: '125.00',
    duration: '90 min',
    description: 'Advanced anti-aging facial treatment with collagen boost, peptide serums, and LED light therapy. Reduces fine lines, firms skin, and restores youthful radiance.',
    imageUrl: 'https://images.unsplash.com/photo-1531299244174-d247dd4e5a66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNpYWwlMjB0cmVhdG1lbnQlMjBiZWF1dHl8ZW58MXx8fHwxNzY0MTk5NTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    isPublished: false,
    availability: {
      monday: false,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    }
  }
];
