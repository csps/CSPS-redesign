import React from "react";
import type { EventSessionResponse } from "../../../../../interfaces/event/EventSessionResponse";
import type { AttendanceRecordResponse } from "../../../../../interfaces/event/AttendanceRecordResponse";
import { formatTimeRange } from "../../../../../helper/dateUtils";

interface SessionListProps {
  sessions: EventSessionResponse[];
  sessionAttendance: Record<number, AttendanceRecordResponse[]>;
  onScan: (session: EventSessionResponse) => void;
  onViewAttendance: (session: EventSessionResponse) => void;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  sessionAttendance,
  onScan,
  onViewAttendance,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-white/40 tracking-widest uppercase">
          Sessions ({sessions.length})
        </h2>
      </div>

      {sessions.length === 0 ? (
        <div className="border border-white/5 rounded-xl bg-white/[0.02] p-8 text-center">
          <p className="text-white/50 text-sm">No sessions created yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const attendance = sessionAttendance[session.sessionId] || [];
            return (
              <div
                key={session.sessionId}
                className="border border-white/10 rounded-xl bg-white/[0.03] p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-white">
                        {session.sessionName}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          session.sessionStatus === "ACTIVE"
                            ? "bg-green-500/15 text-green-400"
                            : session.sessionStatus === "PENDING"
                              ? "bg-yellow-500/15 text-yellow-400"
                              : "bg-white/5 text-white/50"
                        }`}
                      >
                        {session.sessionStatus}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-white/50 text-xs">
                      <span>{session.sessionDate}</span>
                      <span>
                        {formatTimeRange(session.startTime, session.endTime)}
                      </span>
                      <span>{attendance.length} checked in</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onScan(session)}
                      className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      Scan QR
                    </button>
                    <button
                      onClick={() => onViewAttendance(session)}
                      className="bg-white/5 hover:bg-white/10 text-white/70 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                      View Attendance
                    </button>
                  </div>
                </div>

                {/* Attendance Preview (Optional - removed to simplify as we have View Attendance) */}
                {/* But keeping recent check-ins if wanted, but maybe redundant with View Attendance Modal */}
                {/* Let's keep a small preview for quick glance */}
                {attendance.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-xs font-semibold text-white/40 mb-2">
                      Recent Check-ins
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {attendance.slice(0, 5).map((record) => (
                        <div
                          key={record.attendanceId}
                          className="flex items-center gap-2 text-xs text-white/50 px-2 py-1 bg-white/5 rounded-lg border border-white/5"
                        >
                          <span>{record.studentName}</span>
                        </div>
                      ))}
                      {attendance.length > 5 && (
                        <span className="text-xs text-white/30 px-2 py-1">
                          +{attendance.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionList;
