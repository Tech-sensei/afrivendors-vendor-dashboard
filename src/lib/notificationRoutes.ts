import type { VendorNotification } from "@/data/notifications";

/** Maps legacy notification action keys to vendor dashboard routes. */
export const VENDOR_NOTIFICATION_ROUTE_MAP: Record<string, string> = {
  "vendor-appointments": "/appointments",
  "vendor-messages": "/messages",
  "vendor-wallet": "/wallet",
  "vendor-reviews": "/reviews",
  "vendor-services": "/services",
  "vendor-custom-requests": "/custom-requests",
  "vendor-analytics": "/analytics",
  "vendor-settings": "/settings",
  "vendor-business-profile": "/business-profile",
  "vendor-help-support": "/help-support",
  "vendor-notifications": "/notifications",
};

/** Build in-app route from API notification fields. */
export function buildVendorNotificationHref(
  notification: Pick<
    VendorNotification,
    "referenceType" | "itemId" | "type" | "actionUrl"
  >
): string | undefined {
  const itemId = notification.itemId;
  const ref = notification.referenceType?.toLowerCase();

  if (ref === "chat_message" && itemId != null) {
    return `/messages?itemId=${itemId}`;
  }
  if (ref === "appointment_booking" && itemId != null) {
    return `/appointments?appointmentId=${itemId}`;
  }

  if (notification.actionUrl) {
    return resolveVendorNotificationHref(notification.actionUrl);
  }

  if (notification.type === "message" && itemId != null) {
    return `/messages?itemId=${itemId}`;
  }
  if (notification.type === "booking" && itemId != null) {
    return `/appointments?appointmentId=${itemId}`;
  }

  if (notification.type === "message") return "/messages";
  if (notification.type === "booking") return "/appointments";
  if (notification.type === "payment") return "/wallet";
  if (notification.type === "review") return "/reviews";

  return "/notifications";
}

export function resolveVendorNotificationHref(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  if (url.startsWith("vendor-")) {
    return VENDOR_NOTIFICATION_ROUTE_MAP[url] ?? `/${url.replace(/^vendor-/, "")}`;
  }
  if (url.startsWith("/")) {
    return url;
  }
  return `/${url}`;
}
