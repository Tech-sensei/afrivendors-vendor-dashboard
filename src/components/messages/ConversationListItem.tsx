"use client";

import { Pin } from "lucide-react";
import type { Channel } from "stream-chat";

type ConversationListItem = {
  userName: string;
  userAvatar: string | null;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: Date | null;
};

function mapChannelToConversationListItem(
  channel: Channel,
): ConversationListItem {
  const members = Object.values(channel.state.members || {});

  // find user
  const userMember: any = members.find(
    (m: any) => m.user?.accountType === "user",
  );

  const user = userMember?.user;

  // last message
  const messages = channel.state.messages || [];
  const lastMsg = messages[messages.length - 1];

  return {
    userName: user?.name || "Unknown User",
    userAvatar: user?.image || null,

    unreadCount: channel.state.unreadCount || 0,

    lastMessage: lastMsg?.text || "",
    lastMessageTime: lastMsg?.created_at ? new Date(lastMsg.created_at) : null,
  };
}

interface ConversationListItemProps {
  conversation: Channel;
  isActive: boolean;
  onClick: () => void;
  isPinned?: boolean;
}

export function ConversationListItem({
  conversation,
  isActive,
  onClick,
  isPinned = false,
}: ConversationListItemProps) {
  const { userName, userAvatar, unreadCount, lastMessage, lastMessageTime } =
    mapChannelToConversationListItem(conversation);

  return (
    <div
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all duration-200 border-l-[3px] 
        ${isActive
          ? "bg-primary-300/30 border-primary-100"
          : "bg-white border-transparent hover:bg-accent-10/50"
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-accent-20 flex items-center justify-center overflow-hidden">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-unbounded font-bold text-secondary-000 text-sm">
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-0.5">
            <h4
              className={`text-sm font-unbounded truncate pr-2 ${isActive ? "text-secondary-000 font-bold" : "text-secondary-000 font-semibold"}`}
            >
              {userName}
            </h4>
            <span
              className={`text-[11px] font-unageo whitespace-nowrap ${isActive ? "text-primary-100 font-medium" : "text-accent-60"}`}
            >
              {lastMessageTime ? lastMessageTime.toLocaleString() : ""}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <p
              className={`text-xs font-unageo truncate max-w-[180px] ${unreadCount > 0 ? "text-secondary-000 font-medium" : "text-accent-60"}`}
            >
              {lastMessage}
            </p>

            <div className="flex items-center gap-1">
              {isPinned && (
                <Pin size={12} className="text-accent-40 fill-accent-40" />
              )}
              {unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-primary-100 text-white text-[10px] font-bold px-1">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
