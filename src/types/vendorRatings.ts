/**
 * GET /vendor/ratings
 */
export type VendorRatingBreakdown = {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
};

/** Raw review row from API (fields may vary; mapper handles common aliases). */
export type VendorRatingReviewApi = {
  id?: string | number;
  rating?: number;
  reviewText?: string;
  comment?: string;
  review?: string;
  customerName?: string;
  customer_name?: string;
  customerAvatar?: string;
  customer_avatar?: string;
  createdAt?: string;
  created_at?: string;
  date?: string;
  vendorReply?: {
    text?: string;
    message?: string;
    createdAt?: string;
    created_at?: string;
    date?: string;
  } | null;
};

export type VendorRatingsResponse = {
  totalReviews: number;
  averageRating: number;
  breakdown: VendorRatingBreakdown;
  reviews: VendorRatingReviewApi[];
};
