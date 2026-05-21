"use client";

import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

// Map paths to header titles and descriptions
const pageMetadata: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Dashboard',
    description: "Welcome back! Here's what's happening today.",
  },
  '/appointments': {
    title: 'Appointments',
    description: 'Manage and view all your scheduled appointments',
  },
  '/custom-requests': {
    title: 'Custom requests',
    description:
      'Quote on client jobs in your category and track active work through escrow payout',
  },
  '/services': {
    title: 'Services',
    description: 'Manage your service offerings and pricing',
  },
  '/wallet': {
    title: 'Wallet',
    description: 'View your earnings, transactions, and payment history',
  },
  '/payouts': {
    title: 'Payout history',
    description: 'Track your withdrawal requests and their status',
  },
  '/messages': {
    title: 'Messages',
    description: 'Communicate with your customers and clients',
  },
  '/notifications': {
    title: 'Notifications',
    description: 'Stay updated with your latest alerts and updates',
  },
  '/business-profile': {
    title: 'Business Profile',
    description: 'Manage your business information and profile settings',
  },
  '/reviews': {
    title: 'Reviews',
    description: 'View and respond to customer reviews and feedback',
  },
  '/analytics': {
    title: 'Analytics',
    description: 'Track your business performance and insights',
  },
  '/settings': {
    title: 'Settings',
    description: 'Configure your account and application preferences',
  },
  '/help-support': {
    title: 'Help & Support',
    description: 'Get assistance and find answers to your questions',
  },
};

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const metadata = pageMetadata[pathname] || pageMetadata['/'];

  return (
    <DashboardLayout
      activePath={pathname}
      headerTitle={metadata.title}
      headerDescription={metadata.description}
    >
      {children}
    </DashboardLayout>
  );
}
