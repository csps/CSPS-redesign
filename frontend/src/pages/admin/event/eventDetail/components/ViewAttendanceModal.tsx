import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  MdOutlineClose,
  MdSearch,
  MdCheckCircle,
  MdKeyboardArrowDown,
} from "react-icons/md";
import type { EventSessionResponse } from "../../../../../interfaces/event/EventSessionResponse";
import type { AttendanceRecordResponse } from "../../../../../interfaces/event/AttendanceRecordResponse";
import type { AttendanceRecordSearchDTO } from "../../../../../interfaces/event/AttendanceRecordSearchDTO";
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
  onSearch: (params: AttendanceRecordSearchDTO) => void;
}

const ViewAttendanceModal: React.FC<ViewAttendanceModalProps> = ({
  isOpen,
  onClose,
  session,
  attendance,
  onStatusChange,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [studentId, setStudentId] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    newStatus: "PENDING" | "ACTIVE" | "COMPLETED" | null;
  }>({ isOpen: false, newStatus: null });

  // Ensure attendance is always an array
  const displayAttendance = Array.isArray(attendance) ? attendance : [];

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if search term starts with a number
      const isNumericSearch = searchTerm && /^\d/.test(searchTerm);

      onSearch({
        sessionId: session?.sessionId,
        studentName: isNumericSearch ? undefined : searchTerm || undefined,
        studentId: isNumericSearch ? searchTerm : undefined,
        startDate: startDate ? `${startDate}T00:00:00` : undefined,
        endDate: endDate ? `${endDate}T23:59:59` : undefined,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm, startDate, endDate, onSearch, session?.sessionId]);

  if (!isOpen || !session) return null;

  const handleStatusChangeClick = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as "PENDING" | "ACTIVE" | "COMPLETED";
    if (session.sessionStatus === "COMPLETED") return;

    // Reset select to current status
    e.currentTarget.value = session.sessionStatus;
    
    // Open confirmation modal
    setConfirmModal({ isOpen: true, newStatus });
  };

  const handleConfirmStatusChange = async () => {
    if (!confirmModal.newStatus) return;

    setIsUpdatingStatus(true);
    try {
      await onStatusChange(session.sessionId, confirmModal.newStatus);
      toast.success("Session status updated successfully");
      setConfirmModal({ isOpen: false, newStatus: null });
    } catch (error) {
      toast.error("Failed to update session status");
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
                      className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-[32px] shadow-2xl flex flex-col max-h-[85vh]"
                    >
                      {/* Header */}
                      <div className="flex flex-col gap-4 px-6 py-5 border-b border-white/5 bg-gray-800/30 rounded-t-[32px]">
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
                          <div className="relative">
                            <select
                              value={session.sessionStatus}
                              onChange={handleStatusChangeClick}
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
                                className="bg-[#111827] text-yellow-400"
                              >
                                PENDING
                              </option>
                              <option
                                value="ACTIVE"
                                className="bg-[#111827] text-green-400"
                              >
                                ACTIVE
                              </option>
                              <option
                                value="COMPLETED"
                                className="bg-[#111827] text-blue-400"
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
          
                          <div className="text-xs text-white/50">
                            <strong className="text-white">
                              {displayAttendance.length}
                            </strong>{" "}
                            Checked In
                          </div>
                        </div>
                      </div>
          
                      {/* Content Area */}
                      <div className="flex-1 flex flex-col min-h-0 bg-gray-900/50 rounded-b-[32px]">
                        {/* Search & Filters */}
                        <div className="p-4 border-b border-white/5 space-y-4">
                          <div className="relative">
                  <MdSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by name or ID (start with number)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">From</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">To</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-white/20 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {displayAttendance.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/30 py-10">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                      <MdSearch size={24} />
                    </div>
                    <p className="text-sm">No attendees found</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {displayAttendance.map((record) => (
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

          {/* Confirmation Modal */}
          <AnimatePresence>
            {confirmModal.isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setConfirmModal({ isOpen: false, newStatus: null })}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#111827] border border-white/10 p-6 rounded-2xl shadow-xl max-w-sm w-full relative overflow-hidden"
                >
                  <h3 className="text-lg font-bold text-white mb-2 relative z-10">
                    Confirm Status Change
                  </h3>
                  <p className="text-white/70 text-sm mb-6 relative z-10">
                    Are you sure you want to change the session status to{" "}
                    <span className="text-yellow-400 font-bold">
                      {confirmModal.newStatus}
                    </span>
                    ?
                  </p>

                  <div className="flex gap-3 justify-end relative z-10">
                    <button
                      onClick={() =>
                        setConfirmModal({ isOpen: false, newStatus: null })
                      }
                      className="px-4 py-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmStatusChange}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-purple-500/20"
                    >
                      Confirm
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewAttendanceModal;
