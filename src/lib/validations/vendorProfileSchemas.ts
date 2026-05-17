import { z } from "zod";

/** Normalize HTML time input / API values to `HH:mm`. */
export function normalizeTimeToHHmm(value: string): string {
  const v = value.trim();
  if (!v) return "";
  return v.length >= 5 ? v.slice(0, 5) : v;
}

export const vendorAddressPayloadSchema = z.object({
  streetAddress: z
    .string()
    .trim()
    .min(1, "Street address is required")
    .max(500, "Street address is too long"),
  city: z.string().trim().min(1, "City is required").max(120, "City is too long"),
  state: z.string().trim().min(1, "State is required").max(120, "State is too long"),
  zip: z
    .string()
    .trim()
    .min(1, "ZIP / postal code is required")
    .max(6, "ZIP / postal code must be at most 6 characters"),
});

export type VendorAddressPayload = z.infer<typeof vendorAddressPayloadSchema>;

export const vendorAboutBusinessPayloadSchema = z.object({
  aboutBusiness: z
    .string()
    .trim()
    .min(1, "Business description is required")
    .max(5000, "Business description is too long"),
});

export type VendorAboutBusinessPayload = z.infer<
  typeof vendorAboutBusinessPayloadSchema
>;

export const vendorOpeningHourDaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export type VendorOpeningHourDay = z.infer<typeof vendorOpeningHourDaySchema>;

export const vendorOpeningHourPayloadSchema = z
  .object({
    day: vendorOpeningHourDaySchema,
    isOpen: z.boolean(),
    openTime: z.string(),
    closeTime: z.string(),
  })
  .superRefine((val, ctx) => {
    if (!val.isOpen) return;

    const openTime = normalizeTimeToHHmm(val.openTime);
    const closeTime = normalizeTimeToHHmm(val.closeTime);
    const timeRe = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (!timeRe.test(openTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid open time (HH:mm)",
        path: ["openTime"],
      });
    }
    if (!timeRe.test(closeTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid close time (HH:mm)",
        path: ["closeTime"],
      });
    }
    if (!timeRe.test(openTime) || !timeRe.test(closeTime)) return;

    const [oh, om] = openTime.split(":").map(Number);
    const [ch, cm] = closeTime.split(":").map(Number);
    const openM = oh * 60 + om;
    const closeM = ch * 60 + cm;
    if (closeM <= openM) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Close time must be after open time",
        path: ["closeTime"],
      });
    }
  });

export type VendorOpeningHourPayload = z.infer<typeof vendorOpeningHourPayloadSchema>;

export { firstZodIssueMessage } from "@/lib/validations/zodHelpers";
