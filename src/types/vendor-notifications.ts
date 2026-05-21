import type {
  NotificationType,
  VendorNotification,
} from "@/data/notifications";

export type { NotificationType, VendorNotification };

export interface NotificationsListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface NotificationsPage {
  items: VendorNotification[];
  meta: NotificationsListMeta;
}
