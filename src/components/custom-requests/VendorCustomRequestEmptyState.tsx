"use client";

import { FileText } from "lucide-react";
import type { VendorCustomRequestTabId } from "@/types/vendorCustomRequests";

const COPY: Partial<
  Record<VendorCustomRequestTabId, { title: string; body: string }>
> = {
  incoming: {
    title: "No new requests",
    body: "When clients post custom jobs in your category, they will appear here for you to quote.",
  },
  quoted: {
    title: "No quotes awaiting client",
    body: "After you send a quote, it will show here until the client accepts and pays.",
  },
  active: {
    title: "No active jobs",
    body: "When a client accepts your quote and pays, the job moves here.",
  },
  completed: {
    title: "No completed jobs yet",
    body: "Finished jobs and released payments appear here.",
  },
  passed: {
    title: "Nothing here",
    body: "Requests you passed on or lost to another vendor appear in this tab.",
  },
};

export function VendorCustomRequestEmptyState({
  tab,
}: {
  tab: VendorCustomRequestTabId;
}) {
  const copy = COPY[tab] ?? {
    title: "No custom requests",
    body: "Browse tabs to see new jobs, quotes you have sent, and active work.",
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-accent-20 bg-white px-4 py-16">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100/10">
        <FileText className="h-8 w-8 text-primary-100" />
      </div>
      <h3 className="mb-2 font-unbounded text-lg font-semibold text-secondary-000">
        {copy.title}
      </h3>
      <p className="max-w-md text-center text-sm text-accent-80">{copy.body}</p>
    </div>
  );
}
