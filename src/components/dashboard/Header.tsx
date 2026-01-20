"use client";

import React from 'react';
import { Menu } from 'lucide-react';

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
            <button className="p-2 rounded-lg hover:bg-secondary-700 transition-colors">
              <svg className="w-5 h-5 text-accent-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
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
