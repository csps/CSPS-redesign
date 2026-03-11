import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../../components/Layout";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";
import { getEventById } from "../../../../api/event";
import {
  getEventSessions,
  getSessionAttendance,
  searchAttendanceRecords,
  updateSessionStatus,
} from "../../../../api/eventParticipation";
import type { EventResponse } from "../../../../interfaces/event/EventResponse";
import type { EventSessionResponse } from "../../../../interfaces/event/EventSessionResponse";
import type { AttendanceRecordResponse } from "../../../../interfaces/event/AttendanceRecordResponse";
import type { AttendanceRecordSearchDTO } from "../../../../interfaces/event/AttendanceRecordSearchDTO";
import QRScannerModal from "./components/QRScannerModal";
import ViewAttendanceModal from "./components/ViewAttendanceModal";
import AddSessionModal from "./components/AddSessionModal";
import EventHeader from "./components/EventHeader";
import SessionList from "./components/SessionList";

const AdminEventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const eventId = Number(id);

  const [event, setEvent] = useState<EventResponse | null>(null);
  const [sessions, setSessions] = useState<EventSessionResponse[]>([]);
  const [sessionAttendance, setSessionAttendance] = useState<
    Record<number, AttendanceRecordResponse[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] =
    useState<EventSessionResponse | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [viewAttendanceOpen, setViewAttendanceOpen] = useState(false);
  const [addSessionOpen, setAddSessionOpen] = useState(false);

  useEffect(() => {
    if (!eventId || isNaN(eventId)) {
      navigate("/admin/event");
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        const eventData = await getEventById(eventId);
        setEvent(eventData);

        const sessionsData = await getEventSessions(eventId);
        setSessions(sessionsData);
      } catch {
        navigate("/admin/event");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId, navigate]);

  const fetchSessionAttendance = async (sessionId: number) => {
    try {
      const attendance = await getSessionAttendance(sessionId);
      setSessionAttendance((prev) => ({
        ...prev,
        [sessionId]: attendance,
      }));
    } catch (err) {
      console.error(`Failed to fetch attendance for session ${sessionId}`, err);
    }
  };

  const handleQRScanned = async (sessionId: number) => {
    await fetchSessionAttendance(sessionId);
  };

  const handleSearch = useCallback(
    async (params: AttendanceRecordSearchDTO) => {
      try {
        const results = await searchAttendanceRecords(params);
        if (params.sessionId) {
          setSessionAttendance((prev) => ({
            ...prev,
            [params.sessionId!]: results,
          }));
        }
      } catch (err) {
        console.error("Search failed", err);
      }
    },
    [],
  );

  const handleViewAttendanceClick = (session: EventSessionResponse) => {
    setSelectedSession(session);
    setViewAttendanceOpen(true);
    // Modal will trigger initial search on mount
  };

  const handleScanClick = async (session: EventSessionResponse) => {
    setSelectedSession(session);
    setScannerOpen(true);
    await fetchSessionAttendance(session.sessionId);
  };

  const handleSessionAdded = async () => {
    try {
      const sessionsData = await getEventSessions(eventId);
      setSessions(sessionsData);
    } catch (err) {
      console.error("Failed to refresh sessions", err);
    }
  };

  const handleStatusChange = useCallback(
    async (
      sessionId: number,
      status: "PENDING" | "ACTIVE" | "COMPLETED",
    ) => {
      try {
        const updatedSession = await updateSessionStatus(sessionId, status);
        setSessions((prev) =>
          prev.map((s) => (s.sessionId === sessionId ? updatedSession : s)),
        );

        // update selected session if it's the one being modified
        if (selectedSession?.sessionId === sessionId) {
          setSelectedSession(updatedSession);
        }
      } catch (error) {
        console.error("Failed to update status:", error);
        // You might want to show a toast here
      }
    },
    [selectedSession?.sessionId],
  );

  if (loading) {
    return (
      <Layout>
        <AuthenticatedNav />
        <div className="mt-4 mb-6">
          <div className="h-4 w-16 bg-white/10 rounded animate-pulse"></div>
        </div>
        <div className="w-full h-[160px] xs:h-[180px] sm:h-[220px] rounded-lg xs:rounded-xl sm:rounded-2xl bg-[#1e1a4a]/50 border border-white/5 animate-pulse mb-4 xs:mb-5 sm:mb-6 md:mb-8"></div>
        <div className="border border-white/5 rounded-xl bg-white/[0.02] p-5 mb-8 animate-pulse">
          <div className="h-3 w-16 bg-white/10 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-white/5 rounded"></div>
            <div className="h-4 w-5/6 bg-white/5 rounded"></div>
            <div className="h-4 w-4/6 bg-white/5 rounded"></div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse"></div>
          ))}
        </div>
      </Layout>
    );
  }

  if (!event) return null;

  return (
    <Layout>
      <AuthenticatedNav />

      {/* Back Button */}
      <button
        onClick={() => navigate("/admin/event")}
        className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium transition-colors mt-4 mb-6"
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
        Back
      </button>

      <EventHeader event={event} />

      {event.eventDescription && (
        <div className="border border-white/5 rounded-xl bg-white/[0.02] p-5 mb-8">
          <h2 className="text-xs font-semibold text-white/40 tracking-widest uppercase mb-3">
            About
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            {event.eventDescription}
          </p>
        </div>
      )}

      <SessionList
        sessions={sessions}
        onScan={handleScanClick}
        onViewAttendance={handleViewAttendanceClick}
        onAddSession={() => setAddSessionOpen(true)}
      />

      {scannerOpen && selectedSession && (
        <QRScannerModal
          sessionId={selectedSession.sessionId}
          sessionName={selectedSession.sessionName}
          onClose={() => {
            setScannerOpen(false);
            setSelectedSession(null);
          }}
          onCheckedIn={() => {
            handleQRScanned(selectedSession.sessionId);
          }}
        />
      )}

      {viewAttendanceOpen && selectedSession && (
        <ViewAttendanceModal
          isOpen={viewAttendanceOpen}
          onClose={() => {
            setViewAttendanceOpen(false);
            setSelectedSession(null);
          }}
          session={selectedSession}
          attendance={sessionAttendance[selectedSession.sessionId] || []}
          onStatusChange={handleStatusChange}
          onSearch={handleSearch}
        />
      )}

      {addSessionOpen && (
        <AddSessionModal
          isOpen={addSessionOpen}
          onClose={() => setAddSessionOpen(false)}
          eventId={eventId}
          onSessionAdded={handleSessionAdded}
        />
      )}
    </Layout>
  );
};

export default AdminEventDetailPage;
