"use client";

import { useState } from 'react';
import { XCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

// Data & Types
import { mockAppointments, VendorAppointment, AppointmentStatus } from '@/data/appointments';

// Components
import { AppointmentTabs, AppointmentTabType } from '@/components/appointments/AppointmentTabs';
import { AppointmentFilters, AppointmentFiltersState } from '@/components/appointments/AppointmentFilters';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { AppointmentDetailsDrawer } from '@/components/appointments/AppointmentDetailsDrawer';
import { RescheduleDrawer } from '@/components/appointments/RescheduleDrawer';
import { MessageDrawer } from '@/components/appointments/MessageDrawer';
import { CancelAppointmentDrawer } from '@/components/appointments/CancelAppointmentDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function VendorAppointments() {
  const [activeTab, setActiveTab] = useState<AppointmentTabType>('upcoming');
  const [appointments, setAppointments] = useState<VendorAppointment[]>(mockAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<VendorAppointment | null>(null);
  
  // Drawer States
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [isAcceptConfirmOpen, setIsAcceptConfirmOpen] = useState(false);
  const [isMarkCompleteConfirmOpen, setIsMarkCompleteConfirmOpen] = useState(false);
  
  const [filters, setFilters] = useState<AppointmentFiltersState>({
    search: '',
    category: 'all',
    status: 'all'
  });

  // Calculate counts
  const counts: Record<AppointmentTabType, number> = {
    upcoming: appointments.filter(a => a.status === 'upcoming').length,
    pending: appointments.filter(a => a.status === 'pending').length,
    past: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  const getFilteredAppointments = () => {
    // Map tab name to actual status value
    const statusMap: Record<AppointmentTabType, AppointmentStatus> = {
      'upcoming': 'upcoming',
      'pending': 'pending',
      'past': 'completed',
      'cancelled': 'cancelled'
    };
    
    let filtered = appointments.filter(apt => apt.status === statusMap[activeTab]);

    // Apply filters
    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(apt => 
            apt.customerName.toLowerCase().includes(searchLower) ||
            apt.serviceName.toLowerCase().includes(searchLower) ||
            apt.location.toLowerCase().includes(searchLower)
        );
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(apt => 
        apt.category.toLowerCase().includes(filters.category.toLowerCase()) ||
        apt.category.toLowerCase() === filters.category.toLowerCase() // Handle exact matches for safety
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => 
        apt.paymentType === filters.status
      );
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  // Handlers
  const handleAcceptClick = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      setSelectedAppointment(apt);
      setIsDetailsOpen(false);
      setIsAcceptConfirmOpen(true);
    }
  };

  const handleConfirmAccept = () => {
    if (!selectedAppointment) return;
    const id = selectedAppointment.id;
    
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: 'upcoming' as const, paymentType: 'Pay After' as const } : apt))
    );
    setIsAcceptConfirmOpen(false);
    toast.success(`Appointment accepted! Moved to Upcoming.`);
  };

  const handleRejectClick = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      setSelectedAppointment(apt);
      setIsDetailsOpen(false);
      setIsRejectConfirmOpen(true);
    }
  };

  const handleMarkCompleteClick = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      setSelectedAppointment(apt);
      setIsDetailsOpen(false);
      setIsMarkCompleteConfirmOpen(true);
    }
  };

  const handleConfirmMarkComplete = () => {
    if (!selectedAppointment) return;
    const id = selectedAppointment.id;
    
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: 'completed' as const } : apt))
    );
    setIsMarkCompleteConfirmOpen(false);
    toast.success('✅ Appointment completed! Moved to Past.');
  };

  const handleViewDetails = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      setSelectedAppointment(apt);
      setIsDetailsOpen(true);
    }
  };

  const handleMessage = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      setSelectedAppointment(apt);
      setIsMessageOpen(true);
    }
  };

  const handleReschedule = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) {
      setSelectedAppointment(apt);
      setIsRescheduleOpen(true);
    }
  };

  const handleConfirmReschedule = (appointmentId: string, newDate: string, newTime: string, notes: string) => {
    setAppointments(prev =>
        prev.map(apt => (apt.id === appointmentId ? { ...apt, date: newDate || apt.date, time: newTime || apt.time } : apt))
    );
    setIsRescheduleOpen(false);
    setIsDetailsOpen(false);
    toast.success(`Appointment rescheduled successfully!`);
  };

  const handleCancelClick = () => {
    setIsDetailsOpen(false);
    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancel = (id: string) => {
    const apt = appointments.find(a => a.id === id);
    const requiresRefund = apt?.paymentType === 'Prepaid';
    
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: 'cancelled' as const } : apt))
    );
    setIsCancelConfirmOpen(false);
    
    if (requiresRefund) {
      toast.error(`Appointment cancelled. Refund initiated.`);
    } else {
      toast.error(`Appointment cancelled successfully.`);
    }
  };

  const handleConfirmReject = () => {
    if (!selectedAppointment) return;
    const id = selectedAppointment.id;
    
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, status: 'cancelled' as const } : apt))
    );
    setIsRejectConfirmOpen(false);
    toast.error(`Booking request rejected.`);
  };

  return (
    <div className="max-w-360 mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-unbounded text-3xl font-black text-secondary-000 tracking-tight mb-2">
          Appointments
        </h1>
        <p className="font-unageo text-accent-60 text-lg">
          Manage your customer bookings and schedule.
        </p>
      </div>

      {/* Tabs */}
      <AppointmentTabs 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        counts={counts}
      />

      {/* Filters */}
      <AppointmentFilters onFilterChange={setFilters} />

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white border border-accent-20/60 rounded-2xl p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-accent-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-accent-40" />
          </div>
          <h3 className="font-unbounded text-xl font-bold text-secondary-000 mb-2">
            No {activeTab} appointments
          </h3>
          <p className="font-unageo text-accent-60 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'No new booking requests at the moment'
              : activeTab === 'upcoming'
              ? 'You have no upcoming appointments scheduled'
              : activeTab === 'past'
              ? 'No completed appointments to show'
              : 'No cancelled appointments'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onAccept={handleAcceptClick}
              onReject={handleRejectClick}
              onReschedule={handleReschedule}
              onMarkComplete={handleMarkCompleteClick}
              onMessage={handleMessage}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Drawers */}
      <AppointmentDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        appointment={selectedAppointment}
        onMessage={() => handleMessage(selectedAppointment?.id || '')}
        onReschedule={() => handleReschedule(selectedAppointment?.id || '')}
        onCancel={handleCancelClick}
        onMarkComplete={() => handleMarkCompleteClick(selectedAppointment?.id || '')}
        onAccept={() => handleAcceptClick(selectedAppointment?.id || '')}
        onReject={() => handleRejectClick(selectedAppointment?.id || '')}
      />

      <RescheduleDrawer
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        appointment={selectedAppointment}
        onConfirm={handleConfirmReschedule}
      />

      <MessageDrawer
        isOpen={isMessageOpen}
        onClose={() => setIsMessageOpen(false)}
        appointment={selectedAppointment}
      />

      <CancelAppointmentDrawer
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        appointment={selectedAppointment}
        onConfirm={handleConfirmCancel}
      />

      {/* Reuse ConfirmModal for Rejection */}
      <ConfirmModal
        open={isRejectConfirmOpen}
        onOpenChange={setIsRejectConfirmOpen}
        onConfirm={handleConfirmReject}
        title="Reject Booking Request?"
        description={`Are you sure you want to reject the booking request from ${selectedAppointment?.customerName}? This action cannot be undone.`}
        confirmText="Yes, Reject Request"
        cancelText="No, Keep Request"
        icon={XCircle}
        iconColor="text-red-600"
        iconBg="bg-red-50"
        confirmButtonVariant="destructive"
      />

      {/* Accept Confirmation Modal */}
      <ConfirmModal
        open={isAcceptConfirmOpen}
        onOpenChange={setIsAcceptConfirmOpen}
        onConfirm={handleConfirmAccept}
        title="Accept Booking Request?"
        description={`Are you sure you want to accept the booking request from ${selectedAppointment?.customerName}? This will move the appointment to your upcoming appointments.`}
        confirmText="Yes, Accept Request"
        cancelText="No, Cancel"
        icon={CheckCircle}
        iconColor="text-primary-100"
        iconBg="bg-primary-100/10"
        confirmButtonVariant="default"
      />

      {/* Mark Complete Confirmation Modal */}
      <ConfirmModal
        open={isMarkCompleteConfirmOpen}
        onOpenChange={setIsMarkCompleteConfirmOpen}
        onConfirm={handleConfirmMarkComplete}
        title="Mark Appointment as Complete?"
        description={`Are you sure you want to mark the appointment with ${selectedAppointment?.customerName} as completed? This will move it to your past appointments.`}
        confirmText="Yes, Mark Complete"
        cancelText="No, Cancel"
        icon={CheckCircle}
        iconColor="text-primary-100"
        iconBg="bg-primary-100/10"
        confirmButtonVariant="default"
      />
    </div>
  );
}