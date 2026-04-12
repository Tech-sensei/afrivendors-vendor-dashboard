'use client';

import { useState } from 'react';
import { AlertCircle, Plus, Loader2 } from 'lucide-react';
import { ServiceCard, Service } from '@/components/services/ServiceCard';
import { ServicesHeader } from '@/components/services/ServicesHeader';
import { ServicesStats } from '@/components/services/ServicesStats';
import { ServicesFilter } from '@/components/services/ServicesFilter';
import { AddEditServiceDrawer } from '@/components/services/AddEditServiceDrawer';
import { ViewServiceDrawer } from '@/components/services/ViewServiceDrawer';
import { DeleteServiceDrawer } from '@/components/services/DeleteServiceDrawer';
import {
  useVendorServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useHideService,
  usePublishService,
} from '@/services/useVendorServices';
import { useAppSelector } from '@/store/hooks';

type FilterType = 'all' | 'published' | 'hidden';

const ServicesPage = () => {
  const vendorCategory = useAppSelector((state) => state.auth.profile?.kyc?.category?.name ?? '');
  const { data, isLoading } = useVendorServices();
  const services = data?.services ?? [];
  const publishedCount = data?.publishedServices ?? 0;
  const hiddenCount = data?.hiddenServices ?? 0;
  const totalCount = data?.totalServices ?? 0;

  const { mutateAsync: createService, isPending: isCreating } = useCreateService();
  const { mutateAsync: updateService, isPending: isUpdating } = useUpdateService();
  const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService();
  const { mutateAsync: hideService } = useHideService();
  const { mutateAsync: publishService } = usePublishService();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && service.isPublished) ||
      (statusFilter === 'hidden' && !service.isPublished);

    return matchesSearch && matchesStatus;
  });

  const handleAddService = () => {
    setSelectedService(null);
    setIsAddEditOpen(true);
  };

  const handleViewService = (id: number) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setSelectedService(service);
      setIsViewOpen(true);
    }
  };

  const handleEditService = (id: number) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setSelectedService(service);
      setIsViewOpen(false);
      setIsAddEditOpen(true);
    }
  };

  const handleSaveService = async (payload: FormData, serviceId?: number) => {
    if (serviceId) {
      await updateService({ id: serviceId, payload });
    } else {
      await createService(payload);
    }
    setIsAddEditOpen(false);
    setSelectedService(null);
  };

  const handleTogglePublish = async (id: number) => {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    if (service.isPublished) {
      await hideService(id);
    } else {
      await publishService(id);
    }
  };

  const handleDeleteClick = (id: number) => {
    const service = services.find((s) => s.id === id);
    if (service) {
      setSelectedService(service);
      setIsDeleteOpen(true);
    }
  };

  const handleConfirmDelete = async (id: number) => {
    await deleteService(id);
    setIsDeleteOpen(false);
    setSelectedService(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-100 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <ServicesHeader onAddService={handleAddService} />

      <ServicesStats
        totalCount={totalCount}
        publishedCount={publishedCount}
        hiddenCount={hiddenCount}
      />

      <ServicesFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        totalCount={totalCount}
        publishedCount={publishedCount}
        hiddenCount={hiddenCount}
      />

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <div className="py-16 px-6 text-center bg-white border border-secondary-600 rounded-2xl">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-secondary-700 flex items-center justify-center">
            <AlertCircle className="w-9 h-9 text-accent-60" />
          </div>
          <h3 className="font-unbounded text-xl font-semibold text-secondary-000 mb-2">
            No services found
          </h3>
          <p className="font-unageo text-[15px] text-accent-60 max-w-[400px] mx-auto mb-6">
            {searchQuery || statusFilter !== 'all'
              ? "Try adjusting your filters to find what you're looking for"
              : 'Get started by adding your first service'}
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <button
              onClick={handleAddService}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-primary-100
                font-unageo text-[15px] font-semibold text-white
                transition-all duration-150 hover:opacity-90 cursor-pointer"
            >
              <Plus className="w-[18px] h-[18px]" />
              Add Your First Service
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onView={handleViewService}
              onEdit={handleEditService}
              onTogglePublish={handleTogglePublish}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Service Drawer */}
      <AddEditServiceDrawer
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        vendorCategory={vendorCategory}
        onSave={handleSaveService}
        isSaving={isCreating || isUpdating}
      />

      {/* View Service Drawer */}
      <ViewServiceDrawer
        isOpen={isViewOpen}
        onClose={() => {
          setIsViewOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        onEdit={() => {
          if (selectedService) handleEditService(selectedService.id);
        }}
      />

      {/* Delete Confirmation Drawer */}
      <DeleteServiceDrawer
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedService(null);
        }}
        service={selectedService}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ServicesPage;
