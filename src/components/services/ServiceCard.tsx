import Image from 'next/image';
import { Clock, DollarSign, Tag, Edit, Trash2, EyeOff, Eye } from 'lucide-react';

export interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  description: string;
  imageUrl?: string;
  isPublished: boolean;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

interface ServiceCardProps {
  service: Service;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onTogglePublish?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function ServiceCard({
  service,
  onView,
  onEdit,
  onTogglePublish,
  onDelete
}: ServiceCardProps) {
  return (
    <div
      onClick={() => onView?.(service.id)}
      className={`p-6 bg-white border border-secondary-600 rounded-[24px] cursor-pointer transition-all duration-300 hover:border-primary-100 hover:shadow-[0_12px_32px_rgba(197,108,49,0.12)] group relative ${service.isPublished ? 'opacity-100' : 'opacity-80'}`}
    >
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Service Image */}
        {service.imageUrl && (
          <div className="w-full sm:w-[160px] h-[160px] rounded-2xl overflow-hidden flex-shrink-0 bg-secondary-700 relative shadow-inner">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {!service.isPublished && (
              <div className="absolute inset-0 bg-secondary-000/40 backdrop-blur-[1px] flex items-center justify-center">
                <span className="bg-white/90 px-3 py-1.5 rounded-lg text-secondary-000 text-[11px] font-bold uppercase tracking-wider shadow-lg">
                  Hidden
                </span>
              </div>
            )}
          </div>
        )}

        {/* Service Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Tag className="w-3.5 h-3.5 text-primary-100" />
                  <span className="font-unageo text-xs font-bold text-primary-100 uppercase tracking-widest">
                    {service.category}
                  </span>
                </div>
                <h3 className="font-unbounded text-xl font-bold text-secondary-000 mb-2 group-hover:text-primary-100 transition-colors">
                  {service.name}
                </h3>
              </div>

              {/* Status Badge - Hidden on Desktop, shown on image */}
              <div className="hidden sm:block">
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider flex-shrink-0 ml-3 font-unageo ${service.isPublished ? 'bg-[#D1FAE5] text-[#059669]' : 'bg-secondary-700 text-accent-80'}`}
                >
                  {service.isPublished ? 'Published' : 'Hidden'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="font-unageo text-[15px] text-accent-80 mb-4 line-clamp-2 leading-relaxed max-w-[600px]">
              {service.description}
            </p>

            {/* Meta Info */}
            <div className="flex items-center gap-5 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary-700/50 rounded-lg border border-secondary-600">
                <DollarSign className="w-4 h-4 text-secondary-000" />
                <span className="font-unbounded text-base font-bold text-secondary-000">
                  {service.price}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent-60" />
                <span className="font-unageo text-[13px] font-bold text-accent-80">
                  {service.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div
            className="flex gap-2.5 flex-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit?.(service.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-100 text-white text-[13px] font-bold font-unageo shadow-lg shadow-primary-100/10 transition-all duration-200 hover:brightness-105 hover:-translate-y-0.5 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </button>

            <button
              onClick={() => onTogglePublish?.(service.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-secondary-600 text-secondary-000 text-[13px] font-bold font-unageo transition-all duration-200 hover:bg-secondary-700 hover:border-secondary-100 cursor-pointer"
            >
              {service.isPublished ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  Hide Service
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  Publish
                </>
              )}
            </button>

            <button
              onClick={() => onDelete?.(service.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-secondary-600 text-destructive text-[13px] font-bold font-unageo transition-all duration-200 hover:bg-red-50 hover:border-red-200 cursor-pointer ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
