import React, { useState } from "react";
import { MdOutlineClose, MdEmail, MdCheckCircle } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import {
  initiateEmailUpdate,
  confirmEmailUpdate,
  updateEmail,
} from "../../../api/auth";
import type {
  InitiateEmailUpdateRequest,
  ConfirmEmailUpdateRequest,
} from "../../../interfaces/auth/EmailUpdateRequest";

interface EmailUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  isVerified: boolean;
  onSuccess?: () => void;
}

type UpdateStep = "request" | "confirm";

const EmailUpdateModal: React.FC<EmailUpdateModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
  isVerified,
  onSuccess,
}) => {
  const updateMethod = isVerified ? "verify" : "direct";
  const [step, setStep] = useState<UpdateStep>("request");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setStep("request");
    setNewEmail("");
    setVerificationCode("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleDirectUpdate = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!newEmail.trim()) {
      setError("Please enter your new email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError("New email must be different from your current email");
      return;
    }

    setIsLoading(true);
    try {
      await updateEmail(newEmail.trim());
      setSuccessMessage("Email updated successfully!");

      setTimeout(() => {
        resetForm();
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "Failed to update email. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestCode = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!newEmail.trim()) {
      setError("Please enter your new email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      setError("New email must be different from your current email");
      return;
    }

    setIsLoading(true);
    try {
      const request: InitiateEmailUpdateRequest = {
        newEmail: newEmail.trim(),
      };

      await initiateEmailUpdate(request);
      setSuccessMessage(
        `Verification code sent to ${currentEmail}. Please check your inbox.`,
      );
      setStep("confirm");
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "Failed to request verification code. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmEmail = async () => {
    setError(null);
    setSuccessMessage(null);

    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    if (!newEmail.trim()) {
      setError("Email address is missing");
      return;
    }

    setIsLoading(true);
    try {
      const request: ConfirmEmailUpdateRequest = {
        newEmail: newEmail.trim(),
        verificationCode: verificationCode.trim(),
      };

      await confirmEmailUpdate(request);
      setSuccessMessage("Email updated successfully!");

      setTimeout(() => {
        resetForm();
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "Failed to confirm email update. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-[#111827] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-gray-800/30">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {updateMethod === "verify"
                    ? step === "request"
                      ? "Update Email"
                      : "Verify Update"
                    : "Update Email"}
                </h2>
                <p className="text-xs text-white/40 mt-1 font-medium tracking-wide">
                  {updateMethod === "verify"
                    ? step === "request"
                      ? "Change your primary account email"
                      : "Enter the code sent to your inbox"
                    : "Update your email address directly"}
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <MdOutlineClose size={20} />
              </button>
            </div>

            {/* body */}
            <div className="px-8 py-8 space-y-6 bg-gray-900/50">
              {/* current email context */}
              <div className="p-5 bg-white/5 border border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/20 mb-1.5">
                  Current Address
                </p>
                <p className="text-sm font-semibold text-white/90">
                  {currentEmail}
                </p>
              </div>

              {step === "request" && updateMethod === "direct" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/30 block ml-1">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="you@university.edu"
                    disabled={isLoading}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                  />
                </div>
              )}

              {step === "request" && updateMethod === "verify" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/30 block ml-1">
                    New Email Address
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="you@university.edu"
                    disabled={isLoading}
                    className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all font-medium"
                  />
                </div>
              )}

              {step === "confirm" && updateMethod === "verify" && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 block ml-1">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) =>
                        setVerificationCode(
                          e.target.value.replace(/\s/g, "").toUpperCase(),
                        )
                      }
                      placeholder="Enter 6-digit code"
                      disabled={isLoading}
                      maxLength={6}
                      className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-lg text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all text-center font-mono tracking-[0.5em]"
                    />
                  </div>

                  <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400/60 mb-1">
                      Target Address
                    </p>
                    <p className="text-sm font-semibold text-purple-200/90">
                      {newEmail}
                    </p>
                  </div>
                </>
              )}

              {/* error */}
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-red-400 text-xs font-bold uppercase tracking-wide">
                    Error
                  </p>
                  <p className="text-red-400/80 text-sm mt-0.5 font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* success */}
              {successMessage && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl animate-in fade-in zoom-in-95 duration-200">
                  <p className="text-green-400 text-xs font-bold uppercase tracking-wide">
                    Success
                  </p>
                  <p className="text-green-400/80 text-sm mt-0.5 font-medium">
                    {successMessage}
                  </p>
                </div>
              )}
            </div>

            {/* footer */}
            <div className="flex items-center gap-4 px-8 py-6 border-t border-white/5 bg-gray-800/30">
              {step === "confirm" && (
                <button
                  onClick={() => {
                    setStep("request");
                    setVerificationCode("");
                    setError(null);
                  }}
                  disabled={isLoading}
                  className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors px-2"
                >
                  Back
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={
                  updateMethod === "direct"
                    ? handleDirectUpdate
                    : step === "request"
                      ? handleRequestCode
                      : handleConfirmEmail
                }
                disabled={isLoading}
                className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-black bg-[#FDE006] hover:brightness-110 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/10 active:scale-95 flex items-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing
                  </>
                ) : updateMethod === "direct" ? (
                  <>
                    <MdCheckCircle size={18} />
                    Update Email
                  </>
                ) : step === "request" ? (
                  <>
                    <MdEmail size={18} />
                    Send Code
                  </>
                ) : (
                  <>
                    <MdCheckCircle size={18} />
                    Confirm Update
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EmailUpdateModal;
