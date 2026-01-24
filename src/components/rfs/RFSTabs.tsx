"use client";

import React from "react";
import { FileText, CheckCircle, Clock, XCircle } from "lucide-react";
import { RFSStatus } from "@/data/rfs";

interface RFSTab {
  id: RFSStatus;
  label: string;
  icon: React.ElementType;
  count: number;
}

interface RFSTabsProps {
  activeTab: RFSStatus;
  setActiveTab: (tab: RFSStatus) => void;
  counts: Record<RFSStatus, number>;
}

export function RFSTabs({ activeTab, setActiveTab, counts }: RFSTabsProps) {
  const tabs: RFSTab[] = [
    { id: 'new', label: 'New Requests', icon: FileText, count: counts.new },
    { id: 'accepted', label: 'Accepted', icon: CheckCircle, count: counts.accepted },
    { id: 'price-pending', label: 'Quote Sent', icon: Clock, count: counts['price-pending'] },
    { id: 'ignored', label: 'Declined', icon: XCircle, count: counts.ignored }
  ];

  return (
    <div className="flex gap-2 mb-10 border-b border-accent-20/60 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 border-b-2 transition-all duration-300 whitespace-nowrap group cursor-pointer ${
              isActive 
                ? "border-primary-100 text-primary-100" 
                : "border-transparent text-accent-100 hover:text-secondary-000"
            }`}
          >
            <Icon size={18} className={isActive ? "text-primary-100" : "text-accent-40 group-hover:text-accent-60"} />
            <span className="font-unageo text-sm font-bold">{tab.label}</span>
            <span className={`flex items-center justify-center min-w-6 h-6 px-2 rounded-full font-unageo text-[10px] font-bold transition-colors ${
              isActive 
                ? "bg-primary-100 text-white shadow-lg shadow-primary-100/20" 
                : "bg-accent-10 text-accent-60 group-hover:bg-accent-20"
            }`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
