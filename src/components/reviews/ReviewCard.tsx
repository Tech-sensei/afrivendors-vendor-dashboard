"use client";

import React from "react";
import { Star, Clock, MessageSquare, Trash2 } from "lucide-react";
import { Review } from "@/data/reviews";

interface ReviewCardProps {
  review: Review;
  onReply: (review: Review) => void;
  onDeleteReply: (id: string) => void;
}

export function ReviewCard({ review, onReply, onDeleteReply }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
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
            size={14}
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
    <div className="bg-white border border-zinc-200 rounded-[32px] p-8 lg:p-10 hover:shadow-xl transition-all duration-300 group shadow-sm">
      <div className="flex flex-col gap-8">
        {/* Customer Info Header */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="relative shrink-0">
              <img
                src={review.customerAvatar}
                alt={review.customerName}
                className="w-16 h-16 rounded-[20px] object-cover border-4 border-zinc-50 shadow-md transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-4 border-white rounded-xl flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm" />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight leading-none">
                {review.customerName}
              </h4>
              <div className="flex items-center gap-4">
                {renderStars(review.rating)}
                <div className="flex items-center gap-2 text-zinc-400 font-unageo text-xs font-semibold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(review.date)}
                </div>
              </div>
            </div>
          </div>

          {!review.vendorReply && (
            <button
              type="button"
              onClick={() => onReply(review)}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-unageo text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-sm bg-primary-100 text-white hover:brightness-110 shadow-lg shadow-primary-100/20"
            >
              <MessageSquare className="w-4.5 h-4.5" />
              Send Reply
            </button>
          )}
        </div>

        {/* Review Text */}
        <div className="px-1 text-zinc-600">
          <p className="font-unageo text-[17px] leading-[1.8] font-medium tracking-tight">
            {review.reviewText}
          </p>
        </div>

        {/* Vendor Reply */}
        {review.vendorReply && (
          <div className="relative mt-2 p-8 bg-zinc-50/70 rounded-[28px] border border-zinc-100/80 group-hover:bg-zinc-50 transition-colors shadow-inner">
            <div className="absolute left-0 top-8 bottom-8 w-1.5 bg-primary-100/80 rounded-full" />
            
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5 text-primary-100" />
                </div>
                <div>
                  <h5 className="font-unbounded text-[11px] font-black text-secondary-000 uppercase tracking-[0.2em]">
                    Your Response
                  </h5>
                  <span className="text-[10px] text-zinc-400 font-unageo mt-0.5 block font-bold">
                    Replied on {formatDate(review.vendorReply.date)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => onDeleteReply(review.id)}
                className="p-2.5 rounded-xl text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-100"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <p className="font-unageo text-[16px] text-zinc-500 leading-relaxed font-medium italic pl-1">
              "{review.vendorReply.text}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
