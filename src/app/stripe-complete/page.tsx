"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

function launchConfetti() {
  void import("canvas-confetti").then(({ default: confetti }) => {
    const colors = ["#C0602D", "#16a34a", "#2563eb", "#eab308", "#7c3aed"];
    const end = Date.now() + 2200;

    const frame = () => {
      void confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      void confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    void confetti({
      particleCount: 110,
      spread: 82,
      origin: { y: 0.58 },
      colors,
    });
  });
}

export default function StripeCompletePage() {
  const router = useRouter();

  useEffect(() => {
    launchConfetti();
    const timer = setTimeout(() => {
      router.replace("/");
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-800 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-chart-2/15">
          <CheckCircle2 className="h-9 w-9 text-chart-2" aria-hidden />
        </div>
        <h1 className="font-unbounded text-2xl font-semibold text-secondary-000">Congratulations!</h1>
        <p className="mt-2 font-unageo text-sm text-accent-70">
          Your Stripe verification is complete. Redirecting you to the dashboard...
        </p>
      </div>
    </div>
  );
}