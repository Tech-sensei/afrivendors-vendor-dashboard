
import React from 'react';
import { Edit2, MapPin } from 'lucide-react';
import { BusinessProfile } from '@/data/business-profile';

interface LocationCardProps {
  profile: BusinessProfile;
  onEdit: () => void;
}

export function LocationCard({ profile, onEdit }: LocationCardProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
            Location & Address
          </h2>
          <p className="font-unageo text-accent-60 text-sm">
            Your business location
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

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-accent-10 flex items-center justify-center shrink-0">
          <MapPin size={20} className="text-primary-100" />
        </div>
        <div>
          <p className="font-unageo text-[15px] font-medium text-secondary-000 mb-0.5">
            {profile.address}
          </p>
          <p className="font-unageo text-[13px] text-accent-60">
            {profile.city}, {profile.state} {profile.zipCode}
          </p>
        </div>
      </div>
    </div>
  );
}
