/**
 * Sent as `portal` on `POST /auth/login` — must match backend contract.
 */
export const APP_AUTH_PORTAL = "vendor" as const;

const EXPECTED_LOGIN_ACCOUNT_TYPE = "vendor";

/** If login body omits `accountType`, we still persist (backend enforced portal). */
export function loginAccountTypeMatchesPortal(accountType?: string | null): boolean {
  if (accountType == null || String(accountType).trim() === "") return true;
  return String(accountType).trim().toLowerCase() === EXPECTED_LOGIN_ACCOUNT_TYPE;
}

export function wrongPortalLoginMessage(): string {
  return "This account isn't for the vendor portal. Sign in via the client or admin site.";
}

/** Throws so `mutateAsync` fails and callers don't navigate after login. */
export function assertLoginAccountTypeOrThrow(data: { accountType?: string | null }) {
  if (!loginAccountTypeMatchesPortal(data?.accountType)) {
    const err = new Error(wrongPortalLoginMessage()) as Error & { wrongPortal: true };
    err.wrongPortal = true;
    throw err;
  }
}
