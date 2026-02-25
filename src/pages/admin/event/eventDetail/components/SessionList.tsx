import React from "react";
import { MdAdd } from "react-icons/md";
import type { EventSessionResponse } from "../../../../../interfaces/event/EventSessionResponse";
import { formatTimeRange } from "../../../../../helper/dateUtils";

interface SessionListProps {
  sessions: EventSessionResponse[];
  onScan: (session: EventSessionResponse) => void;
  onViewAttendance: (session: EventSessionResponse) => void;
  onAddSession: () => void;
}

const SessionList: React.FC<SessionListProps> = ({
  sessions,
  onScan,
  onViewAttendance,
  onAddSession,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold text-white/40 tracking-widest uppercase">
          Sessions ({sessions.length})
        </h2>
        <button
          onClick={onAddSession}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FDE006] hover:brightness-110 text-black text-xs font-bold transition-all shadow-lg shadow-yellow-500/10"
        >
          <MdAdd size={14} />
          Add Session
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="border border-white/5 rounded-xl bg-white/[0.02] p-8 text-center">
          <p className="text-white/50 text-sm mb-4">No sessions created yet</p>
          <button
            onClick={onAddSession}
            className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-colors"
          >
            Create your first session
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SessionList;
