"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import {
  SupportTicket,
  ChatMessage,
  TicketStatus,
  TicketPriority,
  faqs,
  sampleTickets,
  sampleChatMessages
} from '@/data/help-support';
import { QuickActions } from '@/components/help-support/QuickActions';
import { FAQSection } from '@/components/help-support/FAQSection';
import { TicketsList } from '@/components/help-support/TicketsList';
import { NewTicketDrawer } from '@/components/help-support/NewTicketDrawer';
import { LiveChatDrawer } from '@/components/help-support/LiveChatDrawer';
import { TicketDetailDrawer } from '@/components/help-support/TicketDetailDrawer';

type DrawerType = 'new-ticket' | 'chat' | 'ticket-detail' | null;

export default function HelpSupportPage() {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>(sampleTickets);
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketReply, setTicketReply] = useState('');

  // New Ticket Form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    message: '',
    priority: 'medium' as TicketPriority,
    category: 'General',
    attachments: [] as File[]
  });

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(sampleChatMessages);
  const [chatInput, setChatInput] = useState('');

  const closeDrawer = () => {
    setActiveDrawer(null);
    setNewTicket({
      subject: '',
      message: '',
      priority: 'medium',
      category: 'General',
      attachments: []
    });
    setSelectedTicket(null);
    setTicketReply('');
  };

  const handleOpenTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setActiveDrawer('ticket-detail');
  };

  const handleSendTicketReply = () => {
    if (!ticketReply.trim() || !selectedTicket) return;

    const newMessage = {
      id: String((selectedTicket.messages?.length || 0) + 1),
      sender: 'user' as const,
      message: ticketReply,
      timestamp: new Date().toISOString(),
      senderName: 'You'
    };

    setTickets(
      tickets.map(t =>
        t.id === selectedTicket.id
          ? {
              ...t,
              messages: [...(t.messages || []), newMessage],
              updatedAt: new Date().toISOString()
            }
          : t
      )
    );

    setSelectedTicket({
      ...selectedTicket,
      messages: [...(selectedTicket.messages || []), newMessage],
      updatedAt: new Date().toISOString()
    });

    setTicketReply('');
    toast.success('Reply sent successfully!');

    // Simulate support response
    setTimeout(() => {
      const supportResponse = {
        id: String((selectedTicket.messages?.length || 0) + 2),
        sender: 'support' as const,
        message: 'Thank you for your response! Our team is reviewing your message and will get back to you shortly.',
        timestamp: new Date().toISOString(),
        senderName: 'Support Team'
      };

      setTickets(prevTickets =>
        prevTickets.map(t =>
          t.id === selectedTicket.id
            ? {
                ...t,
                messages: [...(t.messages || []), newMessage, supportResponse],
                status: 'in-progress' as TicketStatus,
                updatedAt: new Date().toISOString()
              }
            : t
        )
      );

      if (selectedTicket) {
        setSelectedTicket({
          ...selectedTicket,
          messages: [...(selectedTicket.messages || []), newMessage, supportResponse],
          status: 'in-progress',
          updatedAt: new Date().toISOString()
        });
      }
    }, 2000);
  };

  const handleUpdateTicketStatus = (ticketId: string, newStatus: TicketStatus) => {
    setTickets(
      tickets.map(t =>
        t.id === ticketId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t
      )
    );

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket({
        ...selectedTicket,
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
    }

    toast.success(`Ticket status updated to ${newStatus.replace('-', ' ')}`);
  };

  const handleFileSelect = (files: File[]) => {
    setNewTicket({ ...newTicket, attachments: [...newTicket.attachments, ...files] });
    toast.success(`${files.length} file(s) attached`);
  };

  const handleRemoveFile = (index: number) => {
    setNewTicket({
      ...newTicket,
      attachments: newTicket.attachments.filter((_, i) => i !== index)
    });
    toast.success('File removed');
  };

  const handleSubmitTicket = () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const ticket: SupportTicket = {
      id: `TICK-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      message: newTicket.message,
      status: 'open',
      priority: newTicket.priority,
      category: newTicket.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: newTicket.attachments.map(f => f.name),
      messages: [
        {
          id: '1',
          sender: 'user',
          message: newTicket.message,
          timestamp: new Date().toISOString(),
          senderName: 'You'
        }
      ]
    };

    setTickets([ticket, ...tickets]);
    toast.success('Support ticket created successfully!');
    closeDrawer();
  };

  const handleMarkResolved = (ticketId: string) => {
    setTickets(
      tickets.map(t =>
        t.id === ticketId ? { ...t, status: 'resolved', updatedAt: new Date().toISOString() } : t
      )
    );
    toast.success('Ticket marked as resolved');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: ChatMessage = {
      id: String(chatMessages.length + 1),
      sender: 'user',
      message: chatInput,
      timestamp: new Date().toISOString(),
      senderName: 'You'
    };

    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');

    // Simulate support response
    setTimeout(() => {
      const supportResponse: ChatMessage = {
        id: String(chatMessages.length + 2),
        sender: 'support',
        message: 'Thank you for your message! Our team is reviewing your inquiry and will respond shortly.',
        timestamp: new Date().toISOString(),
        senderName: 'Support Team'
      };
      setChatMessages(prev => [...prev, supportResponse]);
    }, 1500);
  };

  return (
    <>
      <div className="max-w-360 mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-unbounded text-3xl font-bold text-secondary-000 mb-2">
            Help & Support
          </h1>
          <p className="font-unageo text-lg text-accent-60">
            Get help with your account and find answers to common questions
          </p>
        </div>

        {/* Quick Actions */}
        <QuickActions
          onNewTicket={() => setActiveDrawer('new-ticket')}
          onLiveChat={() => setActiveDrawer('chat')}
          onReportIssue={() => {
            setNewTicket({ ...newTicket, priority: 'high', category: 'Technical' });
            setActiveDrawer('new-ticket');
          }}
        />

      

        {/* Support Tickets */}
        <TicketsList
          tickets={tickets}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          onFilterChange={setFilterStatus}
          onSearchChange={setSearchQuery}
          onNewTicket={() => setActiveDrawer('new-ticket')}
          onTicketClick={handleOpenTicket}
          onMarkResolved={handleMarkResolved}
        />
        <div className="mt-8">
          {/* FAQs */}
        <FAQSection faqs={faqs} />
        </div>
      </div>

      {/* Drawers */}
      <NewTicketDrawer
        isOpen={activeDrawer === 'new-ticket'}
        onClose={closeDrawer}
        subject={newTicket.subject}
        message={newTicket.message}
        priority={newTicket.priority}
        category={newTicket.category}
        attachments={newTicket.attachments}
        onSubjectChange={(value) => setNewTicket({ ...newTicket, subject: value })}
        onMessageChange={(value) => setNewTicket({ ...newTicket, message: value })}
        onPriorityChange={(value) => setNewTicket({ ...newTicket, priority: value })}
        onCategoryChange={(value) => setNewTicket({ ...newTicket, category: value })}
        onFileSelect={handleFileSelect}
        onRemoveFile={handleRemoveFile}
        onSubmit={handleSubmitTicket}
      />

      <LiveChatDrawer
        isOpen={activeDrawer === 'chat'}
        onClose={closeDrawer}
        messages={chatMessages}
        input={chatInput}
        onInputChange={setChatInput}
        onSendMessage={handleSendMessage}
      />

      <TicketDetailDrawer
        isOpen={activeDrawer === 'ticket-detail'}
        onClose={closeDrawer}
        ticket={selectedTicket}
        reply={ticketReply}
        onReplyChange={setTicketReply}
        onSendReply={handleSendTicketReply}
        onUpdateStatus={(status) => selectedTicket && handleUpdateTicketStatus(selectedTicket.id, status)}
      />
    </>
  );
}
