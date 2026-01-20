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
  Settings,
  HelpCircle,
  LogOut,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  activePath?: string;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ activePath = '/', onLogout, isMobileOpen = false, onMobileClose }: SidebarProps) {
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/appointments', label: 'Appointments', icon: Calendar },
    { path: '/rfs-requests', label: 'RFS Requests', icon: ClipboardList },
    { path: '/services', label: 'Services', icon: Briefcase },
    { path: '/wallet', label: 'Wallet', icon: Wallet },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
    { path: '/notifications', label: 'Notifications', icon: Bell },
    { path: '/business-profile', label: 'Business Profile', icon: User },
    { path: '/reviews', label: 'Reviews', icon: Star },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
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

        {/* Vendor Profile Section - Fixed at Top */}
        <div className="shrink-0 p-6 border-b border-accent-10 mt-3 sm:mt-0">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-unbounded font-bold text-lg">ZM</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-unbounded font-bold text-secondary-000 text-base truncate">
                ZuriGlow Bea...
              </h2>
              <p className="text-xs text-accent-60 mt-0.5">Wellness & Beauty</p>
            </div>
          </div>
          {/* Rating Box */}
          <div className="bg-secondary-800 rounded-lg px-3 py-2 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="font-unbounded font-bold text-secondary-000 text-sm">4.8</span>
            <span className="text-xs text-accent-60">(92 reviews)</span>
          </div>
        </div>

        {/* Navigation - Scrollable Middle Section */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 min-h-0">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => {
                  // Close mobile menu when link is clicked
                  if (onMobileClose) {
                    onMobileClose();
                  }
                }}
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

        {/* Separator and Logout - Fixed at Bottom */}
        <div className="shrink-0 p-4 border-t border-accent-10 bg-white">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 text-red-600" />
            <span className="text-[15px] font-normal text-red-600">
              Logout
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
