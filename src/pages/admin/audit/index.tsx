import { useState, useEffect } from "react";
import Layout from "../../../components/Layout";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import AuditLogTable from "./components/AuditLogTable";
import AuditLogFilters from "./components/AuditLogFilters";
import {
  getAuditLogsByAction,
  getAuditLogsByAdmin,
  getAuditLogsByAdminAndTimeRange,
  getAuditLogsByTimeRange,
} from "../../../api/auditLog";
import type { AuditLogResponse } from "../../../interfaces/audit/AuditLogResponse";
import type { AuditAction } from "../../../enums/AuditAction";

const AuditPage = () => {
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters - Default to last 30 days
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [action, setAction] = useState<AuditAction | "">("");
  const [adminId, setAdminId] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let data: AuditLogResponse[] = [];

      // Logic to determine which endpoint to use based on available filters
      // The backend has disjointed endpoints, so we prioritize the Range endpoint
      // and filter locally if necessary, or use specific endpoints if range is missing.

      const start = startDate ? `${startDate} 00:00:00` : "";
      const end = endDate ? `${endDate} 23:59:59` : "";

      if (adminId && start && end) {
        data = await getAuditLogsByAdminAndTimeRange(
          Number(adminId),
          start,
          end
        );
      } else if (start && end) {
        // If range is present, use it as the primary fetch
        data = await getAuditLogsByTimeRange(start, end);

        // Client-side filter for Action/Admin if they are present
        if (action) {
          data = data.filter((l) => l.action === action);
        }
        if (adminId) {
          data = data.filter((l) => l.adminId === Number(adminId));
        }
      } else if (adminId) {
        data = await getAuditLogsByAdmin(Number(adminId));
        if (action) data = data.filter((l) => l.action === action);
      } else if (action) {
        data = await getAuditLogsByAction(action as AuditAction);
      } else {
        // Fallback safety (shouldn't be reached due to default state)
        data = [];
      }

      // Sort desc by timestamp
      data.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch audit logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []); // Initial load

  return (
    <Layout>
      <AuthenticatedNav />

      <div className="w-full max-w-[95rem] mx-auto pt-8 pb-20 px-6 space-y-8 relative">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white">System Audit Logs</h1>
          <p className="text-white/50">
            Track all administrative actions and system events.
          </p>
        </div>

        <AuditLogFilters
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          action={action}
          setAction={setAction}
          adminId={adminId}
          setAdminId={setAdminId}
          onSearch={fetchLogs}
        />

        <div className="w-full">
          {loading ? (
            <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="w-full">
                <div className="border-b border-white/10 bg-white/5 h-12"></div>
                <div className="divide-y divide-white/5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-16 flex items-center px-5 gap-4 animate-pulse">
                      <div className="h-4 bg-white/5 rounded w-1/6"></div>
                      <div className="h-4 bg-white/5 rounded w-1/6"></div>
                      <div className="h-6 bg-white/5 rounded-lg w-20"></div>
                      <div className="h-4 bg-white/5 rounded w-1/4"></div>
                      <div className="h-4 bg-white/5 rounded w-1/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <AuditLogTable logs={logs} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuditPage;
