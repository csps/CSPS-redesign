import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getMyEventHistory } from "../../../api/event";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import { S3_BASE_URL } from "../../../constant";
import { formatDate, formatTimeRange } from "../../../helper/dateUtils";
import { FaCalendarAlt, FaClock } from "react-icons/fa";

interface EventHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventHistoryModal: React.FC<EventHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!isOpen) return;

    const fetchEventHistory = async () => {
      try {
        setLoading(true);
        const response = await getMyEventHistory(currentPage, PAGE_SIZE);
        setEvents(response.content || []);
        setTotalPages(response.totalPages);
      } catch {
        setEvents([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchEventHistory();
  }, [currentPage, isOpen]);

  const handleEventClick = (eventId: number) => {
    navigate(`/events/view/${eventId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-[#170657] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
              <h2 className="text-lg font-bold text-white">Event History</h2>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : events.length === 0 ? (
                <div className="flex items-center justify-center py-16 px-6">
                  <p className="text-white/50 text-center">
                    No event history yet. Attend events to see them here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {events.map((event) => (
                    <div
                      key={event.eventId}
                      onClick={() => handleEventClick(event.eventId)}
                      className="flex gap-4 p-4 hover:bg-white/[0.02] transition-colors cursor-pointer group"
                    >
                      {/* Image */}
                      <div className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/40 to-black border border-white/5">
                        {event.s3ImageKey ? (
                          <img
                            src={`${S3_BASE_URL}${event.s3ImageKey}`}
                            alt={event.eventName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-black" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
                          {event.eventName}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-white/50 text-xs mb-2">
                          <div className="flex items-center gap-1.5">
                            <FaCalendarAlt
                              size={10}
                              className="text-purple-400"
                            />
                            <span>{formatDate(event.eventDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FaClock size={10} className="text-purple-400" />
                            <span>
                              {formatTimeRange(event.startTime, event.endTime)}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`inline-block px-2 py-1 text-[10px] font-bold rounded-lg ${
                            event.eventStatus === "UPCOMING"
                              ? "bg-[#FDE006] text-black"
                              : "bg-white/10 text-white/80"
                          }`}
                        >
                          {event.eventStatus}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div className="shrink-0 flex items-center">
                        <svg
                          className="w-5 h-5 text-white/30 group-hover:text-purple-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-white/10 bg-white/[0.02] shrink-0">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Prev
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }).map(
                    (_, i) => {
                      const pageNum = currentPage > 2 ? currentPage - 2 + i : i;
                      if (pageNum >= totalPages) return null;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-purple-600 text-white"
                              : "bg-white/5 text-white/50 hover:bg-white/10"
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventHistoryModal;
