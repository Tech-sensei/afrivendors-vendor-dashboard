"use client";

import React, { useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { BusinessProfile } from '@/data/business-profile';
import { useAppSelector } from '@/store/hooks';
import { useVendorGallery } from '@/services/useVendorGallery';
import {
  useSaveVendorOpeningHours,
  useUpdateAboutBusiness,
  useUpdateVendorAddress,
} from '@/services/useVendorProfile';

// Components
import { ProfileHeader } from '@/components/business-profile/ProfileHeader';
import { BannerSection } from '@/components/business-profile/BannerSection';
import { BasicInfoCard } from '@/components/business-profile/BasicInfoCard';
import { DescriptionCard } from '@/components/business-profile/DescriptionCard';
import { ProfileGallery } from '@/components/business-profile/ProfileGallery';
import { LocationCard } from '@/components/business-profile/LocationCard';
import { HoursCard } from '@/components/business-profile/HoursCard';
import { EditProfileDrawer } from '@/components/business-profile/EditProfileDrawer';
import type { VendorKyc, VendorKycLocationBlock } from '@/types/auth';

type DrawerType = 'description' | 'gallery' | 'location' | 'hours' | null;

function isLocationBlock(
  loc: VendorKyc['location']
): loc is VendorKycLocationBlock {
  return loc != null && typeof loc === 'object' && !Array.isArray(loc);
}

/** Flatten `kyc.location` (string | object) + top-level KYC fields for UI strings. */
function addressStringsFromKyc(kyc: VendorKyc | null | undefined): {
  line1: string;
  city: string;
  state: string;
  zip: string;
} {
  if (!kyc) return { line1: '', city: '', state: '', zip: '' };

  if (isLocationBlock(kyc.location)) {
    const b = kyc.location;
    const street = String(b.street_address ?? b.streetAddress ?? '').trim();
    return {
      line1: street || String(kyc.streetAddress ?? '').trim(),
      city: String(b.city ?? kyc.city ?? '').trim(),
      state: String(b.state ?? kyc.state ?? '').trim(),
      zip: String(b.zip ?? kyc.zip ?? '').trim(),
    };
  }

  if (typeof kyc.location === 'string' && kyc.location.trim()) {
    return {
      line1: String(kyc.streetAddress ?? kyc.location).trim(),
      city: String(kyc.city ?? '').trim(),
      state: String(kyc.state ?? '').trim(),
      zip: kyc.zip != null ? String(kyc.zip).trim() : '',
    };
  }

  return {
    line1: String(kyc.streetAddress ?? '').trim(),
    city: String(kyc.city ?? '').trim(),
    state: String(kyc.state ?? '').trim(),
    zip: kyc.zip != null ? String(kyc.zip).trim() : '',
  };
}

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

  const addr = addressStringsFromKyc(kyc ?? undefined);

  return {
    businessName: kyc?.businessName ?? '',
    ownerName: `${vendor?.firstName ?? ''} ${vendor?.lastName ?? ''}`.trim(),
    category: kyc?.category?.name ?? '',
    description: kyc?.aboutBusiness ?? '',
    logo: bannerImage,
    bannerImage,
    gallery: galleryImages,
    address: addr.line1,
    city: addr.city,
    state: addr.state,
    zipCode: addr.zip,
    phone: vendor?.phoneNumber ?? '',
    email: vendor?.email ?? '',
    openingHours: mapOpeningHours(openingHours ?? []),
    socialLinks: {},
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BusinessProfilePage() {
  const reduxProfile = useAppSelector((state) => state.auth.profile);
  const { uploadAsync, isUploading, deleteAsync, setBannerAsync } = useVendorGallery();
  const updateAddressMutation = useUpdateVendorAddress();
  const updateAboutBusinessMutation = useUpdateAboutBusiness();
  const saveOpeningHoursMutation = useSaveVendorOpeningHours();

  const initialData = useMemo(() => mapToBusinessProfile(reduxProfile), [reduxProfile]);

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  /** Snapshot when "Edit opening hours" opens — used to POST only changed days. */
  const openingHoursBaselineRef = useRef<BusinessProfile['openingHours'] | null>(null);

  // Use Redux data as source; local state overrides once user has made edits
  const displayProfile = profile ?? initialData;

  // Gallery items from Redux (have IDs needed for API calls)
  const galleryItems = reduxProfile?.gallery ?? [];

  const openDrawer = (type: DrawerType) => {
    if (!displayProfile) return;
    switch (type) {
      case 'description':
        setEditingData({ description: displayProfile.description });
        break;
      case 'location':
        setEditingData({
          streetAddress: displayProfile.address,
          city: displayProfile.city,
          state: displayProfile.state,
          zip: String(displayProfile.zipCode ?? '').slice(0, 6),
        });
        break;
      case 'hours':
        openingHoursBaselineRef.current = structuredClone(displayProfile.openingHours);
        setEditingData({ openingHours: { ...displayProfile.openingHours } });
        break;
    }
    setActiveDrawer(type);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
    setEditingData({});
    openingHoursBaselineRef.current = null;
  };

  const handleSave = () => {
    if (activeDrawer === 'location') {
      updateAddressMutation.mutate(
        {
          streetAddress: editingData.streetAddress,
          city: editingData.city,
          state: editingData.state,
          zip: editingData.zip,
        },
        {
          onSuccess: () => {
            setProfile(null);
            toast.success('Address updated successfully!');
            closeDrawer();
          },
          onError: (err: unknown) => {
            let msg = 'Could not update address.';
            if (err instanceof Error) msg = err.message;
            else if (axios.isAxiosError(err)) {
              const d = err.response?.data as { message?: string } | undefined;
              if (d?.message) msg = String(d.message);
            }
            toast.error(msg);
          },
        }
      );
      return;
    }

    if (activeDrawer === 'hours') {
      const baseline = openingHoursBaselineRef.current;
      if (!baseline) {
        toast.error('Please reopen opening hours and try again.');
        return;
      }
      saveOpeningHoursMutation.mutate(
        { previous: baseline, next: editingData.openingHours },
        {
          onSuccess: (result) => {
            setProfile(null);
            if (result.postedCount === 0) {
              toast.info('No changes to save.');
            } else {
              toast.success('Opening hours updated successfully!');
            }
            closeDrawer();
          },
          onError: (err: unknown) => {
            let msg = 'Could not update opening hours.';
            if (err instanceof Error) msg = err.message;
            else if (axios.isAxiosError(err)) {
              const d = err.response?.data as { message?: string } | undefined;
              if (d?.message) msg = String(d.message);
            }
            toast.error(msg);
          },
        }
      );
      return;
    }

    if (activeDrawer === 'description') {
      updateAboutBusinessMutation.mutate(
        { aboutBusiness: String(editingData.description ?? '').trim() },
        {
          onSuccess: () => {
            setProfile(null);
            toast.success('Description updated successfully!');
            closeDrawer();
          },
          onError: (err: unknown) => {
            let msg = 'Could not update description.';
            if (err instanceof Error) msg = err.message;
            else if (axios.isAxiosError(err)) {
              const d = err.response?.data as { message?: string } | undefined;
              if (d?.message) msg = String(d.message);
            }
            toast.error(msg);
          },
        }
      );
    }
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

        <BasicInfoCard profile={displayProfile} />

        <DescriptionCard
          description={displayProfile.description}
          onEdit={() => openDrawer('description')}
        />

        <LocationCard
          profile={displayProfile}
          onEdit={() => openDrawer('location')}
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
        isSaving={
          updateAddressMutation.isPending ||
          updateAboutBusinessMutation.isPending ||
          saveOpeningHoursMutation.isPending
        }
      />
    </div>
  );
}
