import { useEffect, useState } from "react";
import { getAllEvents } from "../../../api/event";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";

const Activities = () => {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <div className="w-full flex justify-between mb-5">
        <p className="md:text-xl lg:text-4xl font-semibold">Activities</p>
        <p className="text-xs mt-[.3rem] lg:text-lg font-semibold">Read more</p>
      </div>
      {loading ? (
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
          <div className="w-full h-[665px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
            <p className="text-gray-400">No events available</p>
          </div>
          <div className="w-full h-[665px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
            <p className="text-gray-400">No events available</p>
          </div>
          <div className="w-full space-y-8">
            <div className="h-[315px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
              <p className="text-gray-400">No events available</p>
            </div>
            <div className="h-[315px] bg-[#BBBBBB]/20 rounded-xl shadow-[1px_-1px_17px_7px_rgba(52,_21,_168,_0.2)] flex justify-center items-center">
              <p className="text-gray-400">No events available</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
