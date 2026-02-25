// event participant response returned after joining an event
export interface EventParticipantResponse {
  participantId: number;
  eventId: number;
  studentId: string;
  studentName: string;
  participationStatus: "JOINED";
  joinedDate: string;
}
