import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdWarning } from "react-icons/md";

interface LeaveEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventName?: string;
}

const LeaveEventModal: React.FC<LeaveEventModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  eventName = "this event",
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-sm bg-[#111827] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-500">
                <MdWarning size={24} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                Leave Event?
              </h3>
              <p className="text-white/60 text-sm mb-6">
                Are you sure you want to leave{" "}
                <span className="text-white font-semibold">{eventName}</span>?
                You will lose your spot and may need to register again.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors text-sm shadow-lg shadow-red-500/20"
                >
                  Leave Event
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LeaveEventModal;
