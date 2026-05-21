"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { useVendorAppointments, useUpdateAppointmentStatus } from '@/services/useVendorAppointments';
import type { VendorAppointment } from '@/types/appointments';

import { AppointmentTabs, AppointmentTabType } from '@/components/appointments/AppointmentTabs';
import { AppointmentFilters, AppointmentFiltersState } from '@/components/appointments/AppointmentFilters';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { AppointmentDetailsDrawer } from '@/components/appointments/AppointmentDetailsDrawer';
import { RescheduleDrawer } from '@/components/appointments/RescheduleDrawer';
import { MessageDrawer } from '@/components/appointments/MessageDrawer';
import { CancelAppointmentDrawer } from '@/components/appointments/CancelAppointmentDrawer';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

// Map UI tab names → API status values
const TAB_STATUS_MAP: Record<AppointmentTabType, VendorAppointment['status']> = {
  pending: 'pending',
  upcoming: 'accepted',
  past: 'completed',
  cancelled: 'rejected',
};

export default function VendorAppointments() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentDeepLinkHandled = useRef(false);

  const [activeTab, setActiveTab] = useState<AppointmentTabType>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<VendorAppointment | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);
  const [isAcceptConfirmOpen, setIsAcceptConfirmOpen] = useState(false);
  const [isMarkCompleteConfirmOpen, setIsMarkCompleteConfirmOpen] = useState(false);

  const [filters, setFilters] = useState<AppointmentFiltersState>({
    search: '', category: 'all', status: 'all',
  });

  const { data: appointments = [], isLoading } = useVendorAppointments();

  useEffect(() => {
    const param = searchParams.get('appointmentId');
    if (!param || appointmentDeepLinkHandled.current || isLoading) return;

    const id = Number(param);
    if (!Number.isFinite(id)) return;

    const apt = appointments.find((a) => a.id === id);
    appointmentDeepLinkHandled.current = true;

    if (apt) {
      setSelectedAppointment(apt);
      setIsDetailsOpen(true);
      router.replace('/appointments');
      return;
    }

    if (appointments.length > 0) {
      toast.error('Appointment not found.');
      router.replace('/appointments');
    }
  }, [appointments, isLoading, router, searchParams]);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAppointmentStatus();

  // Tab counts
  const counts: Record<AppointmentTabType, number> = {
    pending: appointments.filter(a => a.status === 'pending').length,
    upcoming: appointments.filter(a => a.status === 'accepted').length,
    past: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'rejected').length,
  };

  // Filtered list for current tab
  const filteredAppointments = appointments
    .filter(a => a.status === TAB_STATUS_MAP[activeTab])
    .filter(a => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          a.customerName.toLowerCase().includes(q) ||
          a.services.some(s => s.serviceName.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .filter(a => {
      if (filters.category !== 'all') {
        return a.services.some(s =>
          s.category.name.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
      return true;
    });

  // ── Helpers ────────────────────────────────────────────────────────────────

  const selectAndOpen = (id: number, openFn: () => void) => {
    const apt = appointments.find(a => a.id === id);
    if (apt) { setSelectedAppointment(apt); openFn(); }
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleViewDetails = (id: number) => selectAndOpen(id, () => setIsDetailsOpen(true));
  const handleMessage = (id: number) => selectAndOpen(id, () => setIsMessageOpen(true));
  const handleReschedule = (id: number) => selectAndOpen(id, () => setIsRescheduleOpen(true));

  const handleAcceptClick = (id: number) => selectAndOpen(id, () => { setIsDetailsOpen(false); setIsAcceptConfirmOpen(true); });
  const handleRejectClick = (id: number) => selectAndOpen(id, () => { setIsDetailsOpen(false); setIsRejectConfirmOpen(true); });
  const handleMarkCompleteClick = (id: number) => selectAndOpen(id, () => { setIsDetailsOpen(false); setIsMarkCompleteConfirmOpen(true); });
  const handleCancelClick = () => { setIsDetailsOpen(false); setIsCancelConfirmOpen(true); };

  const handleConfirmAccept = () => {
    if (!selectedAppointment) return;
    updateStatus(
      { id: selectedAppointment.id, status: 'accepted' },
      {
        onSuccess: () => { toast.success('Appointment accepted!'); setIsAcceptConfirmOpen(false); },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to accept'),
      }
    );
  };

  const handleConfirmReject = () => {
    if (!selectedAppointment) return;
    updateStatus(
      { id: selectedAppointment.id, status: 'rejected' },
      {
        onSuccess: () => { toast.error('Booking request rejected.'); setIsRejectConfirmOpen(false); },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to reject'),
      }
    );
  };

  const handleConfirmMarkComplete = () => {
    if (!selectedAppointment) return;
    updateStatus(
      { id: selectedAppointment.id, status: 'completed' },
      {
        onSuccess: () => { toast.success('Appointment marked as completed!'); setIsMarkCompleteConfirmOpen(false); },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to complete'),
      }
    );
  };

  // Cancel reuses reject endpoint until a dedicated cancel endpoint is provided
  const handleConfirmCancel = () => {
    if (!selectedAppointment) return;
    updateStatus(
      { id: selectedAppointment.id, status: 'rejected' },
      {
        onSuccess: () => { toast.error('Appointment cancelled.'); setIsCancelConfirmOpen(false); },
        onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to cancel'),
      }
    );
  };

  const handleConfirmReschedule = (_id: number, _date: string, _time: string, _notes: string) => {
    setIsRescheduleOpen(false);
    setIsDetailsOpen(false);
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

      <AppointmentTabs activeTab={activeTab} setActiveTab={setActiveTab} counts={counts} />
      <AppointmentFilters onFilterChange={setFilters} />

      {/* List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={36} className="text-primary-100 animate-spin" />
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="bg-white border border-accent-20/60 rounded-2xl p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-accent-10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={36} className="text-accent-40" />
          </div>
          <h3 className="font-unbounded text-xl font-bold text-secondary-000 mb-2">
            No {activeTab} appointments
          </h3>
          <p className="font-unageo text-accent-60 max-w-sm mx-auto">
            {activeTab === 'pending' ? 'No new booking requests at the moment' :
              activeTab === 'upcoming' ? 'You have no upcoming appointments scheduled' :
                activeTab === 'past' ? 'No completed appointments to show' :
                  'No cancelled appointments'}
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
        onMessage={() => handleMessage(selectedAppointment?.id ?? 0)}
        onCancel={handleCancelClick}
        onMarkComplete={() => handleMarkCompleteClick(selectedAppointment?.id ?? 0)}
        onAccept={() => handleAcceptClick(selectedAppointment?.id ?? 0)}
        onReject={() => handleRejectClick(selectedAppointment?.id ?? 0)}
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

      {/* Reject Confirmation */}
      <ConfirmModal
        open={isRejectConfirmOpen}
        onOpenChange={setIsRejectConfirmOpen}
        onConfirm={handleConfirmReject}
        title="Reject Booking Request?"
        description={`Are you sure you want to reject the booking from ${selectedAppointment?.customerName}? This cannot be undone.`}
        confirmText={isUpdating ? 'Rejecting…' : 'Yes, Reject'}
        cancelText="No, Keep"
        icon={XCircle}
        iconColor="text-red-600"
        iconBg="bg-red-50"
        confirmButtonVariant="destructive"
      />

      {/* Accept Confirmation */}
      <ConfirmModal
        open={isAcceptConfirmOpen}
        onOpenChange={setIsAcceptConfirmOpen}
        onConfirm={handleConfirmAccept}
        title="Accept Booking Request?"
        description={`Accept the booking from ${selectedAppointment?.customerName}? It will move to Upcoming.`}
        confirmText={isUpdating ? 'Accepting…' : 'Yes, Accept'}
        cancelText="Cancel"
        icon={CheckCircle}
        iconColor="text-primary-100"
        iconBg="bg-primary-100/10"
        confirmButtonVariant="default"
      />

      {/* Mark Complete Confirmation */}
      <ConfirmModal
        open={isMarkCompleteConfirmOpen}
        onOpenChange={setIsMarkCompleteConfirmOpen}
        onConfirm={handleConfirmMarkComplete}
        title="Mark as Completed?"
        description={`Mark the appointment with ${selectedAppointment?.customerName} as completed?`}
        confirmText={isUpdating ? 'Saving…' : 'Yes, Complete'}
        cancelText="Cancel"
        icon={CheckCircle}
        iconColor="text-primary-100"
        iconBg="bg-primary-100/10"
        confirmButtonVariant="default"
      />
    </div>
  );
}
