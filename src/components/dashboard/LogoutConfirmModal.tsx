import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface LogoutConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ open, onOpenChange, onConfirm }: LogoutConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-3xl border border-accent-20 max-w-[calc(100%-3rem)] sm:max-w-110 p-6 sm:p-8 [&>button]:top-6 [&>button]:right-6 [&>button]:size-6 [&>button]:opacity-100">
        <DialogHeader>
          <div className="mx-auto mb-4 flex items-center justify-center size-14 rounded-full bg-primary-100/10">
            <LogOut className="size-7 text-primary-100" strokeWidth={2} />
          </div>
          <DialogTitle className="text-center text-2xl font-semibold text-secondary-000 leading-[1.3] mb-2">
            Log Out?
          </DialogTitle>
          <DialogDescription className="text-center text-base text-accent-80 leading-6">
            Are you sure you want to log out of your account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-3 sm:flex-col mt-6">
          <Button
            onClick={onConfirm}
            className="w-full h-12 bg-primary-100 text-white rounded-full text-base font-semibold border-none cursor-pointer hover:bg-primary-100/90"
          >
            Yes, Log Out
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full h-12 bg-transparent text-secondary-000 rounded-full border-2 border-accent-20 text-base font-semibold cursor-pointer hover:bg-accent-10"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
