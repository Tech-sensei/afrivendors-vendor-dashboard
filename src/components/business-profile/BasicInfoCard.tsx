
import React from 'react';
import { Building2, User, Tag, Phone, Mail } from 'lucide-react';
import { BusinessProfile } from '@/data/business-profile';

interface BasicInfoCardProps {
  profile: BusinessProfile;
}

function InfoField({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 min-w-0">
      <div className="w-10 h-10 rounded-xl bg-accent-10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-primary-100" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-unageo text-[13px] text-accent-60 mb-0.5">{label}</p>
        <p className="font-unageo text-[15px] font-medium text-secondary-000 wrap-break-word">
          {value}
        </p>
      </div>
    </div>
  );
}

export function BasicInfoCard({ profile }: BasicInfoCardProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm p-6">
      <div className="mb-6">
        <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
          Basic Information
        </h2>
        <p className="font-unageo text-accent-60 text-sm">
          Your business name, owner, category, and contact details (from your account)
        </p>
      </div>

      {/* Single grid: row 2 aligns under row 1 (phone → business, email → owner, third column empty) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8 items-start">
        <InfoField icon={Building2} label="Business Name" value={profile.businessName} />
        <InfoField icon={User} label="Owner Name" value={profile.ownerName} />
        <InfoField icon={Tag} label="Category" value={profile.category} />

        <div className="col-span-full border-t border-accent-20" aria-hidden />

        <InfoField
          icon={Phone}
          label="Phone Number"
          value={profile.phone || '—'}
        />
        <InfoField
          icon={Mail}
          label="Email Address"
          value={profile.email || '—'}
        />
      </div>
    </div>
  );
}
