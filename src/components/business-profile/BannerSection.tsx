
"use client";

import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

interface BannerSectionProps {
  bannerImage: string;
}

export function BannerSection({ bannerImage }: BannerSectionProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxOpen]);

  return (
    <>
      <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-accent-20">
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
            Banner Image
          </h2>
          <p className="font-unageo text-accent-60 text-sm">
            This appears at the top of your public profile — tap to view full size
          </p>
        </div>

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative block w-full h-[240px] bg-accent-10 cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-100 focus-visible:ring-offset-2"
          aria-label="View banner image full size"
        >
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute top-3 right-3 px-3.5 py-2 rounded-lg bg-black/70 backdrop-blur-md flex items-center gap-1.5 shadow-sm pointer-events-none">
            <ImageIcon size={14} className="text-white" />
            <span className="font-unageo text-[13px] font-medium text-white">
              Current Banner
            </span>
          </div>
        </button>

        <div className="px-6 py-4 bg-accent-10/30 border-t border-accent-20">
          <p className="font-unageo text-[13px] text-accent-60">
            💡 <span className="font-bold">Tip:</span> Click on any image in your gallery below to set it as your banner
          </p>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#231305]/85 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Banner preview"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={bannerImage}
            alt="Banner full size"
            className="max-w-full max-h-[min(92vh,900px)] w-auto h-auto object-contain rounded-lg shadow-2xl pointer-events-none select-none"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
