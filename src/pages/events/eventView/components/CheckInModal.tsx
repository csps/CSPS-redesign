import React, { useState } from "react";
import { motion } from "framer-motion";
import type { EventSessionResponse } from "../../../../interfaces/event/EventSessionResponse";
import {
  getQRToken,
  checkInToSession,
} from "../../../../api/eventParticipation";
import { formatTimeRange } from "../../../../helper/dateUtils";

interface CheckInModalProps {
  session: EventSessionResponse;
  onClose: () => void;
  onSuccess: () => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({
  session,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<"confirm" | "loading" | "success" | "error">(
    "confirm",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleCheckIn = async () => {
    setStep("loading");
    try {
      // retrieve qr token then check in
      const qrToken = await getQRToken(session.sessionId);
      await checkInToSession(session.sessionId, qrToken);
      setStep("success");
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Check-in failed. Please try again.";
      setErrorMessage(msg);
      setStep("error");
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 xs:p-3 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="w-full max-w-xs xs:max-w-sm rounded-xl xs:rounded-2xl bg-[#170657] border border-white/10 shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 xs:p-5 sm:p-6">
          {/* header */}
          <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-5">
            <h2 className="text-sm xs:text-base font-bold text-white">
              Check In
            </h2>
            <button
              onClick={onClose}
              className="w-6 xs:w-7 h-6 xs:h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <svg
                className="w-3 xs:w-3.5 h-3 xs:h-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* session info */}
          <div className="border border-white/5 rounded-lg xs:rounded-xl bg-white/[0.03] p-3 xs:p-4 mb-3 xs:mb-4 sm:mb-5">
            <p className="text-xs xs:text-sm font-semibold text-white mb-1 truncate">
              {session.sessionName}
            </p>
            <p className="text-[11px] xs:text-xs text-white/40">
              {session.sessionDate} &middot;{" "}
              {formatTimeRange(session.startTime, session.endTime)}
            </p>
          </div>

          {/* states */}
          {step === "confirm" && (
            <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3">
              <button
                onClick={handleCheckIn}
                className="w-full py-2 xs:py-2.5 sm:py-3 bg-white text-[#170657] rounded-lg xs:rounded-xl font-bold text-xs xs:text-sm hover:bg-purple-100 transition-colors active:scale-[0.98]"
              >
                Confirm Check-In
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 xs:py-2.5 sm:py-3 bg-white/5 text-white/60 rounded-lg xs:rounded-xl text-xs xs:text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center py-3 xs:py-4">
              <div className="w-7 xs:w-8 h-7 xs:h-8 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-2 xs:mb-3" />
              <p className="text-white/50 text-[11px] xs:text-sm">
                Processing...
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-3 xs:py-4">
              <div className="w-10 xs:w-12 h-10 xs:h-12 rounded-full bg-green-500/15 flex items-center justify-center mb-2 xs:mb-3">
                <svg
                  className="w-5 xs:w-6 h-5 xs:h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-white font-semibold text-xs xs:text-sm">
                Checked in successfully
              </p>
            </div>
          )}

          {step === "error" && (
            <div className="flex flex-col items-center py-3 xs:py-4">
              <div className="w-10 xs:w-12 h-10 xs:h-12 rounded-full bg-red-500/15 flex items-center justify-center mb-2 xs:mb-3">
                <svg
                  className="w-5 xs:w-6 h-5 xs:h-6 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-red-400 text-xs xs:text-sm font-medium mb-1">
                {errorMessage}
              </p>
              <button
                onClick={() => setStep("confirm")}
                className="text-white/50 text-xs hover:text-white transition-colors mt-1.5 xs:mt-2"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CheckInModal;
