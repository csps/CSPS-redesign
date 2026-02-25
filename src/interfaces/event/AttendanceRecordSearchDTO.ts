export interface AttendanceRecordSearchDTO {
  studentId?: string;
  studentName?: string;
  sessionId?: number;
  sessionName?: string;
  eventId?: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: string;
}
