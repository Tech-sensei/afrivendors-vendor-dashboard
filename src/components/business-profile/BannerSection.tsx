
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface BannerSectionProps {
  bannerImage: string;
}

export function BannerSection({ bannerImage }: BannerSectionProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-6 border-b border-accent-20">
        <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
          Banner Image
        </h2>
        <p className="font-unageo text-accent-60 text-sm">
          This appears at the top of your public profile
        </p>
      </div>
      
      <div className="relative w-full h-[240px] bg-accent-10">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 px-3.5 py-2 rounded-lg bg-black/70 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
          <ImageIcon size={14} className="text-white" />
          <span className="font-unageo text-[13px] font-medium text-white">
            Current Banner
          </span>
        </div>
      </div>

      <div className="px-6 py-4 bg-accent-10/30 border-t border-accent-20">
        <p className="font-unageo text-[13px] text-accent-60">
          💡 <span className="font-bold">Tip:</span> Click on any image in your gallery below to set it as your banner
        </p>
      </div>
    </div>
  );
}
