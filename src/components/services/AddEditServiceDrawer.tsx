'use client';

import { useState, useEffect } from 'react';
import { X, FileText, Tag, DollarSign, Clock, AlignLeft, Save, Image as ImageIcon } from 'lucide-react';
import { Service } from './ServiceCard';

interface AddEditServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  onSave: (serviceData: Partial<Service>) => void;
}

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const CATEGORIES = [
  'Massage Therapy',
  'Facial Treatments',
  'Hair Styling',
  'Nails & Manicure',
  'Body Treatments',
  'Wellness & Spa',
  'Makeup Services',
  'Other'
];

export function AddEditServiceDrawer({ isOpen, onClose, service, onSave }: AddEditServiceDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
    description: '',
    imageUrl: '',
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: false,
      sunday: false
    }
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        category: service.category,
        price: service.price,
        duration: service.duration,
        description: service.description,
        imageUrl: service.imageUrl || '',
        availability: { ...service.availability }
      });
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        duration: '',
        description: '',
        imageUrl: '',
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: false,
          sunday: false
        }
      });
    }
  }, [service, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleDay = (day: typeof DAYS_OF_WEEK[number]) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: !prev.availability[day]
      }
    }));
  };

  const isFormValid = formData.name.trim() !== '' && 
                    formData.category !== '' && 
                    formData.price !== '' && 
                    formData.duration.trim() !== '' && 
                    formData.description.trim() !== '';

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[#231305]/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 h-full"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-4 max-sm:right-4 max-sm:h-[92vh] max-sm:rounded-t-[32px] max-sm:translate-y-0 sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] sm:translate-x-0 overflow-hidden`}>
        
        {/* Header */}
        <div className="px-8 py-6 flex items-start justify-between flex-shrink-0">
          <div>
            <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
              {service ? 'Edit Service' : 'Add New Service'}
            </h2>
            <p className="font-unageo text-[15px] text-accent-80">
              {service ? 'Update your service details below' : 'Create a new service for customers to book'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-secondary-000" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-8 pb-8 space-y-7">
            
            {/* Service Name */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                <FileText className="w-4 h-4 text-primary-100" />
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Deep Tissue Massage"
                className="w-full py-3.5 px-4 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5 group"
              />
            </div>

            {/* Category */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                <Tag className="w-4 h-4 text-primary-100" />
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full py-3.5 px-4 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 cursor-pointer outline-none transition-all duration-200 appearance-none bg-no-repeat bg-[right_16px_center] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2212%22%20height%3D%228%22%20viewBox%3D%220%200%2012%208%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1%201.5L6%206.5L11%201.5%22%20stroke%3D%22%232D2D2D%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5"
                >
                  <option value="" className="text-accent-60">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Duration Row */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                  <DollarSign className="w-4 h-4 text-primary-100" />
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-000 font-unageo text-[15px] font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="w-full py-3.5 px-4 pl-8 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5"
                  />
                </div>
              </div>
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                  <Clock className="w-4 h-4 text-primary-100" />
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 60 min"
                  className="w-full py-3.5 px-4 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                <AlignLeft className="w-4 h-4 text-primary-100" />
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your service, what's included, and what makes it special..."
                className="w-full py-4 px-4 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 resize-none focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5"
              />
            </div>

            {/* Image URL Dropdown (Simplified version of what was there) */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                <ImageIcon className="w-4 h-4 text-primary-100" />
                Service Image URL
              </label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Paste an image URL here..."
                className="w-full py-3.5 px-4 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5"
              />
              {formData.imageUrl && (
                <div className="mt-2 w-full h-40 rounded-2xl overflow-hidden bg-secondary-700 relative group">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="space-y-3.5 pt-2">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                <Clock className="w-4 h-4 text-primary-100" />
                Availability
              </label>
              <div className="flex flex-wrap gap-2.5">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`px-4 py-2.5 rounded-xl text-[13px] font-bold font-unageo transition-all duration-200 cursor-pointer ${formData.availability[day] ? 'bg-primary-100 text-white shadow-md shadow-primary-100/20' : 'bg-secondary-700 text-accent-80 border border-secondary-600 hover:border-secondary-100'}`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-secondary-800 border-t border-secondary-600 px-8 py-6 flex gap-4 mt-auto">
            <button
              type="button"
              onClick={onClose}
                className="flex-1 py-4 px-6 bg-white border border-accent-20 text-secondary-000 font-unageo text-[15px] font-bold rounded-xl transition-all duration-200 hover:bg-secondary-700 hover:border-accent-40 cursor-pointer text-center shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`flex-[1.5] py-4 px-6 font-unageo text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${isFormValid ? 'bg-primary-100 text-white hover:brightness-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-100/20 cursor-pointer' : 'bg-secondary-700 text-accent-60 border border-secondary-600 cursor-not-allowed'} group active:translate-y-0 active:scale-95`}
            >
              <Save className="w-5 h-5" />
              {service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}


