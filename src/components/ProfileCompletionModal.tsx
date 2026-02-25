import React, { useState, useCallback } from "react";
import { FiCheck } from "react-icons/fi";
import { completeStudentProfile } from "../api/student";
import { toast } from "sonner";
import { useAuthStore } from "../store/auth_store";
import DatePicker from "./DatePicker";
import { profile } from "../api/auth";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  studentId: string;
  onCompleted: (user: any) => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  studentId,
  onCompleted,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [formData, setFormData] = useState({
    middleName: "",
    birthDate: "",
    email: "",
  });

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    // middleName validation (optional but max 50 chars)
    if (formData.middleName && formData.middleName.length > 50) {
      newErrors.middleName = "Middle name must not exceed 50 characters";
    }

    // birthDate validation
    if (!formData.birthDate.trim()) {
      newErrors.birthDate = "Birth date is required";
    } else {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      if (birthDate >= today) {
        newErrors.birthDate = "Birth date must be in the past";
      }
    }

    // email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }) as any);
    }
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }) as any);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // The API interface has been updated to make first/last name optional
      const response = await completeStudentProfile(studentId, formData as any);
    

      if (response.data) {
        // Update auth store with new user data
        const { setUser } = useAuthStore.getState();

        setUser({
          ...response.data,
          role: "STUDENT",
        });

        await profile();
        // Show success state
        setIsSuccess(true);

        // Auto-close after a delay
        setTimeout(() => {
          onCompleted(response.data);
        }, 2000);
      } else {
        // Handle server validation errors
        if (response.validationErrors) {
          setValidationErrors(response.validationErrors);
          toast.error("Please fix the validation errors");
        } else {
          toast.error(response.message || "Failed to complete profile");
        }
      }
    } catch (err: any) {
      const serverErrors = err?.response?.data?.validationErrors || {};
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to complete profile";

      if (Object.keys(serverErrors).length > 0) {
        setValidationErrors(serverErrors);
      }

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="w-full max-w-sm bg-[#1a1a3e] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-8 animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500 delay-150">
            <FiCheck className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Profile Completed!
          </h2>
          <p className="text-white/60 text-center text-sm">
            You are now ready to explore.
            <br />
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  const isSubmitDisabled =
    !formData.birthDate.trim() || !formData.email.trim() || isLoading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-[#1a1a3e] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 p-6 sm:p-8 animate-in zoom-in-95 duration-300">
        {/* Minimalist Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Complete Profile
          </h2>
          <p className="text-white/60 text-sm font-medium leading-relaxed">
            Please provide your details to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Middle Name */}
          <div className="space-y-2">
            <label
              htmlFor="middleName"
              className="block text-xs font-bold uppercase tracking-widest text-white/50 px-1"
            >
              Middle Name{" "}
              <span className="text-white/30 font-normal normal-case">
                (optional)
              </span>
            </label>
            <div className="relative">
              <input
                id="middleName"
                type="text"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Enter your middle name"
                disabled={isLoading}
                maxLength={50}
                className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none transition-all font-medium
                  ${
                    validationErrors.middleName
                      ? "border-red-500/50 focus:border-red-400 bg-red-500/5"
                      : "border-white/10 focus:border-purple-500/50 focus:bg-white/10"
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              />
            </div>
            {validationErrors.middleName && (
              <p className="text-red-400 text-xs font-medium mt-1 px-1">
                {validationErrors.middleName}
              </p>
            )}
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <DatePicker
              label="Birth Date *"
              value={formData.birthDate}
              maxDate={new Date().toISOString().split("T")[0]}
              placeholder="Select your birth date"
              onChange={(date) => {
                setFormData((prev) => ({ ...prev, birthDate: date }));
                if (errors.birthDate) {
                  setErrors(
                    (prev) => ({ ...prev, birthDate: undefined }) as any,
                  );
                }
                if (validationErrors.birthDate) {
                  setValidationErrors(
                    (prev) =>
                      ({
                        ...prev,
                        birthDate: undefined,
                      }) as any,
                  );
                }
              }}
            />
            {(errors.birthDate || validationErrors.birthDate) && (
              <p className="text-red-400 text-xs font-medium mt-1 px-1">
                {errors.birthDate || validationErrors.birthDate}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-bold uppercase tracking-widest text-white/50 px-1"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                disabled={isLoading}
                className={`w-full bg-white/5 border rounded-xl py-3 px-4 text-white placeholder-white/30 focus:outline-none transition-all font-medium
                  ${
                    errors.email || validationErrors.email
                      ? "border-red-500/50 focus:border-red-400 bg-red-500/5"
                      : "border-white/10 focus:border-purple-500/50 focus:bg-white/10"
                  }
                  ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                `}
              />
            </div>
            {(errors.email || validationErrors.email) && (
              <p className="text-red-400 text-xs font-medium mt-1 px-1">
                {errors.email || validationErrors.email}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-900/30 hover:shadow-purple-900/50 hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Complete Profile"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
