
import React from 'react';
import { Edit2, Building2, User, Tag } from 'lucide-react';
import { BusinessProfile } from '@/data/business-profile';

interface BasicInfoCardProps {
  profile: BusinessProfile;
  onEdit: () => void;
}

export function BasicInfoCard({ profile, onEdit }: BasicInfoCardProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
            Basic Information
          </h2>
          <p className="font-unageo text-accent-60 text-sm">
            Your business name, owner, and category
          </p>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent-20 bg-transparent hover:bg-accent-10 text-primary-100 font-unageo text-sm font-medium transition-colors"
        >
          <Edit2 size={16} />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-10 flex items-center justify-center shrink-0">
            <Building2 size={20} className="text-primary-100" />
          </div>
          <div>
            <p className="font-unageo text-[13px] text-accent-60 mb-0.5">
              Business Name
            </p>
            <p className="font-unageo text-[15px] font-medium text-secondary-000">
              {profile.businessName}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-10 flex items-center justify-center shrink-0">
            <User size={20} className="text-primary-100" />
          </div>
          <div>
            <p className="font-unageo text-[13px] text-accent-60 mb-0.5">
              Owner Name
            </p>
            <p className="font-unageo text-[15px] font-medium text-secondary-000">
              {profile.ownerName}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-10 flex items-center justify-center shrink-0">
            <Tag size={20} className="text-primary-100" />
          </div>
          <div>
            <p className="font-unageo text-[13px] text-accent-60 mb-0.5">
              Category
            </p>
            <p className="font-unageo text-[15px] font-medium text-secondary-000">
              {profile.category}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
