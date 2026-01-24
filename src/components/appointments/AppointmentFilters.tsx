"use client";

import React, { useState } from "react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { AppointmentStatus, PaymentStatus } from "@/data/appointments";

export interface AppointmentFiltersState {
  search: string;
  category: string;
  status: string;
}

interface AppointmentFiltersProps {
  onFilterChange: (filters: AppointmentFiltersState) => void;
}

export function AppointmentFilters({ onFilterChange }: AppointmentFiltersProps) {
  const [localFilters, setLocalFilters] = useState<AppointmentFiltersState>({
    search: '',
    category: 'all',
    status: 'all'
  });

  const handleChange = (key: keyof AppointmentFiltersState, value: string) => {
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
          placeholder="Search by customer, service or location..."
          value={localFilters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-accent-20/60 rounded-xl font-unageo text-sm focus:outline-none focus:border-primary-100 transition-all shadow-sm placeholder:text-accent-40 text-secondary-000"
        />
      </div>

      {/* Filter Selects */}
      <div className="flex gap-4">
        {/* Category Filter */}
        <div className="relative group min-w-[160px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-40 group-hover:text-[#BC6D39] transition-colors" size={16} />
          <select
            value={localFilters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-accent-20/60 rounded-xl font-unageo text-sm font-bold appearance-none focus:outline-none focus:border-primary-100 cursor-pointer shadow-sm text-secondary-000"
          >
            <option value="all">Categories</option>
            <option value="massage">Massage Therapy</option>
            <option value="hair">Hair Styling</option>
            <option value="facial">Facial Treatments</option>
            <option value="spa">Spa Treatments</option>
            <option value="nails">Nails & Manicure</option>
          </select>
        </div>

        {/* Status/Payment Filter */}
        <div className="relative group min-w-[160px]">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-40 group-hover:text-[#BC6D39] transition-colors" size={16} />
          <select
            value={localFilters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full pl-12 pr-10 py-4 bg-white border border-accent-20/60 rounded-xl font-unageo text-sm font-bold appearance-none focus:outline-none focus:border-primary-100 cursor-pointer shadow-sm text-secondary-000"
          >
            <option value="all">Payment Status</option>
            <option value="Prepaid">Prepaid</option>
            <option value="Pending">Pending Payment</option>
            <option value="Pay-After">Pay After</option>
          </select>
        </div>
      </div>
    </div>
  );
}
