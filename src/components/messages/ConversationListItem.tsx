"use client";

import React from 'react';
import { Pin, Circle } from 'lucide-react';

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isOnline: boolean;
  isTyping?: boolean;
}

interface ConversationListItemProps {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

export function ConversationListItem({ conversation, isActive, onClick }: ConversationListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all duration-200 border-l-[3px] 
        ${isActive 
          ? 'bg-primary-300/30 border-primary-100' 
          : 'bg-white border-transparent hover:bg-accent-10/50'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-accent-20 flex items-center justify-center overflow-hidden">
             {/* Placeholder for real avatar, using initials for now if no image */}
             <span className="font-unbounded font-bold text-secondary-000 text-sm">
                {conversation.customerName.split(' ').map(n => n[0]).join('').substring(0, 2)}
             </span>
          </div>
          {conversation.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className={`text-sm font-unbounded truncate pr-2 ${isActive ? 'text-secondary-000 font-bold' : 'text-secondary-000 font-semibold'}`}>
              {conversation.customerName}
            </h4>
            <span className={`text-[11px] font-unageo whitespace-nowrap ${isActive ? 'text-primary-100 font-medium' : 'text-accent-60'}`}>
              {conversation.lastMessageTime}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <p className={`text-xs font-unageo truncate max-w-[180px] ${conversation.unreadCount > 0 ? 'text-secondary-000 font-medium' : 'text-accent-60'}`}>
              {conversation.isTyping ? (
                <span className="text-primary-100 animate-pulse">Typing...</span>
              ) : (
                conversation.lastMessage
              )}
            </p>
            
            <div className="flex items-center gap-1">
               {conversation.isPinned && (
                 <Pin size={12} className="text-accent-40 fill-accent-40" />
               )}
               {conversation.unreadCount > 0 && (
                 <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary-100 text-white text-[10px] font-bold px-1">
                   {conversation.unreadCount}
                 </span>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
