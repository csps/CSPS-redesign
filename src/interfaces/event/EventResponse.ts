import type { EventStatus } from "../../enums/EventStatus";
import type { EventType } from "../../enums/EventType";

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
