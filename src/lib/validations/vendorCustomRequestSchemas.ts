import { z } from "zod";

const breakdownRowSchema = z.object({
  item: z.string().trim().min(1, "Item is required"),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine((val) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    }, "Enter a valid price"),
});

export const vendorSendQuoteSchema = z.object({
  breakdown: z.array(breakdownRowSchema).min(1, "Add at least one line item"),
  note: z.string().trim().max(2000, "Note is too long"),
  validUntil: z.string().trim(),
});

export type VendorSendQuoteFormValues = z.infer<typeof vendorSendQuoteSchema>;

export type VendorQuoteLineItemPayload = {
  item: string;
  price: number;
};

export type VendorSendQuotePayload = {
  breakdown: VendorQuoteLineItemPayload[];
  note?: string;
  validUntil?: string;
};
