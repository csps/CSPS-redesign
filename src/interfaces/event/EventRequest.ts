import type { EventStatus } from "../../enums/EventStatus";
import type { EventType } from "../../enums/EventType";

export interface EventRequest {
  eventName: string; // Required
  eventDescription: string; // Required, max 500 chars
  eventLocation: string; // Required
  eventDate: string; // Required, yyyy-MM-dd, must be present/future
  startTime: string; // Required, HH:mm:ss
  endTime: string; // Required, HH:mm:ss
  eventType: EventType; // Required
  eventStatus: EventStatus; // Required
}

export interface EventUpdateRequest {
  eventName?: string;
  eventDescription?: string;
  eventLocation?: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  eventType?: EventType;
  eventStatus?: EventStatus;
}

export interface EventResponse {
  eventId: number;
  eventName: string;
  eventDescription: string;
  eventLocation: string;
  eventDate: string; // yyyy-MM-dd
  s3ImageKey: string | null;
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  eventType: EventType;
  eventStatus: EventStatus;
}
