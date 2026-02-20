import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../components/Layout";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import { getEventById } from "../../../api/event";
import {
  joinEvent,
  leaveEvent,
  getEventSessions,
  getMyAttendance,
} from "../../../api/eventParticipation";
import type { EventResponse } from "../../../interfaces/event/EventResponse";
import type { EventSessionResponse } from "../../../interfaces/event/EventSessionResponse";
import type { AttendanceRecordResponse } from "../../../interfaces/event/AttendanceRecordResponse";
import { S3_BASE_URL } from "../../../constant";
import { formatDate, formatTimeRange } from "../../../helper/dateUtils";
import SessionList from "./components/SessionList";
import AttendanceHistory from "./components/AttendanceHistory";
import QRCodeModal from "./components/QRCodeModal";

const EventViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = Number(id);

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [sessions, setSessions] = useState<EventSessionResponse[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecordResponse[]>([]);
  const [isParticipant, setIsParticipant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // QR modal state
  const [qrSession, setQrSession] = useState<EventSessionResponse | null>(null);

  // load event data
  useEffect(() => {
    if (!eventId || isNaN(eventId)) {
      navigate("/events");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(eventId);
        setEvent(eventData);

        // try loading sessions and attendance to determine participation
        try {
          const [sessionsData, attendanceData] = await Promise.all([
            getEventSessions(eventId),
            getMyAttendance(eventId),
          ]);
          setSessions(sessionsData);
          setAttendance(attendanceData);
          setIsParticipant(true);
        } catch {
          // if sessions/attendance fail, student may not be a participant yet
          setIsParticipant(false);
        }
      } catch {
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId, navigate]);

  // join event handler
  const handleJoinEvent = async () => {
    setJoining(true);
    setJoinError(null);
    try {
      await joinEvent(eventId);
      setIsParticipant(true);
      const [sessionsData, attendanceData] = await Promise.all([
        getEventSessions(eventId),
        getMyAttendance(eventId),
      ]);
      setSessions(sessionsData);
      setAttendance(attendanceData);
    } catch (err: any) {
      if (err.response?.status === 409) {
        // already joined
        setIsParticipant(true);
        const [sessionsData, attendanceData] = await Promise.all([
          getEventSessions(eventId),
          getMyAttendance(eventId),
        ]);
        setSessions(sessionsData);
        setAttendance(attendanceData);
      } else {
        setJoinError(err.response?.data?.message || "Failed to join event");
      }
    } finally {
      setJoining(false);
    }
  };

  // leave event handler
  const handleLeaveEvent = async () => {
    setLeaving(true);
    try {
      await leaveEvent(eventId);
      setIsParticipant(false);
      setSessions([]);
      setAttendance([]);
    } catch {
      // silent fail
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <AuthenticatedNav />
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!event) return null;

  return (
    <Layout>
      <AuthenticatedNav />

      {/* back button */}
      <button
        onClick={() => navigate("/events")}
        className="flex items-center gap-1 xs:gap-2 text-white/50 hover:text-white text-xs xs:text-sm font-medium transition-colors mt-3 xs:mt-4 mb-4 xs:mb-5 sm:mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="truncate">Back</span>
      </button>

      {/* event header */}
      <div className="relative rounded-xl xs:rounded-xl sm:rounded-2xl overflow-hidden mb-4 xs:mb-5 sm:mb-6 md:mb-8">
        {event.s3ImageKey && (
          <div className="absolute inset-0">
            <img
              src={`${S3_BASE_URL}${event.s3ImageKey}`}
              alt={event.eventName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
          </div>
        )}
        {!event.s3ImageKey && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black" />
        )}

        <div className="relative p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 min-h-[160px] xs:min-h-[180px] sm:min-h-[220px] flex flex-col justify-end">
          <div className="mb-2 xs:mb-3">
            <span
              className={`inline-block px-2 xs:px-3 py-1 text-[10px] xs:text-xs font-bold rounded-lg ${
                event.eventStatus === "UPCOMING"
                  ? "bg-[#FDE006] text-black"
                  : event.eventStatus === "ACTIVE"
                    ? "bg-green-500 text-white"
                    : "bg-white/10 text-white/80 border border-white/10"
              }`}
            >
              {event.eventStatus}
            </span>
          </div>

          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 xs:mb-3 line-clamp-2">
            {event.eventName}
          </h1>

          <div className="flex flex-col xs:flex-row xs:flex-wrap gap-2 xs:gap-3 sm:gap-4 md:gap-6 text-white/70 text-xs xs:text-sm">
            <div className="flex items-center gap-1 xs:gap-2">
              <svg
                className="w-3 h-3 xs:w-4 xs:h-4 text-purple-400 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span className="truncate">{formatDate(event.eventDate)}</span>
            </div>
            <div className="flex items-center gap-1 xs:gap-2">
              <svg
                className="w-3 h-3 xs:w-4 xs:h-4 text-purple-400 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span className="truncate">
                {formatTimeRange(event.startTime, event.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-1 xs:gap-2">
              <svg
                className="w-3 h-3 xs:w-4 xs:h-4 text-purple-400 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="truncate">{event.eventLocation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* description */}
      {event.eventDescription && (
        <div className="border border-white/5 rounded-lg xs:rounded-xl overflow-hidden bg-white/[0.02] p-3 xs:p-4 sm:p-5 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
          <h2 className="text-[10px] xs:text-xs font-semibold text-white/40 tracking-widest uppercase mb-2 xs:mb-3">
            About
          </h2>
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-6">
            {event.eventDescription}
          </p>
        </div>
      )}

      {/* join section */}
      {!isParticipant && (
        <div className="border border-white/10 rounded-lg xs:rounded-xl bg-white/[0.03] p-3 xs:p-4 sm:p-6 md:p-8 text-center mb-4 xs:mb-5 sm:mb-6 md:mb-8">
          <h3 className="text-base xs:text-lg sm:text-lg font-bold text-white mb-1 xs:mb-2">
            Join this event
          </h3>
          <p className="text-white/50 text-xs xs:text-sm mb-3 xs:mb-4 sm:mb-6 max-w-md mx-auto px-2">
            Register to access sessions and your QR code
          </p>
          {joinError && (
            <p className="text-red-400 text-xs sm:text-sm mb-3 xs:mb-4">
              {joinError}
            </p>
          )}
          <button
            onClick={handleJoinEvent}
            disabled={joining}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 xs:px-6 sm:px-8 py-2 xs:py-2.5 sm:py-3 rounded-lg xs:rounded-xl text-xs sm:text-sm font-bold transition-colors w-full xs:w-auto"
          >
            {joining ? "Joining..." : "Join Event"}
          </button>
        </div>
      )}

      {/* sessions and attendance (participants only) */}
      {isParticipant && (
        <>
          {/* leave event */}
          <div className="flex justify-end mb-3 xs:mb-4">
            <button
              onClick={handleLeaveEvent}
              disabled={leaving}
              className="text-red-400/70 hover:text-red-400 disabled:opacity-50 text-xs xs:text-sm font-medium transition-colors"
            >
              {leaving ? "Leaving..." : "Leave Event"}
            </button>
          </div>

          <SessionList
            sessions={sessions}
            attendance={attendance}
            onViewQR={(session) => setQrSession(session)}
          />
          <AttendanceHistory attendance={attendance} />
        </>
      )}

      {/* QR code modal */}
      {qrSession && (
        <QRCodeModal session={qrSession} onClose={() => setQrSession(null)} />
      )}
    </Layout>
  );
};

export default EventViewPage;
