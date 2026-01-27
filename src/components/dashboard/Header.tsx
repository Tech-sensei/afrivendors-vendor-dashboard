"use client";

import React from 'react';
import Link from 'next/link';
import { Menu, Bell } from 'lucide-react';
import { mockNotifications } from '@/data/notifications';

interface HeaderProps {
  title?: string;
  description?: string;
  onMenuToggle?: () => void;
}

export function Header({
  title = 'Dashboard',
  description = "Welcome back! Here's what's happening today.",
  onMenuToggle,
}: HeaderProps) {
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-accent-20">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary-700 transition-colors shrink-0"
            >
              <Menu className="w-5 h-5 text-secondary-000" />
            </button>
            <div className="min-w-0 flex-1">
              <h2 className="font-unbounded font-semibold text-secondary-000 text-lg sm:text-xl truncate">{title}</h2>
              <p className="text-xs sm:text-sm text-accent-60 mt-1 hidden sm:block">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <Link 
              href="/notifications" 
              className="relative p-2 rounded-lg hover:bg-secondary-700 hover:text-white transition-colors group"
            >
              <Bell className="w-5 h-5 text-accent-70 group-hover:text-current transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
            <button className="p-2 rounded-lg hover:bg-secondary-700 transition-colors">
              <svg className="w-5 h-5 text-accent-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
