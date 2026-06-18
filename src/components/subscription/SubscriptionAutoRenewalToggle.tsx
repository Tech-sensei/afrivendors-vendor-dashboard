"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { formatSubscriptionDate } from "@/lib/subscription";
import { SubscriptionConfigError } from "@/lib/vendorSubscriptionApi";
import {
  useUpdateSubscriptionAutoRenewal,
} from "@/services/useVendorSubscriptionAPI";
import { useInvalidateVendorSubscription } from "@/hooks/useVendorSubscription";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserProfile } from "@/store/authSlice";
import type { VendorSubscriptionView } from "@/types/subscription";

function getErrorMessage(err: unknown): string {
  if (err instanceof SubscriptionConfigError) return err.message;
  const ax = err as {
    response?: { data?: { message?: string; responseMessage?: string } };
  };
  return (
    ax?.response?.data?.responseMessage ||
    ax?.response?.data?.message ||
    "Something went wrong. Please try again."
  );
}

type Props = {
  view: VendorSubscriptionView;
};

export function SubscriptionAutoRenewalToggle({ view }: Props) {
  const dispatch = useAppDispatch();
  const invalidateSubscription = useInvalidateVendorSubscription();
  const updateAutoRenewal = useUpdateSubscriptionAutoRenewal();
  const [disableConfirmOpen, setDisableConfirmOpen] = useState(false);

  const periodEnd =
    view.subscription?.currentPeriodEnd ?? view.trialEndsAt;

  const applyAutoRenewal = async (autoRenewal: boolean) => {
    try {
      await updateAutoRenewal.mutateAsync(autoRenewal);
      await dispatch(fetchUserProfile());
      invalidateSubscription();
      toast.success(
        autoRenewal
          ? "Auto-renewal is on. Your plan will renew automatically."
          : "Auto-renewal is off. Your subscription ends at the close of this period."
      );
    } catch (err) {
      toast.error("Could not update auto-renewal", {
        description: getErrorMessage(err),
      });
    }
  };

  const handleToggle = () => {
    if (view.autoRenewal) {
      setDisableConfirmOpen(true);
      return;
    }
    void applyAutoRenewal(true);
  };

  const handleConfirmDisable = () => {
    setDisableConfirmOpen(false);
    void applyAutoRenewal(false);
  };

  const isPending = updateAutoRenewal.isPending;

  return (
    <>
      <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-[#EFE6E1] bg-white p-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-secondary-000">Auto-renewal</p>
          <p className="mt-0.5 text-xs text-accent-80">
            {view.autoRenewal
              ? `Your plan renews automatically on ${formatSubscriptionDate(periodEnd)}.`
              : view.subscription?.cancelAtPeriodEnd
                ? `Your subscription ends on ${formatSubscriptionDate(periodEnd)}.`
                : "Turn on to continue billing at the end of this period."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={view.autoRenewal}
          aria-label="Toggle auto-renewal"
          disabled={isPending}
          onClick={handleToggle}
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            view.autoRenewal ? "bg-primary-100" : "bg-accent-30"
          }`}
        >
          {isPending ? (
            <span className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
            </span>
          ) : (
            <span
              className={`absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                view.autoRenewal ? "translate-x-5" : "translate-x-0"
              }`}
            />
          )}
        </button>
      </div>

      <ConfirmModal
        open={disableConfirmOpen}
        onOpenChange={setDisableConfirmOpen}
        onConfirm={handleConfirmDisable}
        title="Turn off auto-renewal?"
        description={`Your listing stays visible until ${formatSubscriptionDate(periodEnd)}. After that, you will need to subscribe again to appear in client search.`}
        confirmText="Turn off auto-renewal"
        cancelText="Keep auto-renewal"
      />
    </>
  );
}

export function canManageSubscriptionBilling(
  view: VendorSubscriptionView,
  hasStripeBilling: boolean
): boolean {
  if (!view.hasSubscription || view.isSkippedPlan || !hasStripeBilling) {
    return false;
  }
  return view.status === "active" || view.status === "trialing";
}
