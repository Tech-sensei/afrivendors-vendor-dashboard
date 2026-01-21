"use client";

import React from "react";

interface DangerZoneProps {
  onDeleteAccount: () => void;
}

export function DangerZone({ onDeleteAccount }: DangerZoneProps) {
  return (
    <div className="bg-white border-2 border-red-200 rounded-2xl p-6 shadow-sm">
      <h2 className="font-unageo text-xl font-semibold text-red-600 mb-2">
        Danger Zone
      </h2>
      <p className="font-unageo text-sm text-zinc-500 mb-6">
        Once you delete your account, there is no going back. Please be certain.
      </p>
      <button
        onClick={onDeleteAccount}
        className="px-5 py-2.5 rounded-lg border-2 border-red-500 text-sm font-semibold text-red-600 hover:bg-red-500 hover:text-white transition-all active:scale-95 cursor-pointer"
      >
        Delete Account
      </button>
    </div>
  );
}
