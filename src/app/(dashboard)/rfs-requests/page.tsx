"use client";

import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

// Data & Types
import { mockRFSRequests, RFSRequest, RFSStatus } from '@/data/rfs';

// Components
import { RFSTabs } from '@/components/rfs/RFSTabs';
import { RFSCard } from '@/components/rfs/RFSCard';
import { RFSFilters, RFSFiltersState } from '@/components/rfs/RFSFilters';
import { RFSDetailsDrawer } from '@/components/rfs/RFSDetailsDrawer';
import { SendQuoteDrawer } from '@/components/rfs/SendQuoteDrawer';
import { DeclineRFSDrawer } from '@/components/rfs/DeclineRFSDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function VendorRFSRequests() {
  const [activeTab, setActiveTab] = useState<RFSStatus>('new');
  const [requests, setRequests] = useState<RFSRequest[]>(mockRFSRequests);
  const [selectedRequest, setSelectedRequest] = useState<RFSRequest | null>(null);
  
  // Drawer States
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSendQuoteOpen, setIsSendQuoteOpen] = useState(false);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [isAcceptConfirmOpen, setIsAcceptConfirmOpen] = useState(false);

  // Filter State
  const [filters, setFilters] = useState<RFSFiltersState>({
    search: '',
    category: 'all',
    budgetRange: 'all'
  });

  // Calculate counts for tabs
  const counts: Record<RFSStatus, number> = {
    new: requests.filter(r => r.status === 'new').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    'price-pending': requests.filter(r => r.status === 'price-pending').length,
    ignored: requests.filter(r => r.status === 'ignored').length
  };

  const getFilteredRequests = () => {
    let filtered = requests.filter(req => req.status === activeTab);

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(req =>
        req.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.serviceTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
        req.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(req =>
        req.serviceCategory.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    // Apply budget range filter
    if (filters.budgetRange !== 'all') {
      filtered = filtered.filter(req => {
        const budget = req.budget.toLowerCase();
        if (filters.budgetRange === '0-50') return budget.includes('$') && !budget.includes('100') && !budget.includes('200');
        if (filters.budgetRange === '50-100') return budget.includes('$') && (budget.includes('50') || budget.includes('60') || budget.includes('70') || budget.includes('80') || budget.includes('90') || budget.includes('100'));
        if (filters.budgetRange === '100-200') return budget.includes('100') || budget.includes('120') || budget.includes('150') || budget.includes('180');
        if (filters.budgetRange === '200+') return budget.includes('200') || budget.includes('300');
        return true;
      });
    }

    return filtered;
  };

  const filteredRequests = getFilteredRequests();

  // Handlers
  const handleViewDetails = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setIsDetailsOpen(true);
    }
  };

  const handleSendQuoteClick = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setIsDetailsOpen(false);
      setIsSendQuoteOpen(true);
    }
  };

  const handleConfirmQuote = (requestId: string, amount: string, message: string) => {
    const request = requests.find(r => r.id === requestId);
    const isEditing = request?.status === 'price-pending';
    
    setRequests(prev =>
      prev.map(req => (req.id === requestId ? { 
        ...req, 
        status: 'price-pending' as const,
        quoteAmount: amount,
        quoteMessage: message,
        quoteSentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      } : req))
    );
    setIsSendQuoteOpen(false);
    
    toast.success(isEditing 
      ? `Quote updated for ${request?.customerName}!` 
      : `Quote of $${amount} sent to ${request?.customerName}!`
    );
  };

  const handleAccept = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setIsAcceptConfirmOpen(true);
    }
  };

  const handleConfirmAccept = () => {
    if (!selectedRequest) return;
    
    setRequests(prev =>
      prev.map(req => (req.id === selectedRequest.id ? { ...req, status: 'accepted' as const } : req))
    );
    setIsAcceptConfirmOpen(false);
    setIsDetailsOpen(false);
    toast.success(`Request from ${selectedRequest.customerName} accepted!`);
  };

  const handleDeclineClick = (id: string) => {
    const request = requests.find(r => r.id === id);
    if (request) {
      setSelectedRequest(request);
      setIsDetailsOpen(false);
      setIsDeclineOpen(true);
    }
  };

  const handleConfirmDecline = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    setRequests(prev =>
      prev.map(req => (req.id === requestId ? { ...req, status: 'ignored' as const } : req))
    );
    setIsDeclineOpen(false);
    toast.error(`Request from ${request?.customerName} declined.`);
  };

  return (
    <div className="max-w-[1440px] mx-auto ">
      {/* Header Area */}
      <div className="mb-12">
        <h1 className="font-unbounded text-4xl font-black text-secondary-000 tracking-tight mb-2">
          Service Requests
        </h1>
        <p className="font-unageo text-accent-60 text-lg">
          Manage and respond to custom service requirements from your customers.
        </p>
      </div>

      {/* Tabs Section */}
      <RFSTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        counts={counts} 
      />

      {/* Filter Section */}
      <RFSFilters onFilterChange={setFilters} />

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-accent-20/60 rounded-2xl p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-accent-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-accent-40" />
          </div>
          <h3 className="font-unbounded text-xl font-bold text-secondary-000 mb-2">
            No {activeTab.replace('-', ' ')} requests found
          </h3>
          <p className="font-unageo text-accent-60 max-w-sm mx-auto">
            Try adjusting your filters or checking other tabs for requests.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredRequests.map((request) => (
            <RFSCard
              key={request.id}
              request={request}
              onViewDetails={handleViewDetails}
              onAccept={handleAccept}
              onDecline={handleDeclineClick}
              onSendQuote={handleSendQuoteClick}
            />
          ))}
        </div>
      )}

      {/* Drawers */}
      <RFSDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        request={selectedRequest}
        onSendQuote={() => handleSendQuoteClick(selectedRequest?.id || '')}
        onAccept={() => handleAccept(selectedRequest?.id || '')}
        onDecline={() => handleDeclineClick(selectedRequest?.id || '')}
      />

      <SendQuoteDrawer
        isOpen={isSendQuoteOpen}
        onClose={() => setIsSendQuoteOpen(false)}
        request={selectedRequest}
        onConfirm={handleConfirmQuote}
      />

      <DeclineRFSDrawer
        isOpen={isDeclineOpen}
        onClose={() => setIsDeclineOpen(false)}
        request={selectedRequest}
        onConfirm={handleConfirmDecline}
      />

      <ConfirmModal
        open={isAcceptConfirmOpen}
        onOpenChange={setIsAcceptConfirmOpen}
        onConfirm={handleConfirmAccept}
        title="Accept Service Request?"
        description={`You are about to accept the request from ${selectedRequest?.customerName}. This will notify the customer that you're ready to proceed.`}
        confirmText="Yes, Accept Request"
        cancelText="No, Go Back"
        icon={CheckCircle}
        iconColor="text-green-600"
        iconBg="bg-green-50"
      />
    </div>
  );
}