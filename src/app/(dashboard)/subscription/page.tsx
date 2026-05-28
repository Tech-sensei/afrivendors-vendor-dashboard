"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useVendorSubscription } from "@/hooks/useVendorSubscription";
import {
  VENDOR_SUBSCRIPTION_FEATURES,
  VENDOR_TRIAL_MONTHS,
  type VendorBillingIntervalId,
} from "@/data/subscriptionPlans";
import { formatSubscriptionDate } from "@/lib/subscription";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function SubscriptionPage() {
  const { hydrated, view, intervals, subscribe, cancelAtPeriodEnd } =
    useVendorSubscription();
  const [selectedInterval, setSelectedInterval] =
    useState<VendorBillingIntervalId>("quarterly");
  const [cancelOpen, setCancelOpen] = useState(false);

  const handleSubscribe = () => {
    const record = subscribe(selectedInterval);
    toast.success(
      `Subscribed (${selectedInterval}). Demo: visible until ${formatSubscriptionDate(record.currentPeriodEnd)}.`
    );
  };

  const handleCancel = () => {
    cancelAtPeriodEnd();
    setCancelOpen(false);
    toast.message("Subscription will end at the close of the current period.");
  };

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-4 p-8">
        <div className="h-8 w-48 rounded-lg bg-accent-20" />
        <div className="h-32 rounded-2xl bg-accent-20" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-12">
      <div className="mb-8">
        <h1 className="font-unbounded text-[28px] font-semibold leading-8 text-secondary-200">
          Subscription
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-accent-80">
          Your marketplace visibility. New vendors get {VENDOR_TRIAL_MONTHS}{" "}
          months free, then choose monthly, 3-month, 6-month, or yearly billing.
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-[#EFE6E1] bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-80">
              Listing visibility
            </p>
            <div className="mt-2 flex items-center gap-2">
              {view.isVisible ? (
                <>
                  <Eye className="h-5 w-5 text-emerald-600" />
                  <span className="font-unbounded text-lg font-semibold text-emerald-800">
                    Visible to clients
                  </span>
                </>
              ) : (
                <>
                  <EyeOff className="h-5 w-5 text-red-600" />
                  <span className="font-unbounded text-lg font-semibold text-red-800">
                    Hidden from search
                  </span>
                </>
              )}
            </div>
          </div>
          <StatusPill status={view.status} />
        </div>

        <dl className="mt-6 grid gap-4 border-t border-accent-20 pt-6 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-accent-80">Free trial started</dt>
            <dd className="mt-1 text-sm font-semibold text-secondary-000">
              {formatSubscriptionDate(view.trialStartedAt)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-accent-80">Free trial ends</dt>
            <dd className="mt-1 text-sm font-semibold text-secondary-000">
              {formatSubscriptionDate(view.trialEndsAt)}
              {view.status === "trialing" && (
                <span className="ml-2 text-primary-100">
                  ({view.daysLeftInTrial} days left)
                </span>
              )}
            </dd>
          </div>
          {view.subscription && (
            <>
              <div>
                <dt className="text-xs text-accent-80">Current plan</dt>
                <dd className="mt-1 text-sm font-semibold capitalize text-secondary-000">
                  {intervals.find((i) => i.id === view.subscription?.intervalId)
                    ?.label ?? view.subscription.intervalId}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-accent-80">Renews / ends</dt>
                <dd className="mt-1 text-sm font-semibold text-secondary-000">
                  {formatSubscriptionDate(view.subscription.currentPeriodEnd)}
                  {view.subscription.cancelAtPeriodEnd && (
                    <span className="block text-xs font-normal text-amber-800">
                      Cancels at period end
                    </span>
                  )}
                </dd>
              </div>
            </>
          )}
        </dl>
      </div>

      {(view.status === "trialing" || view.status === "expired") && (
        <section className="mb-8">
          <h2 className="mb-2 font-unbounded text-lg font-semibold text-secondary-000">
            {view.status === "expired"
              ? "Subscribe to restore visibility"
              : "Choose billing before trial ends"}
          </h2>
          <p className="mb-6 text-sm text-accent-80">
            Pick how often you want to be billed. You will not be charged during
            your free trial — payment starts when the trial ends (demo: instant
            checkout simulation).
          </p>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {intervals.map((interval) => (
              <button
                key={interval.id}
                type="button"
                onClick={() => setSelectedInterval(interval.id)}
                className={cn(
                  "rounded-2xl border-2 p-4 text-left transition-colors",
                  selectedInterval === interval.id
                    ? "border-primary-100 bg-primary-300/40"
                    : "border-[#EFE6E1] bg-white hover:border-accent-40"
                )}
              >
                {interval.popular && (
                  <span className="mb-2 inline-block rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    Popular
                  </span>
                )}
                <p className="font-semibold text-secondary-000">
                  {interval.label}
                </p>
                <p className="mt-1 font-unbounded text-xl font-semibold text-primary-100">
                  {interval.priceLabel}
                </p>
                <p className="text-xs text-accent-80">{interval.perMonthLabel}</p>
                {interval.saveLabel && (
                  <p className="mt-1 text-xs font-semibold text-emerald-700">
                    {interval.saveLabel}
                  </p>
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSubscribe}
            className="h-11 w-full rounded-[18px] bg-primary-100 font-semibold text-white hover:bg-primary-100/90 sm:w-auto sm:px-8"
          >
            {view.status === "expired"
              ? "Subscribe & go live"
              : "Select plan (demo)"}
          </button>
        </section>
      )}

      {view.status === "active" && view.subscription && (
        <section className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
          <p className="font-semibold text-emerald-900">
            You have an active subscription
          </p>
          <p className="mt-1 text-sm text-emerald-800">
            Your profile is visible. Manage renewal or cancel at period end below.
          </p>
          {!view.subscription.cancelAtPeriodEnd && (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="mt-4 text-sm font-semibold text-red-700 underline"
            >
              Cancel at period end
            </button>
          )}
        </section>
      )}

      <section className="rounded-2xl border border-accent-20 bg-white p-6">
        <h3 className="mb-4 font-unbounded text-base font-semibold text-secondary-000">
          What your subscription includes
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {VENDOR_SUBSCRIPTION_FEATURES.map((f) => (
            <li key={f} className="flex gap-2 text-sm text-secondary-000">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-100" />
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-accent-80">
          Questions? See how pricing works on the{" "}
          <Link
            href={process.env.NEXT_PUBLIC_CLIENT_APP_URL ?? "#"}
            className="font-semibold text-primary-100 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            client marketplace
          </Link>{" "}
          vendor programme page.
        </p>
      </section>

      <ConfirmModal
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        onConfirm={handleCancel}
        title="Cancel subscription?"
        description="Your listing stays visible until the end of the current billing period. After that, you will need to subscribe again to appear in client search."
        confirmText="Cancel at period end"
        cancelText="Keep subscription"
      />
    </div>
  );
}

function StatusPill({
  status,
}: {
  status: "trialing" | "active" | "expired" | "cancelled";
}) {
  const map = {
    trialing: {
      label: "Free trial",
      className: "bg-amber-50 text-amber-900 border-amber-200",
    },
    active: {
      label: "Subscribed",
      className: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    expired: {
      label: "Trial ended",
      className: "bg-red-50 text-red-800 border-red-200",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-accent-10 text-accent-80 border-accent-20",
    },
  };
  const c = map[status];
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-semibold",
        c.className
      )}
    >
      {c.label}
    </span>
  );
}
