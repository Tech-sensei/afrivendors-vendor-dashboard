import { consumePostKycRedirect } from "@/lib/postKycRedirect";
import type { VendorApiSubscription } from "@/types/subscription";

export const TRIAL_WELCOME_DISMISSED_KEY =
  "afrivendors_trial_welcome_dismissed";

/** No subscription record yet — show onboarding. */
export function needsSubscriptionOnboarding(
  subscription: VendorApiSubscription | null | undefined
): boolean {
  return subscription == null;
}

export function redirectToDashboardAfterOnboarding() {
  const destination = consumePostKycRedirect() ?? "/";
  window.location.assign(destination);
}

export function redirectToStripeCheckout(checkoutUrl: string) {
  window.location.assign(checkoutUrl);
}

export function isTrialWelcomeDismissed(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(TRIAL_WELCOME_DISMISSED_KEY) === "1";
}

export function dismissTrialWelcome() {
  if (typeof window === "undefined") return;
  localStorage.setItem(TRIAL_WELCOME_DISMISSED_KEY, "1");
}
