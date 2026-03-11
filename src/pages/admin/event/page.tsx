import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { IoMdAdd } from "react-icons/io";
import {
  FaCalendarAlt,
  FaClock,
  FaHistory,
  FaArrowRight,
} from "react-icons/fa";
import {
  getPastEvents,
  getUpcomingEventsPaginated,
} from "../../../api/event";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";
import EventDetailModal from "../../events/components/EventDetailModal";
import { formatDate, formatTimeRange } from "../../../helper/dateUtils";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import { usePermissions } from "../../../hooks/usePermissions";

// Components
import AddEventModal from "./components/AddEventModal";
import AddSessionsModal from "./components/AddSessionsModal";
import SuccessModal from "./components/SuccessModal";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getUpcomingEventsPaginated(0, 5);
        setEvents(data.content || []);
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
    <div className="mb-12">
      <EventDetailModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        event={selectedEvent}
      />

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Upcoming Events
            </h2>
            <p className="text-white/50 text-sm">
              {events.length} event{events.length !== 1 ? "s" : ""} scheduled
            </p>
          </div>
        </div>
        {events.length > 3 && (
          <button className="hidden sm:flex items-center gap-2 text-purple-400 hover:text-purple-300 transition text-sm font-medium">
            View All <FaArrowRight size={12} />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex gap-5 overflow-hidden pb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] h-[260px] rounded-2xl bg-[#1e1a4a]/50 border border-white/5 animate-pulse shrink-0">
              <div className="h-full w-full bg-white/5"></div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Modern Empty State */
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1a4a]/50 to-[#151238]/50 border border-white/5 p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FaCalendarAlt className="text-white/30" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Upcoming Events
            </h3>
            <p className="text-white/50 max-w-md mx-auto mb-6">
              There are no upcoming events scheduled. Create a new event to get
              started!
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
                onClick={(e) => {
                  setSelectedEvent(event);

                  e.stopPropagation();
                  navigate(`/admin/event/${event.eventId}`);
                }}
                className="group relative h-[260px] rounded-2xl overflow-hidden bg-[#1e1a4a] border border-white/10 cursor-pointer hover:border-purple-500/30 transition-all duration-300"
              >
                {event.s3ImageKey && (
                  <img
                    src={`${S3_BASE_URL}${event.s3ImageKey}`}
                    alt={event.eventName}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-[#FDE006] text-black text-xs font-bold rounded-lg">
                      UPCOMING
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {event.eventName}
                  </h3>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-white/70 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt size={12} className="text-purple-400" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaClock size={12} className="text-purple-400" />
                        <span>
                          {formatTimeRange(event.startTime, event.endTime)}
                        </span>
                      </div>
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

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              Past Events
            </h2>
            <p className="text-white/50 text-sm">
              {events.length} event{events.length !== 1 ? "s" : ""} completed
            </p>
          </div>
        </div>
        {events.length > 3 && (
          <button className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-gray-300 transition text-sm font-medium">
            View All <FaArrowRight size={12} />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex gap-5 overflow-hidden pb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] h-[260px] rounded-2xl bg-[#1e1a4a]/30 border border-white/5 animate-pulse shrink-0">
              <div className="h-full w-full bg-white/5"></div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        /* Modern Empty State */
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e1a4a]/30 to-[#151238]/30 border border-white/5 p-12 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
              <FaHistory className="text-white/30" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Past Events
            </h3>
            <p className="text-white/50 max-w-md mx-auto">
              There are no past events to display yet. Completed events will
              appear here.
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
                className="group relative h-[260px] rounded-2xl overflow-hidden bg-[#1e1a4a]/50 border border-white/5 cursor-pointer hover:border-white/20 transition-all duration-300"
              >
                {event.s3ImageKey && (
                  <img
                    src={`${S3_BASE_URL}${event.s3ImageKey}`}
                    alt={event.eventName}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale-[30%] group-hover:grayscale-0"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium rounded-lg border border-white/10">
                      COMPLETED
                    </span>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                    {event.eventName}
                  </h3>

                  <div className="flex flex-wrap items-center justify-between gap-3 text-white/60 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <FaCalendarAlt size={12} className="text-gray-400" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <FaClock size={12} className="text-gray-400" />
                        <span>
                          {formatTimeRange(event.startTime, event.endTime)}
                        </span>
                      </div>
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

const Page = () => {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddSessions, setShowAddSessions] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<EventResponse | null>(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { canManageEvents } = usePermissions();

  const handleEventCreated = (event: EventResponse) => {
    setCurrentEvent(event);
    setShowAddEvent(false);
    setShowAddSessions(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSessionsFinished = () => {
    setShowAddSessions(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setCurrentEvent(null);
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-10 gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Event Management
              </h1>
              <p className="text-white/60">
                {canManageEvents
                  ? "Create and manage your organization's events"
                  : "View your organization's events"}
              </p>
            </div>
            {canManageEvents && (
              <button
                onClick={() => {
                  setCurrentEvent(null);
                  setShowAddEvent(true);
                }}
                className="flex items-center gap-2 bg-[#FDE006] text-black px-6 py-3 rounded-xl font-bold hover:brightness-110 transition"
              >
                <IoMdAdd className="text-xl" />
                <span>Add New Event</span>
              </button>
            )}
          </div>

          {/* Events Sections */}
          <UpcomingEvents refreshTrigger={refreshTrigger} />
          <RecentEvents refreshTrigger={refreshTrigger} />
        </div>
      </div>
      <Footer />

      {/* Flow Modals */}
      <AddEventModal
        isOpen={showAddEvent}
        onClose={() => setShowAddEvent(false)}
        onEventCreated={handleEventCreated}
      />

      <AddSessionsModal
        isOpen={showAddSessions}
        onClose={() => setShowAddSessions(false)}
        eventId={currentEvent?.eventId || null}
        eventDate={currentEvent?.eventDate || ""}
        onFinish={handleSessionsFinished}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Event Setup Complete!"
        message={`"${currentEvent?.eventName}" and its sessions have been successfully configured.`}
      />
    </>
  );
};

export default Page;
