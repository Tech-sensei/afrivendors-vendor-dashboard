"use client";

import Link from "next/link";
import { AlertTriangle, Sparkles } from "lucide-react";
import { useVendorSubscription } from "@/hooks/useVendorSubscription";
import { formatSubscriptionDate } from "@/lib/subscription";

export function SubscriptionBanner() {
  const { hydrated, view } = useVendorSubscription();

  if (!hydrated) return null;

  if (view.status === "trialing" && view.daysLeftInTrial <= 30) {
    return (
      <div className="mx-6 mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 lg:mx-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Free trial · {view.daysLeftInTrial} day
                {view.daysLeftInTrial !== 1 ? "s" : ""} left
              </p>
              <p className="mt-0.5 text-xs text-amber-800">
                Your listing stays visible until{" "}
                {formatSubscriptionDate(view.trialEndsAt)}. Subscribe before then
                to avoid interruption.
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

  if (view.status === "expired") {
    return (
      <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 lg:mx-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-700" />
            <div>
              <p className="text-sm font-semibold text-red-900">
                Subscription required
              </p>
              <p className="mt-0.5 text-xs text-red-800">
                Your free trial ended on{" "}
                {formatSubscriptionDate(view.trialEndsAt)}. Your profile is
                hidden from clients until you subscribe.
              </p>
            </div>
          </div>
          <Link
            href="/subscription"
            className="shrink-0 rounded-[14px] bg-primary-100 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-100/90"
          >
            Subscribe now
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
