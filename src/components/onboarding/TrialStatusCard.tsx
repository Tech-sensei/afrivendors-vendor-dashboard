import { Eye } from "lucide-react";
import { formatSubscriptionDate } from "@/lib/subscription";
import type { VendorSubscriptionView } from "@/types/subscription";

type Props = {
  view: VendorSubscriptionView;
};

export function TrialStatusCard({ view }: Props) {
  return (
    <div className="rounded-2xl border border-[#EFE6E1] bg-[#FAF7F5] p-4">
      <div className="flex items-center gap-2">
        <Eye className="h-4 w-4 text-emerald-600" aria-hidden />
        <span className="text-sm font-semibold text-emerald-800">
          Visible to clients
        </span>
      </div>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-accent-80">Trial started</dt>
          <dd className="mt-0.5 text-sm font-semibold text-secondary-000">
            {formatSubscriptionDate(view.trialStartedAt)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-accent-80">Trial ends</dt>
          <dd className="mt-0.5 text-sm font-semibold text-secondary-000">
            {formatSubscriptionDate(view.trialEndsAt)}
            <span className="mt-0.5 block text-xs font-normal text-primary-100">
              {view.daysLeftInTrial} day
              {view.daysLeftInTrial !== 1 ? "s" : ""} left
            </span>
          </dd>
        </div>
      </dl>
    </div>
  );
}
