import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import http from "@/lib/http";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserProfile } from "@/store/authSlice";
import type { BusinessProfile } from "@/data/business-profile";
import {
  firstZodIssueMessage,
  normalizeTimeToHHmm,
  vendorAboutBusinessPayloadSchema,
  vendorAddressPayloadSchema,
  vendorOpeningHourPayloadSchema,
  type VendorAboutBusinessPayload,
  type VendorAddressPayload,
} from "@/lib/validations/vendorProfileSchemas";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const DEFAULT_DAY_ROW = { isOpen: false, open: "09:00", close: "18:00" } as const;

function rowForDay(
  hours: BusinessProfile["openingHours"],
  day: (typeof DAYS)[number]
) {
  return hours[day] ?? { ...DEFAULT_DAY_ROW };
}

function openingHourRowsEqual(
  a: { isOpen: boolean; open: string; close: string },
  b: { isOpen: boolean; open: string; close: string }
): boolean {
  return (
    a.isOpen === b.isOpen &&
    normalizeTimeToHHmm(a.open) === normalizeTimeToHHmm(b.open) &&
    normalizeTimeToHHmm(a.close) === normalizeTimeToHHmm(b.close)
  );
}

function axiosMessage(err: unknown): string | undefined {
  if (!axios.isAxiosError(err)) return undefined;
  const d = err.response?.data as { message?: string; responseMessage?: string } | undefined;
  if (d?.message != null) return String(d.message);
  if (d?.responseMessage != null) return String(d.responseMessage);
  return err.message;
}

export function useUpdateAboutBusiness() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (raw: unknown) => {
      const parsed = vendorAboutBusinessPayloadSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(firstZodIssueMessage(parsed.error));
      }
      try {
        await http.patch<VendorAboutBusinessPayload>(
          "/vendor/about-business",
          parsed.data
        );
      } catch (e: unknown) {
        throw new Error(axiosMessage(e) ?? "Could not update description");
      }
    },
    onSuccess: () => {
      dispatch(fetchUserProfile());
    },
  });
}

export function useUpdateVendorAddress() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async (raw: unknown) => {
      const parsed = vendorAddressPayloadSchema.safeParse(raw);
      if (!parsed.success) {
        throw new Error(firstZodIssueMessage(parsed.error));
      }
      try {
        await http.patch<VendorAddressPayload>("/vendor/address", parsed.data);
      } catch (e: unknown) {
        throw new Error(axiosMessage(e) ?? "Could not update address");
      }
    },
    onSuccess: () => {
      dispatch(fetchUserProfile());
    },
  });
}

export interface SaveOpeningHoursInput {
  previous: BusinessProfile["openingHours"];
  next: BusinessProfile["openingHours"];
}

export function useSaveVendorOpeningHours() {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async ({
      previous,
      next,
    }: SaveOpeningHoursInput): Promise<{ postedCount: number }> => {
      let postedCount = 0;
      for (const day of DAYS) {
        const prevRow = rowForDay(previous, day);
        const nextRow = rowForDay(next, day);
        if (openingHourRowsEqual(prevRow, nextRow)) continue;

        const payload = {
          day,
          isOpen: nextRow.isOpen,
          openTime: normalizeTimeToHHmm(nextRow.open),
          closeTime: normalizeTimeToHHmm(nextRow.close),
        };
        const parsed = vendorOpeningHourPayloadSchema.safeParse(payload);
        if (!parsed.success) {
          throw new Error(`${day}: ${firstZodIssueMessage(parsed.error)}`);
        }
        try {
          await http.post("/vendor/opening-hours", {
            day: parsed.data.day,
            isOpen: parsed.data.isOpen,
            openTime: normalizeTimeToHHmm(parsed.data.openTime),
            closeTime: normalizeTimeToHHmm(parsed.data.closeTime),
          });
          postedCount += 1;
        } catch (e: unknown) {
          throw new Error(axiosMessage(e) ?? `Could not save hours for ${day}`);
        }
      }
      return { postedCount };
    },
    onSuccess: (result) => {
      if (result.postedCount > 0) {
        dispatch(fetchUserProfile());
      }
    },
  });
}
