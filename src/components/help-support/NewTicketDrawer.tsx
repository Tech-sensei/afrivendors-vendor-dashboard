"use client";

import React, { useRef } from 'react';
import { X, Paperclip, Send, Trash2 } from 'lucide-react';
import { TicketPriority, ticketCategories } from '@/data/help-support';

interface NewTicketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  subject: string;
  message: string;
  priority: TicketPriority;
  category: string;
  attachments: File[];
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onPriorityChange: (value: TicketPriority) => void;
  onCategoryChange: (value: string) => void;
  onFileSelect: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  onSubmit: () => void;
}

export function NewTicketDrawer({
  isOpen,
  onClose,
  subject,
  message,
  priority,
  category,
  attachments,
  onSubjectChange,
  onMessageChange,
  onPriorityChange,
  onCategoryChange,
  onFileSelect,
  onRemoveFile,
  onSubmit
}: NewTicketDrawerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(Array.from(e.target.files));
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-[#231305]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:h-[92vh] max-sm:rounded-t-[24px] sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] overflow-hidden ${
          isOpen
            ? "max-sm:translate-y-0 sm:translate-x-0"
            : "max-sm:translate-y-full sm:translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-8 py-6 flex items-start justify-between flex-shrink-0 border-b border-zinc-200">
          <div>
            <h2 className="font-unbounded text-2xl font-bold text-secondary-000 mb-1">
              Create Support Ticket
            </h2>
            <p className="font-unageo text-[15px] text-accent-80">
              Describe your issue and we'll help you resolve it
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200"
          >
            <X className="w-5 h-5 text-secondary-000" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 custom-scrollbar">
          {/* Subject */}
          <div>
            <label className="block font-unageo text-xs font-bold text-secondary-000 uppercase tracking-widest mb-2">
              Subject *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 font-unageo text-[15px] text-secondary-000 placeholder:text-accent-40 focus:outline-none focus:border-primary-100 transition-colors"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-unageo text-xs font-bold text-secondary-000 uppercase tracking-widest mb-2">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 font-unageo text-[15px] text-secondary-000 focus:outline-none focus:border-primary-100 transition-colors cursor-pointer"
            >
              {ticketCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block font-unageo text-xs font-bold text-secondary-000 uppercase tracking-widest mb-2">
              Priority *
            </label>
            <select
              value={priority}
              onChange={(e) => onPriorityChange(e.target.value as TicketPriority)}
              className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 font-unageo text-[15px] text-secondary-000 focus:outline-none focus:border-primary-100 transition-colors cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block font-unageo text-xs font-bold text-secondary-000 uppercase tracking-widest mb-2">
              Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              placeholder="Provide detailed information about your issue..."
              rows={6}
              className="w-full px-5 py-4 rounded-2xl border-2 border-zinc-200 font-unageo text-[15px] text-secondary-000 placeholder:text-accent-40 focus:outline-none focus:border-primary-100 transition-colors resize-none"
            />
          </div>

          {/* Attachments */}
          <div>
            <label className="block font-unageo text-xs font-bold text-secondary-000 uppercase tracking-widest mb-2">
              Attachments
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-zinc-200 hover:border-primary-100 hover:bg-zinc-50 font-unageo text-sm font-bold text-secondary-000 transition-all"
            >
              <Paperclip size={18} />
              Attach Files
            </button>
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200"
                  >
                    <span className="font-unageo text-sm text-secondary-000 truncate">
                      {file.name}
                    </span>
                    <button
                      onClick={() => onRemoveFile(index)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-zinc-200 bg-white flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-3.5 rounded-2xl border-2 border-zinc-200 bg-white hover:bg-zinc-50 text-secondary-50 font-unageo text-[15px] font-bold transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary-100 text-white hover:bg-primary-200 hover:shadow-lg hover:shadow-primary-100/20 font-unageo text-[15px] font-bold transition-all"
          >
            <Send size={18} />
            Submit Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
