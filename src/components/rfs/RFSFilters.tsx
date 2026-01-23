"use client";

import React from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

export interface RFSFiltersState {
  search: string;
  category: string;
  budgetRange: string;
}

interface RFSFiltersProps {
  onFilterChange: (filters: RFSFiltersState) => void;
}

export function RFSFilters({ onFilterChange }: RFSFiltersProps) {
  const [localFilters, setLocalFilters] = React.useState<RFSFiltersState>({
    search: '',
    category: 'all',
    budgetRange: 'all'
  });

  const handleChange = (key: keyof RFSFiltersState, value: string) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-40" size={18} />
        <input
          type="text"
          placeholder="Search requests by name or service..."
          value={localFilters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-accent-20/60 rounded-xl font-unageo text-sm focus:outline-none focus:border-primary-100 transition-all shadow-sm"
        />
      </div>

      {/* Filter Selects */}
      <div className="flex gap-4">
        <div className="relative group min-w-[160px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-40 group-hover:text-[#BC6D39] transition-colors" size={16} />
          <select
            value={localFilters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-accent-20/60 rounded-xl font-unageo text-sm font-bold appearance-none focus:outline-none focus:border-primary-100 cursor-pointer shadow-sm text-secondary-000"
          >
            <option value="all">Categories</option>
            <option value="massage">Massage</option>
            <option value="hair">Hair Styling</option>
            <option value="facial">Facial</option>
            <option value="spa">Spa</option>
          </select>
        </div>

        <div className="relative group min-w-[160px]">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-40 group-hover:text-[#BC6D39] transition-colors" size={16} />
          <select
            value={localFilters.budgetRange}
            onChange={(e) => handleChange('budgetRange', e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-accent-20/60 rounded-xl font-unageo text-sm font-bold appearance-none focus:outline-none focus:border-primary-100 cursor-pointer shadow-sm text-secondary-000"
          >
            <option value="all">Budget</option>
            <option value="0-50">$0 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">$100 - $200</option>
            <option value="200+">$200+</option>
          </select>
        </div>
      </div>
    </div>
  );
}
