"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DISPUTE_RESOLUTION_MIN_LENGTH } from "@/lib/disputeResolution";

/** Above detail drawers (`z-[1000]`) and nested drawers (`z-[1002]`). */
const MODAL_OVERLAY_Z = "z-[1100]";
const MODAL_CONTENT_Z = "z-[1101]";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  isPending?: boolean;
  onConfirm: (resolution: string) => void;
};

export function DisputeResolutionDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  isPending = false,
  onConfirm,
}: Props) {
  const [resolution, setResolution] = useState("");

  const reset = () => setResolution("");

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const trimmed = resolution.trim();
  const valid = trimmed.length >= DISPUTE_RESOLUTION_MIN_LENGTH;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        overlayClassName={MODAL_OVERLAY_Z}
        className={`${MODAL_CONTENT_Z} max-w-md rounded-2xl border-accent-20 sm:max-w-lg`}
      >
        <DialogHeader>
          <DialogTitle className="font-unbounded text-xl font-semibold text-secondary-000">
            {title}
          </DialogTitle>
          <DialogDescription className="text-left text-sm leading-relaxed text-accent-80">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-1">
          <label
            htmlFor="vendor-dispute-resolution"
            className="text-xs font-semibold text-secondary-000"
          >
            Resolution note
          </label>
          <textarea
            id="vendor-dispute-resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Describe what you agreed with the customer…"
            rows={5}
            className="min-h-[140px] w-full resize-y rounded-xl border border-accent-20 bg-white px-3 py-2.5 text-sm text-secondary-000 outline-none focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20"
          />
          <p className="text-xs text-accent-80">
            {trimmed.length}/{DISPUTE_RESOLUTION_MIN_LENGTH} characters minimum
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            type="button"
            className="h-12 w-full rounded-[18px] bg-red-600 text-base font-semibold text-white hover:bg-red-700"
            disabled={!valid || isPending}
            onClick={() => valid && onConfirm(trimmed)}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              confirmLabel
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-[18px] border-accent-20 text-base font-semibold"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
