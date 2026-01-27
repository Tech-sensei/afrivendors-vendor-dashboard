
import React from 'react';
import { Edit2 } from 'lucide-react';
import { BusinessProfile } from '@/data/business-profile';

interface HoursCardProps {
  openingHours: BusinessProfile['openingHours'];
  onEdit: () => void;
}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export function HoursCard({ openingHours, onEdit }: HoursCardProps) {
  return (
    <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
            Opening Hours
          </h2>
          <p className="font-unageo text-accent-60 text-sm">
            Your business operating hours
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

      <div className="space-y-2">
        {daysOfWeek.map((day) => {
          const hours = openingHours[day];
          return (
            <div
              key={day}
              className={`
                flex justify-between items-center p-3 rounded-xl border
                ${hours.isOpen 
                  ? 'bg-white border-transparent' 
                  : 'bg-accent-10/30 border-accent-10'
                }
              `}
            >
              <span className="font-unageo text-[14px] font-medium text-secondary-000 capitalize min-w-[100px]">
                {day}
              </span>
              <span
                className={`
                  font-unageo text-[14px]
                  ${hours.isOpen ? 'text-secondary-50' : 'text-accent-60'}
                `}
              >
                {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
