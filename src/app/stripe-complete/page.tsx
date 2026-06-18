"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { needsSubscriptionOnboarding } from "@/lib/subscriptionOnboarding";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserProfile } from "@/store/authSlice";

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
  const dispatch = useAppDispatch();
  const [redirectTarget, setRedirectTarget] = useState<"dashboard" | "subscription">(
    "dashboard"
  );

  useEffect(() => {
    launchConfetti();

    const run = async () => {
      let needsOnboarding = false;
      try {
        const profile = await dispatch(fetchUserProfile()).unwrap();
        needsOnboarding = needsSubscriptionOnboarding(profile.subscription);
      } catch {
        needsOnboarding = false;
      }

      setRedirectTarget(needsOnboarding ? "subscription" : "dashboard");

      setTimeout(() => {
        router.replace(
          needsOnboarding ? "/onboarding/subscription" : "/"
        );
      }, 4000);
    };

    void run();
  }, [dispatch, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary-800 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-chart-2/15">
          <CheckCircle2 className="h-9 w-9 text-chart-2" aria-hidden />
        </div>
        <h1 className="font-unbounded text-2xl font-semibold text-secondary-000">Congratulations!</h1>
        <p className="mt-2 font-unageo text-sm text-accent-70">
          Setup complete. Redirecting you{" "}
          {redirectTarget === "subscription"
            ? "to finish your account setup"
            : "to the dashboard"}
          …
        </p>
      </div>
    </div>
  );
}
