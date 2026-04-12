import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import http from "@/lib/http";
import type { AuthState, VendorProfile } from "@/types/auth";

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
      if (error.response?.status === 401) {
        return rejectWithValue({ is401: true });
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
        if ((action.payload as any)?.is401) {
          state.profile = null;
          state.isAuthenticated = false;
        }
      });
  },
});

export const { setProfile, clearAuth } = authSlice.actions;
export default authSlice.reducer;
