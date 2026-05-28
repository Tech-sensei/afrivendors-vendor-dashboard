"use client";

import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Briefcase,
  Wallet,
  MessageSquare,
  Bell,
  User,
  Star,
  BarChart3,
  CreditCard,
  Settings,
  HelpCircle,
  LogOut,
  X,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';

interface SidebarProps {
  activePath?: string;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ activePath = '/', onLogout, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const { profile } = useAppSelector((state) => state.auth);

  const vendor = profile?.vendor;
  const kyc = profile?.kyc;

  // Display name: business name from KYC, fallback to full name
  const displayName = kyc?.businessName || `${vendor?.firstName ?? ''} ${vendor?.lastName ?? ''}`.trim() || 'Vendor';
  const category = kyc?.category?.name ?? '';
  const bannerImage = profile?.gallery?.find((g) => g.isBanner)?.imageUrl ?? kyc?.bannerImage ?? null;

  // Initials for avatar fallback
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/custom-requests', label: 'Custom Requests', icon: ClipboardList },
    { path: '/services', label: 'Services', icon: Briefcase },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/business-profile', label: 'Business Profile', icon: User },
    { path: '/reviews', label: 'Reviews', icon: Star },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/subscription', label: 'Subscription', icon: CreditCard },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/help-support', label: 'Help & Support', icon: HelpCircle },
  ];

  const isActive = (path: string) => activePath === path;

  return (
    <>
      <aside
        className={`w-64 bg-white border-r border-accent-20 flex flex-col fixed left-0 top-0 h-screen z-50 transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden absolute top-1 right-1 p-2 rounded-lg hover:bg-secondary-700 transition-colors z-10"
        >
          <X className="w-5 h-5 text-secondary-000" />
        </button>

        {/* Vendor Profile Section */}
        <div className="shrink-0 p-6 border-b border-accent-10 mt-3 sm:mt-0">
          <div className="flex items-start gap-3 mb-2">
            {/* Avatar — banner image or initials */}
            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-primary-100 flex items-center justify-center">
              {bannerImage ? (
                <Image
                  src={bannerImage}
                  alt={displayName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-unbounded font-bold text-base">{initials}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-unbounded font-bold text-secondary-000 text-sm truncate">
                {displayName}
              </h2>
              {category && (
                <p className="text-xs text-accent-60 mt-0.5 truncate">{category}</p>
              )}
            </div>
          </div>

          {/* KYC status badge */}
          {kyc?.approvalStatus && (
            <div className={`rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs font-semibold mt-1 ${
              kyc.approvalStatus === 'approved'
                ? 'bg-green-50 text-green-700'
                : kyc.approvalStatus === 'pending'
                ? 'bg-yellow-50 text-yellow-700'
                : kyc.approvalStatus === 'rejected'
                ? 'bg-red-50 text-red-700'
                : 'bg-secondary-800 text-accent-60'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                kyc.approvalStatus === 'approved' ? 'bg-green-500' :
                kyc.approvalStatus === 'pending' ? 'bg-yellow-500' :
                kyc.approvalStatus === 'rejected' ? 'bg-red-500' : 'bg-accent-40'
              }`} />
              {kyc.approvalStatus.charAt(0).toUpperCase() + kyc.approvalStatus.slice(1)}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => { if (onMobileClose) onMobileClose(); }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                  ? 'bg-primary-300 text-secondary-000 font-bold'
                  : 'text-secondary-000 hover:bg-secondary-800 font-medium'
                  }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-primary-100' : 'text-secondary-000'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="shrink-0 p-4 border-t border-accent-10 bg-white">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="text-[15px] font-normal text-red-600">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
