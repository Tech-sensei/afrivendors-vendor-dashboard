"use client";

import React from "react";
import { MessageSquare, ChevronRight } from "lucide-react";
import Link from "next/link";

/** Sidebar CTA when chat preview is not on the dashboard API. */
export function MessagesQuickLink() {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#BC6D39]/10 flex items-center justify-center text-[#BC6D39]">
          <MessageSquare size={22} />
        </div>
        <div>
          <h2 className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight">
            Messages
          </h2>
          <p className="font-unageo text-accent-60 text-sm font-medium">
            Chat with your customers
          </p>
        </div>
      </div>
      <p className="font-unageo text-sm text-accent-60 mb-6 leading-relaxed">
        Open your inbox to reply to clients and manage conversations.
      </p>
      <Link
        href="/messages"
        className="group flex items-center justify-center gap-2 w-full py-4 bg-white border border-accent-20 hover:bg-accent-10/50 text-secondary-000 font-unbounded text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm"
      >
        Open Messages
        <ChevronRight
          size={14}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </Link>
    </div>
  );
}
