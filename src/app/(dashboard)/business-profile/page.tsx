"use client";

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { BusinessProfile } from '@/data/business-profile';
import { useAppSelector } from '@/store/hooks';
import { useVendorGallery } from '@/services/useVendorGallery';

// Components
import { ProfileHeader } from '@/components/business-profile/ProfileHeader';
import { BannerSection } from '@/components/business-profile/BannerSection';
import { BasicInfoCard } from '@/components/business-profile/BasicInfoCard';
import { DescriptionCard } from '@/components/business-profile/DescriptionCard';
import { ProfileGallery } from '@/components/business-profile/ProfileGallery';
import { LocationCard } from '@/components/business-profile/LocationCard';
import { ContactCard } from '@/components/business-profile/ContactCard';
import { HoursCard } from '@/components/business-profile/HoursCard';
import { EditProfileDrawer } from '@/components/business-profile/EditProfileDrawer';

type DrawerType = 'basic' | 'description' | 'gallery' | 'location' | 'contact' | 'hours' | null;

// ─── Map API opening hours array → BusinessProfile opening hours dict ─────────

function mapOpeningHours(
  apiHours: { day: string; isOpen: boolean; openTime: string | null; closeTime: string | null }[]
): BusinessProfile['openingHours'] {
  const result: BusinessProfile['openingHours'] = {};
  for (const entry of apiHours) {
    // strip seconds from "09:00:00" → "09:00"
    const open = entry.openTime ? entry.openTime.slice(0, 5) : '09:00';
    const close = entry.closeTime ? entry.closeTime.slice(0, 5) : '17:00';
    result[entry.day.toLowerCase()] = { isOpen: entry.isOpen, open, close };
  }
  return result;
}

// ─── Map Redux VendorProfile → BusinessProfile ────────────────────────────────

function mapToBusinessProfile(reduxProfile: ReturnType<typeof useAppSelector<any>> | null): BusinessProfile | null {
  if (!reduxProfile) return null;

  const { vendor, kyc, openingHours, gallery } = reduxProfile;

  const bannerImage =
    gallery?.find((g: any) => g.isBanner)?.imageUrl ??
    kyc?.bannerImage ??
    '';

  const galleryImages: string[] = (gallery ?? []).map((g: any) => g.imageUrl);

  return {
    businessName: kyc?.businessName ?? '',
    ownerName: `${vendor?.firstName ?? ''} ${vendor?.lastName ?? ''}`.trim(),
    category: kyc?.category?.name ?? '',
    description: kyc?.aboutBusiness ?? '',
    logo: bannerImage,
    bannerImage,
    gallery: galleryImages,
    address: kyc?.location ?? '',
    city: '',
    state: '',
    zipCode: '',
    phone: vendor?.phoneNumber ?? '',
    email: vendor?.email ?? '',
    website: kyc?.website ?? '',
    openingHours: mapOpeningHours(openingHours ?? []),
    socialLinks: {},
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BusinessProfilePage() {
  const reduxProfile = useAppSelector((state) => state.auth.profile);
  const { uploadAsync, isUploading, deleteAsync, setBannerAsync } = useVendorGallery();

  const initialData = useMemo(() => mapToBusinessProfile(reduxProfile), [reduxProfile]);

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Use Redux data as source; local state overrides once user has made edits
  const displayProfile = profile ?? initialData;

  // Gallery items from Redux (have IDs needed for API calls)
  const galleryItems = reduxProfile?.gallery ?? [];

  const openDrawer = (type: DrawerType) => {
    if (!displayProfile) return;
    switch (type) {
      case 'basic':
        setEditingData({
          businessName: displayProfile.businessName,
          ownerName: displayProfile.ownerName,
          category: displayProfile.category,
        });
        break;
      case 'description':
        setEditingData({ description: displayProfile.description });
        break;
      case 'location':
        setEditingData({
          address: displayProfile.address,
          city: displayProfile.city,
          state: displayProfile.state,
          zipCode: displayProfile.zipCode,
        });
        break;
      case 'contact':
        setEditingData({
          phone: displayProfile.phone,
          email: displayProfile.email,
          website: displayProfile.website,
        });
        break;
      case 'hours':
        setEditingData({ openingHours: { ...displayProfile.openingHours } });
        break;
    }
    setActiveDrawer(type);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
    setEditingData({});
  };

  const handleSave = () => {
    setProfile((prev) => ({ ...(prev ?? initialData!), ...editingData }));
    toast.success('Changes saved successfully!');
    closeDrawer();
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    // TODO: wire to PATCH /vendor/kyc or equivalent endpoint
    setTimeout(() => {
      setIsSaving(false);
      toast.success('All changes saved to server!');
    }, 1000);
  };

  const handleGalleryUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        await uploadAsync(file);
        // Gallery refreshed via fetchUserProfile inside the hook
      }
    };
    input.click();
  };

  const handleSetBanner = async (id: number) => {
    await setBannerAsync(id);
    // Redux state refreshed inside hook — clear local override so banner updates
    setProfile(null);
  };

  const handleRemoveImage = async (id: number) => {
    await deleteAsync(id);
    // Redux state refreshed inside hook — clear local override
    setProfile(null);
  };

  if (!displayProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-accent-60 font-unageo">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="">
      <ProfileHeader onSave={handleSaveAll} isSaving={isSaving} />

      <div className="space-y-8">
        <BannerSection bannerImage={displayProfile.bannerImage} />

        <BasicInfoCard
          profile={displayProfile}
          onEdit={() => openDrawer('basic')}
        />

        <DescriptionCard
          description={displayProfile.description}
          onEdit={() => openDrawer('description')}
        />

        <LocationCard
          profile={displayProfile}
          onEdit={() => openDrawer('location')}
        />

        <ContactCard
          profile={displayProfile}
          onEdit={() => openDrawer('contact')}
        />

        <ProfileGallery
          items={galleryItems}
          onUpload={handleGalleryUpload}
          onSetBanner={handleSetBanner}
          onRemove={handleRemoveImage}
          isUploading={isUploading}
        />

        <HoursCard
          openingHours={displayProfile.openingHours}
          onEdit={() => openDrawer('hours')}
        />
      </div>

      <EditProfileDrawer
        isOpen={!!activeDrawer}
        type={activeDrawer}
        onClose={closeDrawer}
        onSave={handleSave}
        data={editingData}
        setData={setEditingData}
      />
    </div>
  );
}
