"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PartyPopper } from "lucide-react";
import imgHeroImage from "../../../../../public/assets/images/signUpHeroImg.png";

function launchConfetti() {
  void import("canvas-confetti").then(({ default: confetti }) => {
    const colors = ["#C0602D", "#16a34a", "#2563eb", "#eab308", "#7c3aed"];
    const end = Date.now() + 2500;

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
      particleCount: 120,
      spread: 80,
      origin: { y: 0.55 },
      colors,
    });
  });
}

export default function SignUpCelebrationPage() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    setEmail(new URLSearchParams(window.location.search).get("email") || "");
    launchConfetti();
  }, []);

  const verifyHref = email ? `/verify-email?email=${encodeURIComponent(email)}` : "/verify-email";

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center p-6 md:p-8 lg:p-12">
          <div className="mx-auto w-full max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary-700">
              <PartyPopper className="h-10 w-10 text-primary-100" aria-hidden />
            </div>
            <h1 className="font-unbounded text-[clamp(24px,2.8vw,32px)] font-semibold leading-tight text-secondary-000">
              You&apos;re almost there!
            </h1>
            <p className="mt-4 text-base leading-6 text-accent-80">
              Your vendor account is being set up. You get{" "}
              <span className="font-semibold text-secondary-000">6 months free</span>{" "}
              marketplace visibility from today. Next, confirm your email so we can
              activate your access.
            </p>
            {email ? (
              <p className="mt-2 text-sm font-semibold text-secondary-000">{email}</p>
            ) : null}
            <Link
              href={verifyHref}
              className="mt-10 inline-flex h-14 w-full max-w-sm items-center justify-center rounded-xl bg-primary-100 text-base font-semibold text-white transition-opacity duration-200 hover:opacity-90"
            >
              Continue to email verification
            </Link>
            <p className="mt-6 text-sm text-accent-80">We&apos;ll send a link to the address you used at sign-up.</p>
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
