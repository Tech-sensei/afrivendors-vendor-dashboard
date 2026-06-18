import http from "@/lib/http";
import { pickStripeRedirectUrl } from "@/lib/stripeRedirect";
import {
  getStripePriceIdForInterval,
  type VendorBillingIntervalId,
} from "@/data/subscriptionPlans";

export type CreateSubscriptionInput =
  | { mode: "skip" }
  | { mode: "checkout"; intervalId: VendorBillingIntervalId };

export class SubscriptionConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubscriptionConfigError";
  }
}

export async function postCreateVendorSubscription(input: CreateSubscriptionInput) {
  const body =
    input.mode === "skip"
      ? { skip: true as const }
      : {
          skip: false as const,
          duration: getStripePriceIdForInterval(input.intervalId),
        };

  if (input.mode === "checkout" && !body.duration) {
    throw new SubscriptionConfigError(
      "This billing plan is not configured. Please contact support."
    );
  }

  const { data } = await http.post<unknown>(
    "/subscription/create-subscription",
    body
  );

  const redirectUrl = pickStripeRedirectUrl(data);

  return {
    data,
    checkoutUrl: input.mode === "checkout" ? redirectUrl : null,
  };
}

export async function cancelVendorSubscriptionAtPeriodEnd() {
  await http.patch("/subscription/cancel");
}

export async function patchSubscriptionAutoRenewal(autoRenewal: boolean) {
  await http.patch("/subscription/auto-renewal", { autoRenewal });
}
