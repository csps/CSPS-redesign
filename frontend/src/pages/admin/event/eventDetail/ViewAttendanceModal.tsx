import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdOutlineClose,
  MdSearch,
  MdCheckCircle,
  MdSchedule,
  MdPlayArrow,
  MdDoneAll,
} from "react-icons/md";
import type { EventSessionResponse } from "../../../../interfaces/event/EventSessionResponse";
import type { AttendanceRecordResponse } from "../../../../interfaces/event/AttendanceRecordResponse";
import { formatTimeRange } from "../../../../helper/dateUtils";

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

  useEffect(() => {
    if (attendance) {
      const filtered = attendance.filter(
        (record) =>
          record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.studentId.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredAttendance(filtered);
    }
  }, [attendance, searchTerm]);

  if (!isOpen || !session) return null;

  const handleStatusUpdate = async (
    newStatus: "PENDING" | "ACTIVE" | "COMPLETED",
  ) => {
    if (isUpdatingStatus) return;
    if (session.sessionStatus === "COMPLETED") return; // Cannot change if completed

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
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="relative w-full max-w-2xl bg-[#170657] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {session.sessionName}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white/50 text-xs font-medium">
                    {session.sessionDate} •{" "}
                    {formatTimeRange(session.startTime, session.endTime)}
                  </span>
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(
                      session.sessionStatus,
                    )}`}
                  >
                    {session.sessionStatus}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              >
                <MdOutlineClose size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col md:flex-row h-full overflow-hidden">
              {/* Sidebar / Top Section for Controls */}
              <div className="w-full md:w-64 p-6 border-b md:border-b-0 md:border-r border-white/5 bg-black/20 shrink-0">
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                    Session Status
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleStatusUpdate("PENDING")}
                      disabled={
                        session.sessionStatus === "COMPLETED" ||
                        session.sessionStatus === "PENDING" ||
                        isUpdatingStatus
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        session.sessionStatus === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                          : "bg-white/5 text-white/40 hover:bg-white/10"
                      } ${session.sessionStatus === "COMPLETED" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <MdSchedule size={16} />
                      Pending
                    </button>

                    <button
                      onClick={() => handleStatusUpdate("ACTIVE")}
                      disabled={
                        session.sessionStatus === "COMPLETED" ||
                        session.sessionStatus === "ACTIVE" ||
                        isUpdatingStatus
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        session.sessionStatus === "ACTIVE"
                          ? "bg-green-500/20 text-green-400 border border-green-500/20"
                          : "bg-white/5 text-white/40 hover:bg-white/10"
                      } ${session.sessionStatus === "COMPLETED" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <MdPlayArrow size={16} />
                      Active (Accept Check-ins)
                    </button>

                    <button
                      onClick={() => handleStatusUpdate("COMPLETED")}
                      disabled={
                        session.sessionStatus === "COMPLETED" ||
                        isUpdatingStatus
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        session.sessionStatus === "COMPLETED"
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                          : "bg-white/5 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      <MdDoneAll size={16} />
                      Completed (Finalize)
                    </button>
                    {session.sessionStatus === "COMPLETED" && (
                      <p className="text-[10px] text-white/30 px-1 mt-1">
                        Completed sessions cannot be modified.
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">
                    Attendance Summary
                  </h3>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-2xl font-bold text-white mb-1">
                      {attendance.length}
                    </div>
                    <div className="text-xs text-white/50">
                      Total Checked In
                    </div>
                  </div>
                </div>
              </div>

              {/* Main List Area */}
              <div className="flex-1 flex flex-col min-h-0 bg-white/[0.01]">
                {/* Search Bar */}
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
                              <p className="text-sm font-medium text-white group-hover:text-purple-200 transition-colors">
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
                            <MdCheckCircle className="text-green-500/50" size={14} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewAttendanceModal;
