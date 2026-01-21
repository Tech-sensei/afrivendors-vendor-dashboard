"use client";

import React from "react";
import { Lock, Shield, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface SecuritySettingsProps {
  twoFactorEnabled: boolean;
  onOpenPasswordDrawer: () => void;
  onDisable2FA: () => void;
  onEnable2FA: () => void;
}

export function SecuritySettings({
  twoFactorEnabled,
  onOpenPasswordDrawer,
  onDisable2FA,
  onEnable2FA,
}: SecuritySettingsProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-5 shadow-sm">
      <h2 className="font-unageo text-xl font-semibold text-secondary-000 mb-6">
        Security
      </h2>

      <div className="flex flex-col gap-4">
        {/* Password */}
        <div
          onClick={onOpenPasswordDrawer}
          className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 cursor-pointer hover:bg-zinc-50 hover:border-primary-100/30 transition-all group active:scale-[0.99]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <Lock className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h4 className="font-unageo text-[15px] font-semibold text-secondary-000 mb-0.5">
                Password
              </h4>
              <p className="font-unageo text-sm text-zinc-500">
                Change your password
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-primary-100 transition-colors" />
        </div>

        {/* 2FA */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h4 className="font-unageo text-[15px] font-semibold text-secondary-000 mb-0.5">
                Two-Factor Authentication
              </h4>
              <p className="font-unageo text-sm text-zinc-500">
                {twoFactorEnabled ? "Enabled" : "Add an extra layer of security"}
              </p>
            </div>
          </div>
          {twoFactorEnabled ? (
            <button
              onClick={onDisable2FA}
              className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-[13px] font-semibold hover:bg-red-100 transition-all active:scale-95"
            >
              Disable
            </button>
          ) : (
            <button
              onClick={onEnable2FA}
              className="px-4 py-2 rounded-lg bg-primary-100 text-white text-[13px] font-semibold hover:bg-primary-100/90 transition-all active:scale-95"
            >
              Enable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
