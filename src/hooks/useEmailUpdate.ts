import { useState } from "react";
import { initiateEmailUpdate, confirmEmailUpdate } from "../api/auth";
import type {
  InitiateEmailUpdateRequest,
  ConfirmEmailUpdateRequest,
} from "../interfaces/auth/EmailUpdateRequest";

export type EmailUpdateStep = "request" | "confirm";

interface UseEmailUpdateReturn {
  step: EmailUpdateStep;
  newEmail: string;
  verificationCode: string;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  setStep: (step: EmailUpdateStep) => void;
  setNewEmail: (email: string) => void;
  setVerificationCode: (code: string) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  initiateUpdate: () => Promise<void>;
  confirmUpdate: () => Promise<void>;
  resetState: () => void;
}

/**
 * Hook for managing email update form state and operations
 */
export const useEmailUpdate = (): UseEmailUpdateReturn => {
  const [step, setStep] = useState<EmailUpdateStep>("request");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const initiateUpdate = async () => {
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

    setIsLoading(true);
    try {
      const request: InitiateEmailUpdateRequest = {
        newEmail: newEmail.trim(),
      };

      await initiateEmailUpdate(request);
      setSuccessMessage("Verification code sent to your current email");
      setStep("confirm");
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "Failed to request verification code";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmUpdate = async () => {
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
      resetState();
    } catch (err: unknown) {
      const errorMessage =
        (err as any)?.response?.data?.message ||
        "Failed to confirm email update";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setStep("request");
    setNewEmail("");
    setVerificationCode("");
    setError(null);
    setSuccessMessage(null);
  };

  return {
    step,
    newEmail,
    verificationCode,
    isLoading,
    error,
    successMessage,
    setStep,
    setNewEmail,
    setVerificationCode,
    setError,
    setSuccessMessage,
    initiateUpdate,
    confirmUpdate,
    resetState,
  };
};
