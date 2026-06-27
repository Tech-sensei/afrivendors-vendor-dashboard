"use client";

import { X, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VendorCustomRequest } from "@/types/vendorCustomRequests";

type Props = {
  request: VendorCustomRequest;
  onClose: () => void;
  onCreateChannel?: () => void;
  disableCreate?: boolean;
};

export function CustomRequestMessagePlaceholder({
  request,
  onClose,
  onCreateChannel,
  disableCreate = false,
}: Props) {
  const firstName = request.customerName.split(" ")[0] ?? "customer";

  return (
    <>
      <div className="flex shrink-0 flex-row items-center gap-3 border-b border-accent-20 bg-white px-6 py-4 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-300/10 transition-colors hover:bg-secondary-300/20"
          aria-label="Close"
        >
          <X className="h-4 w-4 text-secondary-000" />
        </button>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate font-unbounded text-base font-bold text-secondary-000">
            {request.customerName}
          </p>
          <p className="truncate font-unageo text-xs font-medium text-secondary-300">
            {request.title}
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-[#F8F5F2] p-4">
        <div className="my-4 flex justify-center">
          <span className="rounded-full bg-white/50 px-3 py-1 font-unageo text-xs text-secondary-300/60">
            Today
          </span>
        </div>

        <div className="mx-auto mt-8 max-w-xs rounded-2xl border border-accent-20 bg-white p-4 text-center shadow-sm">
          <p className="mb-2 font-unbounded text-sm font-medium text-secondary-000">
            Start a conversation
          </p>
          <p className="font-unageo text-xs leading-relaxed text-secondary-300">
            No chat for this custom request yet. Create the channel to message{" "}
            {request.customerName} here.
          </p>
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-unageo"
              onClick={onCreateChannel}
              disabled={disableCreate || !request.customerUserId}
            >
              Chat with {firstName}
            </Button>
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-accent-20 bg-white p-4">
        <div className="flex w-full items-end gap-2 rounded-3xl border border-transparent bg-[#F8F5F2] p-2 opacity-60">
          <Button type="button" variant="ghost" size="icon-sm" className="rounded-full shrink-0" disabled>
            <Paperclip className="h-4 w-4" />
          </Button>
          <textarea
            readOnly
            placeholder="Messaging unavailable"
            rows={1}
            disabled
            className="min-h-[40px] max-h-[120px] flex-1 resize-none border-0 bg-transparent font-unageo text-sm placeholder:text-secondary-300/60"
          />
          <Button type="button" size="icon-sm" className="rounded-full shrink-0" disabled>
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </>
  );
}
