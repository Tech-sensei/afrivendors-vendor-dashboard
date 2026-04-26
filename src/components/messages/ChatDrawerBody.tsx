"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Clock, Calendar, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useStreamChat from "@/hooks/useStreamChat";
import { QueryChannelAPIResponse } from "stream-chat";
import { toast } from "sonner";
import streamChat from "@/lib/streamChat";
import { formatMessageTime } from "@/data/messagesData";

interface CustomerInfo {
  name: string;
  avatar: string;
  initials: string;
  status: "online" | "offline";
}

function mapChannelToCustomerInfo(
  channel: QueryChannelAPIResponse,
): CustomerInfo {
  const members = Object.values(channel.members || {});

  // find user
  const userMember: any = members.find(
    (m: any) => m.user?.accountType === "user",
  );

  const user = userMember?.user;

  return {
    name: user?.name || "Unknown User",
    avatar: user?.image || null,
    status: user?.online ? "online" : "offline",
    initials:
      user?.name
        ?.split(" ")
        .map((n: any) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() ?? "",
  };
}

interface ChatDrawerProps {
  onClose: () => void;
  channelId: string;
}

export function ChatDrawerBody({ onClose, channelId }: ChatDrawerProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { getChannelMessages, sendMessage } = useStreamChat();

  const [messages, setMessages] = useState<QueryChannelAPIResponse>();

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getChannelMessages(channelId);
      setMessages(messages);
    };
    fetchMessages();
  }, [channelId]);

  const handleSend = () => {
    const t = inputText.trim();
    if (t) {
      void sendMessage(channelId, t)
        .then(() => {
          //update conversation
          void getChannelMessages(channelId).then((response) => {
            setMessages(response);
          });
          setInputText("");
        })
        .catch((error) => {
          toast.error("Failed to send message");
        });
    } else {
      console.error("Please enter a message");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!messages) return null;

  const customerInfo = mapChannelToCustomerInfo(messages);

  return (
    <>
      <div className="px-6 py-4 border-b border-accent-20 bg-white shrink-0 flex flex-row items-center gap-3 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-secondary-300/10 hover:bg-secondary-300/20 transition-colors shrink-0 -ml-1"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-secondary-000" />
        </button>
        <div
          // onClick={onViewCustomerInfo}
          className="flex flex-1 items-center gap-3 cursor-pointer group min-w-0 text-left"
        >
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center overflow-hidden shrink-0 border border-border/50">
            {customerInfo.avatar ? (
              <img
                src={customerInfo.avatar}
                alt={customerInfo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-unbounded text-sm font-semibold text-white">
                {customerInfo.initials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-unbounded text-base font-bold text-secondary-000 truncate group-hover:text-primary-100 transition-colors">
              {customerInfo.name}
            </p>
            <p className="font-unageo text-xs text-secondary-300 font-medium truncate">
              {customerInfo.status}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pt-4 pb-2 bg-[#F8F5F2] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {messages.messages.length === 0 ? (
            <div className="flex min-h-[120px] items-center justify-center">
              <p className="font-unageo text-sm text-accent-60">
                No messages yet.
              </p>
            </div>
          ) : (
            messages.messages.map((msg) => {
              const isVendor =
                String(msg.user?.id ?? "") === String(streamChat.userID ?? "");
              return (
                <div
                  key={msg.id}
                  className={`group relative flex mb-4 ${isVendor ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[75%] flex flex-col gap-1">
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        isVendor
                          ? "bg-primary-100 text-white rounded-br-sm"
                          : "bg-accent-10 text-secondary-000 rounded-bl-sm"
                      }`}
                    >
                      <p className="font-unageo text-sm leading-relaxed m-0">
                        {msg.text}
                      </p>
                    </div>
                    <span
                      className={`font-unageo text-xs text-accent-60 ${
                        isVendor ? "text-right pr-2" : "text-left pl-2"
                      }`}
                    >
                      {formatMessageTime(new Date(msg.created_at ?? ""))}
                    </span>
                  </div>

                  {/* {!isVendor && (
                    <div className="absolute top-0 right-0 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white shadow-sm rounded-lg p-1 z-10">
                      <button
                        type="button"
                        // onClick={() => onSetReminder(msg.id)}
                        title="Set Reminder"
                        className="p-1.5 hover:bg-accent-10 rounded-md text-accent-60 hover:text-primary-100"
                      >
                        <Clock size={14} />
                      </button>
                      <button
                        type="button"
                        // onClick={() => onSyncCalendar(msg.id)}
                        title="Sync to Calendar"
                        className="p-1.5 hover:bg-accent-10 rounded-md text-accent-60 hover:text-primary-100"
                      >
                        <Calendar size={14} />
                      </button>
                    </div>
                  )} */}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="shrink-0 p-4 bg-white border-t border-accent-20">
        <div className="flex w-full items-end gap-2 bg-[#F8F5F2] p-2 rounded-3xl border border-accent-20/40 focus-within:border-primary-100/30 focus-within:shadow-sm transition-all">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="rounded-full text-secondary-300 hover:text-secondary-000 hover:bg-white/50 mb-0.5 shrink-0"
            disabled
            aria-hidden
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="flex-1 min-h-[40px] max-h-[120px] bg-transparent border-0 focus:outline-none focus:ring-0 px-2 py-2.5 font-unageo text-sm text-secondary-000 resize-none placeholder:text-secondary-300/60"
          />
          <Button
            type="button"
            size="icon-sm"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={cn(
              "rounded-full mb-0.5 shrink-0",
              inputText.trim()
                ? "bg-primary-100 hover:bg-primary-100/90 text-white shadow-md"
                : "bg-secondary-300/20 text-secondary-300 cursor-not-allowed",
            )}
            aria-label="Send message"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
        <p className="mt-2 font-unageo text-xs text-accent-60">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </>
  );
}
