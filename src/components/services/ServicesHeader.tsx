'use client';

import { Plus } from 'lucide-react';

interface ServicesHeaderProps {
  onAddService: () => void;
}

export function ServicesHeader({ onAddService }: ServicesHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-2 flex-wrap gap-4">
      <div>
        <h1 className="font-unbounded text-3xl font-bold text-secondary-000 mb-2 leading-tight">
          Services Management
        </h1>
        <p className="font-unageo text-[17px] text-accent-80">
          Curate and manage your signature service offerings
        </p>
      </div>
      <button
        onClick={onAddService}
        className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary-100 font-unageo text-[15px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:brightness-105 shadow-[0_8px_20px_rgba(197,108,49,0.15)] hover:shadow-[0_12px_24px_rgba(197,108,49,0.25)] cursor-pointer active:scale-95"
      >
        <Plus className="w-5 h-5 stroke-[2.5px]" />
        Add New Service
      </button>
    </div>
  );
}
