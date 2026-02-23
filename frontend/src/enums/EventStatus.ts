export const EventStatus = {
  UPCOMING: "UPCOMING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
} as const;

export type EventStatus = (typeof EventStatus)[keyof typeof EventStatus];
