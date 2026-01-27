
import React from 'react';
import { Camera, Plus, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { BusinessProfile } from '@/data/business-profile';

interface ProfileGalleryProps {
  profile: BusinessProfile;
  onUploadLogo: () => void;
  onUploadGallery: () => void;
  onSetBanner: (url: string) => void;
  onRemoveImage: (index: number) => void;
}

export function ProfileGallery({
  profile,
  onUploadLogo,
  onUploadGallery,
  onSetBanner,
  onRemoveImage
}: ProfileGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Logo Section - Takes up 1 column on medium screens */}
      <div className="bg-white border border-accent-20 rounded-2xl p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
            Business Logo
          </h2>
          <p className="font-unageo text-accent-60 text-sm">
            Upload your business logo
          </p>
        </div>

        <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden border-2 border-accent-20 group">
          <img
            src={profile.logo}
            alt="Business Logo"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <button
            onClick={onUploadLogo}
            className="absolute bottom-2 right-2 w-9 h-9 flex items-center justify-center rounded-full bg-primary-100 text-white shadow-md hover:scale-110 transition-transform cursor-pointer"
          >
            <Camera size={18} />
          </button>
        </div>
      </div>

      {/* Gallery Section - Takes up 2 columns on medium screens */}
      <div className="md:col-span-2 bg-white border border-accent-20 rounded-2xl p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
            Gallery / Portfolio
          </h2>
          <div className="flex items-center justify-between">
            <p className="font-unageo text-accent-60 text-sm">
              Showcase your work ({profile.gallery.length}/8)
            </p>
            <p className="font-unageo text-xs font-medium text-primary-100 hidden sm:block">
              Click any image to set as banner
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {profile.gallery.map((image, index) => {
            const isBanner = image === profile.bannerImage;
            return (
              <div
                key={index}
                onClick={() => onSetBanner(image)}
                className={`
                  relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group
                  ${isBanner ? 'ring-2 ring-primary-100' : 'border border-accent-20 hover:border-primary-100 hover:scale-[1.02]'}
                `}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Banner Badge */}
                {isBanner && (
                  <div className="absolute top-2 left-2 px-2.5 py-1.5 rounded-lg bg-primary-100 shadow-sm flex items-center gap-1">
                    <Check size={12} className="text-white" />
                    <span className="font-unageo text-[10px] font-bold text-white uppercase tracking-wide">
                      Banner
                    </span>
                  </div>
                )}

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(index);
                  }}
                  className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <Trash2 size={14} />
                </button>

                {/* Hover Overlay */}
                {!isBanner && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                    <ImageIcon size={20} />
                    <span className="font-unageo text-[10px] font-bold">Set Banner</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Button */}
          {profile.gallery.length < 8 && (
            <button
              onClick={onUploadGallery}
              className="aspect-square rounded-xl border-2 border-dashed border-accent-20 bg-accent-10/50 hover:border-primary-100 hover:bg-primary-100/5 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer"
            >
              <Plus size={24} className="text-accent-40 group-hover:text-primary-100 transition-colors" />
              <span className="font-unageo text-xs font-medium text-accent-60 group-hover:text-primary-100 transition-colors">
                Add Photo
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
