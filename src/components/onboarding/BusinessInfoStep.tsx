"use client";

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BusinessInfoStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

const businessTypes = [
    'Sole Proprietorship',
    'Partnership',
    'Limited Liability Company (LLC)',
    'Corporation',
    'Cooperative',
    'Other'
];

const businessCategories = [
    'Beauty & Wellness',
    'Health & Fitness',
    'Home Services',
    'Professional Services',
    'Events & Entertainment',
    'Education & Training',
    'Food & Beverage',
    'Automotive',
    'Pet Services',
    'Other'
];

export function BusinessInfoStep({ formData, updateFormData }: BusinessInfoStepProps) {
    const [focused, setFocused] = useState({
        businessName: false,
        taxId: false,
        registrationNumber: false,
    });

    const handleChange = (field: string, value: string) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Business Name */}
            <div className="flex flex-col gap-2">
                <label htmlFor="businessName" className="text-base leading-6 font-normal text-secondary-000">
                    Business Name <span className="text-red-600">*</span>
                </label>
                <input
                    id="businessName"
                    type="text"
                    placeholder="e.g. ZuriGlow Beauty Hub"
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    onFocus={() => setFocused({ ...focused, businessName: true })}
                    onBlur={() => setFocused({ ...focused, businessName: false })}
                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                        formData.businessName ? 'bg-secondary-600' : 'bg-white'
                    } ${
                        focused.businessName
                            ? 'border border-primary-100'
                            : 'border border-secondary-200'
                    }`}
                />
            </div>

            {/* Business Type */}
            <div className="flex flex-col gap-2">
                <label className="text-base leading-6 font-normal text-secondary-000">
                    Business Type <span className="text-red-600">*</span>
                </label>
                <Select
                    value={formData.businessType}
                    onValueChange={(value) => handleChange('businessType', value)}
                >
                    <SelectTrigger
                        className={`w-full py-7 h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                            formData.businessType ? 'bg-secondary-600' : 'bg-white'
                        } border border-secondary-200`}
                    >
                        <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                        {businessTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Business Category */}
            <div className="flex flex-col gap-2">
                <label className="text-base leading-6 font-normal text-secondary-000">
                    Business Category <span className="text-red-600">*</span>
                </label>
                <Select
                    value={formData.businessCategory}
                    onValueChange={(value) => handleChange('businessCategory', value)}
                >
                    <SelectTrigger
                        className={`w-full py-7 h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                            formData.businessCategory ? 'bg-secondary-600' : 'bg-white'
                        } border border-secondary-200`}
                    >
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        {businessCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Tax ID (Optional) */}
            <div className="flex flex-col gap-2">
                <label htmlFor="taxId" className="text-base leading-6 font-normal text-secondary-000">
                    Tax ID (Optional)
                </label>
                <input
                    id="taxId"
                    type="text"
                    placeholder="Enter tax identification number"
                    value={formData.taxId}
                    onChange={(e) => handleChange('taxId', e.target.value)}
                    onFocus={() => setFocused({ ...focused, taxId: true })}
                    onBlur={() => setFocused({ ...focused, taxId: false })}
                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                        formData.taxId ? 'bg-secondary-600' : 'bg-white'
                    } ${
                        focused.taxId
                            ? 'border border-primary-100'
                            : 'border border-secondary-200'
                    }`}
                />
            </div>

            {/* Registration Number (Optional) */}
            <div className="flex flex-col gap-2">
                <label htmlFor="registrationNumber" className="text-base leading-6 font-normal text-secondary-000">
                    Business Registration Number (Optional)
                </label>
                <input
                    id="registrationNumber"
                    type="text"
                    placeholder="Enter registration number"
                    value={formData.registrationNumber}
                    onChange={(e) => handleChange('registrationNumber', e.target.value)}
                    onFocus={() => setFocused({ ...focused, registrationNumber: true })}
                    onBlur={() => setFocused({ ...focused, registrationNumber: false })}
                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                        formData.registrationNumber ? 'bg-secondary-600' : 'bg-white'
                    } ${
                        focused.registrationNumber
                            ? 'border border-primary-100'
                            : 'border border-secondary-200'
                    }`}
                />
            </div>
        </div>
    );
}
