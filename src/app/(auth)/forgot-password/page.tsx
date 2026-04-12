"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Mail } from 'lucide-react';
import Image from 'next/image';
import imgHeroImage from "../../../../public/assets/images/signInHeroImg.png";
import Link from 'next/link';
import { forgotPasswordSchema } from '@/lib/validations/authValidationSchema';
import { useAuthAPI } from '@/services/useAuthAPI';

const ForgotPasswordPage = () => {
    const router = useRouter();
    const { forgotPasswordAsync, isSendingResetLink } = useAuthAPI();
    const [email, setEmail] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const validateEmail = () => {
        const result = forgotPasswordSchema.safeParse({ email });
        if (!result.success) {
            setEmailError(result.error.flatten().fieldErrors.email?.[0] ?? '');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleSubmit = async () => {
        if (!validateEmail()) return;
        try {
            await forgotPasswordAsync({ email });
            setIsSuccess(true);
        } catch {
            // error toast handled inside useAuthAPI
        }
    };

    const isDisabled = !email || isSendingResetLink;

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen max-h-screen overflow-hidden">
                {/* Left Column - Form */}
                <div className="flex flex-col justify-between p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-140 w-full mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => router.push('/sign-in')}
                            aria-label="Go back to sign in"
                            className="inline-flex items-center gap-2 mb-8 bg-transparent border-none cursor-pointer p-2 min-w-11 min-h-11 rounded-xl transition-colors duration-200 ease-out hover:bg-secondary-700"
                        >
                            <ArrowLeft className="w-5 h-5 text-secondary-000" />
                        </button>

                        {!isSuccess ? (
                            <>
                                {/* Header */}
                                <div className="mb-10">
                                    <h1 className="font-unbounded text-[clamp(28px,2.6vw,36px)] leading-[110%] font-semibold text-secondary-000 mb-3">
                                        Forgot password?
                                    </h1>
                                    <p className="text-base leading-6 text-accent-80">
                                        No worries! Enter your email and we&apos;ll send you a link to reset your password.
                                    </p>
                                </div>

                                {/* Form */}
                                <div className="flex flex-col gap-5">
                                    {/* Email Field */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-base leading-6 font-normal text-secondary-000">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="e.g example@email.com"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                if (emailError) setEmailError('');
                                            }}
                                            onFocus={() => setEmailFocused(true)}
                                            onBlur={() => setEmailFocused(false)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                            className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-xl outline-none transition-colors duration-200 ease-out ${email ? 'bg-secondary-600' : 'bg-white'
                                                } ${emailError
                                                    ? 'border border-red-600'
                                                    : emailFocused
                                                        ? 'border border-primary-100'
                                                        : 'border border-accent-20'
                                                }`}
                                        />
                                        {emailError && (
                                            <p className="text-sm text-red-600">{emailError}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isDisabled}
                                        className={`w-full h-14 flex items-center justify-center gap-2 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out ${isDisabled
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:opacity-90 active:scale-[0.98]'
                                            }`}
                                    >
                                        {isSendingResetLink ? (
                                            <span className="text-base leading-5 font-semibold text-white">Sending...</span>
                                        ) : (
                                            <>
                                                <span className="text-base leading-5 font-semibold text-white">Send Reset Link</span>
                                                <ArrowRight className="w-[18px] h-[18px] text-white" />
                                            </>
                                        )}
                                    </button>

                                    {/* Back to Sign In */}
                                    <div className="text-center pt-1">
                                        <p className="text-base leading-6 text-accent-80">
                                            Remembered your password?{' '}
                                            <Link
                                                href="/sign-in"
                                                className="font-semibold text-primary-100 underline transition-opacity duration-200 ease-out hover:opacity-70"
                                            >
                                                Sign in
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Success State */
                            <div className="flex flex-col items-center text-center py-12">
                                <div className="w-20 h-20 rounded-2xl bg-secondary-700 flex items-center justify-center mb-6">
                                    <Mail className="w-10 h-10 text-primary-100" />
                                </div>
                                <h1 className="font-unbounded text-[clamp(24px,2.6vw,32px)] leading-[110%] font-semibold text-secondary-000 mb-4">
                                    Check your email
                                </h1>
                                <p className="text-base leading-6 text-accent-80 mb-2 max-w-[400px]">
                                    We&apos;ve sent a password reset link to
                                </p>
                                <p className="text-base leading-6 font-semibold text-secondary-000 mb-8">
                                    {email}
                                </p>
                                <p className="text-sm leading-6 text-accent-80 mb-8 max-w-[400px]">
                                    Didn&apos;t receive it? Check your spam folder or{' '}
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="font-semibold text-primary-100 underline bg-transparent border-none cursor-pointer transition-opacity duration-200 hover:opacity-70"
                                    >
                                        try again
                                    </button>
                                    .
                                </p>
                                <Link
                                    href="/sign-in"
                                    className="w-full max-w-[360px] h-14 flex items-center justify-center gap-2 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
                                >
                                    <span className="text-base leading-5 font-semibold text-white">Back to Sign In</span>
                                </Link>
                            </div>
                        )}
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
                        alt="Forgot Password"
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
};

export default ForgotPasswordPage;
