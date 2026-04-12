"use client";

import { useEffect, useRef } from "react";
import { parseCookies } from "nookies";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearAuth, fetchUserProfile } from "@/store/authSlice";
import { redirectToSignIn } from "@/lib/http";

function getTokenExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const { accessToken } = parseCookies();

    if (!accessToken) {
      if (isAuthenticated) dispatch(clearAuth());
      return;
    }

    const expiryMs = getTokenExpiry(accessToken);
    const now = Date.now();

    if (expiryMs !== null && expiryMs <= now) {
      // Token is already expired — log out immediately
      redirectToSignIn();
      return;
    }

    // Token is valid — fetch profile
    dispatch(fetchUserProfile());

    // Schedule proactive logout when token expires
    if (expiryMs !== null) {
      const delay = expiryMs - now;
      timerRef.current = setTimeout(() => {
        redirectToSignIn();
      }, delay);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
