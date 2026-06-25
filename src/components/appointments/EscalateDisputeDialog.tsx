"use client";

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

/** Above detail drawers (`z-[1000]`) and nested drawers (`z-[1002]`). */
const MODAL_OVERLAY_Z = "z-[1100]";
const MODAL_CONTENT_Z = "z-[1101]";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  onConfirm: () => void;
};

export function EscalateDisputeDialog({
  open,
  onOpenChange,
  isPending = false,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        overlayClassName={MODAL_OVERLAY_Z}
        className={`${MODAL_CONTENT_Z} max-w-md rounded-2xl border-accent-20 sm:max-w-lg`}
      >
        <DialogHeader>
          <DialogTitle className="font-unbounded text-lg text-secondary-000">
            Escalate to Afrivendors
          </DialogTitle>
          <DialogDescription className="font-unageo text-left text-sm leading-relaxed text-accent-60">
            If you could not resolve this with the customer, our team will review
            the dispute and decide. A dispute can only be escalated once.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="h-11 w-full gap-2 bg-primary-100 font-unageo hover:bg-primary-100/90"
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit escalation"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full font-unageo"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
