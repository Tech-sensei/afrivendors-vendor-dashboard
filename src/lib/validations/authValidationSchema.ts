import { z } from "zod";

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

// Inferred types
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
