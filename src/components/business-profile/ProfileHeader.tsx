
import React from 'react';
import { Save } from 'lucide-react';

interface ProfileHeaderProps {
  onSave: () => void;
  isSaving?: boolean;
}

export function ProfileHeader({ onSave, isSaving }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
      <div>
        <h1 className="font-unbounded text-3xl font-bold text-secondary-000 mb-2">
          Business Profile
        </h1>
        <p className="font-unageo text-accent-60 text-lg">
          Manage your public business profile and information
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary-100 text-white hover:bg-primary-200 hover:shadow-lg hover:shadow-primary-100/20 font-unageo text-sm font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
