const KEY = "postKycRedirect";

export function savePostKycRedirect(path: string | null) {
  if (typeof window === "undefined" || !path) return;
  if (path.startsWith("/") && !path.startsWith("//")) {
    sessionStorage.setItem(KEY, path);
  }
}

/** Returns saved path and clears storage (internal paths only). */
export function consumePostKycRedirect(): string | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(KEY);
  sessionStorage.removeItem(KEY);
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null;
  return raw;
}

export function clearPostKycRedirect() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(KEY);
}
