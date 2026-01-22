"use client";

import React from "react";
import { Star, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

export function BusinessRatingCard() {
  const ratingData = [
    { stars: 5, percentage: 78 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 5 },
    { stars: 2, percentage: 2 },
    { stars: 1, percentage: 0 },
  ];

  return (
    <div className="bg-white border border-accent-20/60 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-unbounded text-lg font-bold text-secondary-000 tracking-tight">
          Business Rating
        </h2>
      </div>

      <div className="flex flex-col items-center mb-8">
        <div className="inline-flex items-center gap-4 mb-2">
          <Star size={36} className="text-amber-400 fill-amber-400" />
          <span className="font-unbounded text-5xl font-black text-secondary-000 tracking-tighter">
            4.8
          </span>
        </div>
        <p className="font-unageo text-xs font-bold text-accent-60 uppercase tracking-widest">
          Based on 92 reviews
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        {ratingData.map((item) => (
          <div key={item.stars} className="flex items-center gap-4">
            <div className="flex items-center gap-1 min-w-[28px]">
              <span className="font-unageo text-xs font-bold text-accent-80">
                {item.stars}
              </span>
              <Star size={10} className="text-accent-20 fill-accent-20" />
            </div>
            
            <div className="flex-1 h-1.5 bg-accent-10 rounded-xl overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-xl transition-all duration-1000 ease-out"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            
            <span className="font-unageo text-[11px] font-bold text-accent-60 min-w-[35px] text-right">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>

      <button 
        className="w-full py-4 bg-white border border-accent-20 hover:bg-accent-10/50 text-secondary-000 font-unbounded text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-sm cursor-pointer"
        onClick={() => window.location.href = '/reviews'}
      >
        View All Reviews
      </button>
    </div>
  );
}
