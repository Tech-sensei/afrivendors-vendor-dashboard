import { z } from "zod";

/** POST /vendor/reply-to-review */
export const vendorReplyToReviewPayloadSchema = z.object({
  reply: z
    .string()
    .trim()
    .min(1, "Reply cannot be empty")
    .max(2000, "Reply is too long"),
  reviewId: z.number().int().positive("Invalid review"),
});

export type VendorReplyToReviewPayload = z.infer<
  typeof vendorReplyToReviewPayloadSchema
>;
