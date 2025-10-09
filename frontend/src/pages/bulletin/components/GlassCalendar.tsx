import React, { useState } from "react";
import Calendar from "react-calendar";
import { BsCameraVideo } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";

const events = [
  {
    title: "AI Tutorial",
    date: new Date(2025, 8, 13),
    color: "bg-yellow-400",
    time: "9:00 AM",
    icon: CiLocationOn,
    location: "Uc - Main Room 526",
  },
  {
    title: "Java Tutorial",
    date: new Date(2025, 8, 12),
    color: "bg-yellow-400",
    time: "9:00 AM",
    icon: BsCameraVideo,
    location: "Google Meet",
  },
  {
    title: "Acquaintance Party",
    date: new Date(2025, 8, 18),
    color: "bg-cyan-400",
    time: "9:00 AM",
    icon: CiLocationOn,
    location: "Mandani Bay Hotel",
  },
];

const GlassCalendar = () => {
  const [value, setValue] = useState<Date>(new Date());

  return (
    <div className="min-h-screen w-full bg-gradient-to-br  text-white flex flex-col items-center py-10">
      <div className="flex w-full max-w-7xl gap-8 flex-col lg:flex-row">
        {/* Calendar  */}
        <div className="flex-1 p-6 rounded-xl bg-white/5 border-t-2 border-b-2 border-purple-200/40 backdrop-blur-lg shadow-2xl ">
          <Calendar
            onChange={() => setValue(value)}
            value={value}
            className="react-calendar w-full text-white"
            tileContent={({ date, view }) =>
              view === "month" && (
                <div className="flex justify-center mt-1 space-x-[2px]">
                  {events
                    .filter(
                      (event) =>
                        event.date.toDateString() === date.toDateString()
                    )
                    .map((event, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${event.color}`}
                      ></div>
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
              <button className="text-sm text-gray-300 hover:text-white font-semibold">
                View all
              </button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[500px] space-y-4 py-1 px-4">
            <p className="font-semibold">September</p>
            {events.map((event, i) => (
              <div
                key={i}
                className="flex items-start gap-3  pb-3"
              >
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${event.color}`}
                ></div>
                <div className="space-y-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-xs text-gray-300 font-semibold">
                    {event.date.toDateString()} &#8226; {event.time}
                  </p>
                  <p className="text-xs text-gray-400 flex gap-1 items-center font-semibold">
                  <event.icon /> {event.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassCalendar;
