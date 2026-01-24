'use client';

import Image from 'next/image';
import { X, Clock, DollarSign, Calendar, Tag, Edit3 } from 'lucide-react';
import { Service } from './ServiceCard';

interface ViewServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onEdit: () => void;
}

export function ViewServiceDrawer({ isOpen, onClose, service, onEdit }: ViewServiceDrawerProps) {
  if (!isOpen || !service) return null;

  const availableDays = Object.entries(service.availability)
    .filter(([, available]) => available)
    .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1));

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[#231305]/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 h-full"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-4 max-sm:right-4 max-sm:h-[92vh] max-sm:rounded-t-[32px] max-sm:translate-y-0 sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] sm:translate-x-0 overflow-hidden`}>
        
        {/* Header */}
        <div className="px-8 py-6 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
              Service Details
            </h2>
            <p className="font-unageo text-[15px] text-accent-80">
              View comprehensive information about this service
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-secondary-000" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-8 pb-8">
            {/* Service Image */}
            {service.imageUrl && (
              <div className="w-full h-[280px] rounded-[24px] overflow-hidden mb-8 relative group">
                <Image
                  src={service.imageUrl}
                  alt={service.name}
                  fill
                  sizes="(max-width: 560px) 100vw, 560px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-xl text-[11px] font-bold font-unageo backdrop-blur-md shadow-lg uppercase tracking-wider ${service.isPublished ? 'bg-[#D1FAE5]/90 text-[#059669]' : 'bg-white/90 text-accent-80'}`}
                  >
                    {service.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </div>
              </div>
            )}

            {/* Service Name & Category */}
            <div className="mb-8">
              <h3 className="font-unbounded text-3xl font-bold text-secondary-000 leading-tight mb-3">
                {service.name}
              </h3>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary-100" />
                <span className="font-unageo text-[15px] font-bold text-primary-100">
                  {service.category}
                </span>
              </div>
            </div>

            {/* Price & Duration Grid (Updated to match reference) */}
            <div className="grid grid-cols-2 gap-5 mb-8">
              <div className="p-5 bg-secondary-700/40 rounded-[20px] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-accent-60">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-unageo text-[13px] font-semibold">Price</span>
                </div>
                <p className="font-unbounded text-2xl font-bold text-primary-100">
                  ${service.price}
                </p>
              </div>
              <div className="p-5 bg-secondary-700/40 rounded-[20px] flex flex-col gap-2">
                <div className="flex items-center gap-2 text-accent-60">
                  <Clock className="w-4 h-4" />
                  <span className="font-unageo text-[13px] font-semibold">Duration</span>
                </div>
                <p className="font-unbounded text-2xl font-bold text-secondary-000">
                  {service.duration}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h4 className="font-unageo text-[15px] font-bold text-secondary-000 mb-4 flex items-center gap-2">
                <X className="w-4 h-4 text-primary-100 rotate-45" /> {/* Document-like icon */}
                Description
              </h4>
              <p className="font-unageo text-[15px] text-accent-80 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Availability */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="w-5 h-5 text-primary-100" />
                <h4 className="font-unageo text-[15px] font-bold text-secondary-000">
                  Availability
                </h4>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const dayLower = day.toLowerCase() as keyof typeof service.availability;
                  const isAvailable = service.availability[dayLower];
                  return (
                    <span
                      key={day}
                      className={`px-4 py-2.5 rounded-xl font-unageo text-[13px] font-bold transition-colors ${isAvailable ? 'bg-primary-100 text-white' : 'bg-secondary-700 text-accent-80'}`}
                    >
                      {day.slice(0, 3)}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-secondary-800 border-t border-secondary-600 px-8 py-6 flex flex-col sm:flex-row gap-4 flex-shrink-0">
          <button
            onClick={onEdit}
            className="flex-1 py-4 px-6 bg-primary-100 text-white font-unageo text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-105 hover:-translate-y-1 shadow-lg shadow-primary-100/20 active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-5 h-5" />
            Edit Service
          </button>
        </div>
      </div>

    </>
  );
}

