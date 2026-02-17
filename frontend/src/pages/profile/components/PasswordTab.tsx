import React from "react";
import { ProfileCard, inputStyles } from "./ProfileUIElements";

interface PasswordTabProps {
  passwordForm: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  error: string;
}

/**
 * Password management tab.
 *
 * Provides a secure interface for updating account credentials.
 * Adheres to the new deep purple theme with white/40 text and white/10 borders.
 *
 * @param {PasswordTabProps} props - Component properties
 * @returns {JSX.Element} The rendered password tab
 */
const PasswordTab: React.FC<PasswordTabProps> = ({
  passwordForm,
  onPasswordChange,
  onSubmit,
  onCancel,
  isLoading,
  error,
}) => {
  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <h2 className="text-xl font-bold text-white ">Security settings</h2>
        <p className="text-sm text-white/40 mt-2 max-w-sm mx-auto">
          Ensure your account remains secure by using a strong, unique password.
        </p>
      </div>

      <ProfileCard>
        <div className="p-8 space-y-8">
          {/* Current password */}
          <div>
            <label className="text-[10px] font-bold text-purple-300/60 uppercase block mb-3">
              Current authentication
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={onPasswordChange}
              placeholder="••••••••••••"
              className={inputStyles.password}
            />
          </div>

          <div className="h-px bg-white/10" />

          {/* New password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-[10px] font-bold text-purple-300/60 uppercase block mb-3">
                New credentials
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={onPasswordChange}
                placeholder="••••••••••••"
                className={inputStyles.password}
              />
              <p className="text-[10px] text-white/30 mt-3 font-medium leading-relaxed">
                Requirements: 8+ characters, including uppercase, lowercase,
                numbers, and symbols.
              </p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-purple-300/60 tracking-[0.2em] uppercase block mb-3">
                Verify credentials
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={onPasswordChange}
                placeholder="••••••••••••"
                className={inputStyles.password}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl animate-in shake-in duration-300">
              <p className="text-red-400 text-sm font-medium text-center">
                {error}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 disabled:cursor-not-allowed text-white px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Update security key"
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-white/10"
            >
              Cancel
            </button>
          </div>
        </div>
      </ProfileCard>
    </div>
  );
};

export default PasswordTab;
