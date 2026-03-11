import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineClose, MdAdd, MdEvent, MdAccessTime } from "react-icons/md";
import toast from "react-hot-toast";
import {
  createEventSession,
  getEventSessions,
} from "../../../../api/eventParticipation";
import type { EventSessionRequest } from "../../../../interfaces/event/EventSessionRequest";
import type { EventSessionResponse } from "../../../../interfaces/event/EventSessionResponse";
import { DatePicker } from "../../../../components/DatePicker";

interface AddSessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number | null;
  eventDate: string;
  onFinish: () => void;
}

const AddSessionsModal: React.FC<AddSessionsModalProps> = ({
  isOpen,
  onClose,
  eventId,
  eventDate,
  onFinish,
}) => {
  const [sessions, setSessions] = useState<EventSessionResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Input Row State
  const [newSession, setNewSession] = useState<EventSessionRequest>({
    sessionName: "",
    sessionDate: eventDate || "",
    startTime: "",
    endTime: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [sessionErrors, setSessionErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && eventId) {
      setLoading(true);
      getEventSessions(eventId)
        .then((data) => {
          setSessions(data || []);
          // Reset input date to event date if available
          setNewSession((prev) => ({ ...prev, sessionDate: eventDate || "" }));
          setSessionErrors({});
        })
        .catch((err) => {
          console.error("Failed to load sessions", err);
          toast.error("Could not load existing sessions");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, eventId, eventDate]);

  const handleAddSession = async () => {
    if (!eventId) return;

    const errors: Record<string, boolean> = {};
    if (!newSession.sessionName) errors.sessionName = true;
    if (!newSession.sessionDate) errors.sessionDate = true;
    if (!newSession.startTime) errors.startTime = true;
    if (!newSession.endTime) errors.endTime = true;

    setSessionErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fill all fields");
      return;
    }

    // Removed isPastDate validation to allow backfilling/planning freedom

    setIsAdding(true);
    try {
      const created = await createEventSession(eventId, newSession);
      setSessions((prev) => [...prev, created]);

      // Reset form but keep date
      setNewSession({
        sessionName: "",
        sessionDate: newSession.sessionDate, // Keep same date for rapid entry
        startTime: "",
        endTime: "",
      });
      setSessionErrors({});
      toast.success("Session added!");
    } catch (error) {
      console.error("Failed to add session:", error);
      const msg =
        (error as any).response?.data?.message || "Failed to add session";
      toast.error(msg);
    } finally {
      setIsAdding(false);
    }
  };

  const handleFinish = () => {
    onFinish();
    onClose();
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
            className="relative w-full max-w-4xl bg-[#111827] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-gray-800/30 rounded-t-3xl">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <MdAccessTime className="text-purple-400" />
                  Manage Sessions
                </h2>
                <p className="text-white/40 text-xs mt-1">
                  Add sessions to your event efficiently.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <MdOutlineClose size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-900/50 p-6 flex flex-col gap-6">
              {/* Input Row (Always Visible) */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-lg sticky top-0 z-10 backdrop-blur-md">
                <div className="grid grid-cols-2 md:flex md:flex-row items-end gap-3">
                  {/* Name: Full width on mobile */}
                  <div className="col-span-2 md:flex-1 w-full">
                    <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block pl-1">
                      Session Name
                    </label>
                    <input
                      placeholder="e.g. Registration, Keynote..."
                      value={newSession.sessionName}
                      onChange={(e) => {
                        setNewSession({
                          ...newSession,
                          sessionName: e.target.value,
                        });
                        if (sessionErrors.sessionName)
                          setSessionErrors((prev) => ({
                            ...prev,
                            sessionName: false,
                          }));
                      }}
                      className={`w-full h-10 bg-[#1e1e2e] border rounded-lg px-3 text-sm text-white focus:outline-none transition-colors ${
                        sessionErrors.sessionName
                          ? "border-red-500 focus:border-red-400"
                          : "border-white/10 focus:border-purple-500"
                      }`}
                    />
                  </div>

                  {/* Date: Full width on mobile for easier picking */}
                  <div className="col-span-2 md:w-40">
                    <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block pl-1">
                      Date
                    </label>
                    <div
                      className={sessionErrors.sessionDate ? "border-red-500 rounded-lg border" : ""}
                    >
                      <DatePicker
                        value={newSession.sessionDate}
                        onChange={(date) => {
                          setNewSession({ ...newSession, sessionDate: date });
                          if (sessionErrors.sessionDate)
                            setSessionErrors((prev) => ({
                              ...prev,
                              sessionDate: false,
                            }));
                        }}
                        placeholder="Select"
                        className="!h-10 !py-0 !px-3"
                      />
                    </div>
                  </div>

                  {/* Start: Half width on mobile */}
                  <div className="col-span-1 md:w-32">
                    <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block pl-1">
                      Start
                    </label>
                    <input
                      type="time"
                      value={newSession.startTime}
                      onChange={(e) => {
                        setNewSession({
                          ...newSession,
                          startTime: e.target.value,
                        });
                        if (sessionErrors.startTime)
                          setSessionErrors((prev) => ({
                            ...prev,
                            startTime: false,
                          }));
                      }}
                      className={`w-full h-10 bg-[#1e1e2e] border rounded-lg px-3 text-sm text-white focus:outline-none transition-colors [color-scheme:dark] ${
                        sessionErrors.startTime
                          ? "border-red-500 focus:border-red-400"
                          : "border-white/10 focus:border-purple-500"
                      }`}
                    />
                  </div>

                  {/* End: Half width on mobile */}
                  <div className="col-span-1 md:w-32">
                    <label className="text-[10px] uppercase font-bold text-white/40 mb-1 block pl-1">
                      End
                    </label>
                    <input
                      type="time"
                      value={newSession.endTime}
                      onChange={(e) => {
                        setNewSession({
                          ...newSession,
                          endTime: e.target.value,
                        });
                        if (sessionErrors.endTime)
                          setSessionErrors((prev) => ({
                            ...prev,
                            endTime: false,
                          }));
                      }}
                      className={`w-full h-10 bg-[#1e1e2e] border rounded-lg px-3 text-sm text-white focus:outline-none transition-colors [color-scheme:dark] ${
                        sessionErrors.endTime
                          ? "border-red-500 focus:border-red-400"
                          : "border-white/10 focus:border-purple-500"
                      }`}
                    />
                  </div>

                  {/* Add Button: Full width on mobile */}
                  <button
                    onClick={handleAddSession}
                    disabled={isAdding}
                    className="col-span-2 md:w-auto h-10 px-6 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isAdding ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <MdAdd size={20} />
                    )}
                    <span className="md:hidden">Add Session</span>
                    <span className="hidden md:inline">Add</span>
                  </button>
                </div>
              </div>

              {/* Sessions List */}
              <div className="flex-1 min-h-[200px]">
                {loading ? (
                  <div className="grid gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-xl h-[72px] md:h-14 animate-pulse"></div>
                    ))}
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-white/30 border-2 border-dashed border-white/5 rounded-2xl">
                    <MdEvent size={40} className="mb-2 opacity-50" />
                    <p className="text-sm">No sessions added yet.</p>
                    <p className="text-xs">
                      Use the form above to add your first session.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    <div className="hidden md:grid grid-cols-[1fr_140px_100px_100px_60px] px-4 text-[10px] uppercase font-bold text-white/40">
                      <div>Name</div>
                      <div>Date</div>
                      <div>Start</div>
                      <div>End</div>
                      <div></div>
                    </div>
                    {sessions.map((session, idx) => (
                      <div
                        key={session.sessionId || idx}
                        className="group bg-white/5 hover:bg-white/[0.07] border border-white/5 rounded-xl p-4 md:p-0 md:h-14 flex flex-col md:grid md:grid-cols-[1fr_140px_100px_100px_60px] md:items-center gap-2 md:gap-0 transition-colors"
                      >
                        <div className="md:px-4 font-medium text-white">
                          {session.sessionName}
                        </div>
                        <div className="md:px-4 text-sm text-white/70 flex items-center gap-2">
                          <span className="md:hidden text-white/30 text-xs w-12">
                            Date:
                          </span>
                          {session.sessionDate}
                        </div>
                        <div className="md:px-4 text-sm text-white/70 flex items-center gap-2">
                          <span className="md:hidden text-white/30 text-xs w-12">
                            Start:
                          </span>
                          {session.startTime}
                        </div>
                        <div className="md:px-4 text-sm text-white/70 flex items-center gap-2">
                          <span className="md:hidden text-white/30 text-xs w-12">
                            End:
                          </span>
                          {session.endTime}
                        </div>
                        <div className="md:px-4 flex justify-end">
                          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                            <MdAdd className="rotate-45" size={0} />{" "}
                            {/* Spacer */}
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-gray-800/30 rounded-b-3xl">
              <button
                onClick={handleFinish}
                className="w-full h-[56px] bg-[#FDE006] hover:brightness-110 text-black font-extrabold rounded-2xl transition-all shadow-lg shadow-yellow-500/10 flex items-center justify-center gap-2 uppercase tracking-widest text-sm active:scale-95"
              >
                Finish & Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddSessionsModal;
