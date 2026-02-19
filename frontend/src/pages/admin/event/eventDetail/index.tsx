import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../../../components/Layout";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";
import { getEventById } from "../../../../api/event";
import {
  getEventSessions,
  getSessionAttendance,
  updateSessionStatus,
} from "../../../../api/eventParticipation";
import type { EventResponse } from "../../../../interfaces/event/EventResponse";
import type { EventSessionResponse } from "../../../../interfaces/event/EventSessionResponse";
import type { AttendanceRecordResponse } from "../../../../interfaces/event/AttendanceRecordResponse";
import QRScannerModal from "./QRScannerModal";
import ViewAttendanceModal from "./ViewAttendanceModal";
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

        // Load attendance for each session
        const attendanceData: Record<number, AttendanceRecordResponse[]> = {};
        for (const session of sessionsData) {
          try {
            attendanceData[session.sessionId] = await getSessionAttendance(
              session.sessionId,
            );
          } catch {
            attendanceData[session.sessionId] = [];
          }
        }
        setSessionAttendance(attendanceData);
      } catch {
        navigate("/admin/event");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [eventId, navigate]);

  const handleQRScanned = async (sessionId: number) => {
    try {
      const attendance = await getSessionAttendance(sessionId);
      setSessionAttendance((prev) => ({
        ...prev,
        [sessionId]: attendance,
      }));
    } catch {
      // Silently fail
    }
  };

  const handleStatusChange = async (
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

      {/* Event Header */}
      <EventHeader event={event} />

      {/* Description */}
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

      {/* Sessions List */}
      <SessionList
        sessions={sessions}
        sessionAttendance={sessionAttendance}
        onScan={(session) => {
          setSelectedSession(session);
          setScannerOpen(true);
        }}
        onViewAttendance={(session) => {
          setSelectedSession(session);
          setViewAttendanceOpen(true);
        }}
      />

      {/* QR Scanner Modal */}
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

      {/* View Attendance Modal */}
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
        />
      )}
    </Layout>
  );
};

export default AdminEventDetailPage;
