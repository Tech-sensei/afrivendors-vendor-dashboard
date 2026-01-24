"use client";

import React, { useState } from 'react';
import { Search, Pin, PinOff, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

// Components
import { ConversationListItem, Conversation } from '@/components/messages/ConversationListItem';
import { ChatDrawer } from '@/components/messages/ChatDrawer';
import { Message } from '@/components/messages/ChatMessage';
import { CustomerInfoDrawer } from '@/components/messages/CustomerInfoDrawer';
import { SetReminderDrawer } from '@/components/messages/SetReminderDrawer';
import { CalendarSyncDrawer } from '@/components/messages/CalendarSyncDrawer';

// Data
import { mockCustomers, mockConversations, mockMessagesData } from '@/data/messages';

export default function VendorMessages() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessagesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'unread' | 'pinned'>('recent');
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCustomerInfoOpen, setIsCustomerInfoOpen] = useState(false);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [isCalendarSyncOpen, setIsCalendarSyncOpen] = useState(false);
  const [selectedMessageForAction, setSelectedMessageForAction] = useState<Message | null>(null);

  const activeCustomer = mockCustomers.find(c => c.id === selectedConversation?.customerId);

  const handleOpenChat = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
    // Mark as read
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversation.id
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'vendor',
      senderName: 'ZuriGlow Beauty Hub',
      content: content,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isVendor: true,
      isRead: false
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
    }));

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: content, lastMessageTime: 'Just now' }
          : conv
      )
    );

    toast.success('Message sent!');
  };

  const handleSendFile = (file: File) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'vendor',
      senderName: 'ZuriGlow Beauty Hub',
      content: 'Sent an attachment',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      isVendor: true,
      isRead: false,
      hasAttachment: true,
      attachmentUrl: URL.createObjectURL(file), // Note: In propd, handle file upload to server
      attachmentName: file.name
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), newMessage]
    }));

    toast.success(`Sent ${file.name}`);
  };

  const handleTogglePin = (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, isPinned: !conv.isPinned }
          : conv
      )
    );
    const conv = conversations.find(c => c.id === conversationId);
    toast.success(`${conv?.isPinned ? 'Unpinned' : 'Pinned'} conversation with ${conv?.customerName}`);
  };

  const handleSetReminder = (messageId: string) => {
    const message = messages[selectedConversation?.id || '']?.find(m => m.id === messageId);
    if (message) {
      setSelectedMessageForAction(message);
      setIsReminderOpen(true);
    }
  };

  const handleSyncCalendar = (messageId: string) => {
    const message = messages[selectedConversation?.id || '']?.find(m => m.id === messageId);
    if (message) {
      setSelectedMessageForAction(message);
      setIsCalendarSyncOpen(true);
    }
  };

  const handleSaveReminder = (reminderDate: string, reminderTime: string, note: string) => {
    if (selectedConversation && selectedMessageForAction) {
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
          msg.id === selectedMessageForAction.id
            ? { ...msg, hasReminder: true, reminderDate: `${reminderDate} at ${reminderTime}` }
            : msg
        )
      }));
      setIsReminderOpen(false);
      setSelectedMessageForAction(null);
      toast.success(`Reminder set for ${reminderDate} at ${reminderTime}`);
    }
  };

  const handleSaveCalendarSync = (eventDate: string, eventTime: string, eventTitle: string, eventNote: string) => {
    if (selectedConversation && selectedMessageForAction) {
      setMessages(prev => ({
        ...prev,
        [selectedConversation.id]: prev[selectedConversation.id].map(msg =>
          msg.id === selectedMessageForAction.id
            ? { ...msg, hasCalendarSync: true, calendarDate: `${eventDate} at ${eventTime}` }
            : msg
        )
      }));
      setIsCalendarSyncOpen(false);
      setSelectedMessageForAction(null);
      toast.success(`"${eventTitle}" added to your calendar!`);
    }
  };

  const filteredConversations = conversations
    .filter(conv => 
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'pinned') {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
      }
      if (sortBy === 'unread') {
        return b.unreadCount - a.unreadCount;
      }
      return 0; // Keep original order (recent first from mock sort)
    });

  return (
    <div className="max-w-[1440px] mx-auto min-h-[calc(100vh-100px)]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-unbounded text-3xl font-black text-secondary-000 tracking-tight mb-2">
          Messages & Inbox
        </h1>
        <p className="font-unageo text-accent-60 text-lg">
          Communicate with your customers
        </p>
      </div>

      {/* Main Layout: List + Filters */}
      <div className="flex flex-col gap-6">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-40" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-accent-20 rounded-xl font-unageo text-sm text-secondary-000 placeholder:text-accent-40 outline-none focus:border-primary-100 focus:ring-4 focus:ring-primary-100/10 transition-all shadow-sm"
            />
          </div>

          {/* Sort tabs */}
          <div className="flex p-1.5 bg-white border border-accent-20 rounded-xl shadow-sm shrink-0 gap-2">
            {(['recent', 'unread', 'pinned'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSortBy(tab)}
                className={`px-6 py-2.5 rounded-[10px] font-unageo text-sm font-bold capitalize transition-all ${
                  sortBy === tab 
                    ? 'bg-primary-100 text-white shadow-sm' 
                    : 'bg-transparent text-accent-60 hover:text-secondary-000 hover:bg-accent-10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm">
          {filteredConversations.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 bg-accent-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-accent-40" />
              </div>
              <h3 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
                No Conversations Found
              </h3>
              <p className="font-unageo text-sm text-accent-60">
                {searchQuery ? 'Try a different search term' : 'No messages yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-accent-10">
              {filteredConversations.map((conversation) => (
                <div key={conversation.id} className="relative group">
                  <ConversationListItem
                    conversation={conversation}
                    isActive={false}
                    onClick={() => handleOpenChat(conversation)}
                  />
                  {/* Pin button (Desktop Hover) */}
                  <button
                    onClick={(e) => handleTogglePin(conversation.id, e)}
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg border transition-all z-10
                      ${conversation.isPinned 
                        ? 'bg-primary-100/10 border-primary-100/20 text-primary-100 opacity-100' 
                        : 'bg-white border-accent-20 text-accent-40 opacity-0 group-hover:opacity-100 hover:text-primary-100 hover:border-primary-100'}
                    `}
                  >
                    {conversation.isPinned ? (
                      <PinOff size={16} />
                    ) : (
                      <Pin size={16} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawers */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedConversation(null);
        }}
        conversation={selectedConversation}
        messages={messages[selectedConversation?.id || ''] || []}
        onSendMessage={handleSendMessage}
        onSendFile={handleSendFile}
        onSetReminder={handleSetReminder}
        onSyncCalendar={handleSyncCalendar}
        onViewCustomerInfo={() => setIsCustomerInfoOpen(true)}
      />

      <CustomerInfoDrawer
        isOpen={isCustomerInfoOpen}
        onClose={() => setIsCustomerInfoOpen(false)}
        customer={activeCustomer || null}
      />

      <SetReminderDrawer
        isOpen={isReminderOpen}
        onClose={() => {
          setIsReminderOpen(false);
          setSelectedMessageForAction(null);
        }}
        messageContent={selectedMessageForAction?.content || ''}
        onSave={handleSaveReminder}
      />

      <CalendarSyncDrawer
        isOpen={isCalendarSyncOpen}
        onClose={() => {
          setIsCalendarSyncOpen(false);
          setSelectedMessageForAction(null);
        }}
        messageContent={selectedMessageForAction?.content || ''}
        onSave={handleSaveCalendarSync}
      />
    </div>
  );
}
