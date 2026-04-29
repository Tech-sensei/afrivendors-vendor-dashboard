"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { KycNotificationBanner } from './KycNotificationBanner';
import { useAuthAPI } from '@/services/useAuthAPI';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  headerTitle?: string;
  headerDescription?: string;
}

export default function DashboardLayout({
  children,
  activePath = '/',
  headerTitle,
  headerDescription,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { logoutAsync, isLoggingOut } = useAuthAPI();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAsync();
    } catch {
      // even if API fails, clear local state and redirect
    }
    setShowLogoutModal(false);
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen bg-[#f9f5f2]">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activePath={activePath}
        onLogout={() => setShowLogoutModal(true)}
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <Header
          title={headerTitle}
          description={headerDescription}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Page Content */}
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <KycNotificationBanner />
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
