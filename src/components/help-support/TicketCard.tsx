import React from 'react';
import { Clock, AlertCircle, CheckCircle, Check, Paperclip } from 'lucide-react';
import { SupportTicket, TicketStatus, TicketPriority } from '@/data/help-support';

export function getStatusColor(status: TicketStatus): string {
  switch (status) {
    case 'open':
      return '#3B82F6';
    case 'in-progress':
      return '#F59E0B';
    case 'resolved':
      return '#10B981';
    case 'closed':
      return '#6B7280';
  }
}

export function getStatusIcon(status: TicketStatus) {
  switch (status) {
    case 'open':
      return Clock;
    case 'in-progress':
      return AlertCircle;
    case 'resolved':
      return CheckCircle;
    case 'closed':
      return Check;
  }
}

export function getPriorityColor(priority: TicketPriority): string {
  switch (priority) {
    case 'low':
      return '#10B981';
    case 'medium':
      return '#F59E0B';
    case 'high':
      return '#EF4444';
    case 'urgent':
      return '#DC2626';
  }
}

export function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface TicketCardProps {
  ticket: SupportTicket;
  onClick: () => void;
  onMarkResolved?: () => void;
}

export function TicketCard({ ticket, onClick, onMarkResolved }: TicketCardProps) {
  const StatusIcon = getStatusIcon(ticket.status);
  const statusColor = getStatusColor(ticket.status);
  const priorityColor = getPriorityColor(ticket.priority);

  return (
    <div
      onClick={onClick}
      className="p-5 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-white hover:border-primary-100 transition-all duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3 flex-wrap gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="font-unageo text-xs font-bold text-accent-60 px-2 py-1 rounded-lg bg-white">
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
            <span
              className="px-2.5 py-1 rounded-lg font-unageo text-xs font-bold"
              style={{
                backgroundColor: `${priorityColor}15`,
                color: priorityColor
              }}
            >
              {ticket.priority.toUpperCase()}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white font-unageo text-xs font-medium text-accent-60">
              {ticket.category}
            </span>
          </div>
          <h4 className="font-unbounded text-base font-bold text-secondary-000 mb-2">
            {ticket.subject}
          </h4>
          <p className="font-unageo text-sm text-accent-80 leading-relaxed mb-2 line-clamp-2">
            {ticket.message}
          </p>
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <Paperclip size={14} className="text-accent-60" />
              <span className="font-unageo text-xs text-accent-60">
                {ticket.attachments.length} attachment(s)
              </span>
            </div>
          )}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-unageo text-xs text-accent-60">
              Created: {formatTimestamp(ticket.createdAt)}
            </span>
            <span className="font-unageo text-xs text-accent-60">
              Updated: {formatTimestamp(ticket.updatedAt)}
            </span>
          </div>
        </div>
        {onMarkResolved && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkResolved();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 hover:bg-green-100 border border-green-200 font-unageo text-xs font-bold text-green-700 transition-colors"
          >
            <CheckCircle size={14} />
            Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
}
