"use client"
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import imgHeroImage from "../../../../public/assets/images/signUpHeroImg.png";
import Link from 'next/link';
import { useAuthAPI } from '@/services/useAuthAPI';

const countries = [
    { code: '+1', name: 'United States', flag: '🇺🇸' },
    { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
    { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
    { code: '+27', name: 'South Africa', flag: '🇿🇦' },
    { code: '+254', name: 'Kenya', flag: '🇰🇪' },
    { code: '+233', name: 'Ghana', flag: '🇬🇭' }
];

const SignUpPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromParams = searchParams.get('email') || '';
    const { signUpAsync, isSigningUp } = useAuthAPI();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: emailFromParams,
        password: '',
        phoneCode: '+234',
        phoneNumber: '',
        country: ''
    });

    const [focused, setFocused] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        phoneNumber: false
    });

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phoneNumber: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        if (errors[field as keyof typeof errors]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleFocus = (field: keyof typeof focused) => {
        setFocused({ ...focused, [field]: true });
    };

    const handleBlur = (field: keyof typeof focused) => {
        setFocused({ ...focused, [field]: false });
    };

    const validateForm = () => {
        const newErrors = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            phoneNumber: ''
        };

        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleContinue = async () => {
        if (!validateForm() || !agreedToTerms) return;
        try {
            await signUpAsync({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                country: formData.country,
                password: formData.password,
                phoneNumber: { code: formData.phoneCode, number: formData.phoneNumber },
                accountType: 'vendor',
            });
            // Backend sends a verification link to the email — redirect to "check your inbox" view
            router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        } catch {
            // error toast handled inside useAuthAPI
        }
    };

    const isDisabled = !formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.phoneNumber || !formData.country || !agreedToTerms || isSigningUp;

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Left Column - Form */}
                <div className="flex flex-col p-6 md:p-8 lg:p-12 overflow-y-auto bg-white max-h-screen">
                    <div className="max-w-132 w-full mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => router.push('/sign-in')}
                            aria-label="Go back"
                            className="inline-flex items-center gap-2 mb-8 bg-transparent border-none cursor-pointer p-2 rounded-lg transition-colors duration-200 ease-out hover:bg-secondary-600"
                        >
                            <ArrowLeft className="w-6 h-6 text-secondary-000" />
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="font-unbounded text-[clamp(20px,3vw,24px)] leading-tight font-semibold text-secondary-000 mb-2">
                                Create a vendor account
                            </h2>
                            <p className="text-base leading-6 text-accent-80">
                                Complete your details to get started on Afrivendors.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="flex flex-col gap-4 mb-12">
                            {/* First Name */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="firstName" className="text-base leading-6 font-normal text-secondary-000">
                                    First Name *
                                </label>
                                <input
                                    id="firstName"
                                    type="text"
                                    placeholder="e.g John"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    onFocus={() => handleFocus('firstName')}
                                    onBlur={() => handleBlur('firstName')}
                                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${formData.firstName ? 'bg-secondary-600' : 'bg-white'} ${errors.firstName ? 'border border-red-600' : focused.firstName ? 'border border-primary-100' : 'border border-secondary-200'}`}
                                />
                                {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
                            </div>

                            {/* Last Name */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="lastName" className="text-base leading-6 font-normal text-secondary-000">
                                    Last Name *
                                </label>
                                <input
                                    id="lastName"
                                    type="text"
                                    placeholder="e.g Doe"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    onFocus={() => handleFocus('lastName')}
                                    onBlur={() => handleBlur('lastName')}
                                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${formData.lastName ? 'bg-secondary-600' : 'bg-white'} ${errors.lastName ? 'border border-red-600' : focused.lastName ? 'border border-primary-100' : 'border border-secondary-200'}`}
                                />
                                {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-base leading-6 font-normal text-secondary-000">
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="e.g example@email.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    onFocus={() => handleFocus('email')}
                                    onBlur={() => handleBlur('email')}
                                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${formData.email ? 'bg-secondary-600' : 'bg-white'} ${errors.email ? 'border border-red-600' : focused.email ? 'border border-primary-100' : 'border border-secondary-200'}`}
                                />
                                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="text-base leading-6 font-normal text-secondary-000">
                                    Password *
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="**************"
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        onFocus={() => handleFocus('password')}
                                        onBlur={() => handleBlur('password')}
                                        className={`w-full h-14 pl-4 pr-12 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${formData.password ? 'bg-secondary-600' : 'bg-white'} ${errors.password ? 'border border-red-600' : focused.password ? 'border border-primary-100' : 'border border-secondary-200'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-secondary-000"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                            </div>

                            {/* Phone Number */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base leading-6 font-normal text-secondary-000">
                                    Phone number
                                </label>
                                <div className="flex gap-2.5">
                                    <Select
                                        value={formData.phoneCode}
                                        onValueChange={(value) => handleInputChange('phoneCode', value)}
                                    >
                                        <SelectTrigger className={`w-30 py-7 h-14 px-3 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out bg-white border ${focused.phoneNumber ? 'border-primary-100' : 'border-secondary-200'}`}>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {countries.map((country) => (
                                                <SelectItem key={country.code} value={country.code}>
                                                    {country.flag} {country.code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/\D/g, ''))}
                                        onFocus={() => handleFocus('phoneNumber')}
                                        onBlur={() => handleBlur('phoneNumber')}
                                        className={`flex-1 h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${formData.phoneNumber ? 'bg-secondary-600' : 'bg-white'} ${errors.phoneNumber ? 'border border-red-600' : focused.phoneNumber ? 'border border-primary-100' : 'border border-secondary-200'}`}
                                    />
                                </div>
                                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
                            </div>

                            {/* Country */}
                            <div className="flex flex-col gap-2">
                                <label className="text-base leading-6 font-normal text-secondary-000">
                                    Country
                                </label>
                                <Select
                                    value={formData.country}
                                    onValueChange={(value) => handleInputChange('country', value)}
                                >
                                    <SelectTrigger className={`w-full py-7 h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${formData.country ? 'bg-secondary-600' : 'bg-white'} border border-secondary-200`}>
                                        <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((country) => (
                                            <SelectItem key={country.name} value={country.name}>
                                                {country.flag} {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreedToTerms}
                                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                    className="mt-1"
                                />
                                <label htmlFor="terms" className="text-base leading-5 text-accent-100 flex-1 cursor-pointer">
                                    I agree to the{' '}
                                    <a href="/terms-of-use" className="text-secondary-000 font-bold underline transition-opacity duration-200 ease-out hover:opacity-70">
                                        Terms & Conditions
                                    </a>{' '}
                                    and{' '}
                                    <Link href="/privacy-policy" className="text-secondary-000 font-bold underline transition-opacity duration-200 ease-out hover:opacity-70">
                                        Policies
                                    </Link>{' '}
                                    of <strong>Afrivendor.</strong>
                                </label>
                            </div>

                            {/* Continue Button */}
                            <button
                                onClick={handleContinue}
                                disabled={isDisabled}
                                className={`w-full h-14 flex items-center justify-center gap-2 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'}`}
                            >
                                <span className="text-base leading-5 font-semibold text-white">
                                    {isSigningUp ? 'Creating account...' : 'Continue'}
                                </span>
                                {!isSigningUp && <ArrowRight className="w-4.5 h-4.5 text-white" />}
                            </button>

                            {/* Sign In Link */}
                            <div className="text-center pt-1">
                                <p className="text-base leading-6 text-accent-80">
                                    Already have an account?{' '}
                                    <Link href="/sign-in" className="font-semibold text-primary-100 underline transition-opacity duration-200 ease-out hover:opacity-70">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="max-w-132 w-full mt-4 mx-auto flex items-center justify-between flex-wrap gap-4">
                            <p className="text-base leading-6 text-accent-80">
                                © {new Date().getFullYear()} Afrivendors.co.uk ltd
                            </p>
                            <button
                                onClick={() => router.push('/help-support')}
                                className="text-base leading-5 font-semibold text-secondary-000 bg-transparent border-none cursor-pointer underline p-0 transition-opacity duration-200 ease-out hover:opacity-70"
                            >
                                Help & Support
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column - Hero Image */}
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
};

const SignUpPage = () => (
    <Suspense fallback={
        <div className="min-h-screen bg-accent-10 flex items-center justify-center">
            <p className="font-unageo text-base text-accent-80">Loading...</p>
        </div>
    }>
        <SignUpPageContent />
    </Suspense>
);

export default SignUpPage;
