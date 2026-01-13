import React from "react";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";
import { MdOutlineClose } from "react-icons/md";
import CSPS_IMAGE from "../../../assets/logos/csps_logo 1.png";
import { formatTimeRange, parseEventDate } from "../../../helper/dateUtils";

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventResponse | null;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
}) => {
  if (!isOpen || !event) return null;

  const eventDate = parseEventDate(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden relative bg-black">
        {/* Full-length Background Image Overlay */}
        <div
          className="absolute inset-0 z-0 max-w-[50%]"
          style={{
            backgroundImage: event.s3ImageKey
              ? `url(${S3_BASE_URL}${event.s3ImageKey})`
              : "none",
            backgroundSize: "cover",
            backgroundPosition: "left",
          }}
        >
          {/* Gradient overlay to make text readable: dark on the right, clearer on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/80 to-black"></div>
        </div>

        {/* Content - Layered on top with z-10 */}
        <div className="relative z-10 w-full flex flex-col md:flex-row min-h-[500px]">
          {/* Optional: Empty left spacer if you want the image more visible on the left side */}
          <div className="hidden md:block w-1/3"></div>

          {/* Right Side - Content */}
          <div className="w-full md:w-2/3 flex flex-col overflow-y-auto p-6 md:p-10 max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 text-white hover:text-gray-300 transition-colors text-3xl"
            >
              <MdOutlineClose />
            </button>

            {/* Logo/Icon at top center */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-px bg-white/30"></div>
              <img
                src={CSPS_IMAGE}
                alt="CSPS Logo"
                className="w-20 h-20 flex-shrink-0"
              />
              <div className="flex-1 h-px bg-white/30"></div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-5">
              {event.eventName}
            </h1>

            {/* Separator */}
            <div className="h-1 bg-gradient-to-r from-transparent via-purple-400/90 to-transparent mb-6"></div>

            {/* Event Details */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-white/90 mb-8 justify-center flex-wrap text-center md:text-left">
              <div>
                <p className="text-yellow-400 font-semibold text-sm">DATE</p>
                <p className="text-lg">{formattedDate.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-yellow-400 font-semibold text-sm">TIME</p>
                <p className="text-lg">
                  {formatTimeRange(event.startTime, event.endTime)}
                </p>
              </div>
              <div>
                <p className="text-yellow-400 font-semibold text-sm">
                  LOCATION
                </p>
                <p className="text-lg">{event.eventLocation}</p>
              </div>
            </div>

            {/* Separator */}
            <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent mb-6"></div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Description
              </h2>
              <p className="text-white/80 leading-relaxed text-sm md:text-base">
                {event.eventDescription || "No description available"}
              </p>
            </div>

            {/* Event Type and Status Tags */}
            {(event.eventType || event.eventStatus) && (
              <div className="mt-6 flex gap-4 flex-wrap">
                {event.eventType && (
                  <div className="bg-purple-600/30 border border-purple-400/50 rounded-full px-4 py-2">
                    <p className="text-white/80 text-sm font-semibold">
                      {event.eventType}
                    </p>
                  </div>
                )}
                {event.eventStatus && (
                  <div className="bg-blue-600/30 border border-blue-400/50 rounded-full px-4 py-2">
                    <p className="text-white/80 text-sm font-semibold">
                      {event.eventStatus}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
