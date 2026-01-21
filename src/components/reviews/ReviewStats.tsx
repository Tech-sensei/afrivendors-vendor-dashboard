"use client";

import React from "react";
import { Star } from "lucide-react";

interface Review {
  rating: number;
}

interface ReviewStatsProps {
  reviews: Review[];
}

export function ReviewStats({ reviews }: ReviewStatsProps) {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "0.0";
  
  const ratingBreakdown = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
      {/* Average Rating Card */}
      <div className="bg-white border border-zinc-200 rounded-[32px] p-10 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
        <div className="text-zinc-400 font-unageo text-sm font-bold uppercase tracking-widest mb-4">
          Overall Rating
        </div>
        <div className="text-7xl font-unbounded font-black text-secondary-000 mb-4 tracking-tighter">
          {averageRating}
        </div>
        <div className="mb-4">
          {renderStars(Number(averageRating), 28)}
        </div>
        <p className="font-unageo text-base text-zinc-500">
          Based on <span className="font-bold text-secondary-000">{totalReviews}</span> verified reviews
        </p>
      </div>

      {/* Rating Breakdown Card */}
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
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
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
