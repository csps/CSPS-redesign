import React from "react";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";
import { MdOutlineClose } from "react-icons/md";
import CSPS_IMAGE from "../../../assets/logos/csps_logo 1.png";
import { formatTimeRange, parseEventDate } from "../../../helper/dateUtils";
import { motion } from "framer-motion";
import LeaveEventModal from "./LeaveEventModal";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventResponse | null;
  onJoin?: (eventId: number) => void;
  onLeave?: (eventId: number) => void;
  isParticipant?: boolean;
  isJoining?: boolean;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  onJoin,
  onLeave,
  isParticipant = false,
  isJoining = false,
}) => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = React.useState(false);

  if (!isOpen || !event) return null;

  const eventDate = parseEventDate(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-2 sm:p-4">
      <LeaveEventModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={() => onLeave?.(event.eventId)}
        eventName={event.eventName}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[95vh] rounded-[32px] overflow-hidden relative bg-[#111827] border border-white/10 shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side: Image Banner (Top on Mobile) */}
        <div className="relative w-full md:w-2/5 h-48 md:h-auto shrink-0 overflow-hidden">
          {event.s3ImageKey ? (
            <img
              src={`${S3_BASE_URL}${event.s3ImageKey}`}
              alt={event.eventName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-black flex items-center justify-center">
              <img src={CSPS_IMAGE} alt="CSPS" className="w-20 opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent md:to-black/20" />
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/20 hover:bg-white/10 text-white transition-all backdrop-blur-md border border-white/5"
          >
            <MdOutlineClose size={24} />
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 md:p-10">
            {/* Header */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#FDE006] text-black text-[10px] font-extrabold rounded-lg uppercase tracking-wider">
                  {event.eventStatus || "Upcoming"}
                </span>
                <span className="px-3 py-1 bg-white/5 text-white/60 text-[10px] font-bold rounded-lg border border-white/10 uppercase tracking-wider">
                  {event.eventType}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
                {event.eventName}
              </h1>

              <div className="w-20 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-8" />

              {/* Logistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] font-bold text-[#FDE006] uppercase tracking-widest mb-1.5">
                    Date
                  </p>
                  <p className="text-sm font-semibold text-white/90">
                    {formattedDate}
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-[10px] font-bold text-[#FDE006] uppercase tracking-widest mb-1.5">
                    Time
                  </p>
                  <p className="text-sm font-semibold text-white/90">
                    {formatTimeRange(event.startTime, event.endTime)}
                  </p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 sm:col-span-1">
                  <p className="text-[10px] font-bold text-[#FDE006] uppercase tracking-widest mb-1.5">
                    Location
                  </p>
                  <p className="text-sm font-semibold text-white/90 truncate">
                    {event.eventLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h2 className="text-sm font-bold text-white/30 uppercase tracking-[0.2em] mb-4">
                About the Event
              </h2>
              <p className="text-white/70 leading-relaxed text-sm sm:text-base font-medium">
                {event.eventDescription || "No description available."}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-6 border-t border-white/5">
              {onJoin && !isParticipant ? (
                <button
                  onClick={() => onJoin(event.eventId)}
                  disabled={isJoining}
                  className="w-full bg-[#FDE006] hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed text-black py-4 rounded-2xl text-sm font-extrabold uppercase tracking-widest transition-all shadow-lg shadow-yellow-500/10 active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isJoining ? (
                    <>
                      <div className="w-5 h-5 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register for Event"
                  )}
                </button>
              ) : isParticipant ? (
                <div className="flex flex-col gap-3 w-full">
                  <div className="w-full py-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-3 text-green-400 font-bold uppercase tracking-widest text-xs">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Already Registered
                  </div>
                  {onLeave && (
                    <button
                      onClick={() => setIsLeaveModalOpen(true)}
                      className="w-full py-3 text-red-400 hover:text-red-300 font-bold uppercase tracking-widest text-xs transition-colors"
                    >
                      Leave Event
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetailModal;
