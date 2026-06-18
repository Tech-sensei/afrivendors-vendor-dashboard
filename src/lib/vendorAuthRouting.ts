import type { VendorLoginResponse } from "@/types/auth";
import { needsSubscriptionOnboarding } from "@/lib/subscriptionOnboarding";

function isKycSubmitted(session: VendorLoginResponse): boolean {
  return (
    session.kyc?.kycSubmitted === true ||
    session.vendorKyc?.kycSubmitted === true
  );
}

/** Resolve first route after sign-in from login/refresh session snapshot. */
export function resolvePostAuthPath(
  session: VendorLoginResponse,
  redirectPath: string | null
): string {
  if (!isKycSubmitted(session)) {
    return "/kyc-verification";
  }
  if (needsSubscriptionOnboarding(session.subscription)) {
    return "/onboarding/subscription";
  }
  return redirectPath ?? "/";
}
