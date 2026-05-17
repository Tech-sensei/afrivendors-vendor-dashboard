"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Edit2, Save } from "lucide-react";
import { toast } from "sonner";
import { vendorAccountSettingsSchema } from "@/lib/validations/accountSettingsSchemas";
import { firstZodIssueMessage } from "@/lib/validations/zodHelpers";

interface AccountData {
  name: string;
  email: string;
  phone: string;
}

interface AccountSettingsProps {
  initialData: AccountData;
}

export function AccountSettings({ initialData }: AccountSettingsProps) {
  const [data, setData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const parsed = vendorAccountSettingsSchema.safeParse(data);
    if (!parsed.success) {
      toast.error(firstZodIssueMessage(parsed.error));
      return;
    }
    setData(parsed.data);
    setIsEditing(false);
    toast.success("Account information updated successfully!");
  };

  const handleCancel = () => {
    setData(initialData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 mb-5 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-unageo text-xl font-semibold text-secondary-000">
          Account Settings
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:border-primary-100 hover:text-primary-100 transition-all active:scale-95 cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-all active:scale-95 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-100 text-white text-sm font-semibold hover:bg-primary-100/90 transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-5">
        {/* Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <User className="w-4 h-4" />
            Full Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-4 py-3 rounded-xl border border-zinc-200 font-unageo text-[15px] text-secondary-000 outline-none transition-all ${
              isEditing ? "bg-white focus:border-primary-100 ring-2 ring-primary-100/5" : "bg-zinc-50 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <Mail className="w-4 h-4" />
            Email Address
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-4 py-3 rounded-xl border border-zinc-200 font-unageo text-[15px] text-secondary-000 outline-none transition-all ${
              isEditing ? "bg-white focus:border-primary-100 ring-2 ring-primary-100/5" : "bg-zinc-50 cursor-not-allowed"
            }`}
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-zinc-600">
            <Phone className="w-4 h-4" />
            Phone Number
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
            disabled={!isEditing}
            className={`w-full px-4 py-3 rounded-xl border border-zinc-200 font-unageo text-[15px] text-secondary-000 outline-none transition-all ${
              isEditing ? "bg-white focus:border-primary-100 ring-2 ring-primary-100/5" : "bg-zinc-50 cursor-not-allowed"
            }`}
          />
        </div>
      </div>
    </div>
  );
}
