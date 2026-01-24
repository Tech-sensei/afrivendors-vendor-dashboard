import React from "react";
import { X, AlertTriangle, Info, Calendar, Clock, DollarSign, XCircle, Tag } from "lucide-react";
import { RFSRequest } from "@/data/rfs";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "@/hooks/useMobile";

interface DeclineRFSDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: RFSRequest | null;
  onConfirm: (requestId: string) => void;
}

export function DeclineRFSDrawer({ 
  isOpen, 
  onClose, 
  request, 
  onConfirm 
}: DeclineRFSDrawerProps) {
  const isMobile = useMobile();
  if (!request) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#231305]/40 backdrop-blur-[2px] z-[999]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={isMobile ? { y: '100%' } : { x: '100%' }}
            animate={isMobile ? { y: 0 } : { x: 0 }}
            exit={isMobile ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed ${isMobile ? 'bottom-0 left-4 right-4 h-[90vh] max-h-[90vh] rounded-t-3xl' : 'top-0 right-0 bottom-0 w-[90%] max-w-[500px] rounded-l-2xl'} bg-white shadow-2xl z-[1000] flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="p-6 border-b border-accent-10/50 bg-white flex items-start justify-between">
              <div>
                <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
                  Decline Request
                </h2>
                <p className="font-unageo text-sm text-accent-60">
                  Confirm that you want to decline this service request
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-accent-10 hover:bg-accent-20 rounded-xl transition-all active:scale-90"
              >
                <X size={20} className="text-secondary-000" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center text-center">
              <div className="p-4 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
                <AlertTriangle size={28} className="text-red-500" />
              </div>

              <h3 className="font-unbounded text-xl font-bold text-secondary-000 mb-2 max-w-[300px]">
                Are you sure you want to decline this request?
              </h3>
              <p className="font-unageo text-sm text-accent-60 leading-relaxed mb-8 max-w-[320px]">
                This action cannot be undone. The customer will be notified that you've declined their service request.
              </p>

              {/* Request Summary Card */}
              <div className="w-full p-6 bg-accent-10/30 rounded-2xl border border-accent-10/50 text-left mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#BC6D39] flex items-center justify-center shrink-0">
                    <span className="font-unbounded text-sm font-bold text-white uppercase italic">
                      {request.customerInitials}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-unbounded text-sm font-bold text-secondary-000 truncate">
                      {request.customerName}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[#BC6D39] mt-0.5">
                      <Tag size={12} className="fill-current/10" />
                      <span className="font-unageo text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                        {request.serviceCategory}
                      </span>
                    </div>
                  </div>
                </div>
                
                <h5 className="font-unbounded text-sm font-bold text-secondary-000 mb-4 truncate">
                  {request.serviceTitle}
                </h5>

                <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-accent-10/50">
                  <div className="flex items-center gap-2 text-accent-60">
                    <Calendar size={14} className="text-accent-40" />
                    <span className="font-unageo text-[11px] font-medium">{request.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-accent-60">
                    <Clock size={14} className="text-accent-40" />
                    <span className="font-unageo text-[11px] font-medium">{request.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-accent-60 col-span-2">
                    <DollarSign size={14} className="text-accent-40" />
                    <span className="font-unageo text-[11px] font-bold text-secondary-000">Budget: {request.budget}</span>
                  </div>
                </div>
              </div>

              {/* Impact Alert */}
              <div className="w-full p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3 text-left">
                <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h6 className="font-unbounded text-[10px] font-bold text-red-800 uppercase tracking-widest mb-1">
                    Impact on Customer
                  </h6>
                  <p className="font-unageo text-[11px] text-red-700/80 leading-relaxed font-medium">
                    {request.customerName} will receive a notification that you're unable to fulfill this request. They can then explore other vendors.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-accent-10/50 bg-secondary-800 grid grid-cols-2 gap-3">
              <button 
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-4 bg-white border border-accent-20 hover:bg-accent-10 text-secondary-000 rounded-xl font-unbounded text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-sm"
              >
                Go Back
              </button>
              <button 
                onClick={() => onConfirm(request.id)}
                className="flex items-center justify-center gap-2 py-4 bg-[#913131] hover:bg-[#7a2828] text-white rounded-xl font-unbounded text-[10px] font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
              >
                <XCircle size={15} />
                Yes, Decline Request
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
