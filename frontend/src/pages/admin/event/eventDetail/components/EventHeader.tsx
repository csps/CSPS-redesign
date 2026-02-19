import React, { useState } from "react";
import { S3_BASE_URL } from "../../../../../constant";
import { formatDate, formatTimeRange } from "../../../../../helper/dateUtils";
import type { EventResponse } from "../../../../../interfaces/event/EventResponse";
import EventDetailModal from "../../../../events/components/EventDetailModal";

interface EventHeaderProps {
  event: EventResponse;
}

const EventHeader: React.FC<EventHeaderProps> = ({ event }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden mb-8 group">
        {event.s3ImageKey && (
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setIsDetailOpen(true)}
          >
            <img
              src={`${S3_BASE_URL}${event.s3ImageKey}`}
              alt={event.eventName}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 transition-opacity duration-300 group-hover:opacity-90" />

            {/* Hover overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <span className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                View Details
              </span>
            </div>
          </div>
        )}
        {!event.s3ImageKey && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black" />
        )}

        <div className="relative p-6 md:p-10 min-h-[220px] flex flex-col justify-end pointer-events-none">
          <div className="mb-4">
            <span className="px-3 py-1.5 text-xs font-bold rounded-lg bg-[#FDE006] text-black">
              {event.eventStatus}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
            {event.eventName}
          </h1>

          <div className="flex flex-wrap gap-6 text-white/70 text-sm">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>{formatDate(event.eventDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{formatTimeRange(event.startTime, event.endTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-purple-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{event.eventLocation}</span>
            </div>
          </div>
        </div>
      </div>

      <EventDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        event={event}
      />
    </>
  );
};

export default EventHeader;
