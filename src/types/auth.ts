// ─── Sub-types matching /vendor/me response ───────────────────────────────────

/** Nested `kyc.location` from API (snake_case fields). */
export interface VendorKycLocationBlock {
  id?: number;
  street_address?: string | null;
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
}

export interface VendorKyc {
  id: number;
  businessName: string;
  /** Legacy string line, or structured block from API. */
  location: string | VendorKycLocationBlock | null;
  /** Structured address (when returned by `/vendor/me` after using `/vendor/address`). */
  streetAddress?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  aboutBusiness: string;
  website: string | null;
  bannerImage: string | null;
  kycSubmitted?: boolean;
  canReceivePayment?: boolean;
  canHandlePayout?: boolean;
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
  kycSubmitted?: boolean;
  canReceivePayment?: boolean;
  canHandlePayout?: boolean;
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
  /** Injected by `useAuthAPI` — do not omit when calling mutate. */
  portal?: string;
}

/** Shape of `POST /auth/login` success body (vendor). */
export interface VendorLoginKycSnapshot {
  kycSubmitted: boolean;
  canReceivePayment?: boolean;
  canHandlePayout?: boolean;
}

export interface VendorLoginResponse {
  id: number;
  accountType: string;
  adminRoles: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  createdAt: string;
  vendorKyc?: VendorLoginKycSnapshot | null;
  accessToken?: string;
  refreshToken?: string;
}

/** `POST /auth/refresh` success body (Bearer = refresh token). */
export interface VendorAuthRefreshResponse {
  id: number;
  accessToken: string;
  refreshToken: string;
  vendorKyc?: VendorLoginKycSnapshot | null;
}

export type VendorRegisterAccountKind = "individual" | "business";

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  password: string;
  phoneNumber: AuthPhoneNumber;
  accountType: "vendor";
  /** Client / extended registration metadata (API may accept or ignore fields). */
  vendorAccountKind?: VendorRegisterAccountKind;
  /** Selected category from `GET /categories` (individual vendors). */
  serviceCategoryId?: number;
  serviceCategory?: string;
  businessName?: string;
  /** Selected category from `GET /categories` (business vendors). */
  businessCategoryId?: number;
  businessCategory?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
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
