'use client';

import { useState, useEffect, useRef } from 'react';
import { X, FileText, Tag, DollarSign, Clock, AlignLeft, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Service } from './ServiceCard';
import {
  validateServiceImageFile,
  vendorServiceFormSchema,
} from '@/lib/validations/serviceSchemas';
import { zodFieldErrors } from '@/lib/validations/zodHelpers';
import { toast } from 'sonner';

interface AddEditServiceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
  vendorCategory: string;
  onSave: (payload: FormData, serviceId?: number) => Promise<void>;
  isSaving?: boolean;
}

interface FormState {
  serviceName: string;
  price: string;
  duration: string;
  description: string;
  imageFile: File | null;
}

const defaultForm: FormState = {
  serviceName: '',
  price: '',
  duration: '',
  description: '',
  imageFile: null,
};

export function AddEditServiceDrawer({ isOpen, onClose, service, vendorCategory, onSave, isSaving = false }: AddEditServiceDrawerProps) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (service) {
      setForm({
        serviceName: service.serviceName,
        price: service.price,
        duration: service.duration,
        description: service.description,
        imageFile: null,
      });
      setPreviewUrl(service.imageUrl);
    } else {
      setForm(defaultForm);
      setPreviewUrl(null);
    }
  }, [service, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageError = validateServiceImageFile(file);
    if (imageError) {
      toast.error(imageError);
      return;
    }
    setForm((prev) => ({ ...prev, imageFile: file }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = vendorServiceFormSchema.safeParse(form);
    if (!result.success) {
      setErrors(zodFieldErrors(result.error));
      return;
    }
    const imageError = validateServiceImageFile(form.imageFile);
    if (imageError) {
      toast.error(imageError);
      return;
    }
    setErrors({});
    const payload = new FormData();
    payload.append('serviceName', form.serviceName);
    payload.append('price', form.price);
    payload.append('duration', form.duration);
    if (form.description.trim()) {
      payload.append('description', form.description);
    }
    if (form.imageFile) {
      payload.append('image', form.imageFile);
    }
    await onSave(payload, service?.id);
  };

  const isFormValid =
    form.serviceName.trim() !== '' &&
    form.price !== '' &&
    form.duration.trim() !== '';

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-[#231305]/40 backdrop-blur-[2px] z-50 transition-opacity duration-300 h-full"
        onClick={!isSaving ? onClose : undefined}
      />

      {/* Drawer */}
      <div className="fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:h-[92vh] max-sm:rounded-t-[24px] max-sm:translate-y-0 sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] sm:translate-x-0 overflow-hidden">

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
            disabled={isSaving}
            className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5 text-secondary-000" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="px-8 pb-8 space-y-7">

            {/* Category — read-only from profile */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                <Tag className="w-4 h-4 text-primary-100" />
                Category
              </label>
              <div className="w-full py-3.5 px-4 bg-secondary-700/60 border border-secondary-600 rounded-xl font-unageo text-[15px] text-accent-60 flex items-center gap-2">
                <span>{vendorCategory || '—'}</span>
                <span className="ml-auto text-[11px] font-medium text-accent-40 bg-secondary-700 px-2 py-0.5 rounded-md">
                  From profile
                </span>
              </div>
            </div>

            {/* Service Name */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                <FileText className="w-4 h-4 text-primary-100" />
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.serviceName}
                onChange={(e) => setForm((p) => ({ ...p, serviceName: e.target.value }))}
                placeholder="e.g., Proposal Decor Package"
                className="w-full py-3.5 px-4 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5"
              />
            </div>

            {/* Price & Duration Row */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                  <DollarSign className="w-4 h-4 text-primary-100" />
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-000 font-unageo text-[15px] font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
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
                  value={form.duration}
                  onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
                  placeholder="e.g., 5 hours"
                  className="w-full py-3.5 px-4 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                <AlignLeft className="w-4 h-4 text-primary-100" />
                Description
              </label>
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Describe your service, what's included, and what makes it special..."
                className="w-full py-4 px-4 bg-white border border-secondary-600 rounded-xl font-unageo text-[15px] text-secondary-000 placeholder:text-accent-60 outline-none transition-all duration-200 resize-none focus:border-primary-100 focus:ring-4 focus:ring-primary-100/5"
              />
            </div>

            {/* Service Image */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000">
                <ImageIcon className="w-4 h-4 text-primary-100" />
                Service Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-[2/1] border-2 border-dashed border-zinc-200 rounded-3xl bg-secondary-800/50 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary-100 hover:bg-primary-100/5 transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm border border-zinc-100 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-secondary-000" />
                  </div>
                  <div className="text-center">
                    <p className="font-unageo text-base font-bold text-secondary-000">Click to upload</p>
                    <p className="font-unageo text-sm text-accent-60">JPG, PNG or WebP (max 5MB)</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden group">
                  <img
                    src={previewUrl}
                    alt="Service Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 bg-white rounded-xl font-unageo text-sm font-bold text-secondary-000 hover:bg-zinc-100 transition-colors"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((p) => ({ ...p, imageFile: null }));
                        setPreviewUrl(null);
                      }}
                      className="px-5 py-2.5 bg-red-500 rounded-xl font-unageo text-sm font-bold text-white hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              <p className="font-unageo text-[13px] text-accent-80 leading-relaxed">
                Upload a high-quality image that represents your service (JPG, PNG or WebP, max 5MB)
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-secondary-800 border-t border-secondary-600 px-8 py-6 flex gap-4 mt-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 py-4 px-6 bg-white border border-accent-20 text-secondary-000 font-unageo text-[15px] font-bold rounded-xl transition-all duration-200 hover:bg-secondary-700 hover:border-accent-40 cursor-pointer text-center shadow-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSaving}
              className={`flex-[1.5] py-4 px-6 font-unageo text-[15px] font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${isFormValid && !isSaving ? 'bg-primary-100 text-white hover:brightness-105 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-100/20 cursor-pointer' : 'bg-secondary-700 text-accent-60 border border-secondary-600 cursor-not-allowed'} group active:translate-y-0 active:scale-95`}
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSaving ? 'Saving…' : service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
