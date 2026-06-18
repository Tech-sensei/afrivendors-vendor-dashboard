"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { useVendorSubscription } from "@/hooks/useVendorSubscription";
import { formatSubscriptionDate } from "@/lib/subscription";
import {
  dismissTrialWelcome,
  isTrialWelcomeDismissed,
} from "@/lib/subscriptionOnboarding";

export function TrialWelcomeCard() {
  const { hydrated, view } = useVendorSubscription();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(isTrialWelcomeDismissed());
  }, []);

  if (!hydrated || dismissed) return null;
  if (view.status !== "trialing") return null;
  if (!view.isSkippedPlan) return null;
  if (view.daysLeftInTrial <= 30) return null;

  const handleDismiss = () => {
    dismissTrialWelcome();
    setDismissed(true);
  };

  return (
    <div className="relative mb-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-[#FAF7F5] px-4 py-4">
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-accent-80 transition-colors hover:bg-white/80"
        aria-label="Dismiss welcome notice"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex flex-wrap items-start justify-between gap-3 pr-10">
        <div className="flex gap-3">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Free trial active · {view.daysLeftInTrial} days left
            </p>
            <p className="mt-0.5 text-xs text-amber-800">
              Your listing is visible. Choose a plan anytime before{" "}
              {formatSubscriptionDate(view.trialEndsAt)} to avoid interruption.
            </p>
          </div>
        </div>
        <Link
          href="/subscription"
          className="shrink-0 rounded-[14px] bg-primary-100 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-100/90"
        >
          View plans
        </Link>
      </div>
    </div>
  );
}
