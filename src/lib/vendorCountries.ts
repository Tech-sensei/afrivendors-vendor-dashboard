/** ISO 3166-1 alpha-2 codes for vendor registration. */
export const VENDOR_COUNTRIES = [
  { iso: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { iso: "US", name: "United States", flag: "🇺🇸" },
  { iso: "NG", name: "Nigeria", flag: "🇳🇬" },
  { iso: "ZA", name: "South Africa", flag: "🇿🇦" },
  { iso: "KE", name: "Kenya", flag: "🇰🇪" },
  { iso: "GH", name: "Ghana", flag: "🇬🇭" },
] as const;

export function countryLabelToIso(label: string): string {
  const trimmed = label.trim();
  if (!trimmed) return "";
  if (trimmed.length === 2) return trimmed.toUpperCase();
  const match = VENDOR_COUNTRIES.find(
    (c) => c.name.toLowerCase() === trimmed.toLowerCase() || c.iso === trimmed.toUpperCase()
  );
  return match?.iso ?? trimmed;
}
