'use client';

import { Search, SlidersHorizontal, Eye, EyeOff, ChevronDown, LayoutGrid, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type FilterType = 'all' | 'published' | 'hidden';

interface ServicesFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: FilterType;
  setStatusFilter: (filter: FilterType) => void;
  totalCount: number;
  publishedCount: number;
  hiddenCount: number;
}

export function ServicesFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  totalCount,
  publishedCount,
  hiddenCount
}: ServicesFilterProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filterOptions = [
    { value: 'all' as FilterType, label: 'All Services', count: totalCount, icon: LayoutGrid },
    { value: 'published' as FilterType, label: 'Published', count: publishedCount, icon: Eye },
    { value: 'hidden' as FilterType, label: 'Hidden', count: hiddenCount, icon: EyeOff },
  ];

  const currentFilter = filterOptions.find(option => option.value === statusFilter);
  const CurrentIcon = currentFilter?.icon;

  return (
    <div className="mb-6">
      <div className="flex gap-3 items-center">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-accent-60" />
          <input
            type="text"
            placeholder="Search services by name, category, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-4 pl-11 pr-11 bg-white border border-secondary-600 rounded-xl
              font-unageo text-sm text-secondary-000 placeholder:text-accent-60
              outline-none transition-all duration-150
              focus:border-primary-100 focus:ring-[3px] focus:ring-primary-100/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full
                text-accent-60 hover:text-secondary-000 hover:bg-secondary-700
                transition-all duration-150 cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-secondary-600 
              rounded-xl font-unageo text-sm text-secondary-000 whitespace-nowrap
              transition-all duration-150 hover:border-primary-100 cursor-pointer
              focus:border-primary-100 focus:ring-[3px] focus:ring-primary-100/10 outline-none"
          >
            <SlidersHorizontal className="w-[18px] h-[18px] text-accent-60" />
            {CurrentIcon && <CurrentIcon className="w-4 h-4 text-accent-100" />}
            <span className="font-medium">
              {currentFilter?.label} ({currentFilter?.count})
            </span>
            <ChevronDown 
              className={`w-4 h-4 text-accent-60 transition-transform duration-200 
                ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-secondary-600 
              rounded-xl shadow-lg z-10 overflow-hidden">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left
                      font-unageo text-sm transition-all duration-150 cursor-pointer
                      ${statusFilter === option.value 
                        ? 'bg-primary-100/5 text-primary-100 font-semibold' 
                        : 'text-secondary-000 hover:bg-secondary-700'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="flex-1">{option.label}</span>
                    <span className="text-accent-60 text-xs">({option.count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}