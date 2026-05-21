import { z } from "zod";

const lineItemSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .refine((val) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    }, "Enter a valid amount"),
});

export const vendorSendQuoteSchema = z.object({
  lineItems: z.array(lineItemSchema).min(1, "Add at least one line item"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message is too long"),
  validUntil: z.string().min(1, "Valid until date is required"),
});

export type VendorSendQuoteFormValues = z.infer<typeof vendorSendQuoteSchema>;
