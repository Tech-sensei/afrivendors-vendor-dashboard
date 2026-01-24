"use client";

import React from "react";
import { Calendar, Clock, CheckCircle, XCircle } from "lucide-react";

export type AppointmentTabType = 'upcoming' | 'pending' | 'past' | 'cancelled';

interface AppointmentTabsProps {
  activeTab: AppointmentTabType;
  setActiveTab: (tab: AppointmentTabType) => void;
  counts: Record<AppointmentTabType, number>;
}

export function AppointmentTabs({ activeTab, setActiveTab, counts }: AppointmentTabsProps) {
  const tabs = [
    { id: 'upcoming' as AppointmentTabType, label: 'Upcoming', icon: Calendar },
    { id: 'pending' as AppointmentTabType, label: 'Pending Approval', icon: Clock },
    { id: 'past' as AppointmentTabType, label: 'Past', icon: CheckCircle },
    { id: 'cancelled' as AppointmentTabType, label: 'Cancelled', icon: XCircle }
  ];

  return (
    <div className="flex gap-2 mb-8 border-b border-accent-20/60 overflow-x-auto pb-0 no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const count = counts[tab.id] || 0;

        return (
          // <button
          //   key={tab.id}
          //   onClick={() => setActiveTab(tab.id)}
          //   className={`
          //     flex items-center gap-2 px-5 py-3 border-b-2 transition-all whitespace-nowrap
          //     ${isActive 
          //       ? 'border-primary-100 text-primary-100' 
          //       : 'border-transparent text-accent-60 hover:text-secondary-000'
          //     }
          //   `}
          // >
          //   <Icon size={18} />
          //   <span className={`font-unageo text-[15px] text-accent-100  ${isActive ? 'font-bold' : 'font-medium'}`}>
          //     {tab.label}
          //   </span>
          //   <span className={`
          //     inline-flex items-center justify-center h-6 min-w-6 px-2 rounded-full text-xs font-bold font-unageo ml-1
          //     ${isActive 
          //       ? 'bg-primary-100 text-white' 
          //       : 'bg-accent-10 text-accent-80'
          //     }
          //   `}>
          //     {count}
          //   </span>
          // </button>

          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all duration-300 whitespace-nowrap group cursor-pointer ${isActive
              ? "border-primary-100 text-primary-100"
              : "border-transparent text-accent-100 hover:text-secondary-000"
              }`}
          >
            <Icon size={18} className={isActive ? "text-primary-100" : "text-accent-40 group-hover:text-accent-60"} />
            <span className="font-unageo text-sm font-bold">{tab.label}</span>
            <span className={`flex items-center justify-center min-w-6 h-6 px-2 rounded-full font-unageo text-[10px] font-bold transition-colors ${isActive
              ? "bg-primary-100 text-white shadow-lg shadow-primary-100/20"
              : "bg-accent-10 text-accent-60 group-hover:bg-accent-20"
              }`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
