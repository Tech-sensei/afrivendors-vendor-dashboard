import axios from "axios";
import { parseCookies, setCookie } from "nookies";
import type { VendorAuthRefreshResponse } from "@/types/auth";

/** Match backend JWT lifetime (30 minutes). */
const ACCESS_MAX_AGE = 30 * 60;
/** Match backend refresh lifetime (24 hours). */
const REFRESH_MAX_AGE = 24 * 60 * 60;

function unwrapData<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data: unknown }).data;
    if (inner && typeof inner === "object") return inner as T;
  }
  return raw as T;
}

/**
 * Calls `POST /auth/refresh` with the **refresh** JWT as Bearer (not the access token).
 * Updates cookies when successful. Does not use the shared `http` client (no interceptors).
 */
export async function performTokenRefresh(): Promise<VendorAuthRefreshResponse | null> {
  if (typeof window === "undefined") return null;

  const { refreshToken } = parseCookies();
  if (!refreshToken) return null;

  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  if (!baseURL) return null;

  try {
    const res = await axios.post<unknown>(
      `${baseURL.replace(/\/$/, "")}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const body = unwrapData<VendorAuthRefreshResponse>(res.data);
    if (!body?.accessToken) return null;

    setCookie(null, "accessToken", body.accessToken, {
      maxAge: ACCESS_MAX_AGE,
      path: "/",
    });
    if (body.refreshToken) {
      setCookie(null, "refreshToken", body.refreshToken, {
        maxAge: REFRESH_MAX_AGE,
        path: "/",
      });
    }

    return body;
  } catch {
    return null;
  }
}
