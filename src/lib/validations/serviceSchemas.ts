import { z } from "zod";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const vendorServiceFormSchema = z.object({
  serviceName: z
    .string()
    .trim()
    .min(1, "Service name is required")
    .max(200, "Service name is too long"),
  price: z
    .string()
    .trim()
    .min(1, "Price is required")
    .refine((val) => {
      const n = Number(val);
      return Number.isFinite(n) && n > 0;
    }, "Enter a valid price greater than 0"),
  duration: z
    .string()
    .trim()
    .min(1, "Duration is required")
    .max(80, "Duration is too long"),
  description: z
    .string()
    .trim()
    .max(5000, "Description is too long")
    .optional()
    .or(z.literal("")),
  imageFile: z
    .custom<File | null>((val) => val === null || val instanceof File)
    .nullable()
    .optional(),
});

export type VendorServiceFormValues = z.infer<typeof vendorServiceFormSchema>;

export function validateServiceImageFile(file: File | null): string | null {
  if (!file) return null;
  if (!file.type.startsWith("image/")) {
    return "Image must be a PNG, JPEG, or WebP file";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5MB or smaller";
  }
  return null;
}
