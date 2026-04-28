"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import imgHeroImage from "../../../../public/assets/images/signInHeroImg.png";
import http from "@/lib/http";
import { clearPostKycRedirect, consumePostKycRedirect } from "@/lib/postKycRedirect";

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

export default function KycVerificationIntroPage() {
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const handleSkip = () => {
    const next = consumePostKycRedirect();
    router.replace(next ?? "/");
  };

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const { data } = await http.post<unknown>("/vendor/stripe-connect-account-link");
      const url = pickAccountLink(data);
      if (!url) {
        toast.error("Invalid response", { description: "No Stripe account link was returned." });
        return;
      }
      clearPostKycRedirect();
      window.location.assign(url);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string; responseMessage?: string } } };
      toast.error("Could not start verification", {
        description:
          ax?.response?.data?.responseMessage ||
          ax?.response?.data?.message ||
          "Please try again or contact support.",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary-700">
              <ShieldCheck className="h-9 w-9 text-primary-100" aria-hidden />
            </div>
            <h1 className="font-unbounded text-[clamp(24px,2.8vw,32px)] font-semibold leading-tight text-secondary-000">
              Verification needed
            </h1>
            <p className="mt-4 text-base leading-6 text-accent-80">
              Your account is active, but business verification is not finished yet. Complete it when you&apos;re ready
              to receive payments and use payout features.
            </p>
            <p className="mt-3 text-sm leading-5 text-accent-80">
              You can skip for now and complete this later from your dashboard or business profile.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={handleSkip}
                disabled={isStarting}
                className="flex h-14 flex-1 items-center justify-center rounded-xl border-2 border-accent-20 bg-white font-unageo text-base font-semibold text-secondary-000 transition-colors hover:bg-secondary-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => void handleStart()}
                disabled={isStarting}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-none bg-primary-100 font-unageo text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStarting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : null}
                {isStarting ? "Opening Stripe…" : "Start verification"}
              </button>
            </div>
          </div>
        </div>
        <div className="relative hidden h-screen overflow-hidden rounded-bl-[200px] bg-secondary-000 lg:block">
          <Image
            src={imgHeroImage}
            alt=""
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[rgba(29,13,4,0.15)]" />
        </div>
      </div>
    </div>
  );
}
