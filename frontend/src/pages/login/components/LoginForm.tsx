import React, { useState } from "react";
import { FaHashtag, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../api/auth";
import { toast } from "sonner";
import type { AuthRequest } from "../../../interfaces/auth/AuthRequest";
import { useAuthStore } from "../../../store/auth_store";

const LoginForm = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    studentId?: string;
    password?: string;
  }>({});

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: { studentId?: string; password?: string } = {};

    if (!studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    } else if (studentId.length < 3) {
      newErrors.studentId = "Student ID must be at least 3 characters";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 3) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const authRequest: AuthRequest = {
        studentId: studentId.trim(),
        password,
      };

      await login(authRequest);

      const { isAuthenticated, user } = useAuthStore.getState();

      if (!isAuthenticated || !user) {
        throw new Error("Auth state not ready");
      }

      let destination = "";

      if (user.role === "ADMIN") destination = "/admin/dashboard";
      else destination = "/dashboard";

      toast.success("Login successful! Welcome back!");
      navigate(destination);
    } catch (error: any) {
      // Handle different error scenarios with specific messages
      if (
        error?.response?.status === 401 ||
        error?.response?.data?.status === "UNAUTHORIZED"
      ) {
        const errorMessage =
          error?.response?.data?.message?.toLowerCase() || "";

        if (
          errorMessage.includes("invalid") ||
          errorMessage.includes("wrong")
        ) {
          toast.error(
            "Invalid student ID or password. Please check your credentials and try again.",
          );
        } else if (
          errorMessage.includes("not found") ||
          errorMessage.includes("exist")
        ) {
          toast.error(
            "Student ID not found. Please check your ID number or contact support.",
          );
        } else if (
          errorMessage.includes("disabled") ||
          errorMessage.includes("inactive")
        ) {
          toast.error(
            "Your account has been deactivated. Please contact an administrator.",
          );
        } else if (errorMessage.includes("credentials")) {
          toast.error(
            "Invalid credentials. Please check your student ID and password.",
          );
        } else {
          toast.error(
            "Login failed. Please check your credentials and try again.",
          );
        }
      } else if (error?.response?.status === 400) {
        toast.error("Please enter both student ID and password.");
      } else if (error?.response?.status === 429) {
        toast.error(
          "Too many login attempts. Please wait a few minutes before trying again.",
        );
      } else if (error?.response?.status >= 500) {
        toast.error(
          "Server error. Please try again later or contact support if the problem persists.",
        );
      } else if (error?.code === "NETWORK_ERROR" || !error?.response) {
        toast.error(
          "Network error. Please check your internet connection and try again.",
        );
      } else {
        toast.error(
          "Login failed. Please try again or contact support if the problem continues.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      action=""
      method="post"
      className="space-y-5 w-full py-6 sm:py-10 z-10"
      onSubmit={handleSubmit}
    >
      <div className="w-full relative">
        <label htmlFor="idNumber" className="absolute top-5 left-3">
          <FaHashtag className="text-lg sm:text-xl text-purple-300/80" />
        </label>
        <input
          type="text"
          id="idNumber"
          className={`w-full bg-purple-700/40 rounded-2xl py-3 sm:py-4 px-10 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-700/50 transition-all shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] z-10 border font-bold text-base sm:text-lg lg:text-xl ${
            errors.studentId ? "border-red-500 bg-red-700/40" : "border-black"
          }`}
          placeholder="ID Number"
          value={studentId}
          onChange={(e) => {
            setStudentId(e.target.value);
            if (errors.studentId) {
              setErrors((prev) => ({ ...prev, studentId: undefined }));
            }
          }}
        />
        {errors.studentId && (
          <p className="text-red-400 text-sm mt-1 ml-3">{errors.studentId}</p>
        )}
      </div>
      <div className="w-full relative">
        <label htmlFor="password" className="absolute top-5 left-3">
          <FaLock className="text-lg sm:text-xl text-purple-300/80" />
        </label>
        <input
          type="password"
          id="password"
          className={`w-full bg-purple-700/40 rounded-2xl py-3 sm:py-4 px-10 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-700/50 transition-all shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] z-10 border font-bold text-base sm:text-lg lg:text-xl ${
            errors.password ? "border-red-500 bg-red-700/40" : "border-black"
          }`}
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
        />
        {errors.password && (
          <p className="text-red-400 text-sm mt-1 ml-3">{errors.password}</p>
        )}
      </div>
      <div className="flex justify-between items-center px-2 sm:px-5 m5-6 sm:mt-10 mb-6 sm:mb-10">
        <Link
          to="/forgot-password"
          className="text-xs sm:text-lg lg:text-xl font-semibold hover:underline transition-all"
        >
          Forgot Password?
        </Link>
        <div className="flex items-center gap-2">
          <input
            id="CheckBox"
            type="checkbox"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="w-5 h-5 accent-purple-500"
          />
        </div>
      </div>
      <div className="w-full px-2 sm:px-10">
        <button
          disabled={isLoading}
          className="bg-purple-700/40 font-semibold text-lg sm:text-xl lg:text-2xl w-full py-3 sm:py-4 rounded-lg shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] hover:bg-purple-600/50 disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
