import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdOutlineClose,
  MdSearch,
  MdCheckCircle,
  MdKeyboardArrowDown,
} from "react-icons/md";
import type { EventSessionResponse } from "../../../../../interfaces/event/EventSessionResponse";
import type { AttendanceRecordResponse } from "../../../../../interfaces/event/AttendanceRecordResponse";
import { formatTimeRange } from "../../../../../helper/dateUtils";

interface ViewAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: EventSessionResponse | null;
  attendance: AttendanceRecordResponse[];
  onStatusChange: (
    sessionId: number,
    status: "PENDING" | "ACTIVE" | "COMPLETED",
  ) => Promise<void>;
}

const ViewAttendanceModal: React.FC<ViewAttendanceModalProps> = ({
  isOpen,
  onClose,
  session,
  attendance,
  onStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState<
    AttendanceRecordResponse[]
  >([]);

  // Ensure attendance is always an array to prevent "filter is not a function" error
  const safeAttendance = Array.isArray(attendance) ? attendance : [];

  useEffect(() => {
    const filtered = safeAttendance.filter(
      (record) =>
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredAttendance(filtered);
  }, [attendance, searchTerm]);

  if (!isOpen || !session) return null;

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as "PENDING" | "ACTIVE" | "COMPLETED";
    // Prevent change if already completed or currently updating
    if (isUpdatingStatus || session.sessionStatus === "COMPLETED") return;

    setIsUpdatingStatus(true);
    try {
      await onStatusChange(session.sessionId, newStatus);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "COMPLETED":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default:
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
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
            className="relative w-full max-w-2xl bg-[#170657] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex flex-col gap-4 px-6 py-5 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {session.sessionName}
                  </h2>
                  <p className="text-white/50 text-xs font-medium mt-1">
                    {session.sessionDate} •{" "}
                    {formatTimeRange(session.startTime, session.endTime)}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
                >
                  <MdOutlineClose size={20} />
                </button>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-between gap-4">
                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={session.sessionStatus}
                    onChange={handleStatusChange}
                    disabled={
                      session.sessionStatus === "COMPLETED" || isUpdatingStatus
                    }
                    className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border outline-none cursor-pointer transition-all ${getStatusColor(
                      session.sessionStatus,
                    )} ${
                      session.sessionStatus === "COMPLETED"
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <option
                      value="PENDING"
                      className="bg-[#170657] text-yellow-400"
                    >
                      PENDING
                    </option>
                    <option
                      value="ACTIVE"
                      className="bg-[#170657] text-green-400"
                    >
                      ACTIVE
                    </option>
                    <option
                      value="COMPLETED"
                      className="bg-[#170657] text-blue-400"
                    >
                      COMPLETED
                    </option>
                  </select>
                  <MdKeyboardArrowDown
                    className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                      session.sessionStatus === "ACTIVE"
                        ? "text-green-400"
                        : session.sessionStatus === "COMPLETED"
                          ? "text-blue-400"
                          : "text-yellow-400"
                    }`}
                  />
                </div>

                {/* Stats */}
                <div className="text-xs text-white/50">
                  <strong className="text-white">
                    {safeAttendance.length}
                  </strong>{" "}
                  Checked In
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-h-0 bg-white/[0.01]">
              {/* Search */}
              <div className="p-4 border-b border-white/5">
                <div className="relative">
                  <MdSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search student name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {filteredAttendance.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/30 py-10">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                      <MdSearch size={24} />
                    </div>
                    <p className="text-sm">No attendees found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {filteredAttendance.map((record) => (
                      <div
                        key={record.attendanceId}
                        className="group flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-xs font-bold text-white/70 border border-white/5">
                            {record.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              {record.studentName}
                            </p>
                            <p className="text-[10px] text-white/40 font-mono">
                              {record.studentId}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <div className="text-[10px] text-white/30 bg-white/5 px-2 py-1 rounded-lg">
                            {new Date(record.checkedInAt).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </div>
                          <MdCheckCircle
                            className="text-green-500/50"
                            size={14}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewAttendanceModal;
