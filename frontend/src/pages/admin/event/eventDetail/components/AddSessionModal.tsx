import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineClose, MdAdd } from "react-icons/md";
import toast from "react-hot-toast";
import { createEventSession } from "../../../../../api/eventParticipation";
import type { EventSessionRequest } from "../../../../../interfaces/event/EventSessionRequest";
import { DatePicker } from "../../../../../components/DatePicker";

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
  onSessionAdded: () => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({
  isOpen,
  onClose,
  eventId,
  onSessionAdded,
}) => {
  const [formData, setFormData] = useState<EventSessionRequest>({
    sessionName: "",
    sessionDate: "",
    startTime: "",
    endTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.sessionName ||
      !formData.sessionDate ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createEventSession(eventId, formData);
      toast.success("Session created successfully");
      onSessionAdded();
      onClose();
      setFormData({
        sessionName: "",
        sessionDate: "",
        startTime: "",
        endTime: "",
      });
    } catch (error) {
      console.error("Failed to create session:", error);
      toast.error("Failed to create session");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-lg bg-[#111827] border border-white/10 rounded-[32px] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-gray-800/30 rounded-t-[32px]">
              <h2 className="text-xl font-bold text-white">Add Session</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <MdOutlineClose size={20} />
              </button>
            </div>

            {/* Content */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 bg-gray-900/50 rounded-b-[32px]"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
                  Session Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning Workshop"
                  value={formData.sessionName}
                  onChange={(e) =>
                    setFormData({ ...formData, sessionName: e.target.value })
                  }
                  className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors placeholder-white/20"
                />
              </div>

              <DatePicker
                label="Date"
                value={formData.sessionDate}
                onChange={(date) =>
                  setFormData({ ...formData, sessionDate: date })
                }
                placeholder="Select session date"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2 px-1 text-white/50">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="w-full h-[46px] bg-[#1e1e2e] border border-white/10 rounded-xl px-4 text-sm text-white focus:border-purple-500 outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[46px] bg-[#FDE006] hover:brightness-110 text-black font-bold rounded-xl transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Creating..."
                ) : (
                  <>
                    <MdAdd size={20} /> Create Session
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddSessionModal;
