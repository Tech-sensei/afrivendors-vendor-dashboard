"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Filter, Search } from "lucide-react";

import type { Review } from "@/data/reviews";
import { ReviewStats } from "@/components/reviews/ReviewStats";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ReplyDrawer } from "@/components/reviews/ReplyDrawer";
import {
  useVendorRatings,
  mapApiReviewToReview,
} from "@/services/useVendorRatings";
import type { VendorRatingBreakdown } from "@/types/vendorRatings";

const emptyBreakdown: VendorRatingBreakdown = {
  "1": 0,
  "2": 0,
  "3": 0,
  "4": 0,
  "5": 0,
};

export default function ReviewsPage() {
  const { data, isLoading, isError, error } = useVendorRatings();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [sortBy, setSortBy] = useState<"recent" | "highest" | "lowest">("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isReplyDrawerOpen, setIsReplyDrawerOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  useEffect(() => {
    if (!data?.reviews) return;
    setReviews(data.reviews.map((r, i) => mapApiReviewToReview(r, i)));
  }, [data]);

  const sortOptions = [
    { id: "recent", label: "Most Recent" },
    { id: "highest", label: "Highest Rated" },
    { id: "lowest", label: "Lowest Rated" },
  ];

  const currentSortLabel = sortOptions.find((opt) => opt.id === sortBy)?.label;

  const filteredAndSortedReviews = useMemo(() => {
    return reviews
      .filter(
        (r) =>
          r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "highest") return b.rating - a.rating;
        if (sortBy === "lowest") return a.rating - b.rating;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [reviews, searchQuery, sortBy]);

  const handleOpenReply = (review: Review) => {
    setSelectedReview(review);
    setIsReplyDrawerOpen(true);
  };

  const handleSaveReply = (text: string) => {
    if (!selectedReview) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === selectedReview.id
          ? {
              ...r,
              vendorReply: {
                text,
                date: new Date().toISOString().split("T")[0],
              },
            }
          : r
      )
    );

    toast.success("Response saved locally. Sync with the server when reply API is available.");
    setIsReplyDrawerOpen(false);
  };

  const handleDeleteReply = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, vendorReply: undefined } : r))
    );
    toast.error("Response removed");
  };

  const stats = data
    ? {
        totalReviews: data.totalReviews,
        averageRating: data.averageRating,
        breakdown: data.breakdown,
      }
    : {
        totalReviews: 0,
        averageRating: 0,
        breakdown: emptyBreakdown,
      };

  const hasNoReviewsFromApi =
    !isLoading &&
    !isError &&
    data &&
    data.totalReviews === 0 &&
    (data.reviews?.length ?? 0) === 0;

  if (isError && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <ReviewStats
          totalReviews={0}
          averageRating={0}
          breakdown={emptyBreakdown}
          isLoading={false}
        />
        <div className="py-20 text-center rounded-[40px] border border-red-100 bg-red-50/50">
          <p className="font-unbounded text-lg font-bold text-secondary-000 mb-2">
            Couldn&apos;t load reviews
          </p>
          <p className="font-unageo text-zinc-600 max-w-md mx-auto">
            {(error as { response?: { data?: { message?: string; responseMessage?: string } } })
              ?.response?.data?.message ??
              (error as { response?: { data?: { responseMessage?: string } } })?.response?.data
                ?.responseMessage ??
              (error instanceof Error ? error.message : "Something went wrong. Try again later.")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ReviewStats
        totalReviews={stats.totalReviews}
        averageRating={stats.averageRating}
        breakdown={stats.breakdown}
        isLoading={isLoading}
      />

      {!isLoading && (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 bg-zinc-50/50 p-6 rounded-[32px] border border-zinc-100/80">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative group flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-primary-100 transition-colors" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-11 pr-6 py-4 bg-white border border-zinc-200 rounded-[22px] font-unageo text-sm text-secondary-000 outline-none focus:border-primary-100 focus:shadow-xl focus:shadow-primary-100/5 transition-all w-full shadow-sm"
                />
              </div>
            </div>

            <div className="relative shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-unbounded text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-2">
                  Sort by
                </span>
                <button
                  type="button"
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center justify-between gap-4 pl-6 pr-5 py-4 min-w-[200px] bg-white border border-zinc-200 rounded-[22px] font-unageo text-sm font-bold text-secondary-000 transition-all hover:border-zinc-300 hover:shadow-md cursor-pointer shadow-sm group"
                >
                  <span>{currentSortLabel}</span>
                  <Filter
                    className={`w-4 h-4 text-zinc-400 group-hover:text-primary-100 transition-all ${isSortOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-white border border-zinc-100 rounded-[22px] shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setSortBy(option.id as "recent" | "highest" | "lowest");
                          setIsSortOpen(false);
                        }}
                        className={`w-full px-5 py-3 rounded-xl font-unageo text-sm text-left transition-all ${
                          sortBy === option.id
                            ? "bg-primary-100 text-white font-bold"
                            : "text-zinc-600 hover:bg-zinc-50 active:scale-95"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-unbounded text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Customer Feedback ({filteredAndSortedReviews.length})
              </h3>
              <div className="h-px flex-1 bg-zinc-100 mx-6 hidden sm:block" />
            </div>

            {hasNoReviewsFromApi && !searchQuery ? (
              <div className="py-24 text-center bg-zinc-50/50 rounded-[40px] border-2 border-dashed border-zinc-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-8 h-8 text-zinc-300" />
                </div>
                <h4 className="font-unbounded text-xl font-bold text-secondary-000 mb-2">
                  No reviews yet
                </h4>
                <p className="font-unageo text-zinc-500 max-w-sm mx-auto text-base">
                  When customers leave ratings, they will appear here with your overall
                  score and breakdown.
                </p>
              </div>
            ) : filteredAndSortedReviews.length > 0 ? (
              <div className="grid grid-cols-1 gap-10">
                {filteredAndSortedReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onReply={handleOpenReply}
                    onDeleteReply={handleDeleteReply}
                  />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center bg-zinc-50/50 rounded-[40px] border-2 border-dashed border-zinc-200">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-8 h-8 text-zinc-300" />
                </div>
                <h4 className="font-unbounded text-xl font-bold text-secondary-000 mb-2">
                  No matching reviews
                </h4>
                <p className="font-unageo text-zinc-500 max-w-xs mx-auto text-base">
                  Try adjusting your search or filters to see more results.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      <ReplyDrawer
        isOpen={isReplyDrawerOpen}
        onClose={() => setIsReplyDrawerOpen(false)}
        review={selectedReview}
        onSave={handleSaveReply}
      />
    </div>
  );
}
