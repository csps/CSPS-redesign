import React from "react";
import type { AuditLogResponse } from "../../../../interfaces/audit/AuditLogResponse";
import { AuditAction } from "../../../../enums/AuditAction";

interface AuditLogTableProps {
  logs: AuditLogResponse[];
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ logs }) => {
  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case AuditAction.CREATE:
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case AuditAction.UPDATE:
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case AuditAction.DELETE:
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="p-5 text-sm font-semibold text-white/50 tracking-wide">
              Timestamp
            </th>
            <th className="p-5 text-sm font-semibold text-white/50 tracking-wide">
              Admin
            </th>
            <th className="p-5 text-sm font-semibold text-white/50 tracking-wide">
              Action
            </th>
            <th className="p-5 text-sm font-semibold text-white/50 tracking-wide">
              Resource
            </th>
            <th className="p-5 text-sm font-semibold text-white/50 tracking-wide">
              Description
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-white/30 text-sm">
                No audit logs found.
              </td>
            </tr>
          ) : (
            logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="p-5 text-sm text-white/70 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-5 text-sm font-medium text-white">
                  {log.adminName}
                </td>
                <td className="p-5">
                  <span
                    className={`px-2 py-1 rounded-lg text-xs font-bold border ${getActionColor(
                      log.action
                    )}`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="p-5 text-sm text-white/70">
                  <div className="flex flex-col">
                    <span className="text-white/90 font-medium">
                      {log.resourceType}
                    </span>
                    <span className="text-xs text-white/40 font-mono">
                      {log.resourceId}
                    </span>
                  </div>
                </td>
                <td
                  className="p-5 text-sm text-white/70 max-w-xs truncate"
                  title={log.description}
                >
                  {log.description}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
