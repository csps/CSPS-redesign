import React, { useState, useCallback } from "react";
import { FaHashtag, FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../../api/auth";
import { toast } from "sonner";
import type { AuthRequest } from "../../../interfaces/auth/AuthRequest";
import { useAuthStore } from "../../../store/auth_store";
import type { UserResponse } from "../../../interfaces/user/UserResponse";
import { getAdminHomeRoute } from "../../../router/routePermissions";

/**
 * LoginForm - Handles user authentication with an optimistic login pattern.
 *
 * On successful login:
 * 1. JWT is decoded inline for instant auth state (no extra API call)
 * 2. A smooth fade-to-dark overlay animates in (~400ms)
 * 3. Navigation fires after the fade completes, masking the route transition
 * 4. Full user profile is hydrated in the background (fire-and-forget)
 *
 * This eliminates the black flash between login and dashboard pages,
 * creating a polished, app-like transition experience.
 */
const LoginForm = () => {
  const [studentId, setStudentId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
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

  /**
   * Navigates to the destination after the crossfade overlay animation finishes.
   * Called from the overlay's onTransitionEnd event so the route switch happens
   * behind the fully opaque overlay — no black flash visible to the user.
   *
   * @param destination - The route path to navigate to after the fade
   */
  const handleTransitionEnd = useCallback(
    (destination: string) => {
      navigate(destination);
    },
    [navigate],
  );

  // Store the destination so the overlay's onTransitionEnd can access it
  const [pendingDestination, setPendingDestination] = useState<string>("");

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
      
      toast.success("Login successful! Welcome back!");
      if (user.role === "ADMIN") {
        // Use position-based routing for admins
        const adminUser = user as UserResponse;
        destination = getAdminHomeRoute(adminUser.position);
      } else {
        destination = "/dashboard";
      }

      // Brief delay for form fade effect, then trigger the crossfade overlay
      setTimeout(() => {
        setPendingDestination(destination);
        setIsTransitioning(true);
      }, 900);
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
    <>
      {/* Crossfade overlay: fades to dark on successful login to mask the route transition */}
      <div
        className="fixed inset-0 bg-black pointer-events-none"
        style={{
          zIndex: 9999,
          opacity: isTransitioning ? 1 : 0,
          transition: "opacity 400ms ease-in-out",
        }}
        onTransitionEnd={() => {
          if (isTransitioning && pendingDestination) {
            handleTransitionEnd(pendingDestination);
          }
        }}
      />

      <form
        action=""
        method="post"
        className="space-y-5 w-full py-6 sm:py-10 z-10 transition-all duration-300"
        style={{
          opacity: isTransitioning ? 0.6 : 1,
          filter: isTransitioning ? "blur(2px)" : "blur(0px)",
        }}
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
            type={showPassword ? "text" : "password"}
            id="password"
            className={`w-full bg-purple-700/40 rounded-2xl py-3 sm:py-4 px-10 pr-14 text-white placeholder-purple-300/80 focus:outline-none focus:bg-purple-700/50 transition-all shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] z-10 border font-bold text-base sm:text-lg lg:text-xl ${
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300/80 hover:text-purple-300 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible className="text-lg sm:text-xl" />
            ) : (
              <AiOutlineEye className="text-lg sm:text-xl" />
            )}
          </button>
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
        </div>
        <div className="w-full px-2 sm:px-10">
          <button
            disabled={isLoading || isTransitioning}
            className="bg-purple-700/40 font-semibold text-lg sm:text-xl lg:text-2xl w-full py-3 sm:py-4 rounded-lg shadow-[0px_8px_6px_0px_rgba(0,_0,_0,_0.4)] hover:bg-purple-600/50 disabled:opacity-50"
          >
            {isLoading
              ? "Logging in..."
              : isTransitioning
                ? "Welcome!"
                : "Log In"}
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
