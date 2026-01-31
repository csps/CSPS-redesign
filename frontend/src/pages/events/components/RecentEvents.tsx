import { useState, useEffect } from "react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { getPastEvents } from "../../../api/event";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";
import EventDetailModal from "./EventDetailModal";
import { formatDate, formatTimeRange } from "../../../helper/dateUtils";

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
        console.error("Failed to fetch recent events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <EventDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        event={selectedEvent}
      />

      <p className="text-lg md:text-2xl lg:text-3xl font-semibold mb-10">
        Recent Events
      </p>
      <Swiper
        slidesPerView="auto"
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
      >
        {loading ? (
          <SwiperSlide className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </SwiperSlide>
        ) : events.length === 0 ? (
          <SwiperSlide className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60flex items-center justify-center">
            <p className="text-gray-400">No recent events</p>
          </SwiperSlide>
        ) : (
          events.map((event) => (
            <SwiperSlide
              key={event.eventId}
              className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60 bg-[#0F033C] border border-gray-200 rounded-lg overflow-hidden group relative cursor-pointer"
              onClick={() => {
                setSelectedEvent(event);
                setIsOpen(true);
              }}
            >
              {event.s3ImageKey && (
                <img
                  src={`${S3_BASE_URL}${event.s3ImageKey}`}
                  alt={event.eventName}
                  className="w-auto h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white font-semibold text-sm line-clamp-2">
                  {event.eventName}
                </p>
                <p className="text-white font-light text-sm line-clamp-2">
                  {formatDate(event.eventDate)}
                </p>
                <p className="text-white font-light text-sm line-clamp-2">
                  {formatTimeRange(event.startTime, event.endTime)}
                </p>
              </div>
            </SwiperSlide>
          ))
        )}
      </Swiper>
    </div>
  );
};

export default RecentEvents;
