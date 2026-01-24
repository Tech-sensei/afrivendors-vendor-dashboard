"use client";
import { useState, useRef, useEffect } from "react";
import { X, Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface OTPVerificationProps {
  open: boolean;
  onClose: () => void;
  onVerify: () => void;
  phoneNumber: string;
  phoneCode: string;
}

export function OTPVerification({ open, onClose, onVerify, phoneNumber, phoneCode }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (open && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, open]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setOtp(["", "", "", "", "", ""]);
      setCountdown(60);
      setCanResend(false);
      setIsSuccess(false);
      // Focus first input after a short delay
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    while (newOtp.length < 6) newOtp.push("");
    setOtp(newOtp);

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    // Auto-verify if all 6 digits are pasted
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, accept any 6-digit code
    // In production, validate against backend
    setIsVerifying(false);
    setIsSuccess(true);
    toast.success("Phone number verified successfully!");

    // Close modal and proceed after success animation
    setTimeout(() => {
      onVerify();
      onClose();
    }, 1500);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();

    // Simulate sending OTP
    await new Promise((resolve) => setTimeout(resolve, 500));
    toast.success("Verification code resent!");
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            // onClick={onClose}
            className="fixed inset-0 bg-secondary-000/40 backdrop-blur-sm z-9998 flex items-center justify-center"
          />

          {/* Modal Container - Centered */}
          <div className="fixed inset-0 flex items-center justify-center z-9999 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-110 pointer-events-auto"
            >
              <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(35,19,5,0.2)] p-8 relative">
                {/* Close Button */}
                <div
                  onClick={onClose}
                  className="absolute top-5 right-5 w-8 h-8 rounded-lg border-none bg-secondary-700 text-accent-80 cursor-pointer flex items-center justify-center transition-all duration-200 ease-out hover:bg-secondary-600 hover:text-secondary-000"
                >
                  <X className="h-4 w-4" />
                </div>

                {/* Icon & Title */}
                <div className="text-center mb-6">
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 ease-out ${
                      isSuccess ? "bg-green-100" : "bg-secondary-700"
                    }`}
                  >
                    {isSuccess ? <CheckCircle2 className="h-8 w-8 text-green-600" /> : <Smartphone className="h-8 w-8 text-primary-100" />}
                  </div>

                  <h2 className="font-unbounded text-2xl font-semibold text-secondary-000 mb-2">
                    {isSuccess ? "Verified!" : "Verify Your Phone"}
                  </h2>

                  <p className="text-sm text-accent-80 leading-6">
                    {isSuccess
                      ? "Your phone number has been verified successfully"
                      : `We've sent a 6-digit code to ${phoneCode} ${phoneNumber}`}
                  </p>
                </div>

                {/* OTP Input */}
                {!isSuccess && (
                  <>
                    <div className="flex gap-2 justify-center mb-6">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => {
                            inputRefs.current[index] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          disabled={isVerifying}
                          className={`w-12 h-14 rounded-xl border-2 text-center font-unbounded text-2xl font-semibold text-secondary-000 outline-none transition-all duration-200 ease-out ${
                            digit ? "border-primary-100" : "border-accent-20"
                          } ${
                            isVerifying ? "bg-secondary-700 cursor-not-allowed" : "bg-white cursor-text"
                          } focus:border-primary-100 focus:shadow-[0_0_0_4px_rgba(197,108,49,0.1)]`}
                        />
                      ))}
                    </div>

                    {/* Verify Button */}
                    <button
                      onClick={() => handleVerify()}
                      disabled={otp.some((digit) => digit === "") || isVerifying}
                      className={`w-full h-12 rounded-xl border-none font-semibold text-base cursor-pointer transition-all duration-200 ease-out mb-4 ${
                        otp.every((digit) => digit !== "") && !isVerifying
                          ? "bg-primary-100 text-white hover:bg-primary-100/90"
                          : "bg-secondary-700 text-accent-80 cursor-not-allowed"
                      }`}
                    >
                      {isVerifying ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Verifying...
                        </span>
                      ) : (
                        "Verify Code"
                      )}
                    </button>

                    {/* Resend Code */}
                    <div className="text-center">
                      <p className="text-sm text-accent-80 mb-2">Didn't receive the code?</p>
                      <button
                        onClick={handleResend}
                        disabled={!canResend}
                        className={`bg-none border-none font-semibold text-sm transition-all duration-200 ease-out ${
                          canResend ? "text-primary-100 cursor-pointer hover:underline" : "text-accent-80 cursor-not-allowed"
                        }`}
                      >
                        {canResend ? "Resend Code" : `Resend in ${countdown}s`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
