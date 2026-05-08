import { useMutation, useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import type { PayoutAccount } from "@/data/wallet";

export const VENDOR_PAYOUT_ACCOUNTS_QUERY_KEY = ["vendor", "accounts"] as const;

/** Stripe external account row from `GET /vendor/accounts` (shape may vary by object type). */
export interface VendorStripeExternalAccountApi {
  id: string;
  object: string;
  bank_name?: string | null;
  last4?: string | null;
  account_holder_name?: string | null;
  default_for_currency?: boolean;
  currency?: string | null;
  country?: string | null;
  status?: string | null;
  brand?: string | null;
}

function unwrapAccountsPayload(data: unknown): VendorStripeExternalAccountApi[] {
  if (Array.isArray(data)) return data as VendorStripeExternalAccountApi[];
  if (data && typeof data === "object" && "data" in data) {
    const inner = (data as { data: unknown }).data;
    if (Array.isArray(inner)) return inner as VendorStripeExternalAccountApi[];
  }
  return [];
}

function mapStripeRowToPayoutAccount(row: VendorStripeExternalAccountApi): PayoutAccount {
  const last4 = row.last4?.replace(/\D/g, "").slice(-4) || "????";
  const bankName = (row.bank_name || row.brand || "Bank").trim() || "Bank";
  const holder = row.account_holder_name?.trim();
  const cur = (row.currency || "").toUpperCase();

  if (row.object === "bank_account") {
    const label = holder || `${bankName}${cur ? ` (${cur})` : ""}`;
    return {
      id: row.id,
      type: "bank",
      name: label,
      details: `****${last4} - ${bankName}`,
      isDefault: Boolean(row.default_for_currency),
    };
  }

  if (row.object === "card") {
    return {
      id: row.id,
      type: "bank",
      name: holder || `${row.brand ?? "Card"}${cur ? ` (${cur})` : ""}`,
      details: `****${last4}${row.brand ? ` - ${row.brand}` : ""}`,
      isDefault: Boolean(row.default_for_currency),
    };
  }

  return {
    id: row.id,
    type: "bank",
    name: holder || `Payout account (${row.object})`,
    details: row.last4 ? `****${last4}` : row.id,
    isDefault: Boolean(row.default_for_currency),
  };
}

export function mapVendorAccountsToPayoutAccounts(
  rows: VendorStripeExternalAccountApi[]
): PayoutAccount[] {
  const mapped = rows.map(mapStripeRowToPayoutAccount);
  return mapped.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
}

export function useVendorPayoutAccounts() {
  return useQuery({
    queryKey: VENDOR_PAYOUT_ACCOUNTS_QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get<unknown>("/vendor/accounts");
      const rows = unwrapAccountsPayload(data);
      return mapVendorAccountsToPayoutAccounts(rows);
    },
    staleTime: 60_000,
  });
}

function unwrapAccountLink(data: unknown): string {
  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    if (typeof o.accountLink === "string" && o.accountLink.length > 0) {
      return o.accountLink;
    }
    const inner = o.data;
    if (inner && typeof inner === "object") {
      const link = (inner as Record<string, unknown>).accountLink;
      if (typeof link === "string" && link.length > 0) return link;
    }
  }
  throw new Error("No account link in response");
}

/** `POST /vendor/stripe-connect-account-link` → redirect URL for Stripe Connect onboarding. */
export async function fetchStripeConnectAccountLink(): Promise<string> {
  const { data } = await http.post<unknown>("/vendor/stripe-connect-account-link", {});
  return unwrapAccountLink(data);
}

export function useStripeConnectAccountLink() {
  return useMutation({
    mutationFn: fetchStripeConnectAccountLink,
  });
}
