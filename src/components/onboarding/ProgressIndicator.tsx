"use client";

import { Check } from 'lucide-react';

interface Step {
    number: number;
    title: string;
}

interface ProgressIndicatorProps {
    currentStep: number;
    totalSteps: number;
    steps: Step[];
}

export function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
    return (
        <div className="mb-8">
            {/* Progress Bar */}
            <div className="relative">
                {/* Background Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-accent-20" />
                
                {/* Active Line */}
                <div
                    className="absolute top-5 left-0 h-0.5 bg-primary-100 transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                    {steps.map((step) => {
                        const isCompleted = currentStep > step.number;
                        const isCurrent = currentStep === step.number;
                        const isPending = currentStep < step.number;

                        return (
                            <div key={step.number} className="flex flex-col items-center">
                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-primary-100'
                                            : isCurrent
                                            ? 'bg-primary-100 ring-4 ring-primary-100/20'
                                            : 'bg-white border-2 border-accent-20'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <Check className="w-5 h-5 text-white" />
                                    ) : (
                                        <span
                                            className={`font-unbounded text-sm font-semibold ${
                                                isCurrent ? 'text-white' : 'text-accent-60'
                                            }`}
                                        >
                                            {step.number}
                                        </span>
                                    )}
                                </div>

                                {/* Label */}
                                <span
                                    className={`mt-2 text-xs font-medium text-center transition-colors duration-300 ${
                                        isCompleted || isCurrent
                                            ? 'text-secondary-000'
                                            : 'text-accent-60'
                                    }`}
                                >
                                    {step.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
