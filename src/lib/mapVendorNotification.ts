import { buildVendorNotificationHref } from "@/lib/notificationRoutes";
import type {
  NotificationReferenceType,
  NotificationType,
  VendorNotification,
} from "@/data/notifications";

const VENDOR_KNOWN_TYPES = new Set<NotificationType>([
  "booking",
  "payment",
  "message",
  "review",
  "update",
  "reminder",
  "calendar-event",
  "pinned-message",
]);

function typeFromReferenceType(
  referenceType: unknown
): NotificationType | null {
  const ref = String(referenceType ?? "").toLowerCase();
  if (ref === "chat_message") return "message";
  if (ref === "appointment_booking") return "booking";
  if (ref.includes("payment") || ref.includes("payout")) return "payment";
  if (ref.includes("review")) return "review";
  if (ref.includes("remind")) return "reminder";
  if (ref.includes("calendar")) return "calendar-event";
  if (ref.includes("pin") && ref.includes("message")) return "pinned-message";
  return null;
}

function normalizeVendorNotificationType(raw: unknown): NotificationType {
  const fromRef = typeFromReferenceType(raw);
  if (fromRef) return fromRef;

  const value = String(raw ?? "")
    .toLowerCase()
    .replace(/_/g, "-");

  if (value.includes("pin")) return "pinned-message";
  if (value.includes("calendar") && value.includes("event")) {
    return "calendar-event";
  }
  if (value.includes("remind")) return "reminder";
  if (value.includes("book") || value.includes("appointment")) return "booking";
  if (value.includes("payment") || value.includes("payout") || value.includes("wallet")) {
    return "payment";
  }
  if (value.includes("message") || value.includes("chat")) return "message";
  if (value.includes("review")) return "review";
  if (value.includes("rfs") || value.includes("request") || value.includes("quote")) {
    return "update";
  }

  if (VENDOR_KNOWN_TYPES.has(value as NotificationType)) {
    return value as NotificationType;
  }

  return "update";
}

function parseNotificationDate(raw: unknown): Date {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) return raw;
  const parsed = new Date(String(raw ?? ""));
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function readActionUrl(raw: Record<string, unknown>): string | undefined {
  const url = raw.actionUrl ?? raw.action_url ?? raw.link ?? raw.url ?? raw.href;
  if (url == null || url === "") return undefined;
  return String(url);
}

function readIsRead(raw: Record<string, unknown>): boolean {
  if (typeof raw.isRead === "boolean") return raw.isRead;
  if (typeof raw.read === "boolean") return raw.read;
  if (raw.readAt != null || raw.read_at != null) return true;
  return false;
}

function readOptionalString(raw: unknown): string | undefined {
  if (raw == null || raw === "") return undefined;
  return String(raw);
}

function readItemId(raw: Record<string, unknown>): number | null {
  const value = raw.itemId ?? raw.item_id ?? raw.referenceId ?? raw.reference_id;
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** Map a single API notification row to the vendor UI model. */
export function mapApiNotificationToVendor(raw: unknown): VendorNotification {
  const row =
    raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const metadata =
    row.metadata && typeof row.metadata === "object"
      ? (row.metadata as Record<string, unknown>)
      : {};

  const referenceType = String(
    row.referenceType ?? row.reference_type ?? ""
  ) as NotificationReferenceType;

  const itemId = readItemId(row);

  const type = normalizeVendorNotificationType(
    referenceType || row.type || row.category || row.event
  );

  const mapped: VendorNotification = {
    id: String(row.id ?? row._id ?? ""),
    type,
    title: String(row.title ?? row.subject ?? row.heading ?? "Notification"),
    message: String(
      row.message ?? row.body ?? row.content ?? row.description ?? ""
    ),
    timestamp: parseNotificationDate(
      row.createdAt ?? row.created_at ?? row.timestamp ?? row.sentAt
    ),
    isRead: readIsRead(row),
    referenceType: referenceType || undefined,
    itemId,
    isPinned: Boolean(row.isPinned ?? row.is_pinned ?? row.pinned ?? metadata.pinned),
    reminderDate: readOptionalString(
      row.reminderDate ?? row.reminder_date ?? metadata.reminderDate
    ),
    eventDate: readOptionalString(
      row.eventDate ?? row.event_date ?? metadata.eventDate
    ),
  };

  const explicitUrl = readActionUrl(row);
  mapped.actionUrl =
    explicitUrl ?? buildVendorNotificationHref(mapped) ?? undefined;

  return mapped;
}

export function parseUnreadCountResponse(body: unknown): number {
  if (typeof body === "number" && Number.isFinite(body)) {
    return Math.max(0, Math.floor(body));
  }

  const root =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  if (typeof root.count === "number") {
    return Math.max(0, Math.floor(root.count));
  }
  if (typeof root.unreadCount === "number") {
    return Math.max(0, Math.floor(root.unreadCount));
  }

  const nested =
    root.data && typeof root.data === "object"
      ? (root.data as Record<string, unknown>)
      : null;

  if (nested) {
    if (typeof nested.count === "number") {
      return Math.max(0, Math.floor(nested.count));
    }
    if (typeof nested.unreadCount === "number") {
      return Math.max(0, Math.floor(nested.unreadCount));
    }
  }

  return 0;
}

export function parseNotificationsListResponse(body: unknown): {
  items: VendorNotification[];
  meta: { page: number; limit: number; total: number; totalPages: number };
} {
  const root =
    body && typeof body === "object" ? (body as Record<string, unknown>) : {};

  const payload =
    root.data && typeof root.data === "object" && !Array.isArray(root.data)
      ? (root.data as Record<string, unknown>)
      : root;

  const rawList = Array.isArray(payload.data)
    ? payload.data
    : Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.notifications)
        ? payload.notifications
        : Array.isArray(root.data)
          ? root.data
          : [];

  const items = rawList.map((row) => mapApiNotificationToVendor(row));

  const metaRaw = (payload.meta ?? root.meta ?? {}) as Record<string, unknown>;
  const page = Number(metaRaw.page ?? 1);
  const limit = Number(metaRaw.limit ?? (items.length || 20));
  const total = Number(metaRaw.total ?? items.length);
  const totalPages = Math.max(
    1,
    Number(
      metaRaw.totalPages ??
        (limit > 0 ? Math.ceil(total / limit) : 1)
    )
  );

  return {
    items,
    meta: { page, limit, total, totalPages },
  };
}
