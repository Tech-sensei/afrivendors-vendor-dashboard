"use client";

import React, { useState } from 'react';
import { Camera, Plus, Trash2, Check, Image as ImageIcon, X, Loader2 } from 'lucide-react';

export interface GalleryItem {
  id: number;
  imageUrl: string;
  isBanner: boolean;
}

interface ConfirmState {
  type: 'set-banner' | 'delete';
  item: GalleryItem;
}

interface ProfileGalleryProps {
  items: GalleryItem[];
  onUpload: () => void;
  onSetBanner: (id: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  isUploading?: boolean;
}

export function ProfileGallery({
  items,
  onUpload,
  onSetBanner,
  onRemove,
  isUploading = false,
}: ProfileGalleryProps) {
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [isActioning, setIsActioning] = useState(false);

  const handleConfirm = async () => {
    if (!confirm) return;
    setIsActioning(true);
    try {
      if (confirm.type === 'set-banner') {
        await onSetBanner(confirm.item.id);
      } else {
        await onRemove(confirm.item.id);
      }
    } finally {
      setIsActioning(false);
      setConfirm(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white border border-accent-20 rounded-2xl p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
              Gallery / Portfolio
            </h2>
            <div className="flex items-center justify-between">
              <p className="font-unageo text-accent-60 text-sm">
                Showcase your work ({items.length}/8)
              </p>
              <p className="font-unageo text-xs font-medium text-primary-100 hidden sm:block">
                Click any image to set as banner
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.isBanner) setConfirm({ type: 'set-banner', item });
                }}
                className={`
                  relative aspect-square rounded-xl overflow-hidden transition-all duration-200 group
                  ${item.isBanner
                    ? 'ring-2 ring-primary-100 cursor-default'
                    : 'border border-accent-20 hover:border-primary-100 hover:scale-[1.02] cursor-pointer'}
                `}
              >
                <img
                  src={item.imageUrl}
                  alt={`Gallery ${item.id}`}
                  className="w-full h-full object-cover"
                />

                {/* Banner Badge */}
                {item.isBanner && (
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
                    setConfirm({ type: 'delete', item });
                  }}
                  className="absolute top-1.5 right-1.5 w-7 h-7 flex items-center justify-center rounded-full bg-black/60 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <Trash2 size={14} />
                </button>

                {/* Hover Overlay */}
                {!item.isBanner && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                    <ImageIcon size={20} />
                    <span className="font-unageo text-[10px] font-bold">Set Banner</span>
                  </div>
                )}
              </div>
            ))}

            {/* Add Button */}
            {items.length < 8 && (
              <button
                onClick={onUpload}
                disabled={isUploading}
                className="aspect-square rounded-xl border-2 border-dashed border-accent-20 bg-accent-10/50 hover:border-primary-100 hover:bg-primary-100/5 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2 size={24} className="text-primary-100 animate-spin" />
                ) : (
                  <Plus size={24} className="text-accent-40 group-hover:text-primary-100 transition-colors" />
                )}
                <span className="font-unageo text-xs font-medium text-accent-60 group-hover:text-primary-100 transition-colors">
                  {isUploading ? 'Uploading…' : 'Add Photo'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => !isActioning && setConfirm(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-5">
            {/* Close */}
            <button
              onClick={() => !isActioning && setConfirm(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent-10 transition-colors"
            >
              <X size={18} className="text-accent-60" />
            </button>

            {/* Preview */}
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-accent-10">
              <img
                src={confirm.item.imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            {confirm.type === 'set-banner' ? (
              <>
                <div>
                  <h3 className="font-unbounded text-base font-bold text-secondary-000 mb-1">
                    Set as banner image?
                  </h3>
                  <p className="font-unageo text-sm text-accent-60">
                    This image will be displayed as your business banner across the platform.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirm(null)}
                    disabled={isActioning}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-accent-20 font-unageo text-sm font-medium text-accent-60 hover:bg-accent-10 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isActioning}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary-100 font-unageo text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isActioning && <Loader2 size={14} className="animate-spin" />}
                    Set as Banner
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h3 className="font-unbounded text-base font-bold text-secondary-000 mb-1">
                    Delete this image?
                  </h3>
                  <p className="font-unageo text-sm text-accent-60">
                    This will permanently remove the image from your gallery. This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirm(null)}
                    disabled={isActioning}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-accent-20 font-unageo text-sm font-medium text-accent-60 hover:bg-accent-10 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={isActioning}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 font-unageo text-sm font-bold text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isActioning && <Loader2 size={14} className="animate-spin" />}
                    Delete Image
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
