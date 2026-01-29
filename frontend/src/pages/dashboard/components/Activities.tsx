import { useEffect, useState } from "react";
import { getAllEvents } from "../../../api/event";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";

const Activities = () => {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load events. Please check your connection and try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const retryFetchEvents = () => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load events. Please check your connection and try again.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  };

  return (
    <div>
      <div className="w-full flex justify-between mb-5">
        <p className="md:text-xl lg:text-4xl font-semibold">Activities</p>
        <p className="text-xs mt-[.3rem] lg:text-lg font-semibold">Read more</p>
      </div>

      {error ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="w-full h-[450px] bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col justify-center items-center p-6">
            <div className="text-red-400 text-center mb-4">
              <svg
                className="w-12 h-12 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="font-semibold mb-2">Failed to Load Events</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={retryFetchEvents}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-full h-[450px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10">
          {/* First big slide */}
          {events.slice(0, 1).map((event) => (
            <div
              key={event.eventId}
              className="w-full h-[450px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center"
            >
              <div className="w-full h-full border-b-2 border-t-2 border-[#727272] rounded-3xl p-6 flex flex-col">
                {event.s3ImageKey && (
                  <img
                    src={S3_BASE_URL + event.s3ImageKey}
                    alt={event.eventName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">
                  {event.eventName}
                </h3>
                <p className="text-gray-300 text-sm mb-4 flex-grow">
                  {event.eventDescription}
                </p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-purple-400">{event.eventType}</span>
                    <span className="text-gray-400">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {event.eventLocation} • {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Second big slide */}
          {events.slice(1, 2).map((event) => (
            <div
              key={event.eventId}
              className="w-full h-[450px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center"
            >
              <div className="w-full h-full border-b-2 border-t-2 border-[#919191] rounded-3xl p-6 flex flex-col">
                {event.s3ImageKey && (
                  <img
                    src={S3_BASE_URL + event.s3ImageKey}
                    alt={event.eventName}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">
                  {event.eventName}
                </h3>
                <p className="text-gray-300 text-sm mb-4 flex-grow">
                  {event.eventDescription}
                </p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-purple-400">{event.eventType}</span>
                    <span className="text-gray-400">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {event.eventLocation} • {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Third column stacked */}
          <div className="w-full space-y-8">
            {events.slice(2, 4).map((event) => (
              <div
                key={event.eventId}
                className="h-[200px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center"
              >
                <div className="w-full h-full border-b-2 border-t-2 border-[#919191] rounded-3xl p-4 flex flex-col">
                  {event.s3ImageKey && (
                    <img
                      src={S3_BASE_URL + event.s3ImageKey}
                      alt={event.eventName}
                      className="w-full h-20 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h4 className="text-lg font-semibold mb-1">
                    {event.eventName}
                  </h4>
                  <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                    {event.eventDescription}
                  </p>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="text-purple-400">{event.eventType}</span>
                      <span className="text-gray-400">
                        {new Date(event.eventDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {event.eventLocation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="w-full h-[450px] bg-gray-500/10 border border-gray-500/20 rounded-xl flex flex-col justify-center items-center p-6">
            <div className="text-gray-400 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="font-semibold mb-2">No Events Available</p>
              <p className="text-sm">
                Stay tuned for upcoming CSP-S activities!
              </p>
            </div>
          </div>
          <div className="w-full h-[450px] bg-gray-500/10 border border-gray-500/20 rounded-xl flex flex-col justify-center items-center p-6">
            <div className="text-gray-400 text-center">
              <svg
                className="w-12 h-12 mx-auto mb-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="font-semibold mb-2">No Events Available</p>
              <p className="text-sm">
                Stay tuned for upcoming CSP-S activities!
              </p>
            </div>
          </div>
          <div className="w-full space-y-8">
            <div className="h-[200px] bg-gray-500/10 border border-gray-500/20 rounded-xl flex flex-col justify-center items-center p-4">
              <div className="text-gray-400 text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="font-semibold text-sm mb-1">
                  No Events Available
                </p>
                <p className="text-xs">
                  Stay tuned for upcoming CSP-S activities!
                </p>
              </div>
            </div>
            <div className="h-[200px] bg-gray-500/10 border border-gray-500/20 rounded-xl flex flex-col justify-center items-center p-4">
              <div className="text-gray-400 text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="font-semibold text-sm mb-1">
                  No Events Available
                </p>
                <p className="text-xs">
                  Stay tuned for upcoming CSP-S activities!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
