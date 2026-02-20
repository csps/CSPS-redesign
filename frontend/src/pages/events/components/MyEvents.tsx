import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyJoinedEvents } from "../../../api/eventParticipation";
import { getEventById } from "../../../api/event";
import type { EventParticipantResponse } from "../../../interfaces/event/EventParticipantResponse";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";
import { formatDate, formatTimeRange } from "../../../helper/dateUtils";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

interface JoinedEvent {
  participant: EventParticipantResponse;
  event: EventResponse | null;
}

const MyEvents = () => {
  const navigate = useNavigate();
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        setLoading(true);
        const participants = await getMyJoinedEvents();
        // fetch event details for each joined event
        const eventsData = await Promise.all(
          participants.map(async (p) => {
            try {
              const event = await getEventById(p.eventId);
              return { participant: p, event };
            } catch {
              return { participant: p, event: null };
            }
          }),
        );
        setJoinedEvents(eventsData.filter((e) => e.event !== null));
      } catch {
        setJoinedEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
          My Events
        </h2>
        <p className="text-white/50 text-sm mb-6">Events you've joined</p>
        <div className="flex items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (joinedEvents.length === 0) return null;

  return (
    <div className="py-8">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
        My Events
      </h2>
      <p className="text-white/50 text-sm mb-6">Events you've joined</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {joinedEvents.map(({ participant, event }) => {
          if (!event) return null;
          return (
            <div
              key={participant.participantId}
              onClick={() => navigate(`/events/view/${event.eventId}`)}
              className="group relative rounded-xl overflow-hidden bg-[#1e1a4a] border border-white/10 cursor-pointer hover:border-purple-500/30 transition-all duration-300"
            >
              {/* image */}
              <div className="relative h-[140px]">
                {event.s3ImageKey ? (
                  <img
                    src={`${S3_BASE_URL}${event.s3ImageKey}`}
                    alt={event.eventName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                {/* status badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg ${
                      event.eventStatus === "UPCOMING"
                        ? "bg-[#FDE006] text-black"
                        : event.eventStatus === "ACTIVE"
                          ? "bg-green-500 text-white"
                          : "bg-white/10 text-white/80"
                    }`}
                  >
                    {event.eventStatus}
                  </span>
                </div>

                {/* joined indicator */}
                <div className="absolute top-3 right-3">
                  <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-green-500/15 text-green-400 border border-green-500/20">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Joined
                  </span>
                </div>
              </div>

              {/* details */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-2 truncate group-hover:text-purple-300 transition-colors">
                  {event.eventName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-white/50 text-xs">
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt size={10} className="text-purple-400" />
                    <span>{formatDate(event.eventDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaClock size={10} className="text-purple-400" />
                    <span>
                      {formatTimeRange(event.startTime, event.endTime)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyEvents;
