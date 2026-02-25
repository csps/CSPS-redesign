import React from "react";
import type { EventSessionResponse } from "../../../../interfaces/event/EventSessionResponse";
import type { AttendanceRecordResponse } from "../../../../interfaces/event/AttendanceRecordResponse";
import { formatTimeRange } from "../../../../helper/dateUtils";

interface SessionListProps {
  sessions: EventSessionResponse[];
  attendance: AttendanceRecordResponse[];
  onViewQR: (session: EventSessionResponse) => void;
}

// status badge styles
const statusStyles: Record<string, string> = {
  ACTIVE: "bg-green-500/15 text-green-400 border border-green-500/20",
  PENDING: "bg-white/5 text-white/50 border border-white/10",
  COMPLETED: "bg-white/5 text-white/30 border border-white/5",
};

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  attendance,
  onViewQR,
}) => {
  // check if student already checked in for a session
  const isCheckedIn = (sessionId: number) =>
    attendance.some((a) => a.sessionId === sessionId);

  if (sessions.length === 0) {
    return (
      <div className="border border-white/5 rounded-lg xs:rounded-xl bg-white/[0.02] p-4 xs:p-5 sm:p-6 md:p-8 text-center mb-4 xs:mb-5 sm:mb-6 md:mb-8">
        <div className="w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 mx-auto mb-3 xs:mb-4 rounded-xl xs:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg
            className="w-5 xs:w-6 sm:w-7 h-5 xs:h-6 sm:h-7 text-white/20"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </div>
        <h3 className="text-sm xs:text-base font-semibold text-white mb-1">
          No sessions available
        </h3>
        <p className="text-white/40 text-xs sm:text-sm">
          Sessions will appear here once they are created
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
      <h2 className="text-[10px] xs:text-xs font-semibold text-white/40 tracking-widest uppercase mb-2 xs:mb-3 sm:mb-4">
        Sessions
      </h2>

      <div className="flex flex-col gap-2 xs:gap-2.5 sm:gap-3">
        {sessions.map((session) => {
          const checked = isCheckedIn(session.sessionId);
          const canViewQR = session.sessionStatus === "ACTIVE" && !checked;

          return (
            <div
              key={session.sessionId}
              className="border border-white/5 rounded-lg xs:rounded-xl bg-white/[0.02] p-3 xs:p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 xs:gap-2.5 sm:gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-start sm:items-center gap-2 mb-1.5 xs:mb-2">
                  <h3 className="text-xs xs:text-sm font-semibold text-white truncate flex-1">
                    {session.sessionName}
                  </h3>
                  <span
                    className={`px-1.5 xs:px-2 py-0.5 text-[8px] xs:text-[9px] sm:text-[10px] font-semibold rounded-full shrink-0 whitespace-nowrap ${
                      statusStyles[session.sessionStatus] ||
                      statusStyles.PENDING
                    }`}
                  >
                    {session.sessionStatus}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 xs:gap-3 sm:gap-4 text-white/50 text-[11px] xs:text-xs">
                  <span className="truncate">{session.sessionDate}</span>
                  <span className="truncate">
                    {formatTimeRange(session.startTime, session.endTime)}
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center justify-end">
                {checked ? (
                  <span className="flex items-center gap-1 xs:gap-1.5 text-green-400 text-[11px] xs:text-xs font-medium">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="truncate">Checked in</span>
                  </span>
                ) : canViewQR ? (
                  <button
                    onClick={() => onViewQR(session)}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-3 xs:px-4 sm:px-5 py-1.5 xs:py-2 sm:py-2.5 rounded-lg text-[11px] xs:text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                  >
                    View QR
                  </button>
                ) : (
                  <span className="text-white/30 text-[11px] xs:text-xs whitespace-nowrap">
                    {session.sessionStatus === "PENDING"
                      ? "Not yet active"
                      : "Session ended"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionList;
