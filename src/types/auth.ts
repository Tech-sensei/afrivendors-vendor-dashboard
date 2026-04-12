// ─── Sub-types matching /vendor/me response ───────────────────────────────────

export interface VendorKyc {
  id: number;
  businessName: string;
  location: string;
  aboutBusiness: string;
  website: string | null;
  bannerImage: string | null;
  approvalStatus: "pending" | "approved" | "rejected" | "under_review";
  category: {
    id: number;
    name: string;
  } | null;
}

export interface VendorOpeningHour {
  id: number;
  day: string;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
}

export interface VendorGalleryItem {
  id: number;
  imageUrl: string;
  isBanner: boolean;
}

// ─── Core vendor account (the "vendor" key in the API response) ───────────────

export interface VendorAccount {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  phoneNumber: string;
  emailVerifiedAt: string | null;
  accountType: string;
  adminRoles: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Full profile returned by /vendor/me ─────────────────────────────────────

export interface VendorProfile {
  vendor: VendorAccount;
  kyc: VendorKyc | null;
  openingHours: VendorOpeningHour[];
  gallery: VendorGalleryItem[];
}

// ─── Redux auth state ─────────────────────────────────────────────────────────

export interface AuthState {
  profile: VendorProfile | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
}

// ─── Auth payload types ───────────────────────────────────────────────────────

export interface AuthPhoneNumber {
  code: string;
  number: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
  phoneNumber: AuthPhoneNumber;
  accountType: "vendor";
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface ResendOTPPayload {
  email: string;
}
