import { z } from "zod";

export const sendQuoteFormSchema = z.object({
  quoteAmount: z
    .string()
    .trim()
    .min(1, "Quote amount is required")
    .refine((val) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    }, "Enter a valid amount greater than 0"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message is too long"),
});

export type SendQuoteFormValues = z.infer<typeof sendQuoteFormSchema>;
