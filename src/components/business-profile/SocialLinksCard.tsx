
import React from 'react';
import { Edit2, Facebook, Instagram, Twitter, Linkedin, ExternalLink } from 'lucide-react';
import { BusinessProfile } from '@/data/business-profile';

interface SocialLinksCardProps {
  socialLinks: BusinessProfile['socialLinks'];
  onEdit: () => void;
}

export function SocialLinksCard({ socialLinks, onEdit }: SocialLinksCardProps) {
  const getSocialIcon = (network: string) => {
    switch (network) {
      case 'facebook': return { icon: Facebook, color: '#1877F2', label: 'Facebook' };
      case 'instagram': return { icon: Instagram, color: '#E1306C', label: 'Instagram' };
      case 'twitter': return { icon: Twitter, color: '#1DA1F2', label: 'Twitter' };
      case 'linkedin': return { icon: Linkedin, color: '#0A66C2', label: 'LinkedIn' };
      default: return { icon: ExternalLink, color: '#666', label: network };
    }
  };

  const activeLinks = Object.entries(socialLinks).filter(([_, url]) => url);

  return (
    <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
            Social Media Links
          </h2>
          <p className="font-unageo text-accent-60 text-sm">
            Connect your social media profiles
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

      {activeLinks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeLinks.map(([network, url]) => {
            const { icon: Icon, color, label } = getSocialIcon(network);
            const fullUrl = url?.startsWith('http') ? url : `https://${url}`;
            
            return (
              <a
                key={network}
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-accent-10/50 hover:bg-accent-10 border border-transparent hover:border-accent-20 transition-all group no-underline"
              >
                <Icon size={20} style={{ color }} />
                <span className="font-unageo text-[14px] font-medium text-secondary-000 flex-1 truncate">
                  {label}
                </span>
                <ExternalLink size={14} className="text-accent-40 group-hover:text-primary-100 transition-colors" />
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-accent-10/30 rounded-xl border border-dashed border-accent-20">
          <p className="font-unageo text-sm text-accent-60">
            No social media links added yet. Click edit to add.
          </p>
        </div>
      )}
    </div>
  );
}
