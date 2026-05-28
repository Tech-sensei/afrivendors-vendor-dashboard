"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DISPUTE_RESOLUTION_MIN_LENGTH } from "@/lib/disputeResolution";

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
      <DialogContent className="max-w-md rounded-2xl border-accent-20 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-unbounded text-lg text-secondary-000">
            {title}
          </DialogTitle>
          <DialogDescription className="font-unageo text-sm text-accent-60">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <label
            htmlFor="vendor-dispute-resolution"
            className="font-unageo text-xs font-semibold text-secondary-000"
          >
            Resolution note
          </label>
          <textarea
            id="vendor-dispute-resolution"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            placeholder="Describe what you agreed with the customer…"
            rows={5}
            className="min-h-[120px] w-full resize-y rounded-xl border border-accent-20 bg-white px-3 py-2.5 font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20"
          />
          <p className="font-unageo text-xs text-accent-60">
            {trimmed.length}/{DISPUTE_RESOLUTION_MIN_LENGTH} characters minimum
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="font-unageo"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="gap-2 bg-red-600 font-unageo hover:bg-red-700"
            disabled={!valid || isPending}
            onClick={() => valid && onConfirm(trimmed)}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
