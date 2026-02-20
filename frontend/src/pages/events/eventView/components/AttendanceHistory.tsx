import React from "react";
import type { AttendanceRecordResponse } from "../../../../interfaces/event/AttendanceRecordResponse";

interface AttendanceHistoryProps {
  attendance: AttendanceRecordResponse[];
}

// format iso datetime to readable string
const formatCheckedIn = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  attendance,
}) => {
  if (attendance.length === 0) return null;

  return (
    <div className="mb-4 xs:mb-5 sm:mb-6 md:mb-8">
      <h2 className="text-[10px] xs:text-xs font-semibold text-white/40 tracking-widest uppercase mb-2 xs:mb-3 sm:mb-4">
        Attendance
      </h2>

      <div className="border border-white/5 rounded-lg xs:rounded-xl bg-white/[0.02] overflow-hidden">
        {/* table header */}
        <div className="hidden sm:grid grid-cols-3 gap-3 xs:gap-4 px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 border-b border-white/5 text-[8px] xs:text-[9px] sm:text-[10px] font-semibold text-white/30 tracking-wider uppercase">
          <span>Session</span>
          <span>Date</span>
          <span>Checked In</span>
        </div>

        {/* rows */}
        {attendance.map((record) => (
          <div
            key={record.attendanceId}
            className="grid grid-cols-1 sm:grid-cols-3 gap-1 xs:gap-1.5 sm:gap-4 px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-3 border-b border-white/5 last:border-0"
          >
            <div>
              <span className="text-xs xs:text-sm text-white font-medium truncate block">
                {record.sessionName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2">
              <span className="sm:hidden text-[8px] xs:text-[9px] text-white/30 uppercase font-bold">
                Date:
              </span>
              <span className="text-[11px] xs:text-xs text-white/50 truncate">
                {record.sessionDate} &middot; {record.sessionTime}
              </span>
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2">
              <span className="sm:hidden text-[8px] xs:text-[9px] text-white/30 uppercase font-bold">
                At:
              </span>
              <span className="text-[11px] xs:text-xs text-white/50 truncate">
                {formatCheckedIn(record.checkedInAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceHistory;
