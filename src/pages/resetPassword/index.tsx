import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  validateRecoveryToken,
  resetPasswordWithToken,
} from "../../api/recoveryToken";
import BACKGROUNDCSSLOGO from "../../assets/logos/BIGLOGOCSPS.png";
import CSPSLOGO2 from "../../assets/logos/csps_logo 1.png";

type PageState = "loading" | "invalid" | "form" | "success";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setErrorMessage("Missing recovery token.");
      setPageState("invalid");
      return;
    }

    const validate = async () => {
      try {
        await validateRecoveryToken(token);
        setPageState("form");
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          "This recovery link is invalid or has expired.";
        setErrorMessage(msg);
        setPageState("invalid");
      }
    };
    validate();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newPassword) {
      setFormError("New password is required.");
      return;
    }
    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await resetPasswordWithToken(token!, newPassword, confirmPassword);
      setPageState("success");
    } catch (err: any) {
      setFormError(
        err?.response?.data?.message ||
          "Failed to reset password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared background layout (matches login/forgot password pages)
  const renderContent = () => {
    switch (pageState) {
      case "loading":
        return (
          <div className="w-full py-10 z-10 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-white/40 text-sm font-medium">
              Validating recovery link...
            </p>
          </div>
        );

      case "invalid":
        return (
          <div className="w-full py-6 sm:py-10 z-10 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Link expired
              </h2>
              <p className="text-white/40 text-sm sm:text-base font-medium mt-3 leading-relaxed max-w-md">
                {errorMessage}
              </p>
            </div>

            <div className="space-y-4">
              <Link
                to="/forgot-password"
                className="block w-full text-center bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-900/30"
              >
                Request a new link
              </Link>
              <Link
                to="/login"
                className="block text-sm text-white/40 font-medium hover:text-white transition-colors"
              >
                Back to login
              </Link>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="w-full py-6 sm:py-10 z-10 space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Password updated
              </h2>
              <p className="text-white/40 text-sm sm:text-base font-medium mt-3 leading-relaxed max-w-md">
                Your password has been reset successfully. You can now sign in
                with your new password.
              </p>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-900/30"
            >
              Continue to login
            </button>
          </div>
        );

      case "form":
        return (
          <form
            onSubmit={handleSubmit}
            className="w-full py-6 sm:py-10 z-10 space-y-8"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Create new password
              </h2>
              <p className="text-white/40 text-sm sm:text-base font-medium mt-3 leading-relaxed max-w-md">
                Your new password must be at least 8 characters long.
              </p>
            </div>

            {/* New password */}
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-[10px] font-bold uppercase tracking-widest text-white/40 px-1"
              >
                New password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Enter new password"
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-5 pr-14 text-white text-sm font-medium placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                  aria-label={showPasswords.new ? "Hide" : "Show"}
                >
                  {showPasswords.new ? (
                    <AiOutlineEyeInvisible className="text-lg" />
                  ) : (
                    <AiOutlineEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-[10px] font-bold uppercase tracking-widest text-white/40 px-1"
              >
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Confirm new password"
                  disabled={isSubmitting}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 px-5 pr-14 text-white text-sm font-medium placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all duration-200 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                  aria-label={showPasswords.confirm ? "Hide" : "Show"}
                >
                  {showPasswords.confirm ? (
                    <AiOutlineEyeInvisible className="text-lg" />
                  ) : (
                    <AiOutlineEye className="text-lg" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {formError && (
              <p className="text-red-400 text-xs font-medium px-1">
                {formError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-900/30"
            >
              {isSubmitting ? "Resetting..." : "Reset password"}
            </button>

            <div>
              <Link
                to="/login"
                className="text-sm text-white/40 font-medium hover:text-white transition-colors"
              >
                Back to login
              </Link>
            </div>
          </form>
        );
    }
  };

  return (
    <div
      className="px-4 sm:px-8 lg:px-20 xl:px-56 mx-auto min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(
            40% 50% at 90% 10%, 
            rgba(193, 19, 251, 0.25) 0%, 
            rgba(193, 19, 251, 0.10) 50%, 
            rgba(193, 19, 251, 0) 100%
          ),
          radial-gradient(
            60% 70% at 0% 20%, 
            rgba(255, 204, 0, 0.15) 0%, 
            rgba(207, 176, 19, 0.08) 45%, 
            rgba(126, 99, 10, 0) 100%
          ),
          radial-gradient(
            100% 80% at 70% 70%, 
            rgba(52, 21, 168, 0.85) 0%, 
            #290F86 20%, 
            #210C71 40%, 
            #160651 60%, 
            #0F033D 80%, 
            #0D0233 100%
          )
        `,
      }}
    >
      <div className="relative flex flex-wrap bg-[#2d0f52]/10 rounded-4xl border-b border-b-white/20 border-t border-t-white/20 shadow-[-11px_10px_5px_0px_rgba(0,_0,_0,_0.3)] min-h-[40rem] w-full">
        {/* Left side */}
        <div className="w-full xl:w-1/2 px-5 sm:px-10 py-8 text-white flex xl:block flex-col items-center justify-center">
          <div className="absolute left-[-4rem] md:bottom-[-10rem]">
            <img
              src={BACKGROUNDCSSLOGO}
              alt=""
              className="w-full z-0 drop-shadow-xl/50"
            />
          </div>

          <img
            src={CSPSLOGO2}
            alt=""
            className="max-w-[10rem] sm:max-w-[14rem]"
          />
          <div className="mt-5 text-center xl:text-start">
            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Reset Password
            </p>
            <p className="text-base sm:text-lg lg:text-xl font-extralight max-w-lg text-gray-400 mt-5">
              Secure your account with a new password.
            </p>
          </div>
        </div>

        {/* Right side — dynamic content */}
        <div className="text-white w-full xl:w-1/2 px-5 sm:px-10 lg:px-20 flex items-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
