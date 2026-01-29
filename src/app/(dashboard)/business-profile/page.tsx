
"use client";

import React, { useState } from 'react';
import { toast } from 'sonner';
import { initialProfile, BusinessProfile } from '@/data/business-profile';

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

export default function BusinessProfilePage() {
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [editingData, setEditingData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const openDrawer = (type: DrawerType) => {
    switch (type) {
      case 'basic':
        setEditingData({
          businessName: profile.businessName,
          ownerName: profile.ownerName,
          category: profile.category
        });
        break;
      case 'description':
        setEditingData({ description: profile.description });
        break;
      case 'location':
        setEditingData({
          address: profile.address,
          city: profile.city,
          state: profile.state,
          zipCode: profile.zipCode
        });
        break;
      case 'contact':
        setEditingData({
          phone: profile.phone,
          email: profile.email,
          website: profile.website
        });
        break;
      case 'hours':
        setEditingData({ openingHours: { ...profile.openingHours } });
        break;
    }
    setActiveDrawer(type);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
    setEditingData({});
  };

  const handleSave = () => {
    setProfile(prev => ({ ...prev, ...editingData }));
    toast.success('Changes saved successfully!');
    closeDrawer();
  };

  const handleSaveAll = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
        setIsSaving(false);
        toast.success('All changes saved to server!');
    }, 1000);
  };

  const handleGalleryUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setProfile((prev) => ({
            ...prev,
            gallery: [...prev.gallery, imageUrl]
          }));
          toast.success('Image added to gallery!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleRemoveGalleryImage = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
    toast.error('Image removed from gallery');
  };


  const handleSetBannerImage = (imageUrl: string) => {
    setProfile((prev) => ({ ...prev, bannerImage: imageUrl }));
    toast.success('Banner image updated successfully!');
  };

  return (
    <div className="">
      <ProfileHeader 
        onSave={handleSaveAll} 
        isSaving={isSaving}
      />

      <div className="space-y-8">
        <BannerSection bannerImage={profile.bannerImage} />

        <BasicInfoCard 
          profile={profile} 
          onEdit={() => openDrawer('basic')} 
        />

        <DescriptionCard 
          description={profile.description} 
          onEdit={() => openDrawer('description')} 
        />


          <LocationCard
            profile={profile}
            onEdit={() => openDrawer('location')}
          />
          
          <ContactCard
            profile={profile}
            onEdit={() => openDrawer('contact')}
          />
      
        <ProfileGallery 
          profile={profile}
          onUploadGallery={handleGalleryUpload}
          onSetBanner={handleSetBannerImage}
          onRemoveImage={handleRemoveGalleryImage}
        />

        <HoursCard
          openingHours={profile.openingHours}
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

