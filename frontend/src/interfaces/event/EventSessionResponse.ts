// event session response for multi-day event support
export interface EventSessionResponse {
  sessionId: number;
  sessionName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  sessionStatus: "PENDING" | "ACTIVE" | "COMPLETED";
  qrTokenCode: string | null;
}
