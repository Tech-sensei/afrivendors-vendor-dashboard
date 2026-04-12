import { X, AlertTriangle, Trash2, Tag, DollarSign, Clock, Lightbulb } from 'lucide-react';
import { Service } from './ServiceCard';

interface DeleteServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onConfirm: (id: number) => void;
  isDeleting?: boolean;
}

export function DeleteServiceDrawer({ isOpen, onClose, service, onConfirm, isDeleting = false }: DeleteServiceDrawerProps) {
  if (!isOpen || !service) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[#231305]/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 h-full"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:h-[92vh] max-sm:rounded-t-[24px] max-sm:translate-y-0 sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] sm:translate-x-0 overflow-hidden`}>
        
        {/* Header */}
        <div className="px-8 py-6 flex items-start justify-between border-b border-secondary-600/30 flex-shrink-0">
          <div>
            <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
              Delete Service
            </h2>
            <p className="font-unageo text-[15px] text-accent-80">
              Confirm that you want to permanently delete this service
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
          <div className="px-8 py-10 flex flex-col items-center">
            {/* Warning Icon Container */}
            <div className="w-24 h-24 rounded-[32px] bg-red-50 flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-[24px] bg-red-100/50 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-[#A82B2B]" />
              </div>
            </div>

            <h3 className="font-unbounded text-2xl font-bold text-secondary-000 mb-2 text-center">
              Are you sure you want to delete this service?
            </h3>
            
            <p className="font-unageo text-[15px] text-accent-80 mb-8 text-center max-w-[420px] leading-relaxed">
              This action cannot be undone. The service will be permanently removed and will no longer be available for customers to book.
            </p>

            {/* Service Preview Card */}
            <div className="w-full p-6 bg-white border border-secondary-600 rounded-[20px] mb-6">
              <h4 className="font-unbounded text-lg font-bold text-secondary-000 mb-2">
                {service.serviceName}
              </h4>
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-4 h-4 text-[#C56C31]" />
                <span className="font-unageo text-[14px] font-medium text-[#C56C31]">
                  {service.category.name}
                </span>
              </div>
              <div className="h-[1px] w-full bg-secondary-600/30 mb-4" />
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-accent-60" />
                  <span className="font-unbounded text-[15px] font-bold text-secondary-000">
                    ${service.price}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-60" />
                  <span className="font-unageo text-[14px] font-semibold text-accent-80">
                    {service.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Permanent Deletion Alert */}
            <div className="w-full p-5 bg-[#FFF5F5] border border-[#FFD9D9] rounded-[20px] mb-4 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Trash2 className="w-5 h-5 text-[#A82B2B]" />
              </div>
              <div>
                <p className="font-unageo text-[15px] font-bold text-[#A82B2B] mb-1">
                  Permanent Deletion
                </p>
                <p className="font-unageo text-[14px] text-[#A82B2B]/80 leading-snug">
                  This service will be completely removed from your offerings. Customers will no longer be able to view or book this service.
                </p>
              </div>
            </div>

            {/* Alternative Option Alert */}
            <div className="w-full p-5 bg-secondary-700/40 border border-secondary-600/30 rounded-[20px] mb-10 flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Lightbulb className="w-5 h-5 text-accent-40" />
              </div>
              <div>
                <p className="font-unageo text-[15px] font-bold text-secondary-000 mb-1">
                  Alternative Option
                </p>
                <p className="font-unageo text-[14px] text-accent-80 leading-snug">
                  Instead of deleting, you can mark this service as <span className="font-bold">Hidden</span> to keep your records while removing it from public view.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-secondary-800 border-t border-secondary-600 px-8 py-6 flex gap-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 bg-white border border-accent-20 text-secondary-000 font-unageo text-[15px] font-bold rounded-xl transition-all duration-200 hover:bg-secondary-700 hover:border-accent-40 cursor-pointer text-center shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(service.id)}
            disabled={isDeleting}
            className="flex-[1.5] py-4 px-6 bg-[#A82B2B] text-white font-unageo text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 hover:-translate-y-1 shadow-lg shadow-red-900/10 cursor-pointer active:scale-95 disabled:opacity-60"
          >
            <Trash2 className="w-5 h-5" />
            {isDeleting ? 'Deleting…' : 'Yes, Delete Service'}
          </button>
        </div>
      </div>
    </>
  );
}


