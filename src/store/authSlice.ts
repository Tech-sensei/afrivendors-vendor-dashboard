import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import http, { redirectToSignIn } from "@/lib/http";
import type { AuthState, VendorLoginKycSnapshot, VendorProfile } from "@/types/auth";

const initialState: AuthState = {
  profile: null,
  isAuthenticated: false,
  isLoadingUser: false,
};

// ─── Async Thunk ─────────────────────────────────────────────────────────────

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await http.get("/vendor/me");
      // API returns { vendor, kyc, openingHours, gallery }
      return (data?.data ?? data) as VendorProfile;
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 401) {
        return rejectWithValue({ is401: true });
      }
      if (status === 403) {
        redirectToSignIn();
        return rejectWithValue({ isForbiddenPortal: true });
      }
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<VendorProfile>) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
    },
    /** After `/auth/refresh`, merge KYC flags without a full `/vendor/me` round-trip. */
    mergeVendorKycFromRefresh: (
      state,
      action: PayloadAction<{ vendorKyc?: VendorLoginKycSnapshot | null }>
    ) => {
      const k = action.payload.vendorKyc;
      if (!k || !state.profile) return;
      state.profile.vendor.kycSubmitted = k.kycSubmitted;
      if (k.canReceivePayment !== undefined) {
        state.profile.vendor.canReceivePayment = k.canReceivePayment;
      }
      if (k.canHandlePayout !== undefined) {
        state.profile.vendor.canHandlePayout = k.canHandlePayout;
      }
      if (state.profile.kyc) {
        state.profile.kyc.kycSubmitted = k.kycSubmitted;
        if (k.canReceivePayment !== undefined) {
          state.profile.kyc.canReceivePayment = k.canReceivePayment;
        }
        if (k.canHandlePayout !== undefined) {
          state.profile.kyc.canHandlePayout = k.canHandlePayout;
        }
      }
    },
    clearAuth: (state) => {
      state.profile = null;
      state.isAuthenticated = false;
      state.isLoadingUser = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoadingUser = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isAuthenticated = true;
        state.isLoadingUser = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoadingUser = false;
        if ((action.payload as any)?.is401 || (action.payload as any)?.isForbiddenPortal) {
          state.profile = null;
          state.isAuthenticated = false;
        }
      });
  },
});

export const { setProfile, mergeVendorKycFromRefresh, clearAuth } = authSlice.actions;
export default authSlice.reducer;
