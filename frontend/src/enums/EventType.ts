export const EventType = {
  WORKSHOP: "WORKSHOP",
  SEMINAR: "SEMINAR",
  CONFERENCE: "CONFERENCE",
  PARTY: "PARTY",
  TUTORIAL: "TUTORIAL",
  COMPETITION: "COMPETITION",
  OTHER: "OTHER",
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];
