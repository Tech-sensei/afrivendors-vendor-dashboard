
import React from 'react';
import { Edit2 } from 'lucide-react';

interface DescriptionCardProps {
  description: string;
  onEdit: () => void;
}

export function DescriptionCard({ description, onEdit }: DescriptionCardProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
            Business Description
          </h2>
          <p className="font-unageo text-accent-60 text-sm">
            Tell customers about your business
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
      <p className="font-unageo text-[15px] text-secondary-50 leading-relaxed max-w-4xl">
        {description}
      </p>
    </div>
  );
}
