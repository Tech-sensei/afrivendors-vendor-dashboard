"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import GoogleIcon from "../../../../public/assets/icons/google.svg";
import imgHeroImage from "../../../../public/assets/images/signInHeroImg.png";
import Link from 'next/link';
import { z } from 'zod';
import { signInSchema } from '@/lib/validations/authValidationSchema';
import { useAuthAPI } from '@/services/useAuthAPI';
import { savePostKycRedirect } from '@/lib/postKycRedirect';
import { resolvePostAuthPath } from '@/lib/vendorAuthRouting';

/** `?redirect=` from auth proxy when user was sent here from a protected route (internal paths only). */
function getSafeRedirectPath(): string | null {
    if (typeof window === 'undefined') return null;
    const raw = new URLSearchParams(window.location.search).get('redirect');
    if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return null;
    return raw;
}

export default function SignInPage() {
    const router = useRouter();
    const { signInAsync, isSigningIn } = useAuthAPI();
    const [formData, setFormData] = useState({ email: 'jetoka4903@nazisat.com', password: 'Password@123' });
    const [focused, setFocused] = useState({ email: false, password: false });
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field as keyof typeof errors]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const validateForm = () => {
        const result = signInSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = z.flattenError(result.error).fieldErrors;
            setErrors({
                email: fieldErrors.email?.[0] ?? '',
                password: fieldErrors.password?.[0] ?? '',
            });
            return false;
        }
        setErrors({ email: '', password: '' });
        return true;
    };

    const handleSignIn = async () => {
        if (!validateForm()) return;
        try {
            const session = await signInAsync({ email: formData.email, password: formData.password });
            const redirectPath = getSafeRedirectPath();
            const nextPath = resolvePostAuthPath(session, redirectPath);
            if (nextPath === '/kyc-verification' || nextPath === '/onboarding/subscription') {
                savePostKycRedirect(redirectPath);
            }
            router.replace(nextPath);
        } catch {
            // error toast handled inside useAuthAPI
        }
    };

    const isDisabled = !formData.email || !formData.password || isSigningIn;

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen max-h-screen overflow-hidden">
                {/* Left Column - Form */}
                <div className="flex flex-col justify-between p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-140 w-full mx-auto">

                        {/* Header */}
                        <div className="my-12">
                            <h1 className="font-unbounded text-[clamp(28px,2.6vw,36px)] leading-[110%] font-semibold text-secondary-000 mb-3">
                                Vendor Portal
                            </h1>
                            <p className="text-base leading-6 text-accent-80">
                                Sign in to your vendor account to manage your business.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="flex flex-col gap-5">
                            {/* Social Login */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => { }}
                                    aria-label="Continue with Google"
                                    className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-accent-20 rounded-xl cursor-pointer transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98] focus:outline-2 focus:outline-primary-100 outline-offset-2"
                                >
                                    <Image src={GoogleIcon} alt="Google" className="w-6 h-6" />
                                    <span className="text-base leading-5 font-semibold text-secondary-000">
                                        Continue with Google
                                    </span>
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-px bg-accent-20" />
                                <span className="text-sm leading-5 text-accent-80">OR</span>
                                <div className="flex-1 h-px bg-accent-20" />
                            </div>

                            {/* Email Field */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-base leading-6 font-normal text-secondary-000">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="e.g example@email.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    onFocus={() => setFocused({ ...focused, email: true })}
                                    onBlur={() => setFocused({ ...focused, email: false })}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-xl outline-none transition-colors duration-200 ease-out ${formData.email ? 'bg-secondary-600' : 'bg-white'
                                        } ${errors.email
                                            ? 'border border-red-600'
                                            : focused.email
                                                ? 'border border-primary-100'
                                                : 'border border-accent-20'
                                        }`}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-base leading-6 font-normal text-secondary-000">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm leading-5 font-semibold text-primary-100 underline transition-opacity duration-200 ease-out hover:opacity-70"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        onFocus={() => setFocused({ ...focused, password: true })}
                                        onBlur={() => setFocused({ ...focused, password: false })}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
                                        className={`w-full h-14 pl-4 pr-12 text-base leading-6 text-secondary-000 rounded-xl outline-none transition-colors duration-200 ease-out ${formData.password ? 'bg-secondary-600' : 'bg-white'
                                            } ${errors.password
                                                ? 'border border-red-600'
                                                : focused.password
                                                    ? 'border border-primary-100'
                                                    : 'border border-accent-20'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-accent-80 hover:text-secondary-000 transition-colors duration-200"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Sign In Button */}
                            <button
                                onClick={handleSignIn}
                                disabled={isDisabled}
                                className={`w-full h-14 flex items-center justify-center gap-2 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out ${isDisabled
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:opacity-90 active:scale-[0.98]'
                                    }`}
                            >
                                {isSigningIn ? (
                                    <span className="text-base leading-5 font-semibold text-white">Signing in...</span>
                                ) : (
                                    <>
                                        <span className="text-base leading-5 font-semibold text-white">Sign In</span>
                                        <ArrowRight className="w-[18px] h-[18px] text-white" />
                                    </>
                                )}
                            </button>

                            {/* Sign Up Link */}
                            <div className="text-center pt-1">
                                <p className="text-base leading-6 text-accent-80">
                                    Don&apos;t have an account?{' '}
                                    <Link
                                        href="/sign-up"
                                        className="font-semibold text-primary-100 underline transition-opacity duration-200 ease-out hover:opacity-70"
                                    >
                                        Create account
                                    </Link>
                                </p>
                            </div>

                            {/* Customer Link */}
                            <div className="text-center">
                                <p className="text-base leading-6 text-accent-80">
                                    Are you a customer?{' '}
                                    <button
                                        onClick={() => window.open('https://afrivendors-client.vercel.app/sign-in', '_blank')}
                                        className="font-semibold text-secondary-000 underline bg-transparent border-none cursor-pointer p-0 transition-opacity duration-200 ease-out hover:opacity-70"
                                    >
                                        Sign in as a customer
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="max-w-140 w-full mt-12 mx-auto flex items-center justify-between flex-wrap gap-4">
                        <p className="text-sm leading-5 text-accent-80">© {new Date().getFullYear()} Afrivendors.co.uk ltd</p>
                        <button
                            onClick={() => router.push('/help-support')}
                            className="text-base leading-5 font-semibold text-secondary-000 bg-transparent border-none cursor-pointer underline transition-opacity duration-200 ease-out hover:opacity-70"
                        >
                            Help & Support
                        </button>
                    </div>
                </div>

                {/* Right Column - Hero Image (Desktop only) */}
                <div className="hidden lg:block relative bg-secondary-000 overflow-hidden h-screen rounded-bl-[200px]">
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
