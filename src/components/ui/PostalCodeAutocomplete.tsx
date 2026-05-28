"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";

interface GeoapifyProperties {
  formatted: string;
  street?: string;
  housenumber?: string;
  city?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

interface GeoapifyFeature {
  properties: GeoapifyProperties;
}

interface GeoapifyResponse {
  features: GeoapifyFeature[];
}

export interface AddressFields {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface PostalCodeAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: AddressFields) => void;
  disabled?: boolean;
  error?: string;
  placeholder?: string;
  inputClassName?: string;
}

const GEOAPIFY_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY ?? "";

export function PostalCodeAutocomplete({
  value,
  onChange,
  onAddressSelect,
  disabled = false,
  error,
  placeholder = "Enter postal / zip code",
  inputClassName = "",
}: PostalCodeAutocompleteProps) {
  const [results, setResults] = useState<GeoapifyFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!GEOAPIFY_KEY || query.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=postcode&filter=countrycode:gb&limit=6&format=geojson&apiKey=${GEOAPIFY_KEY}`;
      const res = await fetch(url);
      const data: GeoapifyResponse = await res.json();
      const features = data.features ?? [];
      setResults(features);
      setIsOpen(features.length > 0);
    } catch {
      setResults([]);
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void fetchSuggestions(val), 400);
  };

  const handleSelect = (feature: GeoapifyFeature) => {
    const p = feature.properties;
    const street = [p.housenumber, p.street].filter(Boolean).join(" ");
    onAddressSelect({
      street,
      city: p.city ?? p.county ?? "",
      state: p.state ?? "",
      postalCode: p.postcode ?? value,
      country: p.country ?? "",
    });
    onChange(p.postcode ?? value);
    setIsOpen(false);
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className={inputClassName}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-accent-60" />
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {isOpen && results.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-zinc-200 bg-white py-1 shadow-lg">
          {results.map((feature, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(feature)}
                className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm transition-colors hover:bg-secondary-700"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-100" />
                <span className="text-secondary-000">{feature.properties.formatted}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
