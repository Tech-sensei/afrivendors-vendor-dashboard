"use client";

import React, { useState, useEffect } from "react";
import { X, Send, MessageSquare, Clock, Star, Info } from "lucide-react";
import { Review } from "@/data/reviews";

interface ReplyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  onSave: (text: string) => void;
}

export function ReplyDrawer({ isOpen, onClose, review, onSave }: ReplyDrawerProps) {
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (isOpen && review) {
      setReplyText(review.vendorReply?.text || "");
    }
  }, [isOpen, review]);

  if (!review) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (replyText.trim()) {
      onSave(replyText);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={`${
              star <= rating
                ? "fill-primary-100 text-primary-100"
                : "fill-zinc-100 text-zinc-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      <div
        className={`absolute inset-0 bg-[#231305]/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      
      <div
        className={`fixed z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col max-sm:bottom-0 max-sm:left-0 max-sm:w-full max-sm:h-[92vh] max-sm:rounded-t-[32px] sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-[560px] sm:rounded-l-[32px] overflow-hidden ${
          isOpen 
            ? "max-sm:translate-y-0 sm:translate-x-0" 
            : "max-sm:translate-y-full sm:translate-x-full"
        }`}
      >
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="px-8 py-8 flex items-start justify-between flex-shrink-0 border-b border-zinc-100">
            <div>
              <h2 className="font-unbounded text-2xl font-black text-secondary-000">
                {review.vendorReply ? "Edit Response" : "Respond to Review"}
              </h2>
              <p className="font-unageo text-sm text-zinc-500 mt-1">
                Share a thoughtful reply to {review.customerName}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition-all cursor-pointer"
            >
              <X className="w-6 h-6 text-zinc-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
            {/* Context Card */}
            <div className="p-6 bg-zinc-50 rounded-[28px] border border-zinc-100">
              <div className="flex gap-4 mb-4">
                <img
                  src={review.customerAvatar}
                  alt={review.customerName}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-unbounded text-[15px] font-bold text-secondary-000">
                    {review.customerName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    {renderStars(review.rating)}
                    <span className="text-[11px] text-zinc-400 font-unageo">
                      • {formatDate(review.date)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="font-unageo text-sm text-zinc-500 leading-relaxed indent-2 border-l-2 border-primary-100/20 italic">
                "{review.reviewText}"
              </p>
            </div>

            {/* Response Area */}
            <div className="space-y-4">
              <label className="flex items-center gap-2 font-unbounded text-xs font-bold text-zinc-400 uppercase tracking-widest px-1">
                Your Response
              </label>
              <div className="relative group">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply here..."
                  className="w-full p-6 bg-white border-2 border-zinc-100 rounded-[28px] font-unageo text-base text-secondary-000 outline-none focus:border-primary-100 focus:shadow-xl focus:shadow-primary-100/5 transition-all min-h-[220px] resize-none"
                  required
                />
                <div className="absolute bottom-6 right-8 text-[11px] font-unbounded font-bold text-zinc-300">
                  {replyText.length} characters
                </div>
              </div>
            </div>

            {/* Pro-Tip Box */}
            <div className="p-6 bg-[#E8F1FF] rounded-[24px] border border-[#B8D4FF] flex gap-5 items-start">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-[#B8D4FF] shadow-sm">
                <Info className="w-6 h-6 text-[#2B6CB0]" />
              </div>
              <div className="space-y-1">
                <p className="font-unageo text-[16px] font-bold text-[#2B6CB0]">Expert Tip</p>
                <p className="font-unageo text-[14px] text-[#4A5568] leading-relaxed">
                  Personalized responses build trust. Mention specific details from the review to show customers you truly value their feedback.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-zinc-100 px-8 py-6 flex gap-4 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-6 border border-zinc-200 text-secondary-000 font-unageo text-base font-bold rounded-2xl transition-all hover:bg-zinc-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!replyText.trim()}
              className={`flex-[1.5] py-4 px-6 font-unageo text-base font-bold rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 ${
                replyText.trim()
                  ? "bg-primary-100 text-white hover:brightness-110 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-100/20 cursor-pointer"
                  : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
              {review.vendorReply ? "Update Response" : "Send Response"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
