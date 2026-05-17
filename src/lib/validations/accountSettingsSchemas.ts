import { z } from "zod";

export const vendorAccountSettingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(120, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .check(z.email("Enter a valid email address")),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .max(30, "Phone number is too long"),
});

export type VendorAccountSettingsFormValues = z.infer<
  typeof vendorAccountSettingsSchema
>;
