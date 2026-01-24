"use client";

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface LocationStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

const countries = [
    { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'South Africa', flag: '🇿🇦' },
    { name: 'Kenya', flag: '🇰🇪' },
    { name: 'Ghana', flag: '🇬🇭' },
    { name: 'Uganda', flag: '🇺🇬' },
    { name: 'Tanzania', flag: '🇹🇿' }
];

export function LocationStep({ formData, updateFormData }: LocationStepProps) {
    const [focused, setFocused] = useState({
        businessAddress: false,
        city: false,
        state: false,
        postalCode: false,
        phoneNumber: false,
        email: false,
    });

    const [newServiceArea, setNewServiceArea] = useState('');

    const handleChange = (field: string, value: string) => {
        updateFormData({ [field]: value });
    };

    const addServiceArea = () => {
        if (newServiceArea.trim() && !formData.serviceAreas.includes(newServiceArea.trim())) {
            updateFormData({
                serviceAreas: [...formData.serviceAreas, newServiceArea.trim()]
            });
            setNewServiceArea('');
        }
    };

    const removeServiceArea = (area: string) => {
        updateFormData({
            serviceAreas: formData.serviceAreas.filter((a: string) => a !== area)
        });
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Business Address */}
            <div className="flex flex-col gap-2">
                <label htmlFor="businessAddress" className="text-base leading-6 font-normal text-secondary-000">
                    Business Address <span className="text-red-600">*</span>
                </label>
                <input
                    id="businessAddress"
                    type="text"
                    placeholder="Street address"
                    value={formData.businessAddress}
                    onChange={(e) => handleChange('businessAddress', e.target.value)}
                    onFocus={() => setFocused({ ...focused, businessAddress: true })}
                    onBlur={() => setFocused({ ...focused, businessAddress: false })}
                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                        formData.businessAddress ? 'bg-secondary-600' : 'bg-white'
                    } ${
                        focused.businessAddress
                            ? 'border border-primary-100'
                            : 'border border-secondary-200'
                    }`}
                />
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="city" className="text-base leading-6 font-normal text-secondary-000">
                        City <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="city"
                        type="text"
                        placeholder="City"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        onFocus={() => setFocused({ ...focused, city: true })}
                        onBlur={() => setFocused({ ...focused, city: false })}
                        className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                            formData.city ? 'bg-secondary-600' : 'bg-white'
                        } ${
                            focused.city
                                ? 'border border-primary-100'
                                : 'border border-secondary-200'
                        }`}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="state" className="text-base leading-6 font-normal text-secondary-000">
                        State/Province
                    </label>
                    <input
                        id="state"
                        type="text"
                        placeholder="State"
                        value={formData.state}
                        onChange={(e) => handleChange('state', e.target.value)}
                        onFocus={() => setFocused({ ...focused, state: true })}
                        onBlur={() => setFocused({ ...focused, state: false })}
                        className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                            formData.state ? 'bg-secondary-600' : 'bg-white'
                        } ${
                            focused.state
                                ? 'border border-primary-100'
                                : 'border border-secondary-200'
                        }`}
                    />
                </div>
            </div>

            {/* Country & Postal Code */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-base leading-6 font-normal text-secondary-000">
                        Country <span className="text-red-600">*</span>
                    </label>
                    <Select
                        value={formData.country}
                        onValueChange={(value) => handleChange('country', value)}
                    >
                        <SelectTrigger
                            className={`w-full py-7 h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                                formData.country ? 'bg-secondary-600' : 'bg-white'
                            } border border-secondary-200`}
                        >
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

                <div className="flex flex-col gap-2">
                    <label htmlFor="postalCode" className="text-base leading-6 font-normal text-secondary-000">
                        Postal Code
                    </label>
                    <input
                        id="postalCode"
                        type="text"
                        placeholder="Postal code"
                        value={formData.postalCode}
                        onChange={(e) => handleChange('postalCode', e.target.value)}
                        onFocus={() => setFocused({ ...focused, postalCode: true })}
                        onBlur={() => setFocused({ ...focused, postalCode: false })}
                        className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                            formData.postalCode ? 'bg-secondary-600' : 'bg-white'
                        } ${
                            focused.postalCode
                                ? 'border border-primary-100'
                                : 'border border-secondary-200'
                        }`}
                    />
                </div>
            </div>

            {/* Service Areas */}
            <div className="flex flex-col gap-2">
                <label className="text-base leading-6 font-normal text-secondary-000">
                    Service Areas (Optional)
                </label>
                <p className="text-sm text-accent-60">
                    Add areas where you provide services
                </p>
                
                {/* Add Service Area */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="e.g. Victoria Island, Lekki"
                        value={newServiceArea}
                        onChange={(e) => setNewServiceArea(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addServiceArea())}
                        className="flex-1 h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out bg-white border border-secondary-200 focus:border-primary-100"
                    />
                    <button
                        type="button"
                        onClick={addServiceArea}
                        className="h-14 px-6 bg-primary-100 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                        Add
                    </button>
                </div>

                {/* Service Areas List */}
                {formData.serviceAreas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.serviceAreas.map((area: string) => (
                            <div
                                key={area}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-secondary-600 rounded-lg"
                            >
                                <span className="text-sm text-secondary-000">{area}</span>
                                <button
                                    type="button"
                                    onClick={() => removeServiceArea(area)}
                                    className="text-secondary-000 hover:text-primary-100 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Information */}
            <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className="text-base leading-6 font-normal text-secondary-000">
                    Business Phone Number <span className="text-red-600">*</span>
                </label>
                <input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    onFocus={() => setFocused({ ...focused, phoneNumber: true })}
                    onBlur={() => setFocused({ ...focused, phoneNumber: false })}
                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                        formData.phoneNumber ? 'bg-secondary-600' : 'bg-white'
                    } ${
                        focused.phoneNumber
                            ? 'border border-primary-100'
                            : 'border border-secondary-200'
                    }`}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-base leading-6 font-normal text-secondary-000">
                    Business Email <span className="text-red-600">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="business@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onFocus={() => setFocused({ ...focused, email: true })}
                    onBlur={() => setFocused({ ...focused, email: false })}
                    className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                        formData.email ? 'bg-secondary-600' : 'bg-white'
                    } ${
                        focused.email
                            ? 'border border-primary-100'
                            : 'border border-secondary-200'
                    }`}
                />
            </div>
        </div>
    );
}
