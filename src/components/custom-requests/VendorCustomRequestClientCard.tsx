import type { ComponentType } from "react";
import { MapPin, Calendar, Clock, PoundSterling, Tag } from "lucide-react";
import type { VendorCustomRequest } from "@/types/vendorCustomRequests";
import { formatMoney } from "@/lib/vendorCustomRequestUi";
import { cn } from "@/lib/utils";

type Props = {
  request: VendorCustomRequest;
  className?: string;
};

export function VendorCustomRequestClientCard({ request, className }: Props) {
  const dateLabel = request.flexibleDates
    ? `${request.flexibleDates.start} – ${request.flexibleDates.end}`
    : request.preferredDate;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-accent-20 bg-white shadow-sm",
        className
      )}
    >
      <div className="border-b border-accent-20 bg-gradient-to-br from-primary-300/40 via-white to-secondary-800 px-5 py-5">
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white bg-primary-100 font-unbounded text-base font-semibold text-white shadow-md"
            aria-hidden
          >
            {request.customerInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium uppercase tracking-wide text-accent-80">
              Client
            </p>
            <p className="truncate font-unbounded text-lg font-semibold text-secondary-000">
              {request.customerName}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-secondary-000 shadow-sm">
                <Tag className="h-3 w-3 text-primary-100" />
                {request.category}
              </span>
              {request.urgency === "priority" && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">
                  Priority request
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="mt-1 text-xs text-accent-80">Posted {request.createdAt}</p>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-accent-80">
            What they need
          </p>
          <p className="text-sm leading-relaxed text-secondary-000">
            {request.description}
          </p>
        </div>

        <div className="grid gap-3 rounded-xl bg-secondary-800 p-4 sm:grid-cols-2">
          <MetaRow icon={Calendar} label="Date" value={dateLabel} />
          <MetaRow icon={Clock} label="Time" value={request.preferredTime} />
          <MetaRow icon={MapPin} label="Location" value={request.location} className="sm:col-span-2" />
          <MetaRow
            icon={PoundSterling}
            label="Budget"
            value={formatMoney(request.budget)}
            valueClassName="font-unbounded font-semibold text-primary-100"
          />
        </div>
      </div>
    </div>
  );
}

function MetaRow({
  icon: Icon,
  label,
  value,
  valueClassName,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueClassName?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-2.5", className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary-100" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-accent-80">
          {label}
        </p>
        <p className={cn("text-sm font-medium text-secondary-000", valueClassName)}>
          {value}
        </p>
      </div>
    </div>
  );
}
