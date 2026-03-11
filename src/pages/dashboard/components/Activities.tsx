import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents } from "../../../api/event";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";
import EventDetailModal from "../../events/components/EventDetailModal";

const Activities = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const eventsData = await getAllEvents();
        setEvents(eventsData);
      } catch (err: any) {
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventClick = (event: EventResponse) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white ">
            Activities
          </h2>
          <p className="text-white/70 text-[11px] font-medium uppercase mt-1">
            Community Highlights
          </p>
        </div>
        <p
          onClick={() => navigate("/events")}
          className="text-xs lg:text-sm font-bold cursor-pointer text-purple-400 hover:text-purple-300 uppercase"
        >
          Read more
        </p>
      </div>

      {events.length === 0 && (
        <div className="w-full h-[200px] flex items-center justify-center border border-dashed border-zinc-800 rounded-lg">
          <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            No activities available
          </span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full h-[350px] md:h-[400px] lg:h-[520px] bg-white/5 border border-white/20 rounded-[2.5rem] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Featured Events */}
          {events.slice(0, 2).map((event) => (
            <div
              key={event.eventId}
              onClick={() => handleEventClick(event)}
              className="group relative flex flex-col bg-white/15 backdrop-blur-2xl border border-white/20 p-4 md:p-5 rounded-[2.5rem] transition-all duration-500 hover:border-white/40 hover:bg-[#1a1a1a] h-[350px] md:h-[450px] lg:h-[520px] shadow-[0_0_40px_rgba(0,0,0,1)] cursor-pointer"
            >
              {/* Image Container with Inset Contrast */}
              <div className="w-full h-40 md:h-48 lg:h-60 bg-black/60 rounded-[2rem] overflow-hidden border border-white/10 relative shadow-2xl mb-4 md:mb-6">
                {event.s3ImageKey && (
                  <img
                    src={S3_BASE_URL + event.s3ImageKey}
                    alt={event.eventName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                )}
                {/* Gradient overlay to ensure text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>

              {/* Content Area */}
              <div className="flex flex-col flex-grow">
                <p className="text-[10px] md:text-[11px] font-bold text-purple-400 uppercase mb-2">
                  {event.eventType}
                </p>
                <h3 className="text-lg md:text-2xl font-bold text-white mb-2 md:mb-3">
                  {event.eventName}
                </h3>
                <p className="text-white/80 text-xs md:text-sm line-clamp-3 leading-relaxed mb-3 md:mb-4 font-normal">
                  {event.eventDescription}
                </p>

                {/* Footer Metadata - Higher Contrast */}
                <div className="mt-auto pt-3 md:pt-5 border-t border-white/10 flex justify-between items-center">
                  <div className="space-y-0.5">
                    <p className="text-[10px] md:text-[11px] font-bold text-white/60 uppercase">
                      {event.eventLocation}
                    </p>
                    <p className="text-[10px] md:text-[11px] font-medium text-white/40">
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="bg-[#FDE006] text-black px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-[11px] font-black uppercase transition-transform group-hover:scale-105">
                    Details
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Third Column: Stacked Technical High-Contrast Cards */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
            {events.slice(2, 4).map((event) => (
              <div
                key={event.eventId}
                onClick={() => handleEventClick(event)}
                className="group bg-[#121212]/90 backdrop-blur-2xl border border-white/20 p-4 rounded-[2rem] flex flex-col h-[248px] transition-all duration-300 hover:border-white/40 shadow-xl cursor-pointer"
              >
                <div className="flex gap-4 items-start mb-4">
                  <div className="w-16 h-16 shrink-0 bg-black rounded-2xl border border-white/20 overflow-hidden">
                    <img
                      src={S3_BASE_URL + event.s3ImageKey}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-purple-400 uppercase">
                      {event.eventType}
                    </p>
                    <h4 className="text-lg font-bold text-white line-clamp-2">
                      {event.eventName}
                    </h4>
                  </div>
                </div>
                <p className="text-white/70 text-xs line-clamp-2 mb-4 leading-relaxed">
                  {event.eventDescription}
                </p>

                <div className="mt-auto flex justify-between items-center pt-3 border-t border-white/5">
                  <p className="text-[10px] font-bold text-white/50 uppercase">
                    {event.startTime} - {event.endTime}
                  </p>
                  <p className="text-[10px] font-black text-[#FDE006] uppercase">
                    View
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <EventDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
};

export default Activities;
