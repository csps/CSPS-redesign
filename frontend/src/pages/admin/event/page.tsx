import React, { useState } from "react";
import Footer from "../../../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { IoMdAdd } from "react-icons/io";
import { getUpcomingEvents, getPastEvents } from "../../../api/event";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";
import EventDetailModal from "../../events/components/EventDetailModal";
import { formatDate, formatTimeRange } from "../../../helper/dateUtils";
import AddEventModal from "./addEventModal";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import { useEffect } from "react";

interface EventSectionProps {
  refreshTrigger?: number;
}

const UpcomingEvents: React.FC<EventSectionProps> = ({ refreshTrigger }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventResponse | null>(
    null,
  );
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch upcoming events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [refreshTrigger]);

  return (
    <div>
      <EventDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        event={selectedEvent}
      />

      <p className="text-lg w-full sm:w-auto md:text-2xl lg:text-3xl font-semibold flex mb-10">
        Upcoming Events
      </p>
      <Swiper
        slidesPerView="auto"
        spaceBetween={20}
        pagination={{ clickable: true }}
        modules={[Pagination]}
      >
        {loading ? (
          <SwiperSlide className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60 bg-[#0F033C] border border-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </SwiperSlide>
        ) : events.length === 0 ? (
          <SwiperSlide className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60 bg-[#0F033C] border border-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">No upcoming events</p>
          </SwiperSlide>
        ) : (
          events.map((event) => (
            <SwiperSlide
              key={event.eventId}
              className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[350px] !h-70 bg-[#0F033C] border border-gray-200 rounded-lg overflow-hidden group relative cursor-pointer"
              onClick={() => {
                setSelectedEvent(event);
                setIsOpen(true);
              }}
            >
              {event.s3ImageKey && (
                <img
                  src={`${S3_BASE_URL}${event.s3ImageKey}`}
                  alt={event.eventName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white font-semibold text-sm line-clamp-2 ">
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

const RecentEvents: React.FC<EventSectionProps> = ({ refreshTrigger }) => {
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
  }, [refreshTrigger]);

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
          <SwiperSlide className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60 bg-[#0F033C] border border-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Loading...</p>
          </SwiperSlide>
        ) : events.length === 0 ? (
          <SwiperSlide className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[320px] !h-60 bg-[#0F033C] border border-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">No recent events</p>
          </SwiperSlide>
        ) : (
          events.map((event) => (
            <SwiperSlide
              key={event.eventId}
              className="!w-[180px] sm:!w-[220px] md:!w-[280px] lg:!w-[350px] !h-70 bg-[#0F033C] border border-gray-200 rounded-lg overflow-hidden group relative cursor-pointer"
              onClick={() => {
                setSelectedEvent(event);
                setIsOpen(true);
              }}
            >
              {event.s3ImageKey && (
                <img
                  src={`${S3_BASE_URL}${event.s3ImageKey}`}
                  alt={event.eventName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-100 group-hover:opacity-0 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white font-semibold text-sm line-clamp-2 ">
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

const Page = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEventAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="flex flex-col sm:flex-row items-center justify-between py-10 gap-4 sm:gap-0">
            <button
              onClick={() => setIsOpen(true)}
              className="flex w-full sm:w-auto items-center border px-2 py-4 text-sm rounded-lg hover:bg-white/10 transition cursor-pointer"
            >
              <IoMdAdd className="text-white" />
              <span>Add new Event</span>
            </button>
          </div>

          <div className="mb-10">
            <UpcomingEvents refreshTrigger={refreshTrigger} />
          </div>

          <div className="">
            <RecentEvents refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
      <Footer />

      <AddEventModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onEventAdded={handleEventAdded}
      />
    </>
  );
};

export default Page;
