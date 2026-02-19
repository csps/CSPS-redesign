import type { EventParticipantResponse } from "../interfaces/event/EventParticipantResponse";
import type { EventSessionResponse } from "../interfaces/event/EventSessionResponse";
import type { AttendanceRecordResponse } from "../interfaces/event/AttendanceRecordResponse";
import type { EventSessionRequest } from "../interfaces/event/EventSessionRequest";
import type { AttendanceRecordSearchDTO } from "../interfaces/event/AttendanceRecordSearchDTO";
import type { PaginatedResponse } from "../interfaces/paginated";
import api from "./api";

const EVENTS = "event";

// --- student participation endpoints ---

// join an event as a student
export const joinEvent = async (
  eventId: number,
): Promise<EventParticipantResponse> => {
  try {
    const response = await api.post<{ data: EventParticipantResponse }>(
      `${EVENTS}/${eventId}/join`,
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error joining event ${eventId}:`, err);
    throw err;
  }
};

// get all sessions for an event
export const getEventSessions = async (
  eventId: number,
): Promise<EventSessionResponse[]> => {
  try {
    const response = await api.get<{ data: EventSessionResponse[] }>(
      `${EVENTS}/${eventId}/sessions`,
    );
    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) return [];
    console.error(`Error fetching sessions for event ${eventId}:`, err);
    throw err;
  }
};

// get sessions filtered by date
export const getSessionsByDate = async (
  eventId: number,
  date: string,
): Promise<EventSessionResponse[]> => {
  try {
    const response = await api.get<{ data: EventSessionResponse[] }>(
      `${EVENTS}/${eventId}/sessions/by-date`,
      { params: { date } },
    );
    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) return [];
    console.error(`Error fetching sessions by date:`, err);
    throw err;
  }
};

// get qr token for session check-in
export const getQRToken = async (sessionId: number): Promise<string> => {
  try {
    const response = await api.get<{ data: string }>(
      `${EVENTS}/session/${sessionId}/qr-token`,
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error getting QR token for session ${sessionId}:`, err);
    throw err;
  }
};

// check in to a session with qr token
export const checkInToSession = async (
  sessionId: number,
  qrToken: string,
): Promise<AttendanceRecordResponse> => {
  try {
    const response = await api.post<{ data: AttendanceRecordResponse }>(
      `${EVENTS}/session/${sessionId}/check-in`,
      { qrToken },
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error checking in to session ${sessionId}:`, err);
    throw err;
  }
};

// get student's attendance records for an event
export const getMyAttendance = async (
  eventId: number,
): Promise<AttendanceRecordResponse[]> => {
  try {
    const response = await api.get<{ data: AttendanceRecordResponse[] }>(
      `${EVENTS}/${eventId}/my-attendance`,
    );
    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) return [];
    console.error(`Error fetching attendance for event ${eventId}:`, err);
    throw err;
  }
};

// leave an event as a student
export const leaveEvent = async (eventId: number): Promise<void> => {
  try {
    await api.delete(`${EVENTS}/${eventId}/leave`);
  } catch (err) {
    console.error(`Error leaving event ${eventId}:`, err);
    throw err;
  }
};

// get events the current student has joined
export const getMyJoinedEvents = async (): Promise<
  EventParticipantResponse[]
> => {
  try {
    const response = await api.get<{ data: EventParticipantResponse[] }>(
      `${EVENTS}/my-events`,
    );
    return response.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) return [];
    console.error("Error fetching joined events:", err);
    throw err;
  }
};

// --- admin session management endpoints ---

// create a new session for an event
export const createEventSession = async (
  eventId: number,
  session: EventSessionRequest,
): Promise<EventSessionResponse> => {
  try {
    const response = await api.post<{ data: EventSessionResponse }>(
      `${EVENTS}/${eventId}/session`,
      session,
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error creating session for event ${eventId}:`, err);
    throw err;
  }
};

// update session status (admin)
export const updateSessionStatus = async (
  sessionId: number,
  status: "PENDING" | "ACTIVE" | "COMPLETED",
): Promise<EventSessionResponse> => {
  try {
    const response = await api.put<{ data: EventSessionResponse }>(
      `${EVENTS}/session/${sessionId}/status`,
      null,
      { params: { status } },
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error updating session ${sessionId} status:`, err);
    throw err;
  }
};

// get attendance list for a session (admin)
export const getSessionAttendance = async (
  sessionId: number,
  page: number = 0,
  size: number = 1000,
): Promise<AttendanceRecordResponse[]> => {
  try {
    const response = await api.get<{ data: PaginatedResponse<AttendanceRecordResponse> }>(
      `${EVENTS}/session/${sessionId}/attendance`,
      { params: { page, size } },
    );
    return response.data.data.content || [];
  } catch (err: any) {
    if (err.response?.status === 404) return [];
    console.error(`Error fetching attendance for session ${sessionId}:`, err);
    throw err;
  }
};

// search attendance records (admin)
export const searchAttendanceRecords = async (
  searchDto: AttendanceRecordSearchDTO,
  page: number = 0,
  size: number = 1000,
): Promise<AttendanceRecordResponse[]> => {
  try {
    const response = await api.get<{ data: PaginatedResponse<AttendanceRecordResponse> }>(
      `${EVENTS}/attendance/search`,
      { params: { ...searchDto, page, size } },
    );
    return response.data.data.content || [];
  } catch (err) {
    console.error("Error searching attendance:", err);
    throw err;
  }
};

// get attendance count for a session (admin)
export const getSessionAttendanceCount = async (
  sessionId: number,
): Promise<number> => {
  try {
    const response = await api.get<{ data: number }>(
      `${EVENTS}/session/${sessionId}/attendance/count`,
    );
    return response.data.data;
  } catch (err) {
    console.error(
      `Error fetching attendance count for session ${sessionId}:`,
      err,
    );
    throw err;
  }
};

// remove a participant from an event (admin)
export const removeParticipant = async (
  participantId: number,
): Promise<void> => {
  try {
    await api.delete(`${EVENTS}/participant/${participantId}`);
  } catch (err) {
    console.error(`Error removing participant ${participantId}:`, err);
    throw err;
  }
};

export default {
  joinEvent,
  leaveEvent,
  getMyJoinedEvents,
  getEventSessions,
  getSessionsByDate,
  getQRToken,
  checkInToSession,
  getMyAttendance,
  createEventSession,
  updateSessionStatus,
  getSessionAttendance,
  searchAttendanceRecords,
  getSessionAttendanceCount,
  removeParticipant,
};
