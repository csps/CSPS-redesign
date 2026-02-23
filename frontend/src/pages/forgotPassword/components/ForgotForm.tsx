import React, { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordRecovery } from "../../../api/recoveryToken";

const ForgotForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    setIsLoading(true);

    try {
      await requestPasswordRecovery(email.trim());
      setSent(true);
    } catch (err: any) {
      // Generic message for security — don't reveal if email exists
      const status = err?.response?.status;
      if (status === 404) {
        setError(
          "If an account with that email exists, a recovery link has been sent.",
        );
        // Still show "sent" state to avoid email enumeration
        setSent(true);
      } else {
        setError(
          err?.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (sent) {
    return (
      <div className="w-full py-6 sm:py-10 z-10 space-y-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Check your inbox
          </h2>
          <p className="text-white/40 text-sm sm:text-base font-medium mt-3 leading-relaxed max-w-md">
            We sent a password recovery link to{" "}
            <span className="text-white font-semibold">{email}</span>. Click the
            link in the email to reset your password.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-white/30 text-xs font-medium">
            Didn't receive the email? Check your spam folder or try again.
          </p>

          <button
            onClick={() => {
              setSent(false);
              setError(null);
            }}
            className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors"
          >
            Try a different email
          </button>
        </div>

        <div className="pt-4">
          <Link
            to="/login"
            className="text-sm text-white/40 font-medium hover:text-white transition-colors"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  // Request form
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full py-6 sm:py-10 z-10 space-y-8"
    >
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Reset your password
        </h2>
        <p className="text-white/40 text-sm sm:text-base font-medium mt-3 leading-relaxed max-w-md">
          Enter the email address associated with your account and we'll send
          you a link to reset your password.
        </p>
      </div>

      {/* Email input */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-[10px] font-bold uppercase tracking-widest text-white/40 px-1"
        >
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          placeholder="you@university.edu"
          disabled={isLoading}
          className={`w-full bg-white/5 border rounded-xl py-3.5 px-5 text-white text-sm font-medium placeholder-white/20 focus:outline-none transition-all duration-200 ${
            error
              ? "border-red-500/50 focus:border-red-400"
              : "border-white/10 focus:border-purple-500/50"
          } disabled:opacity-50`}
        />
        {error && (
          <p className="text-red-400 text-xs font-medium mt-1 px-1">{error}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-purple-900/30"
      >
        {isLoading ? "Sending..." : "Send recovery link"}
      </button>

      {/* Back to login */}
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
};

export default ForgotForm;
