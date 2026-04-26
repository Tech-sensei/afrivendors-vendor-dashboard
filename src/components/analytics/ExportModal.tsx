"use client";

import { X, FileText, Image as ImageIcon } from 'lucide-react';
import type { ExportFormat } from '@/data/analytics';

interface ExportModalProps {
  onExport: (format: ExportFormat) => void;
  onClose: () => void;
}

const exportOptions: {
  format: ExportFormat;
  label: string;
  description: string;
  iconColor: string;
  bgColor: string;
  Icon: React.ElementType;
}[] = [
  {
    format: 'csv',
    label: 'Export as CSV',
    description: 'Spreadsheet format for data analysis',
    iconColor: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    Icon: FileText,
  },
  {
    format: 'pdf',
    label: 'Export as PDF',
    description: 'Document format for reports and sharing',
    iconColor: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    Icon: FileText,
  },
  {
    format: 'jpg',
    label: 'Export as JPG',
    description: 'Image format for quick sharing',
    iconColor: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    Icon: ImageIcon,
  },
];

export function ExportModal({ onExport, onClose }: ExportModalProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40"
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[440px] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-accent-20">
          <h3 className="font-unbounded text-xl font-semibold text-secondary-000">
            Export Analytics Report
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-accent-10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-secondary-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="font-unageo text-sm text-accent-60 mb-5">
            Choose a format to export your analytics report
          </p>

          <div className="flex flex-col gap-3">
            {exportOptions.map(({ format, label, description, iconColor, bgColor, Icon }) => (
              <button
                key={format}
                onClick={() => onExport(format)}
                className="flex items-center gap-4 p-4 rounded-xl border border-accent-20 bg-transparent hover:bg-accent-10 hover:border-primary-100 transition-all duration-150 text-left cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: iconColor }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-unageo text-[15px] font-semibold text-secondary-000 mb-0.5">
                    {label}
                  </h4>
                  <p className="font-unageo text-[13px] text-accent-60">{description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
