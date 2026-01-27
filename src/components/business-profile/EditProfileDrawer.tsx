
import React from 'react';
import { X, Save, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { BusinessProfile, businessCategories } from '@/data/business-profile';

type DrawerType = 'basic' | 'description' | 'logo' | 'gallery' | 'location' | 'contact' | 'hours' | 'social' | null;

interface EditProfileDrawerProps {
  isOpen: boolean;
  type: DrawerType;
  onClose: () => void;
  onSave: (data: any) => void;
  data: any;
  setData: (data: any) => void;
}

export function EditProfileDrawer({
  isOpen,
  type,
  onClose,
  onSave,
  data,
  setData
}: EditProfileDrawerProps) {
  const getTitle = () => {
    switch (type) {
      case 'basic': return 'Edit Basic Information';
      case 'description': return 'Edit Description';
      case 'location': return 'Edit Location';
      case 'contact': return 'Edit Contact Information';
      case 'hours': return 'Edit Opening Hours';
      case 'social': return 'Edit Social Links';
      default: return 'Edit Profile';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'basic': return 'Update your business name, owner, and category';
      case 'description': return 'Tell customers about your business';
      case 'location': return 'Update your business address';
      case 'contact': return 'Update how customers can reach you';
      case 'hours': return 'Set your business operating hours';
      case 'social': return 'Connect your social media profiles';
      default: return '';
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-[#231305]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-4 max-sm:right-4 max-sm:h-[92vh] max-sm:rounded-t-[32px] sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] overflow-hidden ${
          isOpen 
            ? "max-sm:translate-y-0 sm:translate-x-0" 
            : "max-sm:translate-y-full sm:translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-start justify-between flex-shrink-0 border-b border-zinc-200 mb-3">
          <div>
            <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
              {getTitle()}
            </h2>
            <p className="font-unageo text-[15px] text-accent-80">
              {getSubtitle()}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200 cursor-pointer"
          >
            <X className="w-5 h-5 text-secondary-000" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-7 custom-scrollbar">
          {type === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                  Business Name
                </label>
                <input
                  type="text"
                  value={data.businessName || ''}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                />
              </div>
              <div>
                <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={data.ownerName || ''}
                  onChange={(e) => setData({ ...data, ownerName: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                />
              </div>
              <div>
                <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={data.category || ''}
                    onChange={(e) => setData({ ...data, category: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all appearance-none cursor-pointer"
                  >
                    {businessCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-accent-60">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {type === 'description' && (
            <div>
              <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                Business Description
              </label>
              <textarea
                value={data.description || ''}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                rows={8}
                className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all resize-none leading-relaxed"
                placeholder="Tell customers about your business..."
              />
              <p className="mt-2 font-unageo text-xs text-accent-60 text-right">
                {data.description?.length || 0} characters
              </p>
            </div>
          )}

          {type === 'location' && (
            <div className="space-y-6">
              <div>
                <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                  Street Address
                </label>
                <input
                  type="text"
                  value={data.address || ''}
                  onChange={(e) => setData({ ...data, address: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                    City
                  </label>
                  <input
                    type="text"
                    value={data.city || ''}
                    onChange={(e) => setData({ ...data, city: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                  />
                </div>
                <div>
                  <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                    State
                  </label>
                  <input
                    type="text"
                    value={data.state || ''}
                    onChange={(e) => setData({ ...data, state: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                  Zip Code
                </label>
                <input
                  type="text"
                  value={data.zipCode || ''}
                  onChange={(e) => setData({ ...data, zipCode: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                />
              </div>
            </div>
          )}

          {type === 'contact' && (
            <div className="space-y-6">
              <div>
                <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={data.phone || ''}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                />
              </div>
              <div>
                <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                  Email Address
                </label>
                <input
                  type="email"
                  value={data.email || ''}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                />
              </div>
              <div>
                <label className="block font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                  Website
                </label>
                <input
                  type="text"
                  value={data.website || ''}
                  onChange={(e) => setData({ ...data, website: e.target.value })}
                  placeholder="www.yourbusiness.com"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                />
              </div>
            </div>
          )}

          {type === 'hours' && (
            <div className="space-y-4">
              {daysOfWeek.map((day) => {
                const hours = data.openingHours?.[day] || { isOpen: false, open: '09:00', close: '18:00' };
                return (
                  <div key={day} className="p-5 bg-zinc-50 rounded-2xl border-2 border-zinc-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-unageo text-[15px] font-bold text-secondary-000 capitalize">
                        {day}
                      </span>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hours.isOpen}
                          onChange={(e) => {
                            const newHours = { ...data.openingHours };
                            newHours[day] = { ...hours, isOpen: e.target.checked };
                            setData({ ...data, openingHours: newHours });
                          }}
                          className="w-4 h-4 rounded border-zinc-300 text-primary-100 focus:ring-offset-0 focus:ring-1 focus:ring-primary-100"
                        />
                        <span className="font-unageo text-sm text-secondary-50">Open</span>
                      </label>
                    </div>

                    {hours.isOpen && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-unageo text-xs text-accent-60 mb-1 uppercase tracking-wider">Opens</label>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => {
                              const newHours = { ...data.openingHours };
                              newHours[day] = { ...hours, open: e.target.value };
                              setData({ ...data, openingHours: newHours });
                            }}
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-zinc-200 bg-white text-sm focus:border-primary-100 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block font-unageo text-xs text-accent-60 mb-1 uppercase tracking-wider">Closes</label>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => {
                              const newHours = { ...data.openingHours };
                              newHours[day] = { ...hours, close: e.target.value };
                              setData({ ...data, openingHours: newHours });
                            }}
                            className="w-full px-3 py-2.5 rounded-xl border-2 border-zinc-200 bg-white text-sm focus:border-primary-100 outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {type === 'social' && (
            <div className="space-y-6">
              {[
                { key: 'facebook', icon: Facebook, color: '#1877F2', label: 'Facebook' },
                { key: 'instagram', icon: Instagram, color: '#E1306C', label: 'Instagram' },
                { key: 'twitter', icon: Twitter, color: '#1DA1F2', label: 'Twitter' },
                { key: 'linkedin', icon: Linkedin, color: '#0A66C2', label: 'LinkedIn' }
              ].map(({ key, icon: Icon, color, label }) => (
                <div key={key}>
                  <label className="flex items-center gap-2 font-unageo text-sm font-semibold text-secondary-000 mb-2 uppercase tracking-widest text-zinc-400">
                    <Icon size={18} style={{ color }} />
                    {label}
                  </label>
                  <input
                    type="text"
                    value={data.socialLinks?.[key] || ''}
                    onChange={(e) =>
                      setData({
                        ...data,
                        socialLinks: { ...data.socialLinks, [key]: e.target.value }
                      })
                    }
                    placeholder={`${key}.com/yourbusiness`}
                    className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-zinc-200 bg-white flex justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3.5 rounded-2xl border-2 border-zinc-200 bg-white hover:bg-zinc-50 text-secondary-50 font-unageo text-[15px] font-bold transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary-100 text-white hover:bg-primary-200 hover:shadow-lg hover:shadow-primary-100/20 font-unageo text-[15px] font-bold transition-all"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
