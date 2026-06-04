"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import imgHeroImage from "../../../../public/assets/images/signUpHeroImg.png";
import Link from "next/link";
import { useAuthAPI } from "@/services/useAuthAPI";
import { useVendorCategories } from "@/hooks/useVendorCategories";
import type { VendorRegisterAccountKind } from "@/types/auth";
import { vendorSignUpFormSchema } from "@/lib/validations/authValidationSchema";
import { zodFieldErrors } from "@/lib/validations/zodHelpers";
import { PostalCodeAutocomplete } from "@/components/ui/PostalCodeAutocomplete";
import { UK_PHONE_CODE, normalizeUkPhoneForApi, sanitizeUkPhoneInput } from "@/lib/ukPhone";

const DEFAULT_COUNTRY = "GB";

type FormErrors = Record<string, string>;

export default function SignUpPage() {
  const router = useRouter();
  const { signUpAsync, isSigningUp } = useAuthAPI();
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError, refetch: refetchCategories } =
    useVendorCategories();

  const [accountKind, setAccountKind] = useState<VendorRegisterAccountKind>("individual");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneCode: UK_PHONE_CODE,
    phoneNumber: "",
    displayName: "",
    categoryId: "",
    businessName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: DEFAULT_COUNTRY,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const validateForm = (): boolean => {
    const result = vendorSignUpFormSchema.safeParse({
      ...formData,
      accountKind,
      agreedToTerms,
    });
    if (!result.success) {
      setErrors(zodFieldErrors(result.error) as FormErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleContinue = async () => {
    if (!validateForm()) return;
    try {
      const categoryId = Number(formData.categoryId);
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        country: DEFAULT_COUNTRY,
        password: formData.password,
        phoneNumber: {
          code: UK_PHONE_CODE,
          number: normalizeUkPhoneForApi(formData.phoneNumber),
        },
        accountType: "vendor" as const,
        displayName: formData.displayName.trim(),
        vendorAccountKind: accountKind,
        categoryId,
        streetAddress: formData.streetAddress.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        ...(accountKind === "business" && formData.businessName.trim()
          ? { businessName: formData.businessName.trim() }
          : {}),
      };
      await signUpAsync(payload);
      router.push(`/sign-up/celebration?email=${encodeURIComponent(formData.email)}`);
    } catch {
      // error toast handled inside useAuthAPI
    }
  };

  const requiredFilled =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.phoneNumber &&
    formData.displayName &&
    formData.categoryId &&
    formData.streetAddress &&
    formData.city &&
    formData.state &&
    formData.zipCode &&
    formData.country &&
    (accountKind === "individual" || formData.businessName) &&
    !categoriesLoading &&
    categories.length > 0;

  const isDisabled = !requiredFilled || !agreedToTerms || isSigningUp || categoriesLoading || categoriesError;

  const inputClass = (field: string, hasValue: boolean) =>
    `w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
      hasValue ? "bg-secondary-600" : "bg-secondary-800"
    } ${errors[field] ? "border border-red-600" : "border border-secondary-200 focus:border-primary-100"}`;

  return (
    <div className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex max-h-screen flex-col overflow-y-auto bg-white p-6 md:p-8 lg:p-12">
          <div className="mx-auto w-full max-w-132">
            <button
              type="button"
              onClick={() => router.push("/sign-in")}
              aria-label="Go back"
              className="mb-8 inline-flex cursor-pointer items-center gap-2 rounded-lg border-none bg-transparent p-2 transition-colors duration-200 ease-out hover:bg-secondary-600"
            >
              <ArrowLeft className="h-6 w-6 text-secondary-000" />
            </button>

            <div className="mb-6">
              <h2 className="mb-2 font-unbounded text-[clamp(20px,3vw,24px)] font-semibold leading-tight text-secondary-000">
                Create a vendor account
              </h2>
              <p className="text-base leading-6 text-accent-80">
                Complete your details to get started. Includes{" "}
                <span className="font-semibold text-secondary-000">6 months free</span>{" "}
                marketplace visibility — then choose monthly, 3-month, 6-month, or
                yearly billing.
              </p>
            </div>

            <div className="mb-8 flex w-full rounded-full bg-secondary-700 p-1">
              <button
                type="button"
                onClick={() => setAccountKind("individual")}
                className={`flex-1 rounded-full py-3.5 text-center text-sm font-semibold transition-colors ${
                  accountKind === "individual"
                    ? "bg-secondary-000 text-white"
                    : "bg-transparent text-secondary-000"
                }`}
              >
                Individual Account
              </button>
              <button
                type="button"
                onClick={() => setAccountKind("business")}
                className={`flex-1 rounded-full py-3.5 text-center text-sm font-semibold transition-colors ${
                  accountKind === "business" ? "bg-secondary-000 text-white" : "bg-transparent text-secondary-000"
                }`}
              >
                Business Account
              </button>
            </div>

            {categoriesError ? (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-secondary-000">
                <p className="mb-2">Could not load categories. Check your connection and try again.</p>
                <button
                  type="button"
                  onClick={() => void refetchCategories()}
                  className="font-semibold text-primary-100 underline"
                >
                  Retry
                </button>
              </div>
            ) : null}

            <div className="mb-12 flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="firstName" className="text-base font-normal leading-6 text-secondary-000">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="e.g. John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={inputClass("firstName", !!formData.firstName)}
                  />
                  {errors.firstName ? <p className="text-sm text-red-600">{errors.firstName}</p> : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="lastName" className="text-base font-normal leading-6 text-secondary-000">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="e.g. Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={inputClass("lastName", !!formData.lastName)}
                  />
                  {errors.lastName ? <p className="text-sm text-red-600">{errors.lastName}</p> : null}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="displayName" className="text-base font-normal leading-6 text-secondary-000">
                  Display name *
                </label>
                <input
                  id="displayName"
                  type="text"
                  placeholder="Public name on Afrivendors"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange("displayName", e.target.value)}
                  className={inputClass("displayName", !!formData.displayName)}
                />
                <p className="text-xs text-accent-80">
                  This is how clients will see you on the marketplace.
                </p>
                {errors.displayName ? <p className="text-sm text-red-600">{errors.displayName}</p> : null}
              </div>

              {accountKind === "business" ? (
                <div className="flex flex-col gap-2">
                  <label htmlFor="businessName" className="text-base font-normal leading-6 text-secondary-000">
                    Business Name *
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    placeholder="Your registered business name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className={inputClass("businessName", !!formData.businessName)}
                  />
                  {errors.businessName ? <p className="text-sm text-red-600">{errors.businessName}</p> : null}
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                <label className="text-base font-normal leading-6 text-secondary-000">Category *</label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange("categoryId", value)}
                  disabled={categoriesLoading || categories.length === 0}
                >
                  <SelectTrigger
                    className={`h-14 w-full rounded-lg border px-4 py-7 text-base leading-6 text-secondary-000 ${
                      errors.categoryId ? "border-red-600" : "border-secondary-200"
                    } ${formData.categoryId ? "bg-secondary-600" : "bg-secondary-800"}`}
                  >
                    <SelectValue
                      placeholder={
                        categoriesLoading ? "Loading categories…" : categories.length ? "Select category" : "No categories"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId ? (
                  <p className="text-sm text-red-600">{errors.categoryId}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-base font-normal leading-6 text-secondary-000">
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="e.g. example@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={inputClass("email", !!formData.email)}
                />
                {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-base font-normal leading-6 text-secondary-000">Phone Number *</span>
                <div className="flex gap-2.5">
                  <div className="flex h-14 w-30 shrink-0 items-center justify-center rounded-lg border border-secondary-200 bg-white px-3 text-base leading-6 text-secondary-000">
                    🇬🇧 {UK_PHONE_CODE}
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    maxLength={11}
                    placeholder="e.g. 7123456789"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      handleInputChange("phoneNumber", sanitizeUkPhoneInput(e.target.value))
                    }
                    className={`flex-1 ${inputClass("phoneNumber", !!formData.phoneNumber)}`}
                  />
                </div>
                <p className="text-xs text-accent-80">
                  UK numbers only — 10 digits, or 11 if you include the leading 0.
                </p>
                {errors.phoneNumber ? <p className="text-sm text-red-600">{errors.phoneNumber}</p> : null}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-base font-normal leading-6 text-secondary-000">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="**************"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`${inputClass("password", !!formData.password)} pr-16`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-secondary-000"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmPassword" className="text-base font-normal leading-6 text-secondary-000">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="**************"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`${inputClass("confirmPassword", !!formData.confirmPassword)} pr-16`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((s) => !s)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-4 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center border-none bg-transparent p-1 text-secondary-000"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword ? <p className="text-sm text-red-600">{errors.confirmPassword}</p> : null}
                </div>
              </div>

              <div className="mt-2 border-t border-border pt-4">
                <h3 className="mb-1 font-unbounded text-base font-semibold text-secondary-000">Location</h3>
                <p className="mb-4 text-sm text-accent-80">
                  Start with your post code — we&apos;ll fill in the rest.
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="zipCode" className="text-base font-normal leading-6 text-secondary-000">
                      Post code *
                    </label>
                    <PostalCodeAutocomplete
                      value={formData.zipCode}
                      onChange={(val) => handleInputChange("zipCode", val)}
                      onAddressSelect={(addr) => {
                        setFormData((prev) => ({
                          ...prev,
                          streetAddress: addr.street || prev.streetAddress,
                          city: addr.city || prev.city,
                          state: addr.state || prev.state,
                          zipCode: addr.postalCode,
                          country: DEFAULT_COUNTRY,
                        }));
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.streetAddress;
                          delete next.city;
                          delete next.state;
                          delete next.zipCode;
                          delete next.country;
                          return next;
                        });
                      }}
                      disabled={isSigningUp}
                      error={errors.zipCode}
                      placeholder="e.g. M32 0JG"
                      inputClassName={inputClass("zipCode", !!formData.zipCode)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="streetAddress" className="text-base font-normal leading-6 text-secondary-000">
                      Street Address *
                    </label>
                    <input
                      id="streetAddress"
                      type="text"
                      placeholder="Street address"
                      value={formData.streetAddress}
                      onChange={(e) => handleInputChange("streetAddress", e.target.value)}
                      className={inputClass("streetAddress", !!formData.streetAddress)}
                    />
                    {errors.streetAddress ? <p className="text-sm text-red-600">{errors.streetAddress}</p> : null}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="city" className="text-base font-normal leading-6 text-secondary-000">
                        City *
                      </label>
                      <input
                        id="city"
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={inputClass("city", !!formData.city)}
                      />
                      {errors.city ? <p className="text-sm text-red-600">{errors.city}</p> : null}
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="state" className="text-base font-normal leading-6 text-secondary-000">
                        County / State *
                      </label>
                      <input
                        id="state"
                        type="text"
                        placeholder="County or state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className={inputClass("state", !!formData.state)}
                      />
                      {errors.state ? <p className="text-sm text-red-600">{errors.state}</p> : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-base font-normal leading-6 text-secondary-000">Country *</label>
                    <div
                      aria-readonly="true"
                      className="flex h-14 w-full items-center rounded-lg border border-secondary-200 bg-secondary-600 px-4 text-base leading-6 text-secondary-000 opacity-80"
                    >
                      🇬🇧 United Kingdom
                    </div>
                    <p className="text-xs text-accent-80">Vendor registration is currently available in the UK only.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => {
                    setAgreedToTerms(checked === true);
                    clearError("agreedToTerms");
                  }}
                  className="mt-1"
                />
                <label htmlFor="terms" className="flex-1 cursor-pointer text-base leading-5 text-accent-100">
                  I agree to the{" "}
                  <a
                    href="/terms-of-use"
                    className="font-bold text-secondary-000 underline transition-opacity duration-200 ease-out hover:opacity-70"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-bold text-secondary-000 underline transition-opacity duration-200 ease-out hover:opacity-70"
                  >
                    Policies
                  </Link>{" "}
                  of <strong>Afrivendor.</strong>
                </label>
              </div>
              {errors.agreedToTerms ? (
                <p className="text-sm text-red-600">{errors.agreedToTerms}</p>
              ) : null}

              <button
                type="button"
                onClick={handleContinue}
                disabled={isDisabled}
                className={`flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-primary-100 transition-all duration-200 ease-out ${
                  isDisabled ? "cursor-not-allowed opacity-50" : "hover:opacity-90 active:scale-[0.98]"
                }`}
              >
                <span className="text-base font-semibold leading-5 text-white">
                  {isSigningUp ? "Creating account..." : "Continue"}
                </span>
                {!isSigningUp ? <ArrowRight className="h-4.5 w-4.5 text-white" /> : null}
              </button>

              <div className="pt-1 text-center">
                <p className="text-base leading-6 text-accent-80">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-primary-100 underline transition-opacity duration-200 ease-out hover:opacity-70"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            <div className="mx-auto mt-4 flex max-w-132 flex-wrap items-center justify-between gap-4">
              <p className="text-base leading-6 text-accent-80">© {new Date().getFullYear()} Afrivendors.co.uk ltd</p>
              <button
                type="button"
                onClick={() => router.push("/help-support")}
                className="cursor-pointer border-none bg-transparent p-0 text-base font-semibold leading-5 text-secondary-000 underline transition-opacity duration-200 ease-out hover:opacity-70"
              >
                Help & Support
              </button>
            </div>
          </div>
        </div>

        <div className="relative hidden h-screen overflow-hidden rounded-bl-[200px] bg-secondary-000 lg:block">
          <Image
            src={imgHeroImage}
            alt="Vendor Portal"
            fill
            sizes="50vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-[rgba(29,13,4,0.15)]" />
        </div>
      </div>
    </div>
  );
}

