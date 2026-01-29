"use client";

import React from 'react';
import { Plus, Search, HelpCircle } from 'lucide-react';
import { SupportTicket, TicketStatus } from '@/data/help-support';
import { TicketCard } from './TicketCard';

interface TicketsListProps {
  tickets: SupportTicket[];
  filterStatus: TicketStatus | 'all';
  searchQuery: string;
  onFilterChange: (status: TicketStatus | 'all') => void;
  onSearchChange: (query: string) => void;
  onNewTicket: () => void;
  onTicketClick: (ticket: SupportTicket) => void;
  onMarkResolved: (ticketId: string) => void;
}

export function TicketsList({
  tickets,
  filterStatus,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onNewTicket,
  onTicketClick,
  onMarkResolved
}: TicketsListProps) {
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="font-unbounded text-xl font-bold text-secondary-000">
          My Support Tickets
        </h2>
        <button
          onClick={onNewTicket}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-100 text-white hover:bg-primary-200 hover:shadow-lg hover:shadow-primary-100/20 font-unageo text-sm font-bold transition-all"
        >
          <Plus size={18} />
          New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-accent-60"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 font-unageo text-sm text-secondary-000 bg-white focus:outline-none focus:border-primary-100 transition-colors"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => onFilterChange(e.target.value as TicketStatus | 'all')}
          className="px-4 py-2.5 rounded-xl border border-zinc-200 font-unageo text-sm font-medium text-secondary-000 bg-white focus:outline-none focus:border-primary-100 cursor-pointer min-w-[140px]"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Tickets List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle size={48} className="text-accent-40 mx-auto mb-4" />
            <p className="font-unageo text-base text-accent-60">
              No tickets found
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => onTicketClick(ticket)}
              onMarkResolved={() => onMarkResolved(ticket.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
