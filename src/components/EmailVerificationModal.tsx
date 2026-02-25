import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  sendVerificationCode,
  verifyEmailCode,
  resendVerificationCode,
} from "../api/emailVerification";

interface EmailVerificationModalProps {
  isOpen: boolean;
  email: string;
  onClose: () => void;
  onVerified: () => void;
  profile?: () => Promise<void>;
}

/**
 * Email Verification Modal — 6-digit OTP input.
 *
 * Minimalist design matching ProfileCompletionModal.
 */
const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  email,
  // onClose,
  onVerified,
  profile,
}) => {
  const CODE_LENGTH = 6;
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
    null,
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-send verification code when modal opens
  useEffect(() => {
    if (isOpen && !codeSent) {
      handleSendCode();
    }
    if (!isOpen) {
      // Reset state when modal closes
      setCode(Array(CODE_LENGTH).fill(""));
      setError(null);
      setCodeSent(false);
      setRemainingAttempts(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Focus first input when code is sent
  useEffect(() => {
    if (codeSent) {
      inputRefs.current[0]?.focus();
    }
  }, [codeSent]);

  const handleSendCode = async () => {
    try {
      setIsSending(true);
      setError(null);
      await sendVerificationCode();
      setCodeSent(true);
      setResendCooldown(60);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to send verification code.";
      setError(msg);
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      setIsSending(true);
      setError(null);
      setCode(Array(CODE_LENGTH).fill(""));
      await resendVerificationCode();
      setResendCooldown(60);
      setRemainingAttempts(null);
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to resend verification code.";
      setError(msg);
    } finally {
      setIsSending(false);
    }
  };

  const submitCode = useCallback(
    async (codeStr: string) => {
      try {
        setIsLoading(true);
        setError(null);
        await verifyEmailCode(codeStr);
        if (profile) {
          await profile();
        }
        onVerified();
      } catch (err: any) {
        const data = err?.response?.data;
        const msg = data?.message || "Verification failed. Please try again.";
        const remaining = data?.data?.remainingAttempts ?? null;
        setError(msg);
        setRemainingAttempts(remaining);
        // Reset code inputs on failure
        setCode(Array(CODE_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setIsLoading(false);
      }
    },
    [onVerified, profile],
  );

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);

    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (value && index === CODE_LENGTH - 1) {
      const fullCode = newCode.join("");
      if (fullCode.length === CODE_LENGTH) {
        submitCode(fullCode);
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter") {
      const fullCode = code.join("");
      if (fullCode.length === CODE_LENGTH) {
        submitCode(fullCode);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;

    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    setCode(newCode);

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if full code pasted
    if (pasted.length === CODE_LENGTH) {
      submitCode(pasted);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[#1a1a3e] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-8 max-w-md w-full animate-in zoom-in-95 duration-300 relative">
        {/* Minimalist Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Check your email
          </h2>
          <p className="text-white/60 text-sm font-medium leading-relaxed">
            Enter the verification code sent to
            <br />
            <span className="text-white font-semibold">{email}</span>
          </p>
        </div>

        {/* Code inputs */}
        {codeSent ? (
          <>
            <div
              className="flex justify-center gap-3 mb-8"
              onPaste={handlePaste}
            >
              {code.map((digit, index) => (
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
                  disabled={isLoading}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200 focus:outline-none bg-white/5 text-white caret-purple-400
                    ${
                      error
                        ? "border-red-500/50 focus:border-red-400 bg-red-500/5"
                        : digit
                          ? "border-purple-500/50 focus:border-purple-400 shadow-sm shadow-purple-500/10"
                          : "border-white/10 focus:border-purple-500/50 focus:bg-white/10"
                    }
                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                />
              ))}
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 text-center">
                <p className="text-red-400 text-sm font-medium">{error}</p>
                {remainingAttempts !== null && (
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">
                    {remainingAttempts} attempt
                    {remainingAttempts !== 1 ? "s" : ""} remaining
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => {
                  const fullCode = code.join("");
                  if (fullCode.length === CODE_LENGTH) submitCode(fullCode);
                }}
                disabled={isLoading || code.join("").length !== CODE_LENGTH}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </span>
                ) : (
                  "Verify Email"
                )}
              </button>

              <div className="text-center">
                <p className="text-white/30 text-xs font-medium">
                  Didn't receive the code?{" "}
                  {resendCooldown > 0 ? (
                    <span className="text-white/20">
                      Resend in {resendCooldown}s
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      disabled={isSending}
                      className="text-purple-400 hover:text-purple-300 font-semibold transition-colors disabled:opacity-50"
                    >
                      {isSending ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </p>
              </div>
            </div>
          </>
        ) : (
          // Sending state
          <div className="flex flex-col items-center py-8">
            {isSending ? (
              <>
                <div className="w-12 h-12 border-4 border-white/10 border-t-purple-500 rounded-full animate-spin mb-4" />
                <p className="text-white/40 text-sm font-medium">
                  Sending verification code...
                </p>
              </>
            ) : error ? (
              <>
                <p className="text-red-400 text-sm font-medium mb-4 text-center">
                  {error}
                </p>
                <button
                  onClick={handleSendCode}
                  className="text-purple-400 font-semibold text-sm hover:text-purple-300 transition-colors"
                >
                  Try again
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationModal;
