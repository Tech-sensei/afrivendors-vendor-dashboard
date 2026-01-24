"use client";

import { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface VerificationStepProps {
    formData: any;
    updateFormData: (data: any) => void;
}

export function VerificationStep({ formData, updateFormData }: VerificationStepProps) {
    const [focused, setFocused] = useState({
        bankAccountName: false,
        bankAccountNumber: false,
        bankName: false,
        bankCode: false,
    });

    const businessLicenseRef = useRef<HTMLInputElement>(null);
    const insuranceRef = useRef<HTMLInputElement>(null);
    const idDocumentRef = useRef<HTMLInputElement>(null);

    const handleChange = (field: string, value: string) => {
        updateFormData({ [field]: value });
    };

    const handleFileChange = (field: string, file: File | null) => {
        updateFormData({ [field]: file });
    };

    const handleFileClick = (ref: React.RefObject<HTMLInputElement>) => {
        ref.current?.click();
    };

    const removeFile = (field: string) => {
        updateFormData({ [field]: null });
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Documents Section */}
            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-base leading-6 font-semibold text-secondary-000">
                        Business Documents (Optional)
                    </h3>
                    <p className="text-sm text-accent-60 mt-1">
                        Upload documents to verify your business
                    </p>
                </div>

                {/* Business License */}
                <div className="flex flex-col gap-2">
                    <label className="text-base leading-6 font-normal text-secondary-000">
                        Business License
                    </label>
                    <input
                        ref={businessLicenseRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange('businessLicense', e.target.files?.[0] || null)}
                        className="hidden"
                    />
                    {!formData.businessLicense ? (
                        <button
                            type="button"
                            onClick={() => handleFileClick(businessLicenseRef)}
                            className="h-32 border-2 border-dashed border-accent-20 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary-100 hover:bg-secondary-600 transition-all"
                        >
                            <Upload className="w-8 h-8 text-accent-60" />
                            <span className="text-sm text-accent-60">
                                Click to upload business license
                            </span>
                        </button>
                    ) : (
                        <div className="h-20 border border-accent-20 rounded-lg flex items-center justify-between px-4 bg-secondary-600">
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-primary-100" />
                                <div>
                                    <p className="text-sm font-medium text-secondary-000">
                                        {formData.businessLicense.name}
                                    </p>
                                    <p className="text-xs text-accent-60">
                                        {(formData.businessLicense.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile('businessLicense')}
                                className="p-2 hover:bg-accent-20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-accent-60 hover:text-red-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Insurance Certificate */}
                <div className="flex flex-col gap-2">
                    <label className="text-base leading-6 font-normal text-secondary-000">
                        Insurance Certificate
                    </label>
                    <input
                        ref={insuranceRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange('insurance', e.target.files?.[0] || null)}
                        className="hidden"
                    />
                    {!formData.insurance ? (
                        <button
                            type="button"
                            onClick={() => handleFileClick(insuranceRef)}
                            className="h-32 border-2 border-dashed border-accent-20 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary-100 hover:bg-secondary-600 transition-all"
                        >
                            <Upload className="w-8 h-8 text-accent-60" />
                            <span className="text-sm text-accent-60">
                                Click to upload insurance certificate
                            </span>
                        </button>
                    ) : (
                        <div className="h-20 border border-accent-20 rounded-lg flex items-center justify-between px-4 bg-secondary-600">
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-primary-100" />
                                <div>
                                    <p className="text-sm font-medium text-secondary-000">
                                        {formData.insurance.name}
                                    </p>
                                    <p className="text-xs text-accent-60">
                                        {(formData.insurance.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile('insurance')}
                                className="p-2 hover:bg-accent-20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-accent-60 hover:text-red-600" />
                            </button>
                        </div>
                    )}
                </div>

                {/* ID Document */}
                <div className="flex flex-col gap-2">
                    <label className="text-base leading-6 font-normal text-secondary-000">
                        ID Document
                    </label>
                    <input
                        ref={idDocumentRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange('idDocument', e.target.files?.[0] || null)}
                        className="hidden"
                    />
                    {!formData.idDocument ? (
                        <button
                            type="button"
                            onClick={() => handleFileClick(idDocumentRef)}
                            className="h-32 border-2 border-dashed border-accent-20 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary-100 hover:bg-secondary-600 transition-all"
                        >
                            <Upload className="w-8 h-8 text-accent-60" />
                            <span className="text-sm text-accent-60">
                                Click to upload ID document
                            </span>
                        </button>
                    ) : (
                        <div className="h-20 border border-accent-20 rounded-lg flex items-center justify-between px-4 bg-secondary-600">
                            <div className="flex items-center gap-3">
                                <FileText className="w-8 h-8 text-primary-100" />
                                <div>
                                    <p className="text-sm font-medium text-secondary-000">
                                        {formData.idDocument.name}
                                    </p>
                                    <p className="text-xs text-accent-60">
                                        {(formData.idDocument.size / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile('idDocument')}
                                className="p-2 hover:bg-accent-20 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-accent-60 hover:text-red-600" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bank Details Section */}
            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-base leading-6 font-semibold text-secondary-000">
                        Bank Account Details <span className="text-red-600">*</span>
                    </h3>
                    <p className="text-sm text-accent-60 mt-1">
                        For receiving payments from customers
                    </p>
                </div>

                {/* Account Name */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="bankAccountName" className="text-base leading-6 font-normal text-secondary-000">
                        Account Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="bankAccountName"
                        type="text"
                        placeholder="Account holder name"
                        value={formData.bankAccountName}
                        onChange={(e) => handleChange('bankAccountName', e.target.value)}
                        onFocus={() => setFocused({ ...focused, bankAccountName: true })}
                        onBlur={() => setFocused({ ...focused, bankAccountName: false })}
                        className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                            formData.bankAccountName ? 'bg-secondary-600' : 'bg-white'
                        } ${
                            focused.bankAccountName
                                ? 'border border-primary-100'
                                : 'border border-secondary-200'
                        }`}
                    />
                </div>

                {/* Account Number */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="bankAccountNumber" className="text-base leading-6 font-normal text-secondary-000">
                        Account Number <span className="text-red-600">*</span>
                    </label>
                    <input
                        id="bankAccountNumber"
                        type="text"
                        placeholder="0123456789"
                        value={formData.bankAccountNumber}
                        onChange={(e) => handleChange('bankAccountNumber', e.target.value.replace(/\D/g, ''))}
                        onFocus={() => setFocused({ ...focused, bankAccountNumber: true })}
                        onBlur={() => setFocused({ ...focused, bankAccountNumber: false })}
                        className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                            formData.bankAccountNumber ? 'bg-secondary-600' : 'bg-white'
                        } ${
                            focused.bankAccountNumber
                                ? 'border border-primary-100'
                                : 'border border-secondary-200'
                        }`}
                    />
                </div>

                {/* Bank Name & Code */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="bankName" className="text-base leading-6 font-normal text-secondary-000">
                            Bank Name <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="bankName"
                            type="text"
                            placeholder="e.g. Access Bank"
                            value={formData.bankName}
                            onChange={(e) => handleChange('bankName', e.target.value)}
                            onFocus={() => setFocused({ ...focused, bankName: true })}
                            onBlur={() => setFocused({ ...focused, bankName: false })}
                            className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                                formData.bankName ? 'bg-secondary-600' : 'bg-white'
                            } ${
                                focused.bankName
                                    ? 'border border-primary-100'
                                    : 'border border-secondary-200'
                            }`}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="bankCode" className="text-base leading-6 font-normal text-secondary-000">
                            Bank Code
                        </label>
                        <input
                            id="bankCode"
                            type="text"
                            placeholder="e.g. 044"
                            value={formData.bankCode}
                            onChange={(e) => handleChange('bankCode', e.target.value)}
                            onFocus={() => setFocused({ ...focused, bankCode: true })}
                            onBlur={() => setFocused({ ...focused, bankCode: false })}
                            className={`w-full h-14 px-4 text-base leading-6 text-secondary-000 rounded-lg outline-none transition-all duration-200 ease-out ${
                                formData.bankCode ? 'bg-secondary-600' : 'bg-white'
                            } ${
                                focused.bankCode
                                    ? 'border border-primary-100'
                                    : 'border border-secondary-200'
                            }`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
