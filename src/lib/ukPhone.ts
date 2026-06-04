export const UK_PHONE_CODE = "+44";

/** Strip non-digits and cap at 11 (UK national with leading 0). */
export function sanitizeUkPhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** 10 digits (7xxxxxxxxx) or 11 digits (07xxxxxxxxx). */
export function isValidUkPhoneNumber(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  if (digits.length === 10) return /^[1-9]\d{9}$/.test(digits);
  if (digits.length === 11) return /^0[1-9]\d{9}$/.test(digits);
  return false;
}

/** Send national number without leading 0 when present. */
export function normalizeUkPhoneForApi(digits: string): string {
  const trimmed = digits.trim();
  return trimmed.startsWith("0") ? trimmed.slice(1) : trimmed;
}
