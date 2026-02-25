// session request payload for creating new event sessions
export interface EventSessionRequest {
  sessionName: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
}
