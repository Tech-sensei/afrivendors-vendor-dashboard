"use client";

import { cn } from "@/lib/utils";
import {
  VENDOR_BILLING_INTERVALS,
  type VendorBillingIntervalId,
} from "@/data/subscriptionPlans";

type Props = {
  selectedInterval: VendorBillingIntervalId;
  onSelect: (intervalId: VendorBillingIntervalId) => void;
};

export function OnboardingPlanGrid({ selectedInterval, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {VENDOR_BILLING_INTERVALS.map((interval) => (
        <button
          key={interval.id}
          type="button"
          onClick={() => onSelect(interval.id)}
          className={cn(
            "relative rounded-2xl border-2 p-3 text-left transition-colors",
            selectedInterval === interval.id
              ? "border-primary-100 bg-primary-300/40"
              : "border-[#EFE6E1] bg-white hover:border-accent-40"
          )}
        >
          {interval.popular && (
            <span className="absolute -top-2 left-3 rounded-full bg-primary-100 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
              Popular
            </span>
          )}
          <p className="text-xs font-semibold text-secondary-000">
            {interval.label}
          </p>
          <p className="mt-1 font-unbounded text-lg font-semibold text-primary-100">
            {interval.priceLabel}
          </p>
          <p className="text-[10px] text-accent-80">{interval.perMonthLabel}</p>
          {interval.saveLabel && (
            <p className="mt-1 text-[10px] font-semibold text-emerald-700">
              {interval.saveLabel}
            </p>
          )}
        </button>
      ))}
    </div>
  );
}
