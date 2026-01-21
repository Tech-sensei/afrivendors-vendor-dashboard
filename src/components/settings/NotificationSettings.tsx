"use client";

import React from "react";

interface NotificationSettingsProps {
  notifications: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export function NotificationSettings({
  notifications,
  onToggle,
}: NotificationSettingsProps) {
  const getLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const getDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      emailNotifications: "Receive email updates about your account",
      smsAlerts: "Get SMS notifications for urgent updates",
      pushNotifications: "Receive push notifications on your device",
      bookingUpdates: "Get notified about new bookings and changes",
      paymentAlerts: "Receive alerts when payments are processed",
      reviewNotifications: "Get notified when customers leave reviews",
      marketingEmails: "Receive promotional emails and offers",
      weeklyReports: "Get weekly performance reports",
    };
    return descriptions[key] || "";
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-5 shadow-sm">
      <h2 className="font-unageo text-xl font-semibold text-secondary-000 mb-6">
        Notification Preferences
      </h2>

      <div className="grid gap-4">
        {Object.entries(notifications).map(([key, value]) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:border-zinc-200 transition-colors"
          >
            <div>
              <h4 className="font-unageo text-[15px] font-medium text-secondary-000 mb-0.5">
                {getLabel(key)}
              </h4>
              <p className="font-unageo text-xs text-zinc-500">
                {getDescription(key)}
              </p>
            </div>
            <button
              onClick={() => onToggle(key)}
              className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                value ? "bg-primary-100" : "bg-zinc-200"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                  value ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
