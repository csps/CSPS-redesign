import React from "react";
import { BsCameraVideo } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import type { EventResponse } from "../../../interfaces/event/EventResponse";

interface AllEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventResponse[];
  loading?: boolean;
}

const getEventIcon = (eventLocation: string) => {
  return eventLocation.toLowerCase().includes("meet")
    ? BsCameraVideo
    : CiLocationOn;
};

const getEventColor = (index: number) => {
  const colors = [
    "bg-yellow-400",
    "bg-cyan-400",
    "bg-pink-400",
    "bg-purple-400",
  ];
  return colors[index % colors.length];
};

const parseEventDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const AllEventsModal: React.FC<AllEventsModalProps> = ({
  isOpen,
  onClose,
  events,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[80vh] bg-gradient-to-br from-gray-900/80 to-gray-800/80 rounded-3xl border-t-2 border-b-2 border-purple-200/40 backdrop-blur-lg shadow-2xl flex flex-col">
        <div className="flex justify-between items-center border-b-2 border-purple-100/20 py-4 px-6">
          <h2 className="text-xl font-semibold text-white">
            All Upcoming Events
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white font-semibold text-2xl"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto space-y-4 py-4 px-6">
          {loading && <p className="text-gray-400">Loading events...</p>}
          {!loading && events.length === 0 && (
            <p className="text-gray-400">No upcoming events</p>
          )}
          {events.map((event, i) => {
            const EventIcon = getEventIcon(event.eventLocation);
            return (
              <div
                key={event.eventId}
                className="flex items-start gap-3 pb-4 border-b border-purple-100/10 last:border-b-0"
              >
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${getEventColor(i)}`}
                ></div>
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-sm text-white">
                    {event.eventName}
                  </p>
                  <p className="text-xs text-gray-300 font-semibold">
                    {parseEventDate(event.eventDate).toDateString()} &#8226;{" "}
                    {event.startTime} - {event.endTime}
                  </p>
                  <p className="text-xs text-gray-400 flex gap-1 items-center font-semibold">
                    <EventIcon size={14} /> {event.eventLocation}
                  </p>
                  {event.eventDescription && (
                    <p className="text-xs text-gray-400 mt-2">
                      {event.eventDescription}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AllEventsModal;
