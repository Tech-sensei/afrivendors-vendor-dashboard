"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import GoogleIcon from "../../../../public/assets/icons/google.svg";
import FacebookIcon from "../../../../public/assets/icons/facebook.svg";
import imgHeroImage from "../../../../public/assets/images/signInHeroImg.png";
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';


const SignInPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [buttonHovered, setButtonHovered] = useState(false);
    const [buttonPressed, setButtonPressed] = useState(false);

    const handleContinue = () => {
        if (email && agreedToTerms) {
            toast.success('Welcome to the vendor dashboard');
            // router.push('/dashboard');
            router.push(`/sign-up?type=vendor&email=${encodeURIComponent(email)}`);
        } else {
            // If not registered, go to registration page
            router.push(`/sign-up?type=vendor&email=${encodeURIComponent(email)}`);
        }
    };

    const isDisabled = !email || !agreedToTerms;

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen max-h-screen overflow-hidden">
                {/* Left Column - Form (50%) */}
                <div className="flex flex-col justify-between p-6 md:p-8 overflow-y-auto">
                    <div className="max-w-140 w-full mx-auto">

                        {/* Header */}
                        <div className="my-12">
                            <h1 className="font-unbounded text-[clamp(28px,2.6vw,36px)] leading-[110%] font-semibold text-secondary-000 mb-3">
                                Vendor Portal
                            </h1>
                            <p className="text-base leading-6 text-accent-80">
                                Create an account or log in to book and manage your appointments.
                            </p>
                        </div>

                        {/* Form */}
                        <div className="flex flex-col gap-6">
                            {/* Social Login */}
                            <div className="flex flex-col gap-3">

                                <button
                                    onClick={() => { }}
                                    aria-label="Continue with Facebook"
                                    className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-accent-20 rounded-xl cursor-pointer transition-all duration-200 ease-out outline-offset-2 hover:opacity-90 active:bg-[#f8f5f] active:scale-[0.98] focus:outline-2 focus:outline-primary-100"
                                >
                                    <Image src={FacebookIcon} alt="Facebook" className="w-6 h-6" />
                                    <span className="text-base leading-5 font-semibold text-secondary-000">
                                        Continue with Facebook
                                    </span>
                                </button>
                                <button
                                    onClick={() => { }}
                                    aria-label="Continue with Google"
                                    className="w-full h-14 flex items-center justify-center gap-3 bg-white border border-accent-20 rounded-xl cursor-pointer transition-all duration-200 ease-out outline-offset-2 hover:opacity-90 active:bg-[#f8f5f] active:scale-[0.98] focus:outline-2 focus:outline-primary-100"
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
                                <span className="text-sm leading-5 text-accent-80">
                                    OR
                                </span>
                                <div className="flex-1 h-px bg-accent-20" />
                            </div>

                            {/* Email Field */}
                            <div className="flex flex-col gap-3">
                                <label
                                    htmlFor="email"
                                    className="text-base leading-5 font-semibold text-secondary-000"
                                >
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="e.g example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 bg-white border rounded-xl outline-none transition-colors duration-200 ease-out ${emailFocused ? 'border-primary-100' : 'border-accent-20'
                                        }`}
                                />
                            </div>

                            {/* Terms Checkbox */}
                            <div>
                                <div className="flex items-start gap-3">
                                    <Checkbox
                                        id="terms"
                                        checked={agreedToTerms}
                                        onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                                        className="mt-1"
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-base leading-6 text-accent-80 flex-1 cursor-pointer"
                                    >
                                        I agree to the{' '}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.push('/terms-of-use');
                                            }}
                                            className="text-secondary-000 font-semibold underline transition-opacity duration-200 ease-out hover:opacity-70"
                                        >
                                            Terms of Use
                                        </a>
                                        ,{' '}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.push('/terms-of-service');
                                            }}
                                            className="text-secondary-000 font-semibold underline transition-opacity duration-200 ease-out hover:opacity-70"
                                        >
                                            Terms of Service
                                        </a>
                                        , and{' '}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.push('/privacy-policy');
                                            }}
                                            className="text-secondary-000 font-semibold underline transition-opacity duration-200 ease-out hover:opacity-70"
                                        >
                                            Privacy Policy
                                        </a>{' '}
                                        of <strong>Afrivendor</strong>.
                                    </label>
                                </div>
                            </div>

                            {/* Continue Button */}
                            <button
                                onClick={handleContinue}
                                onMouseEnter={() => setButtonHovered(true)}
                                onMouseLeave={() => setButtonHovered(false)}
                                onMouseDown={() => setButtonPressed(true)}
                                onMouseUp={() => setButtonPressed(false)}
                                disabled={isDisabled}
                                className={`w-full h-14 flex items-center justify-center gap-2 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out ${isDisabled ? 'bg-accent-80 opacity-50 cursor-not-allowed' : ''
                                    } ${!isDisabled && buttonHovered && !buttonPressed ? 'opacity-90' : ''
                                    } ${!isDisabled && buttonPressed ? 'scale-[0.98]' : 'scale-100'
                                    }`}
                            >
                                <span className="text-base leading-5 font-semibold text-white">
                                    Continue
                                </span>
                                <ArrowRight className="w-4.5 h-4.5 text-white" />
                            </button>

                            {/* Vendor Link */}
                            <div className="text-center pt-2">
                                <p className="text-base leading-6 text-accent-80">
                                    Are you a customer?{' '}
                                    <button
                                        onClick={() => window.open('https://afrivendors-client.vercel.app/sign-in', '_blank')}
                                        className="font-semibold text-primary-100 underline bg-none border-none cursor-pointer p-0 min-w-11 min-h-11 transition-opacity duration-200 ease-out hover:opacity-70"
                                    >
                                        Sign in as a customer
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="max-w-140 w-full mt-12 mx-auto flex items-center justify-between flex-wrap gap-4">
                        <p className="text-sm leading-5 text-accent-80">
                            © 2025 Afrivendors.co.uk ltd
                        </p>
                        <button
                            onClick={() => router.push('/support')}
                            className="text-base leading-5 font-semibold text-secondary-000 bg-none border-none cursor-pointer underline min-w-11 min-h-11 p-3 transition-opacity duration-200 ease-out hover:opacity-70"
                        >
                            Help & Support
                        </button>
                    </div>
                </div>

                {/* Right Column - Hero Image (50%, Desktop only) */}
                <div className="hidden lg:block relative bg-secondary-000 overflow-hidden h-screen rounded-bl-[200px]">
                    {/* Uncomment and update path when image is provided */}
                    <Image
                        src={imgHeroImage}
                        alt="vendor Portal"
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

export default SignInPage;
