"use client";

import React, { useRef, useEffect } from 'react';
import { X, Send, User, Bot, Paperclip } from 'lucide-react';
import { SupportTicket, TicketStatus } from '@/data/help-support';
import { getStatusColor, getStatusIcon, getPriorityColor, formatTimestamp } from './TicketCard';

interface TicketDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  reply: string;
  onReplyChange: (value: string) => void;
  onSendReply: () => void;
  onUpdateStatus: (status: TicketStatus) => void;
}

export function TicketDetailDrawer({
  isOpen,
  onClose,
  ticket,
  reply,
  onReplyChange,
  onSendReply,
  onUpdateStatus
}: TicketDetailDrawerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [ticket?.messages]);

  if (!ticket) return null;

  const StatusIcon = getStatusIcon(ticket.status);
  const statusColor = getStatusColor(ticket.status);
  const priorityColor = getPriorityColor(ticket.priority);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendReply();
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
        <div className="px-8 py-6 flex-shrink-0 border-b border-zinc-200 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-unageo text-xs font-bold text-accent-60 px-2 py-1 rounded-lg bg-zinc-100">
                  {ticket.id}
                </span>
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-unageo text-xs font-bold"
                  style={{
                    backgroundColor: `${statusColor}15`,
                    color: statusColor
                  }}
                >
                  <StatusIcon size={14} />
                  {ticket.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              <h2 className="font-unbounded text-xl font-bold text-secondary-000 mb-1">
                {ticket.subject}
              </h2>
              <p className="font-unageo text-sm text-accent-80">
                {ticket.category} • Priority: <span style={{ color: priorityColor }} className="font-bold">{ticket.priority}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-secondary-700 hover:bg-secondary-600 transition-all duration-200"
            >
              <X className="w-5 h-5 text-secondary-000" />
            </button>
          </div>

          {/* Status Update */}
          {ticket.status !== 'closed' && (
            <div className="flex gap-2 flex-wrap">
              <select
                value={ticket.status}
                onChange={(e) => onUpdateStatus(e.target.value as TicketStatus)}
                className="px-4 py-2 rounded-xl border-2 border-zinc-200 font-unageo text-sm font-medium text-secondary-000 bg-white focus:outline-none focus:border-primary-100 cursor-pointer"
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4 custom-scrollbar bg-zinc-50">
          {/* Attachments */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Paperclip size={16} className="text-accent-60" />
                <span className="font-unageo text-sm font-bold text-secondary-000">
                  Attachments
                </span>
              </div>
              <div className="space-y-2">
                {ticket.attachments.map((file, index) => (
                  <div key={index} className="font-unageo text-sm text-accent-80">
                    {file}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {ticket.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-primary-100'
                    : 'bg-blue-500'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User size={20} className="text-white" />
                ) : (
                  <Bot size={20} className="text-white" />
                )}
              </div>
              <div className={`flex-1 max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div
                  className={`px-5 py-3 rounded-2xl ${
                    msg.sender === 'user'
                      ? 'bg-primary-100 text-white rounded-tr-sm'
                      : 'bg-white border border-zinc-200 text-secondary-000 rounded-tl-sm'
                  }`}
                >
                  <p className="font-unageo text-[15px] leading-relaxed">
                    {msg.message}
                  </p>
                </div>
                <span className="font-unageo text-xs text-accent-60 mt-1 px-1">
                  {formatTimestamp(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input */}
        {ticket.status !== 'closed' && (
          <div className="px-8 py-6 border-t border-zinc-200 bg-white flex-shrink-0">
            <div className="flex gap-3">
              <input
                type="text"
                value={reply}
                onChange={(e) => onReplyChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your reply..."
                className="flex-1 px-5 py-4 rounded-2xl border-2 border-zinc-200 font-unageo text-[15px] text-secondary-000 placeholder:text-accent-40 focus:outline-none focus:border-primary-100 transition-colors"
              />
              <button
                onClick={onSendReply}
                disabled={!reply.trim()}
                className="px-6 py-4 rounded-2xl bg-primary-100 text-white hover:bg-primary-200 hover:shadow-lg hover:shadow-primary-100/20 font-unageo text-[15px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
