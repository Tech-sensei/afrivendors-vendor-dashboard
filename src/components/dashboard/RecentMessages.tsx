"use client";

import React from "react";
import {  ChevronRight } from "lucide-react";
import { RecentMessage } from "@/data/dashboard";
import Link from "next/link";

interface RecentMessagesProps {
  messages: RecentMessage[];
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight">
          Recent Messages
        </h2>
        {messages.filter(m => m.unread).length > 0 && (
          <div className="px-3 py-1 bg-[#BC6D39] text-white rounded-full font-unageo text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-[#BC6D39]/20">
            {messages.filter(m => m.unread).length} New
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <Link
            href="/messages"
            key={message.id}
            className={`group p-5 rounded-xl border transition-all duration-300 cursor-pointer ${
              message.unread 
                ? "bg-[#BC6D39]/5 border-[#BC6D39]/10 hover:bg-[#BC6D39]/10" 
                : "bg-white border-accent-10/80 hover:border-accent-20 hover:shadow-md"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className={`font-unbounded text-[13px] font-bold ${message.unread ? "text-secondary-000" : "text-accent-80"}`}>
                {message.customerName}
              </h4>
              <span className="font-unageo text-[10px] text-accent-60 font-bold uppercase tracking-widest whitespace-nowrap ml-4">
                {message.time}
              </span>
            </div>
            
            <p className="font-unageo text-sm text-accent-60 line-clamp-1 mb-4 leading-relaxed font-medium">
              {message.message}
            </p>

            <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              <span className="font-unbounded text-[9px] font-bold text-[#BC6D39] uppercase tracking-widest">
                Reply Now
              </span>
              <ChevronRight size={12} className="text-[#BC6D39]" />
            </div>
          </Link>
        ))}
      </div>

   <button 
        className="w-full py-4 bg-white border border-accent-20 hover:bg-accent-10/50 text-secondary-000 font-unbounded text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm mt-6 cursor-pointer"
        onClick={() => window.location.href = '/messages'}
      >
        View All Reviews
      </button>
    </div>
  );
}
