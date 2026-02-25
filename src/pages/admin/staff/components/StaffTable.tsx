import React from "react";
import type { AdminResponseDTO } from "../../../../api/admin";

interface StaffTableProps {
  admins: AdminResponseDTO[];
  onRevoke: (adminId: number) => void;
}

const StaffTable: React.FC<StaffTableProps> = ({ admins, onRevoke }) => {
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="p-5 text-sm font-semibold text-white/50 tracking-wide">
              Name
            </th>
            <th className="p-5 text-sm font-semibold text-white/50 tracking-wide">
              Email
            </th>
            <th className="p-5 text-sm font-semibold text-white/50 tracking-wide">
              Position
            </th>
            <th className="p-5 text-sm font-semibold text-white/50 tracking-wide">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {admins.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-8 text-center text-white/30 text-sm">
                No staff members found.
              </td>
            </tr>
          ) : (
            admins.map((admin) => (
              <tr
                key={admin.adminId}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-white font-bold border border-white/10">
                      {admin.user.firstName.charAt(0)}
                      {admin.user.lastName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {admin.user.firstName} {admin.user.lastName}
                      </div>
                      <div className="text-xs text-white/40">
                        @{admin.user.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-sm text-white/70">{admin.user.email}</td>
                <td className="p-5">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {admin.position}
                  </span>
                </td>
                <td className="p-5">
                  <button
                    onClick={() => onRevoke(admin.adminId)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
