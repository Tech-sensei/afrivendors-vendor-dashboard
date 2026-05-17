import { z } from "zod";

export const customDateRangeSchema = z
  .object({
    start: z.string().trim(),
    end: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    if (!data.start && !data.end) return;
    if (!data.start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a start date",
        path: ["start"],
      });
    }
    if (!data.end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select an end date",
        path: ["end"],
      });
    }
    if (data.start && data.end && data.end < data.start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be on or after start date",
        path: ["end"],
      });
    }
  });
