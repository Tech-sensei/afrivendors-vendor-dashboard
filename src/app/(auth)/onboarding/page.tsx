"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import imgHeroImage from "../../../../public/assets/images/signUpHeroImg.png";

// Import step components
import { BusinessInfoStep } from '@/components/onboarding/BusinessInfoStep';
import { LocationStep } from '@/components/onboarding/LocationStep';
import { ServicesStep } from '@/components/onboarding/ServicesStep';
import { VerificationStep } from '@/components/onboarding/VerificationStep';
import { ProgressIndicator } from '@/components/onboarding/ProgressIndicator';

const TOTAL_STEPS = 4;

export default function VendorOnboarding() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        // Step 1: Business Information
        businessName: '',
        businessType: '',
        businessCategory: '',
        taxId: '',
        registrationNumber: '',
        
        // Step 2: Contact & Location
        businessAddress: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        serviceAreas: [] as string[],
        phoneNumber: '',
        email: '',
        
        // Step 3: Services & Pricing
        services: [] as Array<{ name: string; price: string; duration: string }>,
        description: '',
        
        // Step 4: Verification & Documents
        businessLicense: null as File | null,
        insurance: null as File | null,
        idDocument: null as File | null,
        bankAccountName: '',
        bankAccountNumber: '',
        bankName: '',
        bankCode: '',
    });

    const updateFormData = (data: Partial<typeof formData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.businessName || !formData.businessType || !formData.businessCategory) {
                    toast.error('Please fill in all required business information');
                    return false;
                }
                return true;
            case 2:
                if (!formData.businessAddress || !formData.city || !formData.country || !formData.phoneNumber || !formData.email) {
                    toast.error('Please fill in all required location information');
                    return false;
                }
                return true;
            case 3:
                if (formData.services.length === 0) {
                    toast.error('Please add at least one service');
                    return false;
                }
                return true;
            case 4:
                if (!formData.bankAccountName || !formData.bankAccountNumber || !formData.bankName) {
                    toast.error('Please fill in all required bank information');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        try {
            // TODO: Submit to API
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            
            toast.success('Onboarding completed successfully!');
            router.push('/'); // Redirect to dashboard
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const steps = [
        { number: 1, title: 'Business Info', component: BusinessInfoStep },
        { number: 2, title: 'Location', component: LocationStep },
        { number: 3, title: 'Services', component: ServicesStep },
        { number: 4, title: 'Verification', component: VerificationStep },
    ];

    const CurrentStepComponent = steps[currentStep - 1].component;

    return (
        <div className="min-h-screen bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                {/* Left Column - Form */}
                <div className="flex flex-col p-6 md:p-8 lg:p-12 overflow-y-auto bg-white max-h-screen">
                    <div className="max-w-132 w-full mx-auto">
                        {/* Back Button */}
                        <button
                            onClick={() => currentStep === 1 ? router.push('/sign-in') : handleBack()}
                            aria-label="Go back"
                            className="inline-flex items-center gap-2 mb-8 bg-none border-none cursor-pointer p-2 rounded-lg transition-colors duration-200 ease-out hover:bg-secondary-600 bg-transparent"
                        >
                            <ArrowLeft className="w-6 h-6 text-secondary-000" />
                        </button>

                        {/* Progress Indicator */}
                        <ProgressIndicator
                            currentStep={currentStep}
                            totalSteps={TOTAL_STEPS}
                            steps={steps}
                        />

                        {/* Header */}
                        <div className="mb-8 mt-8">
                            <h2 className="font-unbounded text-[clamp(20px,3vw,24px)] leading-tight font-semibold text-secondary-000 mb-2">
                                {steps[currentStep - 1].title}
                            </h2>
                            <p className="text-base leading-6 text-accent-80">
                                {currentStep === 1 && "Let's start with your business information"}
                                {currentStep === 2 && "Where is your business located and what areas do you serve?"}
                                {currentStep === 3 && "What services do you offer?"}
                                {currentStep === 4 && "Final step - verify your business and add payment details"}
                            </p>
                        </div>

                        {/* Step Content */}
                        <div className="mb-8">
                            <CurrentStepComponent
                                formData={formData}
                                updateFormData={updateFormData}
                            />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-4 mb-8">
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="flex-1 h-14 flex items-center justify-center gap-2 bg-white border-2 border-accent-20 rounded-xl cursor-pointer transition-all duration-200 ease-out hover:bg-secondary-600"
                                >
                                    <ArrowLeft className="w-4.5 h-4.5 text-secondary-000" />
                                    <span className="text-base leading-5 font-semibold text-secondary-000">
                                        Back
                                    </span>
                                </button>
                            )}

                            {currentStep < TOTAL_STEPS ? (
                                <button
                                    onClick={handleNext}
                                    className="flex-1 h-14 flex items-center justify-center gap-2 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out hover:opacity-90"
                                >
                                    <span className="text-base leading-5 font-semibold text-white">
                                        Continue
                                    </span>
                                    <ArrowRight className="w-4.5 h-4.5 text-white" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className={`flex-1 h-14 flex items-center justify-center gap-2 bg-primary-100 border-none rounded-xl cursor-pointer transition-all duration-200 ease-out ${
                                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                                    }`}
                                >
                                    <span className="text-base leading-5 font-semibold text-white">
                                        {isSubmitting ? 'Submitting...' : 'Complete Setup'}
                                    </span>
                                    <Check className="w-4.5 h-4.5 text-white" />
                                </button>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="max-w-132 w-full mt-8 mx-auto flex items-center justify-between flex-wrap gap-4">
                            <p className="text-base leading-6 text-accent-80">
                                © 2025 Afrivendors.co.uk ltd
                            </p>
                            <button
                                onClick={() => router.push('/support')}
                                className="text-base leading-5 font-semibold text-secondary-000 bg-none border-none cursor-pointer underline p-0 transition-opacity duration-200 ease-out hover:opacity-70"
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
                        alt="Vendor Onboarding"
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
