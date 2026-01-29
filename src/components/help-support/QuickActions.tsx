import React from 'react';
import { MessageSquare, AlertTriangle } from 'lucide-react';

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  onClick: () => void;
}

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  iconColor,
  iconBg,
  borderColor,
  onClick
}: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-5 rounded-xl bg-white border-2 border-zinc-200 hover:border-${borderColor} hover:bg-zinc-50 transition-all duration-200 text-left group`}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={28} style={{ color: iconColor }} />
      </div>
      <div className="flex-1">
        <h3 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
          {title}
        </h3>
        <p className="font-unageo text-sm text-accent-60">
          {description}
        </p>
      </div>
    </button>
  );
}

interface QuickActionsProps {
  onNewTicket: () => void;
  onLiveChat: () => void;
  onReportIssue: () => void;
}

export function QuickActions({ onNewTicket, onLiveChat, onReportIssue }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
      <QuickActionCard
        icon={MessageSquare}
        title="Contact Support"
        description="Create a support ticket"
        iconColor="#BC6D39"
        iconBg="rgba(188, 109, 57, 0.1)"
        borderColor="primary-100"
        onClick={onNewTicket}
      />
      <QuickActionCard
        icon={MessageSquare}
        title="Live Chat"
        description="Chat with our team"
        iconColor="#3B82F6"
        iconBg="rgba(59, 130, 246, 0.1)"
        borderColor="blue-500"
        onClick={onLiveChat}
      />
      <QuickActionCard
        icon={AlertTriangle}
        title="Report an Issue"
        description="Report a technical problem"
        iconColor="#EF4444"
        iconBg="rgba(239, 68, 68, 0.1)"
        borderColor="red-500"
        onClick={onReportIssue}
      />
    </div>
  );
}
