import { useState, useCallback } from "react";
import { changePassword } from "../api/auth";

export const usePasswordChange = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }, [error]);

  const validate = () => {
    if (!form.currentPassword) return "Current password is required";
    if (!form.newPassword) return "New password is required";
    if (form.newPassword.length < 8) return "Password must be at least 8 characters";
    if (form.newPassword !== form.confirmPassword) return "Passwords do not match";
    if (form.currentPassword === form.newPassword) return "New password must be different";
    return "";
  };

  const initiateChange = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setShowConfirm(true);
  };

  const confirmChange = async () => {
    setIsLoading(true);
    setShowConfirm(false);
    try {
      await changePassword({
        oldPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setIsSuccess(true);
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const resetState = () => {
    setIsSuccess(false);
    setError("");
    setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  return {
    form,
    isLoading,
    error,
    isSuccess,
    showConfirm,
    handleChange,
    initiateChange,
    confirmChange,
    setIsSuccess, // to close success modal
    setShowConfirm, // to close confirm modal
    resetState,
  };
};
