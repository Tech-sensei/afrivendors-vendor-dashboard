"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuthAPI } from "@/services/useAuthAPI";
import { useAppSelector } from "@/store/hooks";
import type { PayoutAccount } from "@/data/wallet";
import {
  useStripeConnectAccountLink,
  useVendorPayoutAccounts,
} from "@/services/useVendorPayoutAccounts";
import { AccountSettings } from "@/components/settings/AccountSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { PayoutSettings } from "@/components/settings/PayoutSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { DangerZone } from "@/components/settings/DangerZone";
import { ChangePasswordDrawer } from "@/components/settings/drawers/ChangePasswordDrawer";
import { DeleteAccountDrawer } from "@/components/settings/drawers/DeleteAccountDrawer";

type DrawerType = "password" | "delete-account" | null;

interface PayoutMethod {
  id: string;
  type: "bank" | "mobile-money";
  name: string;
  details: string;
  isPrimary: boolean;
}

function mapPayoutAccountToMethod(p: PayoutAccount): PayoutMethod {
  return {
    id: p.id,
    type: p.type === "mobile_money" ? "mobile-money" : "bank",
    name: p.name,
    details: p.details,
    isPrimary: p.isDefault,
  };
}

export default function VendorSettings() {
  const { changePasswordAsync, isChangingPassword } = useAuthAPI();
  const { profile } = useAppSelector((state) => state.auth);
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const stripeConnectMutation = useStripeConnectAccountLink();

  const accountData = useMemo(() => ({
    name: `${profile?.vendor?.firstName ?? ''} ${profile?.vendor?.lastName ?? ''}`.trim() || '—',
    email: profile?.vendor?.email ?? '—',
    phone: profile?.vendor?.phoneNumber ?? '—',
  }), [profile]);

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const {
    data: payoutAccounts = [],
    isLoading: isPayoutAccountsLoading,
  } = useVendorPayoutAccounts();

  const payoutMethods = useMemo(
    () => payoutAccounts.map(mapPayoutAccountToMethod),
    [payoutAccounts]
  );

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

  const handleAddPayoutViaStripe = () => {
    stripeConnectMutation.mutate(undefined, {
      onSuccess: (url) => {
        window.location.href = url;
      },
      onError: (err: unknown) => {
        let msg = "Could not open Stripe. Please try again.";
        if (axios.isAxiosError(err)) {
          const d = err.response?.data as
            | { message?: string; responseMessage?: string }
            | undefined;
          const m = d?.message ?? d?.responseMessage;
          if (m) msg = Array.isArray(m) ? m.join(", ") : String(m);
          else if (err.message) msg = err.message;
        } else if (err instanceof Error) msg = err.message;
        toast.error(msg);
      },
    });
  };

  const handleDeletePayoutMethod = (_id: string) => {
    toast.info(
      "Connected payout accounts are managed in Stripe Connect. Remove or change them from your Stripe dashboard."
    );
  };

  const handleSetPrimaryPayout = (_id: string) => {
    toast.info(
      "The default payout account is set in Stripe Connect for your currency."
    );
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
          isLoading={isPayoutAccountsLoading}
          isStripeConnectPending={stripeConnectMutation.isPending}
          onAddMethod={handleAddPayoutViaStripe}
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

      <DeleteAccountDrawer
        isOpen={activeDrawer === "delete-account"}
        onClose={closeDrawer}
        onConfirm={handleDeleteAccountConfirm}
      />
    </div>
  );
}
