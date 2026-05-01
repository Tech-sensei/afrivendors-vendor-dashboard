"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import http from "@/lib/http";
import { useAppSelector } from "@/store/hooks";

function pickAccountLink(body: unknown): string | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  if (typeof o.accountLink === "string" && o.accountLink.startsWith("http")) return o.accountLink;
  const inner = o.data;
  if (inner && typeof inner === "object") {
    const link = (inner as Record<string, unknown>).accountLink;
    if (typeof link === "string" && link.startsWith("http")) return link;
  }
  return null;
}

export function KycNotificationBanner() {
  const profile = useAppSelector((state) => state.auth.profile);
  const [isOpening, setIsOpening] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const flags = useMemo(() => {
    const vendor = profile?.vendor;
    const kyc = profile?.kyc;
    return {
      kycSubmitted: kyc?.kycSubmitted ?? vendor?.kycSubmitted,
      canReceivePayment: kyc?.canReceivePayment ?? vendor?.canReceivePayment,
      canHandlePayout: kyc?.canHandlePayout ?? vendor?.canHandlePayout,
    };
  }, [profile]);

  const shouldShow =
    flags.kycSubmitted === false ||
    flags.canReceivePayment === false ||
    flags.canHandlePayout === false;

  if (!shouldShow || dismissed) return null;

  const handleCompleteVerification = async () => {
    setIsOpening(true);
    try {
      const { data } = await http.post<unknown>("/vendor/stripe-connect-account-link");
      const url = pickAccountLink(data);
      if (!url) {
        toast.error("Invalid response", { description: "No Stripe account link was returned." });
        return;
      }
      window.location.assign(url);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string; responseMessage?: string } } };
      toast.error("Could not open verification", {
        description:
          ax?.response?.data?.responseMessage ||
          ax?.response?.data?.message ||
          "Please try again later.",
      });
    } finally {
      setIsOpening(false);
    }
  };

  return (
    <div className="relative mb-4 rounded-xl border border-chart-5/40 bg-chart-5/10 p-4">
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 text-secondary-000 transition-colors hover:bg-white/70"
        aria-label="Dismiss verification notice"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-3 pr-12">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-chart-5/15 sm:h-7 sm:w-7">
            <AlertTriangle className="h-4 w-4 text-chart-5 sm:h-4.5 sm:w-4.5" aria-hidden />
          </div>
          <div>
            <p className="font-unbounded text-sm font-semibold text-secondary-000">Complete Stripe verification</p>
            <p className="mt-1 font-unageo text-sm text-secondary-000/80">
              Some account verification checks are incomplete. Complete setup to fully enable payments and payouts.
            </p>
          </div>
        </div>
        <div className="pl-8.5 sm:pl-10">
          <button
            type="button"
            onClick={() => void handleCompleteVerification()}
            disabled={isOpening}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-lg bg-primary-100 px-4 font-unageo text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isOpening ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            {isOpening ? "Opening Stripe..." : "Complete verification"}
          </button>
        </div>
      </div>
    </div>
  );
}
