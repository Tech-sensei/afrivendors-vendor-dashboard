"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Search, Pin, PinOff, MessageSquare } from "lucide-react";
import { ChatDrawer } from "@/components/messages/ChatDrawer";
import { CustomerInfoDrawer } from "@/components/messages/CustomerInfoDrawer";
// import { SetReminderDrawer } from "@/components/messages/SetReminderDrawer";
// import { CalendarSyncDrawer } from "@/components/messages/CalendarSyncDrawer";
import useStreamChat from "@/hooks/useStreamChat";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { VendorProfile, VendorGalleryItem } from "@/types/auth";
import {
  useStreamChatToken,
  useGetPinnedChannels,
  usePinChannel,
  PinAction,
} from "@/services/useStreamChat";
import { Channel } from "stream-chat";
import { ConversationListItem } from "@/components/messages/ConversationListItem";
import streamChat from "@/lib/streamChat";
import { useQueryClient } from "@tanstack/react-query";

function getBannerImageUrl(gallery: VendorGalleryItem[] | undefined) {
  const banner = gallery?.find((item) => item.isBanner === true);
  return banner ? banner.imageUrl : null;
}

export default function VendorMessages() {
  const user: VendorProfile | null = useSelector(
    (state: RootState) => state.auth.profile,
  );
  const [conversations, setConversations] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "unread" | "pinned">(
    "recent",
  );

  const [selectedConversation, setSelectedConversation] =
    useState<Channel | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCustomerInfoOpen, setIsCustomerInfoOpen] = useState(false);

  //get user token
  const {
    data: streamChatToken,
    isLoading: isLoadingStreamChatToken,
    isError: isErrorStreamChatToken,
  } = useStreamChatToken();
  const {
    data: pinnedChannels,
    isLoading: isLoadingPinnedChannels,
    isError: isErrorPinnedChannels,
  } = useGetPinnedChannels();
  const { mutate: pinChannel, isPending: isPinningChannel } = usePinChannel();
  const queryClient = useQueryClient();

  //get all conversations
  const { getAllChannels, instantiateUser } = useStreamChat();
  const [streamReady, setStreamReady] = useState(false);
  const [channelsRefreshKey, setChannelsRefreshKey] = useState(0);

  useEffect(() => {
    const vendorId = user?.vendor?.id;
    const token = streamChatToken?.userChatToken;
    if (!vendorId || !token) {
      setStreamReady(false);
      return;
    }

    let cancelled = false;
    setStreamReady(false);

    const name =
      `${user?.vendor?.firstName ?? ""} ${user?.vendor?.lastName ?? ""}`.trim();
    const imageUrl = getBannerImageUrl(user?.gallery ?? []);

    void instantiateUser(vendorId, name, imageUrl ?? "", token).then(
      () => {
        if (!cancelled) setStreamReady(true);
      },
      () => {
        if (!cancelled) setStreamReady(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, [
    instantiateUser,
    user?.vendor?.id,
    user?.vendor?.firstName,
    user?.vendor?.lastName,
    user?.gallery,
    streamChatToken?.userChatToken,
  ]);

  useEffect(() => {
    if (!streamReady || !user?.vendor?.id) return;
    let cancelled = false;
    void getAllChannels(String(user.vendor.id)).then((channels) => {
      if (cancelled) return;
      setConversations(channels);
    }).catch(() => {
      if (cancelled) return;
    });
    return () => {
      cancelled = true;
    };
  }, [getAllChannels, streamReady, user?.vendor?.id, channelsRefreshKey]);

  useEffect(() => {
    if (!pinnedChannels) return;
    // Backend returns [{ id, channelId, userId }, ...]
    setPinnedIds(
      Array.isArray(pinnedChannels)
        ? pinnedChannels
          .map((p: any) => String(p?.channelId ?? ""))
          .filter((id: string) => id.length > 0)
        : [],
    );
  }, [pinnedChannels]);

  useEffect(() => {
    if (!streamReady) return;

    // Keep channel list (unreadCount / last_message) in sync without refresh.
    const handler = () => setChannelsRefreshKey((k) => k + 1);

    streamChat.on("message.new", handler);
    streamChat.on("notification.message_new", handler);
    streamChat.on("message.read", handler);
    streamChat.on("notification.mark_read", handler);
    streamChat.on("notification.mark_unread", handler);
    streamChat.on("channel.updated", handler);

    return () => {
      streamChat.off("message.new", handler);
      streamChat.off("notification.message_new", handler);
      streamChat.off("message.read", handler);
      streamChat.off("notification.mark_read", handler);
      streamChat.off("notification.mark_unread", handler);
      streamChat.off("channel.updated", handler);
    };
  }, [streamReady]);

  const handleOpenChat = (conversation: Channel) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  };

  const handleTogglePin = (conversationId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!conversationId || isPinningChannel) return;

    const currentlyPinned = pinnedIds.includes(conversationId);
    const action = currentlyPinned ? PinAction.UNPIN : PinAction.PIN;

    // Optimistic UI
    setPinnedIds((prev) =>
      currentlyPinned
        ? prev.filter((id) => id !== conversationId)
        : [...prev, conversationId],
    );

    pinChannel(
      { channelId: conversationId, action },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["pinned-channels"],
          });
        },
        onError: () => {
          // Revert optimistic update
          setPinnedIds((prev) =>
            currentlyPinned
              ? [...prev, conversationId]
              : prev.filter((id) => id !== conversationId),
          );
        },
      },
    );
  };

  const filteredConversations = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const list = conversations ?? [];

    const searched = list.filter((c) => {
      const customerName = String(
        (c as any)?.data?.name ?? c.id ?? "",
      ).toLowerCase();
      const lastMsg = (c as any)?.state?.messages?.[
        (c as any)?.state?.messages?.length - 1
      ]?.text;
      const lastMessage = String(lastMsg ?? "").toLowerCase();
      const subtitle = "";

      return (
        customerName.includes(q) ||
        lastMessage.includes(q) ||
        subtitle.includes(q)
      );
    });

    const filteredByTab =
      sortBy === "pinned"
        ? searched.filter((c) => pinnedIds.includes(String(c.id)))
        : searched;

    const unreadCount = (ch: Channel) =>
      typeof (ch as any).countUnread === "function"
        ? (ch as any).countUnread()
        : 0;

    const lastMessageAtMs = (ch: Channel) => {
      const dt = (ch as any)?.data?.last_message_at;
      if (!dt) return 0;
      const d = typeof dt === "string" ? new Date(dt) : dt;
      return d instanceof Date ? d.getTime() : 0;
    };

    return filteredByTab.sort((a, b) => {
      const aPinned = pinnedIds.includes(String(a.id));
      const bPinned = pinnedIds.includes(String(b.id));
      // Only float pinned to top in the "recent" view.
      // In "unread", unread ordering should dominate.
      if (sortBy === "recent" && aPinned !== bPinned) return aPinned ? -1 : 1;

      if (sortBy === "unread") {
        return unreadCount(b) - unreadCount(a);
      }

      // recent or pinned: newest activity first
      return lastMessageAtMs(b) - lastMessageAtMs(a);
    });
  }, [conversations, searchQuery, sortBy, pinnedIds]);

  const activeCustomer = selectedConversation
    ? {
      id: String((selectedConversation as any)?.data?.customerId ?? ""),
      name: String(
        (selectedConversation as any)?.data?.name ??
        selectedConversation.id ??
        "",
      ),
      avatar: String((selectedConversation as any)?.data?.image ?? ""),
      email: "",
      phone: "",
      location: "",
      joinedDate: "",
      totalBookings: 0,
      totalSpent: "0.00",
      lastBooking: "",
      rating: 0,
    }
    : null;

  return (
    <div className="max-w-[1440px] mx-auto min-h-[calc(100vh-100px)]">
      <div className="mb-8">
        <h1 className="font-unbounded text-3xl font-black text-secondary-000 tracking-tight mb-2">
          Messages & Inbox
        </h1>
        <p className="font-unageo text-accent-60 text-lg">
          Communicate with your customers
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent-40" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-accent-20 rounded-xl font-unageo text-sm text-secondary-000 placeholder:text-accent-40 outline-none focus:border-primary-100 focus:ring-4 focus:ring-primary-100/10 transition-all shadow-sm"
            />
          </div>

          <div className="flex p-1.5 bg-white border border-accent-20 rounded-xl shadow-sm shrink-0 gap-2">
            {(["recent", "unread", "pinned"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSortBy(tab)}
                className={`px-6 py-2.5 rounded-[10px] font-unageo text-sm font-bold capitalize transition-all ${sortBy === tab
                    ? "bg-primary-100 text-white shadow-sm"
                    : "bg-transparent text-accent-60 hover:text-secondary-000 hover:bg-accent-10"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-accent-20 rounded-2xl overflow-hidden shadow-sm">
          {filteredConversations.length === 0 ? (
            <div className="py-16 px-6 text-center">
              <div className="w-16 h-16 bg-accent-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-accent-40" />
              </div>
              <h3 className="font-unbounded text-lg font-bold text-secondary-000 mb-1">
                No Conversations Found
              </h3>
              <p className="font-unageo text-sm text-accent-60">
                {searchQuery
                  ? "Try a different search term"
                  : "No messages yet"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-accent-10">
              {filteredConversations.map((conversation) => {
                const id = String(conversation.id);
                const isPinned = pinnedIds.includes(id);
                return (
                  <div key={conversation.id} className="relative group">
                    <ConversationListItem
                      conversation={conversation}
                      isActive={
                        selectedConversation?.id === conversation.id &&
                        isChatOpen
                      }
                      isPinned={isPinned}
                      onClick={() => handleOpenChat(conversation)}
                    />
                    <button
                      type="button"
                      onClick={(e) =>
                        handleTogglePin(String(conversation.id), e)
                      }
                      className={`absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg border transition-all z-10
                      ${isPinned
                          ? "bg-primary-100/10 border-primary-100/20 text-primary-100 opacity-100"
                          : "bg-white border-accent-20 text-accent-40 opacity-0 group-hover:opacity-100 hover:text-primary-100 hover:border-primary-100"
                        }
                    `}
                    >
                      {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setSelectedConversation(null);
        }}
        conversation={selectedConversation}
      />

      <CustomerInfoDrawer
        isOpen={isCustomerInfoOpen}
        onClose={() => setIsCustomerInfoOpen(false)}
        customer={activeCustomer}
      />
    </div>
  );
}
