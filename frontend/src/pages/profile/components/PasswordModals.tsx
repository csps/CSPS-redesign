import React from "react";
import { IconLock, IconCheck } from "./Icons";

/**
 * Success Modal for Password Change.
 */
export const PasswordSuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 p-8 max-w-sm w-full animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <IconCheck className="w-8 h-8 text-green-400" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Success</h3>
          <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8">
            Your security credentials have been updated successfully.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Confirmation Modal for Password Change.
 */
export const PasswordConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 p-8 max-w-sm w-full animate-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <IconLock className="w-8 h-8 text-yellow-400" />
          </div>

          <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Security Update</h3>
          <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8">
            You are about to modify your access credentials. This action will take effect immediately.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-900/20"
            >
              {isLoading ? "Processing..." : "Confirm Update"}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-lg text-sm font-medium transition-all border border-zinc-700/30"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
