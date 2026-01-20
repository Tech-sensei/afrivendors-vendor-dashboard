"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { LogoutConfirmModal } from './LogoutConfirmModal';

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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    setShowLogoutModal(false);
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
          {children}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        open={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogout}
      />
    </div>
  );
}
