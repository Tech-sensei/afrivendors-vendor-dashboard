"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    icon?: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    confirmButtonVariant?: 'default' | 'destructive';
}

export function ConfirmModal({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    icon: Icon,
    iconColor = 'text-primary-100',
    iconBg = 'bg-primary-100/10',
    confirmButtonVariant = 'default',
}: ConfirmModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white rounded-3xl border border-accent-20 max-w-[calc(100%-2rem)] sm:max-w-[440px] p-4 sm:p-8">
                <DialogHeader>
                    {Icon && (
                        <div className={`mx-auto mb-4 flex items-center justify-center size-14 rounded-full ${iconBg}`}>
                            <Icon className={`size-7 ${iconColor}`} strokeWidth={2} />
                        </div>
                    )}
                    <DialogTitle className="text-center text-2xl font-semibold text-secondary-000 leading-[1.3] mb-2">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base text-accent-80 leading-6">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex-col gap-3 sm:flex-col mt-6">
                    <Button
                        onClick={handleConfirm}
                        variant={confirmButtonVariant}
                        className={`w-full h-12 rounded-full text-base font-semibold border-none cursor-pointer ${confirmButtonVariant === 'destructive'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-primary-100 text-white hover:bg-primary-100/90'
                            }`}
                    >
                        {confirmText}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full h-12 bg-transparent text-secondary-000 rounded-full border-2 border-accent-20 text-base font-semibold cursor-pointer hover:bg-accent-10"
                    >
                        {cancelText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

