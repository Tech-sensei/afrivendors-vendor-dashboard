"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useAuthAPI } from "@/services/useAuthAPI";
import { useAppSelector } from "@/store/hooks";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { PayoutSettings } from "@/components/settings/PayoutSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { DangerZone } from "@/components/settings/DangerZone";
import { ChangePasswordDrawer } from "@/components/settings/drawers/ChangePasswordDrawer";
import { AddPayoutMethodDrawer } from "@/components/settings/drawers/AddPayoutMethodDrawer";
import { DeleteAccountDrawer } from "@/components/settings/drawers/DeleteAccountDrawer";

type DrawerType = "password" | "payout" | "delete-account" | null;

interface PayoutMethod {
  id: string;
  type: "bank" | "mobile-money";
  name: string;
  details: string;
  isPrimary: boolean;
}

export default function VendorSettings() {
  const { changePasswordAsync, isChangingPassword } = useAuthAPI();
  const { profile } = useAppSelector((state) => state.auth);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);

  const accountData = useMemo(() => ({
    name: `${profile?.vendor?.firstName ?? ''} ${profile?.vendor?.lastName ?? ''}`.trim() || '—',
    email: profile?.vendor?.email ?? '—',
    phone: profile?.vendor?.phoneNumber ?? '—',
  }), [profile]);

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Payout Methods
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([
    {
      id: "1",
      type: "bank",
      name: "GTBank Nigeria",
      details: "•••• •••• •••• 4532",
      isPrimary: true,
    },
    {
      id: "2",
      type: "mobile-money",
      name: "MTN Mobile Money",
      details: "+234 803 456 7890",
      isPrimary: false,
    },
  ]);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsAlerts: true,
    pushNotifications: true,
    bookingUpdates: true,
    paymentAlerts: true,
    reviewNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
  });

  const closeDrawer = () => setActiveDrawer(null);

  // Handlers
  const handlePasswordSubmit = async (data: any) => {
    try {
      await changePasswordAsync({
        oldPassword: data.current,
        newPassword: data.new,
        confirmNewPassword: data.confirm,
      });
      closeDrawer();
    } catch {
      // error toast handled inside useAuthAPI
    }
  };

  const handleAddPayoutMethod = (newMethodData: any) => {
    if (newMethodData.type === "bank") {
      if (!newMethodData.bankName || !newMethodData.accountNumber || !newMethodData.accountName) {
        toast.error("Please fill in all bank details");
        return;
      }
    } else {
      if (!newMethodData.phoneNumber) {
        toast.error("Please enter a phone number");
        return;
      }
    }

    const newMethod: PayoutMethod = {
      id: Date.now().toString(),
      type: newMethodData.type,
      name: newMethodData.type === "bank" ? newMethodData.bankName : "MTN Mobile Money",
      details: newMethodData.type === "bank" 
        ? `•••• •••• •••• ${newMethodData.accountNumber.slice(-4)}`
        : newMethodData.phoneNumber,
      isPrimary: false,
    };

    setPayoutMethods([...payoutMethods, newMethod]);
    toast.success("Payout method added successfully!");
    closeDrawer();
  };

  const handleDeletePayoutMethod = (id: string) => {
    const method = payoutMethods.find((m) => m.id === id);
    if (method?.isPrimary) {
      toast.error("Cannot delete primary payout method");
      return;
    }
    setPayoutMethods(payoutMethods.filter((m) => m.id !== id));
    toast.success("Payout method removed");
  };

  const handleSetPrimaryPayout = (id: string) => {
    setPayoutMethods(
      payoutMethods.map((m) => ({ ...m, isPrimary: m.id === id }))
    );
    toast.success("Primary payout method updated");
  };

  const handleNotificationToggle = (key: string) => {
    setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] });
    toast.success("Notification preferences updated");
  };

  const handleDeleteAccountConfirm = (confirmationText: string) => {
    if (confirmationText === "DELETE") {
      toast.error("Account deletion requested. Our team will contact you.");
      closeDrawer();
    } else {
      toast.error("Please type DELETE to confirm");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* <SettingsHeader /> */}

      <div className="space-y-6">
        <AccountSettings initialData={accountData} />

        <SecuritySettings
          twoFactorEnabled={twoFactorEnabled}
          onOpenPasswordDrawer={() => setActiveDrawer("password")}
          onDisable2FA={() => setTwoFactorEnabled(false)}
          onEnable2FA={() => setTwoFactorEnabled(true)}
        />

        <PayoutSettings
          methods={payoutMethods}
          onAddMethod={() => setActiveDrawer("payout")}
          onDeleteMethod={handleDeletePayoutMethod}
          onSetPrimary={handleSetPrimaryPayout}
        />

        <NotificationSettings
          notifications={notifications}
          onToggle={handleNotificationToggle}
        />

        <DangerZone onDeleteAccount={() => setActiveDrawer("delete-account")} />
      </div>

      {/* Drawers */}
      <ChangePasswordDrawer
        isOpen={activeDrawer === "password"}
        onClose={closeDrawer}
        onSubmit={handlePasswordSubmit}
        isSubmitting={isChangingPassword}
      />

      <AddPayoutMethodDrawer
        isOpen={activeDrawer === "payout"}
        onClose={closeDrawer}
        onSubmit={handleAddPayoutMethod}
      />

      <DeleteAccountDrawer
        isOpen={activeDrawer === "delete-account"}
        onClose={closeDrawer}
        onConfirm={handleDeleteAccountConfirm}
      />
    </div>
  );
}
