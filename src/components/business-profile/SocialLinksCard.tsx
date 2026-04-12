
import React from 'react';
import { Edit2, ExternalLink } from 'lucide-react';
import { BusinessProfile } from '@/data/business-profile';

interface SocialLinksCardProps {
  socialLinks: BusinessProfile['socialLinks'];
  onEdit: () => void;
}

// Simple inline SVG social icons to avoid lucide-react version incompatibility
const SocialIcons: Record<string, React.FC<{ size?: number }>> = {
  facebook: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
  ),
  instagram: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
  ),
  twitter: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#1DA1F2"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
  ),
  linkedin: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
  ),
};

export function SocialLinksCard({ socialLinks, onEdit }: SocialLinksCardProps) {
  const getSocialIcon = (network: string) => {
    const IconComp = SocialIcons[network];
    return {
      IconComp: IconComp ?? null,
      label: network.charAt(0).toUpperCase() + network.slice(1),
    };
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
            const { IconComp, label } = getSocialIcon(network);
            const fullUrl = url?.startsWith('http') ? url : `https://${url}`;
            return (
              <a
                key={network}
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-accent-10/50 hover:bg-accent-10 border border-transparent hover:border-accent-20 transition-all group no-underline"
              >
                {IconComp ? <IconComp size={20} /> : <ExternalLink size={20} className="text-accent-60" />}
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
