const URL_KEYS = [
  "url",
  "checkoutUrl",
  "checkout_url",
  "checkoutSessionUrl",
  "sessionUrl",
  "paymentUrl",
  "redirectUrl",
  "redirect_url",
  "accountLink",
] as const;

function isHttpUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("http");
}

function readUrlFromObject(obj: Record<string, unknown>): string | null {
  for (const key of URL_KEYS) {
    if (isHttpUrl(obj[key])) return obj[key];
  }
  return null;
}

/** Extract a Stripe redirect URL from common API response shapes. */
export function pickStripeRedirectUrl(body: unknown): string | null {
  if (isHttpUrl(body)) return body;
  if (!body || typeof body !== "object") return null;

  const root = body as Record<string, unknown>;
  const fromRoot = readUrlFromObject(root);
  if (fromRoot) return fromRoot;

  const inner = root.data;
  if (isHttpUrl(inner)) return inner;
  if (inner && typeof inner === "object") {
    return readUrlFromObject(inner as Record<string, unknown>);
  }

  return null;
}
