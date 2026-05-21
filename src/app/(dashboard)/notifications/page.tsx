"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { VendorNotification } from "@/data/notifications";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { buildVendorNotificationHref } from "@/lib/notificationRoutes";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationsInfinite,
  useUnreadNotificationCount,
} from "@/services/useNotifications";

type FilterType = "all" | "unread" | "reminders" | "appointments" | "messages";

function matchesFilter(notification: VendorNotification, filter: FilterType): boolean {
  if (filter === "unread") return !notification.isRead;
  if (filter === "reminders") {
    return notification.type === "reminder" || notification.type === "calendar-event";
  }
  if (filter === "appointments") {
    return (
      notification.referenceType === "appointment_booking" ||
      notification.type === "booking" ||
      notification.type === "calendar-event"
    );
  }
  if (filter === "messages") {
    return (
      notification.referenceType === "chat_message" ||
      notification.type === "message" ||
      notification.type === "pinned-message"
    );
  }
  return true;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const listQuery = useNotificationsInfinite();
  const { data: apiUnreadCount = 0 } = useUnreadNotificationCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = useMemo(
    () => listQuery.data?.pages.flatMap((p) => p.items) ?? [],
    [listQuery.data]
  );

  const filteredNotifications = useMemo(
    () => notifications.filter((n) => matchesFilter(n, activeFilter)),
    [notifications, activeFilter]
  );

  const unreadCount = apiUnreadCount;

  const countForFilter = (filter: FilterType) =>
    notifications.filter((n) => matchesFilter(n, filter)).length;

  const handleMarkAsRead = (id: string) => {
    markRead.mutate(id, {
      onSuccess: () => toast.success("Marked as read"),
      onError: () => toast.error("Could not mark notification as read"),
    });
  };

  const handleMarkAllAsRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read"),
      onError: () => toast.error("Could not mark all notifications as read"),
    });
  };

  const handleNavigate = (notification: VendorNotification) => {
    const href = buildVendorNotificationHref(notification);
    if (!href) return;
    if (href.startsWith("http://") || href.startsWith("https://")) {
      window.location.href = href;
      return;
    }
    router.push(href);
  };

  const handleAction = (
    notification: VendorNotification,
    actionType: "sync" | "reminder"
  ) => {
    if (actionType === "sync") {
      toast.success(`"${notification.title}" synced to your calendar`);
      handleNavigate(notification);
      return;
    }
    toast.success("Reminder set successfully");
    handleNavigate(notification);
  };

  const isLoading = listQuery.isLoading;
  const isError = listQuery.isError;
  const hasNextPage = listQuery.hasNextPage ?? false;
  const isFetchingNextPage = listQuery.isFetchingNextPage;

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <h1 className="font-unbounded text-3xl font-black tracking-tight text-secondary-000">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex h-8 min-w-[32px] animate-pulse items-center justify-center rounded-full bg-red-500 px-2.5 font-unageo text-sm font-bold text-white shadow-sm">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </div>
            <p className="font-unageo text-lg text-accent-60">
              Stay updated with your business activity
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={markAllRead.isPending}
                className="flex items-center gap-2 rounded-xl border border-accent-20 bg-white px-5 py-3 font-unageo text-sm font-bold text-secondary-000 shadow-sm transition-all hover:border-primary-100/50 hover:bg-accent-10 disabled:opacity-60"
              >
                {markAllRead.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <CheckCheck size={18} />
                )}
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6 -mx-2 overflow-x-auto px-2 pb-2">
        <div className="flex w-max shrink-0 gap-2 rounded-xl border border-accent-20 bg-white p-1.5 shadow-sm">
          {(
            [
              { id: "all" as FilterType, label: "All" },
              { id: "unread" as FilterType, label: "Unread" },
              { id: "reminders" as FilterType, label: "Reminders" },
              { id: "appointments" as FilterType, label: "Appointments" },
              { id: "messages" as FilterType, label: "Messages" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`whitespace-nowrap rounded-[10px] px-5 py-2.5 font-unageo text-sm font-bold transition-all ${
                activeFilter === filter.id
                  ? "bg-primary-100 text-white shadow-md"
                  : "bg-transparent text-accent-60 hover:bg-accent-10 hover:text-secondary-000"
              }`}
            >
              {filter.label}{" "}
              <span className="ml-1 opacity-80">({countForFilter(filter.id)})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[400px] overflow-hidden rounded-2xl border border-accent-20 bg-white shadow-sm">
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-100" />
            <p className="font-unageo text-sm text-accent-60">Loading notifications…</p>
          </div>
        )}

        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center gap-4 px-6 py-20 text-center">
            <p className="font-unbounded text-lg font-bold text-secondary-000">
              Could not load notifications
            </p>
            <p className="font-unageo text-accent-60">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => listQuery.refetch()}
              className="rounded-xl border border-accent-20 px-5 py-2.5 font-unageo text-sm font-bold text-secondary-000 hover:bg-accent-10"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && filteredNotifications.length === 0 && (
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-10">
              <Bell size={32} className="text-accent-40" />
            </div>
            <h3 className="mb-2 font-unbounded text-lg font-bold text-secondary-000">
              No Notifications Found
            </h3>
            <p className="max-w-xs font-unageo text-accent-60">
              {activeFilter === "all"
                ? "You're all caught up! Check back later for updates."
                : `You don't have any ${activeFilter} notifications at the moment.`}
            </p>
          </div>
        )}

        {!isLoading && !isError && filteredNotifications.length > 0 && (
          <div>
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleMarkAsRead}
                onNavigate={handleNavigate}
                onAction={handleAction}
                isMarkingRead={
                  markRead.isPending && markRead.variables === notification.id
                }
              />
            ))}
          </div>
        )}
      </div>

      {!isLoading && !isError && hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            disabled={isFetchingNextPage}
            onClick={() => listQuery.fetchNextPage()}
            className="flex items-center gap-2 rounded-xl border border-accent-20 bg-white px-6 py-3 font-unageo text-sm font-bold text-secondary-000 shadow-sm transition-all hover:bg-accent-10 disabled:opacity-60"
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading…
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}

      {notifications.length > 0 && !isLoading && !isError && (
        <div className="mt-6 text-center">
          <p className="font-unageo text-sm text-accent-60">
            Showing {filteredNotifications.length} of {notifications.length} loaded
            {listQuery.data?.pages[0]?.meta.total != null &&
              ` (${listQuery.data.pages[0].meta.total} total)`}
          </p>
        </div>
      )}
    </div>
  );
}
