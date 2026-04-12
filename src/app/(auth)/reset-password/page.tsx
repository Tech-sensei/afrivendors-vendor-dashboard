"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import imgHeroImage from "../../../../public/assets/images/signInHeroImg.png";
import Link from 'next/link';
import { resetPasswordSchema } from '@/lib/validations/authValidationSchema';
import { useAuthAPI } from '@/services/useAuthAPI';

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') || '';
    const { resetPasswordAsync, isResettingPassword } = useAuthAPI();

    const [formData, setFormData] = useState({ newPassword: '', confirmNewPassword: '' });
    const [focused, setFocused] = useState({ newPassword: false, confirmNewPassword: false });
    const [errors, setErrors] = useState({ newPassword: '', confirmNewPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field as keyof typeof errors]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const validateForm = () => {
        const result = resetPasswordSchema.safeParse(formData);
        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                newPassword: fieldErrors.newPassword?.[0] ?? '',
                confirmNewPassword: fieldErrors.confirmNewPassword?.[0] ?? '',
            });
            return false;
        }
        setErrors({ newPassword: '', confirmNewPassword: '' });
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
            await resetPasswordAsync({ token, newPassword: formData.newPassword, confirmNewPassword: formData.confirmNewPassword });
            setIsSuccess(true);
        } catch {
            // error toast handled inside useAuthAPI
        }
    };

    const isDisabled = !formData.newPassword || !formData.confirmNewPassword || isResettingPassword;

    const getPasswordStrength = () => {
        const pwd = formData.newPassword;
        if (!pwd) return null;
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[A-Z]/.test(pwd)) strength++;
        if (/[0-9]/.test(pwd)) strength++;
        if (/[^A-Za-z0-9]/.test(pwd)) strength++;

        if (strength <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
        if (strength === 2) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-2/4' };
        if (strength === 3) return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
        return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
    };

    const passwordStrength = getPasswordStrength();

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
                                        Reset password
                                    </h1>
                                    <p className="text-base leading-6 text-accent-80">
                                        Create a new password for your vendor account. Make sure it&apos;s at least 8 characters.
                                    </p>
                                </div>

                                {/* Form */}
                                <div className="flex flex-col gap-5">
                                    {/* New Password */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="newPassword" className="text-base leading-6 font-normal text-secondary-000">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="newPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Min. 8 characters"
                                                value={formData.newPassword}
                                                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                                                onFocus={() => setFocused({ ...focused, newPassword: true })}
                                                onBlur={() => setFocused({ ...focused, newPassword: false })}
                                                className={`w-full h-14 pl-4 pr-12 text-base leading-6 text-secondary-000 rounded-xl outline-none transition-colors duration-200 ease-out ${formData.newPassword ? 'bg-secondary-600' : 'bg-white'
                                                    } ${errors.newPassword
                                                        ? 'border border-red-600'
                                                        : focused.newPassword
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
                                        {/* Password Strength */}
                                        {formData.newPassword && passwordStrength && (
                                            <div className="flex flex-col gap-1">
                                                <div className="h-1 w-full bg-accent-10 rounded-full overflow-hidden">
                                                    <div className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`} />
                                                </div>
                                                <p className="text-xs text-accent-80">
                                                    Password strength: <span className="font-semibold">{passwordStrength.label}</span>
                                                </p>
                                            </div>
                                        )}
                                        {errors.newPassword && <p className="text-sm text-red-600">{errors.newPassword}</p>}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="confirmNewPassword" className="text-base leading-6 font-normal text-secondary-000">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="confirmNewPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Re-enter your password"
                                                value={formData.confirmNewPassword}
                                                onChange={(e) => handleInputChange('confirmNewPassword', e.target.value)}
                                                onFocus={() => setFocused({ ...focused, confirmNewPassword: true })}
                                                onBlur={() => setFocused({ ...focused, confirmNewPassword: false })}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                                className={`w-full h-14 pl-4 pr-12 text-base leading-6 text-secondary-000 rounded-xl outline-none transition-colors duration-200 ease-out ${formData.confirmNewPassword ? 'bg-secondary-600' : 'bg-white'
                                                    } ${errors.confirmNewPassword
                                                        ? 'border border-red-600'
                                                        : focused.confirmNewPassword
                                                            ? 'border border-primary-100'
                                                            : 'border border-accent-20'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-accent-80 hover:text-secondary-000 transition-colors duration-200"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {errors.confirmNewPassword && <p className="text-sm text-red-600">{errors.confirmNewPassword}</p>}
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
                                        {isResettingPassword ? (
                                            <span className="text-base leading-5 font-semibold text-white">Resetting...</span>
                                        ) : (
                                            <>
                                                <span className="text-base leading-5 font-semibold text-white">Reset Password</span>
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
                                <div className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <h1 className="font-unbounded text-[clamp(24px,2.6vw,32px)] leading-[110%] font-semibold text-secondary-000 mb-4">
                                    Password reset!
                                </h1>
                                <p className="text-base leading-6 text-accent-80 mb-10 max-w-[400px]">
                                    Your password has been successfully reset. You can now sign in with your new password.
                                </p>
                                <Link
                                    href="/sign-in"
                                    className="w-full max-w-[360px] h-14 flex items-center justify-center gap-2 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out hover:opacity-90 active:scale-[0.98]"
                                >
                                    <span className="text-base leading-5 font-semibold text-white">Sign In</span>
                                    <ArrowRight className="w-[18px] h-[18px] text-white" />
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
                        alt="Reset Password"
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

const ResetPasswordPage = () => (
    <Suspense fallback={
        <div className="min-h-screen bg-accent-10 flex items-center justify-center">
            <p className="font-unageo text-base text-accent-80">Loading...</p>
        </div>
    }>
        <ResetPasswordContent />
    </Suspense>
);

export default ResetPasswordPage;
