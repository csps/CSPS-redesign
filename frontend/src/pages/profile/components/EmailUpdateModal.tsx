import React, { useState } from "react";
import { X } from "lucide-react";
import { initiateEmailUpdate, confirmEmailUpdate } from "../../../api/auth";
import type {
  InitiateEmailUpdateRequest,
  ConfirmEmailUpdateRequest,
} from "../../../interfaces/auth/EmailUpdateRequest";

interface EmailUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEmail: string;
  onSuccess?: () => void;
}

type UpdateStep = "request" | "confirm";

const EmailUpdateModal: React.FC<EmailUpdateModalProps> = ({
  isOpen,
  onClose,
  currentEmail,
  onSuccess,
}) => {
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

  const handleRequestCode = async () => {
    setError(null);
    setSuccessMessage(null);

    // Validation
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
        `Verification code sent to ${currentEmail}. Please check your email.`,
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

    // Validation
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

      // Close modal after a brief delay
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#1A1625] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-600/20 to-pink-600/20 px-6 py-5 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            {step === "request" ? "Update Email" : "Verify Email"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Info Section */}
          <div className="mb-6 p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-gray-300">
              {step === "request" ? (
                <>
                  A verification code will be sent to your current email (
                  <span className="font-medium text-white">{currentEmail}</span>
                  )
                </>
              ) : (
                <>
                  Check your email at{" "}
                  <span className="font-medium text-white">{currentEmail}</span>{" "}
                  for the verification code
                </>
              )}
            </p>
          </div>

          {step === "request" && (
            <>
              {/* New Email Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter your new email"
                  disabled={isLoading}
                  className="w-full px-4 py-2 bg-[#2A2433] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all"
                />
              </div>
            </>
          )}

          {step === "confirm" && (
            <>
              {/* Verification Code Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-4 py-2 bg-[#2A2433] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50 transition-all tracking-widest text-center font-mono text-lg"
                />
              </div>

              {/* New Email Display */}
              <div className="mb-6 p-3 bg-gray-800/50 border border-white/5 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Updating to:</p>
                <p className="text-sm font-medium text-white">{newEmail}</p>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-600/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-3 bg-green-600/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-green-400">{successMessage}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-white/10 text-white rounded-lg hover:bg-white/5 disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={
                step === "request" ? handleRequestCode : handleConfirmEmail
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    aria-hidden="true"
                  />
                  Processing...
                </span>
              ) : step === "request" ? (
                "Request Code"
              ) : (
                "Confirm Email Update"
              )}
            </button>
          </div>

          {/* Back Link */}
          {step === "confirm" && (
            <button
              onClick={() => {
                setStep("request");
                setVerificationCode("");
                setError(null);
              }}
              disabled={isLoading}
              className="mt-4 w-full text-sm text-gray-400 hover:text-gray-300 disabled:opacity-50 transition-colors"
            >
              Back to email entry
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailUpdateModal;
