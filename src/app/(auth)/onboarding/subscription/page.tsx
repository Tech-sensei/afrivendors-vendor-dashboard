"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import imgHeroImage from "../../../../../public/assets/images/signInHeroImg.png";
import { OnboardingPlanGrid } from "@/components/onboarding/OnboardingPlanGrid";
import { TrialStatusCard } from "@/components/onboarding/TrialStatusCard";
import {
  useInvalidateVendorSubscription,
  useVendorSubscription,
} from "@/hooks/useVendorSubscription";
import { useCreateVendorSubscription } from "@/services/useVendorSubscriptionAPI";
import {
  needsSubscriptionOnboarding,
  redirectToDashboardAfterOnboarding,
  redirectToStripeCheckout,
} from "@/lib/subscriptionOnboarding";
import { formatSubscriptionDate } from "@/lib/subscription";
import { SubscriptionConfigError } from "@/lib/vendorSubscriptionApi";
import {
  VENDOR_BILLING_INTERVALS,
  type VendorBillingIntervalId,
} from "@/data/subscriptionPlans";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserProfile } from "@/store/authSlice";

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

export default function SubscriptionOnboardingPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const invalidateSubscription = useInvalidateVendorSubscription();
  const { hydrated, view, apiSubscription } = useVendorSubscription();
  const createSubscription = useCreateVendorSubscription();
  const [selectedInterval, setSelectedInterval] =
    useState<VendorBillingIntervalId>("quarterly");

  useEffect(() => {
    if (hydrated && !needsSubscriptionOnboarding(apiSubscription)) {
      router.replace("/");
    }
  }, [hydrated, apiSubscription, router]);

  const handleSkipForNow = async () => {
    try {
      await createSubscription.mutateAsync({ mode: "skip" });
      await dispatch(fetchUserProfile());
      invalidateSubscription();
      toast.success("Your 6-month free trial is active.");
      redirectToDashboardAfterOnboarding();
    } catch (err) {
      toast.error("Could not start free trial", { description: getErrorMessage(err) });
    }
  };

  const handleSelectPlan = async () => {
    try {
      const { checkoutUrl } = await createSubscription.mutateAsync({
        mode: "checkout",
        intervalId: selectedInterval,
      });
      if (!checkoutUrl) {
        toast.error("Invalid response", {
          description: "No checkout URL was returned from the server.",
        });
        return;
      }
      redirectToStripeCheckout(checkoutUrl);
    } catch (err) {
      toast.error("Could not start checkout", { description: getErrorMessage(err) });
    }
  };

  const isSubmitting = createSubscription.isPending;
  const selectedLabel =
    VENDOR_BILLING_INTERVALS.find((i) => i.id === selectedInterval)?.label ??
    "plan";

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center overflow-y-auto p-6 md:p-8 lg:p-12">
          <div className="mx-auto w-full max-w-lg">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-700">
              <Sparkles className="h-9 w-9 text-primary-100" aria-hidden />
            </div>
            <h1 className="font-unbounded text-[clamp(24px,2.8vw,32px)] font-semibold leading-tight text-secondary-000">
              You&apos;re live for 6 months free
            </h1>
            <p className="mt-4 text-base leading-6 text-accent-80">
              Your profile is visible to clients now. Pick a billing cycle for
              when your trial ends, or skip and decide later.
            </p>

            {hydrated ? (
              <div className="mt-6">
                <TrialStatusCard view={view} />
              </div>
            ) : (
              <div className="mt-6 h-28 animate-pulse rounded-2xl bg-accent-20" />
            )}

            <div className="mt-8">
              <h2 className="font-unbounded text-base font-semibold text-secondary-000">
                Choose billing for after trial
              </h2>
              <p className="mt-1 text-sm text-accent-80">
                {hydrated
                  ? `Add a card via Stripe — you won't be charged until ${formatSubscriptionDate(view.trialEndsAt)}.`
                  : "Add a card via Stripe — you won't be charged until your trial ends."}
              </p>
              <div className="mt-4">
                <OnboardingPlanGrid
                  selectedInterval={selectedInterval}
                  onSelect={setSelectedInterval}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => void handleSelectPlan()}
                disabled={isSubmitting || !hydrated}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary-100 font-unageo text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                ) : null}
                {isSubmitting
                  ? "Opening Stripe…"
                  : `Select ${selectedLabel} & add card`}
              </button>
              <button
                type="button"
                onClick={() => void handleSkipForNow()}
                disabled={isSubmitting}
                className="mt-1 bg-transparent font-unageo text-sm font-semibold text-accent-80 underline transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>

        <div className="relative hidden h-screen overflow-hidden rounded-bl-[200px] bg-secondary-000 lg:block">
          <Image
            src={imgHeroImage}
            alt=""
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[rgba(29,13,4,0.15)]" />
        </div>
      </div>
    </div>
  );
}
