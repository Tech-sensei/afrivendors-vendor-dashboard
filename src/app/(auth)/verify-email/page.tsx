"use client";
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Mail, CheckCircle2, Loader2, XCircle } from 'lucide-react';
import Image from 'next/image';
import imgHeroImage from "../../../../public/assets/images/signUpHeroImg.png";
import Link from 'next/link';
import { useAuthAPI } from '@/services/useAuthAPI';

// ─── State: "Check your email" (no token in URL yet) ─────────────────────────

const CheckEmailView = ({ email }: { email: string }) => {
    const { resendOTPAsync, isResendingOTP } = useAuthAPI();
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    const handleResend = async () => {
        if (!canResend || !email) return;
        try {
            await resendOTPAsync({ email });
            setCanResend(false);
            setCountdown(60);
        } catch {
            // error toast handled inside useAuthAPI
        }
    };

    return (
        <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 rounded-2xl bg-secondary-700 flex items-center justify-center mb-6">
                <Mail className="w-10 h-10 text-primary-100" />
            </div>
            <h1 className="font-unbounded text-[clamp(24px,2.6vw,32px)] leading-[110%] font-semibold text-secondary-000 mb-4">
                Check your inbox
            </h1>
            <p className="text-base leading-6 text-accent-80 mb-2 max-w-[400px]">
                We&apos;ve sent a verification link to
            </p>
            {email && (
                <p className="text-base leading-6 font-semibold text-secondary-000 mb-6">
                    {email}
                </p>
            )}
            <p className="text-sm leading-6 text-accent-80 mb-8 max-w-[420px]">
                Click the link in the email to activate your vendor account. If you don&apos;t see it, check your spam folder.
            </p>

            {/* Resend */}
            <div className="flex flex-col items-center gap-2">
                <p className="text-base text-accent-80">Didn&apos;t receive it?</p>
                <button
                    onClick={handleResend}
                    disabled={!canResend || isResendingOTP}
                    className={`font-semibold text-base transition-all duration-200 ease-out bg-transparent border-none ${canResend && !isResendingOTP
                        ? 'text-primary-100 cursor-pointer hover:underline'
                        : 'text-accent-80 cursor-not-allowed'
                        }`}
                >
                    {isResendingOTP
                        ? 'Sending...'
                        : canResend
                            ? 'Resend verification email'
                            : `Resend in ${countdown}s`}
                </button>
            </div>

            <Link
                href="/sign-in"
                className="mt-10 w-full max-w-[360px] h-14 flex items-center justify-center bg-primary-100 rounded-xl text-white font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
                Back to Sign In
            </Link>
        </div>
    );
};

// ─── State: Auto-verify with token from URL ───────────────────────────────────

const TokenVerifyView = ({ token }: { token: string }) => {
    const router = useRouter();
    const { verifyEmailAsync } = useAuthAPI();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const verify = async () => {
            try {
                await verifyEmailAsync({ token });
                setStatus('success');
                // Vendors go to onboarding after verification, not sign-in
                setTimeout(() => router.push('/onboarding'), 2000);
            } catch {
                setStatus('error');
            }
        };
        verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center text-center py-12">
                <Loader2 className="w-12 h-12 text-primary-100 animate-spin mb-6" />
                <h1 className="font-unbounded text-[clamp(24px,2.6vw,32px)] leading-[110%] font-semibold text-secondary-000 mb-3">
                    Verifying your email...
                </h1>
                <p className="text-base leading-6 text-accent-80">Please wait a moment.</p>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="flex flex-col items-center text-center py-12">
                <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="font-unbounded text-[clamp(24px,2.6vw,32px)] leading-[110%] font-semibold text-secondary-000 mb-4">
                    Email verified!
                </h1>
                <p className="text-base leading-6 text-accent-80 max-w-[400px]">
                    Your vendor account is now active. Taking you to onboarding...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="font-unbounded text-[clamp(24px,2.6vw,32px)] leading-[110%] font-semibold text-secondary-000 mb-4">
                Verification failed
            </h1>
            <p className="text-base leading-6 text-accent-80 mb-10 max-w-[400px]">
                This link may have expired or already been used. Please request a new one.
            </p>
            <Link
                href="/sign-in"
                className="w-full max-w-[360px] h-14 flex items-center justify-center bg-primary-100 rounded-xl text-white font-semibold text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200"
            >
                Back to Sign In
            </Link>
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

const VerifyEmailContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen max-h-screen overflow-hidden">
                {/* Left Column */}
                <div className="flex flex-col justify-between p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-[560px] w-full mx-auto">
                        {/* Back button — only on check-email state */}
                        {!token && (
                            <button
                                onClick={() => router.push('/sign-up')}
                                aria-label="Go back"
                                className="inline-flex items-center gap-2 mb-8 bg-transparent border-none cursor-pointer p-2 min-w-11 min-h-11 rounded-xl transition-colors duration-200 ease-out hover:bg-secondary-700"
                            >
                                <ArrowLeft className="w-5 h-5 text-secondary-000" />
                            </button>
                        )}

                        {token ? (
                            <TokenVerifyView token={token} />
                        ) : (
                            <CheckEmailView email={email} />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="max-w-[560px] w-full mt-12 mx-auto flex items-center justify-between flex-wrap gap-4">
                        <p className="text-sm leading-5 text-accent-80">© {new Date().getFullYear()} Afrivendors.co.uk ltd</p>
                        <button
                            onClick={() => router.push('/help-support')}
                            className="text-base leading-5 font-semibold text-secondary-000 bg-transparent border-none cursor-pointer underline transition-opacity duration-200 ease-out hover:opacity-70"
                        >
                            Help & Support
                        </button>
                    </div>
                </div>

                {/* Right Column - Hero Image */}
                <div className="hidden lg:block relative bg-secondary-000 overflow-hidden h-screen rounded-bl-[200px]">
                    <Image
                        src={imgHeroImage}
                        alt="Verify Email"
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

const VerifyEmailPage = () => (
    <Suspense fallback={
        <div className="min-h-screen bg-accent-10 flex items-center justify-center">
            <p className="font-unageo text-base text-accent-80">Loading...</p>
        </div>
    }>
        <VerifyEmailContent />
    </Suspense>
);

export default VerifyEmailPage;
