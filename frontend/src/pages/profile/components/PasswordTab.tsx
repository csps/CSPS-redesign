import React from "react";
import { ProfileCard, inputStyles, SectionLabel } from "./ProfileUIElements";
import { MdLock, MdArrowForward } from "react-icons/md";

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
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Security Settings
        </h2>
        <p className="text-sm text-white/40 mt-1.5 font-medium">
          Manage your account password and security preferences.
        </p>
      </div>

      <SectionLabel title="Change Password" />
      <ProfileCard>
        <div className="p-8 space-y-8">
          {/* current password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-white/30 block ml-1">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={onPasswordChange}
              placeholder="Enter current password"
              className={inputStyles.password}
            />
          </div>

          <div className="h-px bg-white/5 mx-[-2rem]" />

          {/* new password fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30 block ml-1">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={onPasswordChange}
                placeholder="New password"
                className={inputStyles.password}
              />
              <p className="text-[10px] text-white/20 mt-2 ml-1 leading-relaxed font-medium">
                Min. 8 characters • Uppercase • Lowercase • Numbers
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-white/30 block ml-1">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={onPasswordChange}
                placeholder="Confirm password"
                className={inputStyles.password}
              />
            </div>
          </div>

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

          {/* actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onSubmit}
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  <MdLock size={18} />
                  Update Password
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all"
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
