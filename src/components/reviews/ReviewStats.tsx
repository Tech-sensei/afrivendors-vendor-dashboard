"use client";

import React from "react";
import { Star } from "lucide-react";
import type { VendorRatingBreakdown } from "@/types/vendorRatings";

export interface ReviewStatsProps {
  totalReviews: number;
  averageRating: number;
  breakdown: VendorRatingBreakdown;
  isLoading?: boolean;
}

export function ReviewStats({
  totalReviews,
  averageRating,
  breakdown,
  isLoading,
}: ReviewStatsProps) {
  const displayAverage =
    totalReviews > 0 ? averageRating.toFixed(1) : "0.0";

  const ratingBreakdown = {
    5: Number(breakdown["5"] ?? 0),
    4: Number(breakdown["4"] ?? 0),
    3: Number(breakdown["3"] ?? 0),
    2: Number(breakdown["2"] ?? 0),
    1: Number(breakdown["1"] ?? 0),
  };

  const renderStars = (rating: number, size: number = 24) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={star <= rating ? size : size - 2}
            className={`transition-all duration-300 ${
              star <= Math.round(rating)
                ? "fill-primary-100 text-primary-100 scale-110"
                : "fill-zinc-100 text-zinc-200"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6 animate-pulse">
        <div className="bg-zinc-100 border border-zinc-200 rounded-[32px] p-10 h-[280px]" />
        <div className="lg:col-span-2 bg-zinc-100 border border-zinc-200 rounded-[32px] p-8 h-[280px]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-6">
      <div className="bg-white border border-zinc-200 rounded-[32px] p-10 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="text-zinc-400 font-unageo text-sm font-bold uppercase tracking-widest mb-4">
          Overall Rating
        </div>
        <div className="text-7xl font-unbounded font-black text-secondary-000 mb-4 tracking-tighter">
          {displayAverage}
        </div>
        <div className="mb-4">
          {renderStars(Number(displayAverage), 28)}
        </div>
        <p className="font-unageo text-base text-zinc-500">
          Based on{" "}
          <span className="font-bold text-secondary-000">{totalReviews}</span>{" "}
          verified reviews
        </p>
      </div>

      <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-unbounded text-xl font-bold text-secondary-000">
            Rating Breakdown
          </h3>
          <div className="px-4 py-1.5 bg-zinc-50 rounded-full border border-zinc-100 font-unageo text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Live Overview
          </div>
        </div>

        <div className="space-y-4">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingBreakdown[rating as keyof typeof ratingBreakdown];
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-4 group">
                <div className="flex items-center gap-1.5 min-w-[50px]">
                  <span className="font-unbounded text-sm font-bold text-secondary-000">
                    {rating}
                  </span>
                  <Star className="w-3.5 h-3.5 fill-primary-100 text-primary-100" />
                </div>

                <div className="flex-1 h-3 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100/50">
                  <div
                    className="h-full bg-primary-100 rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="min-w-[45px] text-right font-unbounded text-xs font-bold text-zinc-400">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
