"use client";

import { History } from "lucide-react";
import {
  formatHistoryEventDate,
  formatHistoryEventTime,
  formatSubscriptionHistoryEvent,
} from "@/lib/formatSubscriptionHistoryEvent";
import { useSubscriptionHistory } from "@/hooks/useSubscriptionHistory";
import { useVendorSubscription } from "@/hooks/useVendorSubscription";

export function SubscriptionHistoryTimeline() {
  const { hydrated, view } = useVendorSubscription();
  const { data: events = [], isLoading, isError, isFetching } =
    useSubscriptionHistory(hydrated && view.hasSubscription);

  return (
    <section className="rounded-2xl border border-[#EFE6E1] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-2">
        <History className="h-5 w-5 text-primary-100" aria-hidden />
        <h3 className="font-unbounded text-base font-semibold text-secondary-000">
          Subscription history
        </h3>
      </div>

      {isLoading || isFetching ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-accent-20" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-accent-20" />
                <div className="h-3 w-48 animate-pulse rounded bg-accent-20" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-accent-80">
          Could not load subscription history. Please refresh the page.
        </p>
      ) : events.length === 0 ? (
        <p className="text-sm text-accent-80">
          No subscription activity yet. Events will appear here when your trial
          starts or your plan changes.
        </p>
      ) : (
        <ol className="relative space-y-0">
          {events.map((event, index) => {
            const { title, detail } = formatSubscriptionHistoryEvent(event);
            const isLast = index === events.length - 1;

            return (
              <li key={event.id} className="relative flex gap-4 pb-6">
                {!isLast && (
                  <span
                    className="absolute left-[5px] top-3 h-[calc(100%-4px)] w-px bg-[#EFE6E1]"
                    aria-hidden
                  />
                )}
                <span
                  className="relative z-[1] mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-primary-100 bg-white"
                  aria-hidden
                />
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-xs font-medium text-accent-80">
                    {formatHistoryEventDate(event.createdAt)}
                    {formatHistoryEventTime(event.createdAt)
                      ? ` · ${formatHistoryEventTime(event.createdAt)}`
                      : ""}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-secondary-000">
                    {title}
                  </p>
                  {detail ? (
                    <p className="mt-0.5 text-sm text-accent-80">{detail}</p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
