import React from "react";
import { IconLock, IconCheck } from "./Icons";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Success modal for password change.
 */
export const PasswordSuccessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#111827] border border-white/10 rounded-[32px] shadow-2xl p-10 max-w-sm w-full text-center relative overflow-hidden"
          >
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
              <IconCheck className="w-10 h-10 text-green-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              Password Updated
            </h3>
            <p className="text-sm text-white/40 mb-8 font-medium leading-relaxed">
              Your account security has been successfully updated.
            </p>

            <button
              onClick={onClose}
              className="w-full bg-[#FDE006] hover:brightness-110 text-black py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/10 active:scale-[0.98]"
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * Confirmation modal for password change.
 */
export const PasswordConfirmModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}> = ({ isOpen, onClose, onConfirm, isLoading = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-[#111827] border border-white/10 rounded-[32px] shadow-2xl p-10 max-w-sm w-full text-center relative overflow-hidden"
          >
            <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-yellow-500/20">
              <IconLock className="w-10 h-10 text-yellow-400" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              Confirm Update
            </h3>
            <p className="text-sm text-white/40 mb-8 font-medium leading-relaxed">
              You're about to change your password. This action will take effect
              immediately.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing
                  </>
                ) : (
                  "Confirm Change"
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isLoading}
                className="w-full py-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
