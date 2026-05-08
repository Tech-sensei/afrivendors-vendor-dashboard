import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import http from "@/lib/http";
import type { VendorRatingsResponse, VendorRatingReviewApi } from "@/types/vendorRatings";
import type { Review } from "@/data/reviews";
import { vendorReplyToReviewPayloadSchema } from "@/lib/validations/reviewReplySchemas";
import { firstZodIssueMessage } from "@/lib/validations/vendorProfileSchemas";

export const VENDOR_RATINGS_QUERY_KEY = ["vendor", "ratings"] as const;

const PLACEHOLDER_AVATAR = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f4f4f5&color=52525b&size=128`;

function normalizeBreakdown(
  b: VendorRatingsResponse["breakdown"] | undefined
): VendorRatingsResponse["breakdown"] {
  if (!b) {
    return { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  }
  return {
    "1": Number(b["1"] ?? 0),
    "2": Number(b["2"] ?? 0),
    "3": Number(b["3"] ?? 0),
    "4": Number(b["4"] ?? 0),
    "5": Number(b["5"] ?? 0),
  };
}

export function mapApiReviewToReview(r: VendorRatingReviewApi, index: number): Review {
  const text =
    r.reviewText ?? r.comment ?? r.review ?? "";
  const rawDate = r.createdAt ?? r.created_at ?? r.date ?? "";
  const date = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate.slice(0, 10) || new Date().toISOString().split("T")[0];

  const nameFromUser =
    r.user?.firstName != null || r.user?.lastName != null
      ? `${r.user?.firstName ?? ""} ${r.user?.lastName ?? ""}`.trim()
      : "";
  const name =
    nameFromUser || (r.customerName ?? r.customer_name ?? "Customer");
  const avatar = (r.customerAvatar ?? r.customer_avatar ?? "").trim();

  let vendorReply: Review["vendorReply"] = undefined;
  if (r.reply != null && String(r.reply).trim() !== "") {
    const rd = r.replyAt ?? "";
    const replyDate = rd.includes("T")
      ? rd.split("T")[0]
      : rd.slice(0, 10) || date;
    vendorReply = {
      text: String(r.reply),
      date: replyDate,
    };
  } else {
    const vr = r.vendorReply;
    if (vr && (vr.text || vr.message)) {
      const rd = vr.createdAt ?? vr.created_at ?? vr.date ?? "";
      const replyDate = rd.includes("T") ? rd.split("T")[0] : rd.slice(0, 10) || date;
      vendorReply = {
        text: vr.text ?? vr.message ?? "",
        date: replyDate,
      };
    }
  }

  const rawRating = Number(r.rating);
  const rating = Number.isFinite(rawRating) ? Math.min(5, Math.max(0, rawRating)) : 0;

  const rawId = r.id != null ? Number(r.id) : NaN;
  const numericReviewId = Number.isFinite(rawId) && rawId > 0 ? rawId : undefined;

  return {
    id: String(r.id ?? `review-${index}`),
    reviewId: numericReviewId,
    customerName: name,
    customerAvatar: avatar || PLACEHOLDER_AVATAR(name),
    rating,
    date,
    reviewText: text,
    vendorReply,
  };
}

function parseRatingsPayload(payload: unknown): VendorRatingsResponse {
  const p = payload as Record<string, unknown>;
  return {
    totalReviews: Number(p.totalReviews ?? 0),
    averageRating: Number(p.averageRating ?? 0),
    breakdown: normalizeBreakdown(p.breakdown as VendorRatingsResponse["breakdown"]),
    reviews: Array.isArray(p.reviews) ? (p.reviews as VendorRatingReviewApi[]) : [],
  };
}

function axiosReplyMessage(err: unknown): string | undefined {
  if (!axios.isAxiosError(err)) return undefined;
  const d = err.response?.data as { message?: string; responseMessage?: string } | undefined;
  if (d?.message != null) return String(d.message);
  if (d?.responseMessage != null) return String(d.responseMessage);
  return err.message;
}

export function useVendorRatings() {
  return useQuery({
    queryKey: VENDOR_RATINGS_QUERY_KEY,
    queryFn: async (): Promise<VendorRatingsResponse> => {
      const { data } = await http.get("/vendor/ratings");
      const payload = (data as { data?: unknown })?.data ?? data;
      return parseRatingsPayload(payload);
    },
  });
}

export function useReplyToReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (raw: unknown) => {
      const parsed = vendorReplyToReviewPayloadSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(firstZodIssueMessage(parsed.error));
      }
      try {
        await http.post("/vendor/reply-to-review", parsed.data);
      } catch (e: unknown) {
        throw new Error(axiosReplyMessage(e) ?? "Could not send reply");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_RATINGS_QUERY_KEY });
    },
  });
}
