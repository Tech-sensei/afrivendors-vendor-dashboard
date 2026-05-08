
import React from 'react';
import { X, Save } from 'lucide-react';
type DrawerType = 'description' | 'gallery' | 'location' | 'hours' | null;

interface EditProfileDrawerProps {
  isOpen: boolean;
  type: DrawerType;
  onClose: () => void;
  onSave: (data: any) => void;
  data: any;
  setData: (data: any) => void;
  isSaving?: boolean;
}

export function EditProfileDrawer({
  isOpen,
  type,
  onClose,
  onSave,
  data,
  setData,
  isSaving = false,
}: EditProfileDrawerProps) {
  const getTitle = () => {
    switch (type) {
      case 'description': return 'Edit Description';
      case 'location': return 'Edit Location';
      case 'hours': return 'Edit Opening Hours';
      default: return 'Edit Profile';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'description': return 'Tell customers about your business';
      case 'location': return 'Update your business address';
      case 'hours': return 'Set your business operating hours';
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
        className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:h-[92vh] max-sm:rounded-t-[24px] sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] overflow-hidden ${
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
                  value={data.streetAddress || ''}
                  onChange={(e) => setData({ ...data, streetAddress: e.target.value })}
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
                  inputMode="text"
                  autoComplete="postal-code"
                  maxLength={6}
                  value={data.zip || ''}
                  onChange={(e) =>
                    setData({
                      ...data,
                      zip: e.target.value.slice(0, 6),
                    })
                  }
                  className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 bg-white focus:border-primary-100 focus:ring-0 outline-none font-unageo text-[15px] transition-all"
                />
                <p className="mt-2 font-unageo text-xs text-accent-60">
                  Maximum 6 characters ({(data.zip || '').length}/6)
                </p>
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

        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-zinc-200 bg-white flex justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-6 py-3.5 rounded-2xl border-2 border-zinc-200 bg-white hover:bg-zinc-50 text-secondary-50 font-unageo text-[15px] font-bold transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary-100 text-white hover:bg-primary-200 hover:shadow-lg hover:shadow-primary-100/20 font-unageo text-[15px] font-bold transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
