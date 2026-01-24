"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff, Lock } from "lucide-react";

interface ChangePasswordDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function ChangePasswordDrawer({
  isOpen,
  onClose,
  onSubmit,
}: ChangePasswordDrawerProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [data, setData] = useState({ current: "", new: "", confirm: "" });

  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#231305]/40 backdrop-blur-[2px] z-[100] animate-in fade-in duration-300"
      />
      <div className="fixed right-0 top-0 bottom-0 w-full lg:max-w-[560px] bg-white z-[101] shadow-2xl flex flex-col animate-in duration-500 ease-out sm:slide-in-from-right max-sm:slide-in-from-bottom sm:rounded-l-[32px] max-sm:rounded-t-[32px] sm:h-full max-sm:h-[92dvh] max-sm:top-auto sm:bottom-0 max-sm:left-4 max-sm:right-4">
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-unbounded text-xl font-semibold text-zinc-900">
            Change Password
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:bg-zinc-50 transition-colors"
          >
            <X className="w-5 h-5 cursor-pointer" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-000">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={data.current}
                  onChange={(e) => setData({ ...data, current: e.target.value })}
                  placeholder="Enter current password"
                  className="w-full pl-4 pr-11 py-3 border border-zinc-200 rounded-xl focus:border-primary-100 outline-none transition-all font-unageo text-[15px] text-secondary-000"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-4.5 h-4.5 cursor-pointer" /> : <Eye className="w-4.5 h-4.5 cursor-pointer" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-000">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={data.new}
                  onChange={(e) => setData({ ...data, new: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full pl-4 pr-11 py-3 border border-zinc-200 rounded-xl focus:border-primary-100 outline-none transition-all font-unageo text-[15px] text-secondary-000"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showNew ? <EyeOff className="w-4.5 h-4.5 cursor-pointer" /> : <Eye className="w-4.5 h-4.5 cursor-pointer" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-000">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={data.confirm}
                  onChange={(e) => setData({ ...data, confirm: e.target.value })}
                  placeholder="Confirm new password"
                  className="w-full pl-4 pr-11 py-3 border border-zinc-200 rounded-xl focus:border-primary-100 outline-none transition-all font-unageo text-[15px] text-secondary-000"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4.5 h-4.5 cursor-pointer" /> : <Eye className="w-4.5 h-4.5 cursor-pointer" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 space-y-2">
            <h4 className="text-[13px] font-semibold text-blue-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Password Requirements
            </h4>
            <ul className="text-[12px] text-blue-800/80 space-y-1 list-disc pl-4 leading-relaxed font-unageo">
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
          </div>
        </div>

        <div className="p-6 border-t border-zinc-100 bg-secondary-800 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white border border-accent-20 text-sm font-semibold text-secondary-000 hover:bg-secondary-700 hover:border-accent-40 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(data)}
            className="px-6 py-3 rounded-xl bg-primary-100 text-white text-sm font-semibold hover:bg-primary-100/90 transition-all shadow-lg shadow-primary-100/10 active:scale-95 cursor-pointer"
          >
            Update Password
          </button>
        </div>
      </div>
    </>
  );
}
