
import React from 'react';
import { Edit2, Phone, Mail, Globe } from 'lucide-react';
import { BusinessProfile } from '@/data/business-profile';

interface ContactCardProps {
  profile: BusinessProfile;
  onEdit: () => void;
}

export function ContactCard({ profile, onEdit }: ContactCardProps) {
  const contacts = [
    { icon: Phone, label: 'Phone Number', value: profile.phone },
    { icon: Mail, label: 'Email Address', value: profile.email },
    { icon: Globe, label: 'Website', value: profile.website }
  ];

  return (
    <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
            Contact Information
          </h2>
          <p className="font-unageo text-accent-60 text-sm">
            How customers can reach you
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {contacts.map((contact, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent-10 flex items-center justify-center shrink-0">
              <contact.icon size={20} className="text-primary-100" />
            </div>
            <div>
              <p className="font-unageo text-[13px] text-accent-60 mb-0.5">
                {contact.label}
              </p>
              <p className="font-unageo text-[15px] font-medium text-secondary-000 truncate">
                {contact.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
