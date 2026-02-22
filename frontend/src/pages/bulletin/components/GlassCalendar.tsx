import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { BsCameraVideo } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import {
  getEventByMonth,
  getUpcomingEvents,
  getUpcomingEventsPaginated,
} from "../../../api/event";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import AllEventsModal from "./AllEventsModal";

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

const GlassCalendar = () => {
  const [value, setValue] = useState<Date>(new Date());
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventResponse[]>([]);
  const [upcomingLoading, setUpcomingLoading] = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const fetchEventsByMonth = async (date: Date) => {
    try {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const data = await getEventByMonth(month, year);
      setEvents(Array.isArray(data) ? data : (data ?? []));
    } catch (err) {
      setEvents([]);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      setUpcomingLoading(true);

      const data = await getUpcomingEventsPaginated(0, 6);

      console.log("Fetched upcoming events:", data);
      setUpcomingEvents(data.content || []);
    } catch (err) {
      setUpcomingEvents([]);
    } finally {
      setUpcomingLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    fetchEventsByMonth(value);
  }, [value.getFullYear(), value.getMonth()]);

  const parseEventDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br  text-white flex flex-col items-center py-10">
      <div className="flex w-full max-w-7xl gap-8 flex-col lg:flex-row">
        {/* Calendar  */}
        <div className="flex-1 p-6 rounded-xl bg-white/5 border-t-2 border-b-2 border-purple-200/40 backdrop-blur-lg shadow-2xl ">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Calendar</h3>
            <select
              value={value.getFullYear()}
              onChange={(e) => {
                const newDate = new Date(
                  parseInt(e.target.value),
                  value.getMonth(),
                );
                setValue(newDate);
              }}
              className="px-3 py-2 text-sm bg-white/10 border border-purple-200/40 rounded-lg text-white font-semibold hover:bg-white/20 transition-colors"
            >
              {Array.from({ length: 10 }, (_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return (
                  <option key={year} value={year} className="bg-gray-900">
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <Calendar
            onActiveStartDateChange={({ activeStartDate }) => {
              if (activeStartDate) {
                setValue(activeStartDate);
              }
            }}
            value={value}
            className="react-calendar w-full text-white"
            tileContent={({ date, view }) =>
              view === "month" && (
                <div className="flex justify-center space-x-[2px]">
                  {events
                    .filter((event) => {
                      const eventDate = parseEventDate(event.eventDate);
                      return eventDate.toDateString() === date.toDateString();
                    })
                    .map((_event, i) => (
                      <div className="-my-1">
                        <div
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full  ${getEventColor(
                            i,
                          )}`}
                        ></div>
                      </div>
                    ))}
                </div>
              )
            }
          />
        </div>

        {/* Upcoming Events  */}
        <div className="w-full lg:w-[320px]  rounded-3xl bg-white/5 border-t-2 border-b border-purple-200/40 backdrop-blur-lg shadow-2xl flex flex-col">
          <div className="flex flex-col  mb-4 border-b-2 border-purple-100/20 py-4 px-4 gap-2">
            <h2 className="text-lg font-semibold">Upcoming Events</h2>
            <div className="w-full flex justify-between">
              <p className="text-sm font-semibold text-gray-300">Next 7 days</p>
              <button
                onClick={() => setShowAllEvents(true)}
                className="text-sm text-gray-300 hover:text-white font-semibold"
              >
                View all
              </button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[500px] space-y-4 py-1 px-4">
            {upcomingLoading && (
              <p className="text-gray-400">Loading events...</p>
            )}
            {!upcomingLoading && upcomingEvents.length === 0 && (
              <p className="text-gray-400">No upcoming events</p>
            )}
            {upcomingEvents.map((event, i) => {
              const EventIcon = getEventIcon(event.eventLocation);
              return (
                <div
                  key={event.eventId}
                  className="flex items-start gap-3 pb-3"
                >
                  <div
                    className={`w-2 h-2 mt-2 rounded-full ${getEventColor(i)}`}
                  ></div>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{event.eventName}</p>
                    <p className="text-xs text-gray-300 font-semibold">
                      {parseEventDate(event.eventDate).toDateString()} &#8226;{" "}
                      {event.startTime}
                    </p>
                    <p className="text-xs text-gray-400 flex gap-1 items-center font-semibold">
                      <EventIcon size={14} /> {event.eventLocation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AllEventsModal
        isOpen={showAllEvents}
        onClose={() => setShowAllEvents(false)}
        events={upcomingEvents}
        loading={upcomingLoading}
      />
    </div>
  );
};

export default GlassCalendar;
