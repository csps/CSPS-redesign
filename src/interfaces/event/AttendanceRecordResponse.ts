// attendance record response for event check-in history
export interface AttendanceRecordResponse {
  attendanceId: number;
  participantId: number;
  studentId: string;
  studentName: string;
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  sessionTime: string;
  checkedInAt: string;
  qrTokenUsed: string;
}
