"use client";

import { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Service {
    name: string;
    price: string;
    duration: string;
}

interface ServicesStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export function ServicesStep({ formData, updateFormData }: ServicesStepProps) {
    const [newService, setNewService] = useState<Service>({
        name: '',
        price: '',
        duration: ''
    });

    const [focused, setFocused] = useState({
        description: false,
        name: false,
        price: false,
        duration: false,
    });

    const handleChange = (field: string, value: string) => {
        updateFormData({ [field]: value });
    };

    const handleServiceChange = (field: keyof Service, value: string) => {
        setNewService({ ...newService, [field]: value });
    };

    const addService = () => {
        if (newService.name && newService.price && newService.duration) {
            updateFormData({
                services: [...formData.services, newService]
            });
            setNewService({ name: '', price: '', duration: '' });
        }
    };

    const removeService = (index: number) => {
        updateFormData({
            services: formData.services.filter((_: any, i: number) => i !== index)
        });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Business Description */}
            <div className="flex flex-col gap-2">
                <label htmlFor="description" className="text-base leading-6 font-normal text-secondary-000">
                    Business Description
                </label>
                <textarea
                    id="description"
                    placeholder="Tell customers about your business, what makes you unique, your experience, etc."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    onFocus={() => setFocused({ ...focused, description: true })}
                    onBlur={() => setFocused({ ...focused, description: false })}
                    rows={4}
                    className={`w-full px-4 py-3 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out resize-none ${
                        formData.description ? 'bg-secondary-600' : 'bg-white'
                    } ${
                        focused.description
                            ? 'border border-primary-100'
                            : 'border border-secondary-200'
                    }`}
                />
            </div>

            {/* Add Services Section */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-base leading-6 font-semibold text-secondary-000">
                            Services Offered <span className="text-red-600">*</span>
                        </h3>
                        <p className="text-sm text-accent-60 mt-1">
                            Add at least one service you offer
                        </p>
                    </div>
                </div>

                {/* Add Service Form */}
                <div className="p-4 bg-secondary-800 rounded-lg border border-accent-20">
                    <div className="flex flex-col gap-3">
                        {/* Service Name */}
                        <input
                            type="text"
                            placeholder="Service name (e.g. Hair Braiding)"
                            value={newService.name}
                            onChange={(e) => handleServiceChange('name', e.target.value)}
                            onFocus={() => setFocused({ ...focused, name: true })}
                            onBlur={() => setFocused({ ...focused, name: false })}
                            className={`w-full h-12 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out bg-white ${
                                focused.name
                                    ? 'border border-primary-100'
                                    : 'border border-secondary-200'
                            }`}
                        />

                        {/* Price & Duration */}
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Price (e.g. $50)"
                                value={newService.price}
                                onChange={(e) => handleServiceChange('price', e.target.value)}
                                onFocus={() => setFocused({ ...focused, price: true })}
                                onBlur={() => setFocused({ ...focused, price: false })}
                                className={`w-full h-12 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out bg-white ${
                                    focused.price
                                        ? 'border border-primary-100'
                                        : 'border border-secondary-200'
                                }`}
                            />
                            <input
                                type="text"
                                placeholder="Duration (e.g. 2 hours)"
                                value={newService.duration}
                                onChange={(e) => handleServiceChange('duration', e.target.value)}
                                onFocus={() => setFocused({ ...focused, duration: true })}
                                onBlur={() => setFocused({ ...focused, duration: false })}
                                className={`w-full h-12 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out bg-white ${
                                    focused.duration
                                        ? 'border border-primary-100'
                                        : 'border border-secondary-200'
                                }`}
                            />
                        </div>

                        {/* Add Button */}
                        <button
                            type="button"
                            onClick={addService}
                            disabled={!newService.name || !newService.price || !newService.duration}
                            className="w-full h-12 flex items-center justify-center gap-2 bg-primary-100 text-white rounded-lg font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5" />
                            Add Service
                        </button>
                    </div>
                </div>

                {/* Services List */}
                {formData.services.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <h4 className="text-sm font-semibold text-secondary-000">
                            Added Services ({formData.services.length})
                        </h4>
                        {formData.services.map((service: Service, index: number) => (
                            <div
                                key={index}
                                className="p-4 bg-white border border-accent-20 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <h5 className="font-semibold text-secondary-000 mb-1">
                                        {service.name}
                                    </h5>
                                    <div className="flex items-center gap-4 text-sm text-accent-60">
                                        <span className="font-medium text-primary-100">
                                            {service.price}
                                        </span>
                                        <span>•</span>
                                        <span>{service.duration}</span>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeService(index)}
                                    className="p-2 hover:bg-secondary-600 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-accent-60 hover:text-red-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {formData.services.length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-accent-20 rounded-lg">
                        <p className="text-sm text-accent-60">
                            No services added yet. Add your first service above.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
