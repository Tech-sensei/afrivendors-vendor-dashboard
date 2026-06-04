import { z } from "zod";
import type { VendorRegisterAccountKind } from "@/types/auth";
import { isValidUkPhoneNumber, UK_PHONE_CODE } from "@/lib/ukPhone";

const phoneNumberDigits = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^\d+$/, "Phone number must contain only digits");

const ukPhoneNumber = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .regex(/^\d+$/, "Phone number must contain only digits")
  .max(11, "UK phone number is too long")
  .refine(isValidUkPhoneNumber, {
    message: "Enter a valid UK phone number (10 digits, or 11 starting with 0)",
  });

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .check(z.email("Please enter a valid email address")),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

export const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z
    .string()
    .min(1, "Email address is required")
    .check(z.email("Please enter a valid email address")),
  country: z.string().min(1, "Country is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
  phoneCode: z.string().min(1, "Phone code is required"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required")
    .check(z.email("Please enter a valid email address")),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

/** Settings drawer field names (`current` / `new` / `confirm`). */
export const changePasswordFormSchema = z
  .object({
    current: z.string().min(1, "Current password is required"),
    new: z
      .string()
      .min(1, "New password is required")
      .min(8, "Password must be at least 8 characters"),
    confirm: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.new === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

export const deleteAccountConfirmationSchema = z.object({
  confirmation: z
    .string()
    .trim()
    .refine((val) => val === "DELETE", {
      message: 'Type DELETE to confirm',
    }),
});

export const vendorSignUpFormSchema = z
  .object({
    accountKind: z.enum(["individual", "business"] satisfies [
      VendorRegisterAccountKind,
      VendorRegisterAccountKind,
    ]),
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .check(z.email("Please enter a valid email address")),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    phoneCode: z.literal(UK_PHONE_CODE),
    phoneNumber: ukPhoneNumber,
    displayName: z
      .string()
      .trim()
      .min(1, "Display name is required")
      .max(80, "Display name is too long"),
    categoryId: z.string(),
    businessName: z.string(),
    streetAddress: z
      .string()
      .trim()
      .min(1, "Street address is required")
      .max(500, "Street address is too long"),
    city: z.string().trim().min(1, "City is required").max(120, "City is too long"),
    state: z.string().trim().min(1, "State is required").max(120, "State is too long"),
    zipCode: z
      .string()
      .trim()
      .min(1, "Post code is required")
      .max(8, "Post code is too long"),
    country: z.string().trim().min(1, "Country is required"),
    agreedToTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.agreedToTerms, {
    message: "You must agree to the terms and conditions",
    path: ["agreedToTerms"],
  })
  .superRefine((data, ctx) => {
    const categoryId = Number(data.categoryId);
    if (!data.categoryId.trim() || !Number.isInteger(categoryId) || categoryId < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category is required",
        path: ["categoryId"],
      });
    }
    if (data.accountKind === "business" && !data.businessName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Business name is required",
        path: ["businessName"],
      });
    }
  });

// Inferred types
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ChangePasswordDrawerFormData = z.infer<typeof changePasswordFormSchema>;
export type VendorSignUpFormData = z.infer<typeof vendorSignUpFormSchema>;
