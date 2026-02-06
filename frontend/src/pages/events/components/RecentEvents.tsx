import { useState, useEffect } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getPastEvents } from "../../../api/event";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";
import EventDetailModal from "./EventDetailModal";
import { formatDate, formatTimeRange } from "../../../helper/dateUtils";
import { FaHistory, FaCalendarAlt, FaClock, FaArrowRight } from "react-icons/fa";

const RecentEvents = () => {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null,
  );

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getPastEvents();
        setEvents(data);
      } catch (err) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="py-8">
      <EventDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        event={selectedEvent}
      />

      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
      
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
              Recent Events
            </h2>
            <p className="text-white/50 text-sm">Look back at past happenings</p>
          </div>
        </div>
        {events.length > 0 && (
          <button className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-gray-300 transition text-sm font-medium">
            View All <FaArrowRight size={12} />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-gray-500/20 border-t-gray-500 rounded-full animate-spin" />
        </div>
      ) : events.length === 0 ? (
        /* Modern Empty State */
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1a4a]/30 to-[#151238]/30 border border-white/5 p-12 text-center">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FaHistory className="text-white/30" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Past Events</h3>
            <p className="text-white/50 max-w-md mx-auto">
              There are no past events to display yet. Stay tuned for upcoming events!
            </p>
          </div>
        </div>
      ) : (
        <Swiper
          slidesPerView="auto"
          spaceBetween={20}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="!pb-12"
        >
          {events.map((event) => (
            <SwiperSlide
              key={event.eventId}
              className="!w-[280px] sm:!w-[320px] md:!w-[360px] lg:!w-[400px]"
            >
              <div
                onClick={() => {
                  setSelectedEvent(event);
                  setIsOpen(true);
                }}
                className="group relative h-[280px] rounded-2xl overflow-hidden bg-[#1e1a4a]/50 border border-white/5 cursor-pointer hover:border-white/20 transition-all duration-300"
              >
                {/* Image */}
                {event.s3ImageKey && (
                  <img
                    src={`${S3_BASE_URL}${event.s3ImageKey}`}
                    alt={event.eventName}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[30%] group-hover:grayscale-0"
                  />
                )}
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium rounded-lg border border-white/10">
                      PAST EVENT
                    </span>
                  </div>
                  
                  {/* Event Info */}
                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {event.eventName}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm">
                    <div className="flex items-center gap-1.5">
                      <FaCalendarAlt size={12} className="text-gray-400" />
                      <span>{formatDate(event.eventDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FaClock size={12} className="text-gray-400" />
                      <span>{formatTimeRange(event.startTime, event.endTime)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default RecentEvents;
