import React from "react";
import type { StudentResponse } from "../../../../interfaces/student/StudentResponse";
import type { PaginatedResponse } from "../../../../interfaces/paginated";
import Pagination from "../../../../components/Pagination";

/**
 * Paginated table of non-members (students without active membership).
 * Shows student info, year level, email, admin position, and an action button.
 * The "Grant Membership" action button is only rendered when canEditFinance is true.
 *
 * @param data - paginated response of student records
 * @param loading - whether data is being fetched
 * @param currentPage - current zero-based page index
 * @param onPageChange - callback when the page changes
 * @param canEditFinance - whether the current user has finance edit permissions (RBAC)
 * @param onGrantMembership - callback when Grant Membership button is clicked
 */

interface NonMembersTableProps {
  data: PaginatedResponse<StudentResponse> | null;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
  canEditFinance: boolean;
  onGrantMembership?: (student: StudentResponse) => void;
}

/**
 * Formats an admin position enum to a readable label.
 * e.g. "VP_INTERNAL" → "VP Internal"
 */
const formatPosition = (position?: string | null): string => {
  if (!position) return "—";
  return position
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
};

// Removed SkeletonRow component

const NonMembersTable: React.FC<NonMembersTableProps> = ({
  data,
  loading,
  currentPage,
  onPageChange,
  canEditFinance,
  onGrantMembership,
}) => {
  const students = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const from = currentPage * (data?.size ?? 7) + 1;
  const to = Math.min(from + (data?.numberOfElements ?? 0) - 1, totalElements);

  // empty state
  if (!loading && students.length === 0) {
    return (
      <div className="bg-[#1E1E3F] border border-white/5 rounded-2xl p-16 text-center">
        <h3 className="text-xl font-bold text-white mb-2">No Students Found</h3>
        <p className="text-gray-400 text-sm">
          There are no students matching your current search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Student
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Year Level
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Email
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Admin Position
              </th>
              {canEditFinance && (
                <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase text-center">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5 animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 w-32 bg-white/10 rounded mb-1"></div>
                      <div className="h-3 w-20 bg-white/10 rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-8 bg-white/10 rounded-md"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-40 bg-white/10 rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 w-20 bg-white/10 rounded-full"></div>
                    </td>
                    {canEditFinance && (
                      <td className="px-4 py-4 text-center">
                        <div className="h-8 w-28 bg-white/10 rounded-lg mx-auto"></div>
                      </td>
                    )}
                  </tr>
                ))
              : students.map((s) => (
                  <tr
                    key={s.studentId}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* student name + id */}
                    <td className="px-4 py-4">
                      <p className="text-white font-medium">
                        {s.user.firstName} {s.user.lastName}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {s.studentId}
                      </p>
                    </td>

                    {/* year level */}
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 text-xs font-medium text-zinc-300">
                        {s.yearLevel}
                      </span>
                    </td>

                    {/* email */}
                    <td className="px-4 py-4 text-zinc-400 text-sm">
                      {s.user.email}
                    </td>

                    {/* admin position */}
                    <td className="px-4 py-4">
                      {s.adminPosition ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-purple-500/10 text-purple-400 border-purple-500/20">
                          {formatPosition(s.adminPosition)}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-xs">—</span>
                      )}
                    </td>

                    {/* action — finance only */}
                    {canEditFinance && (
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => onGrantMembership?.(s)}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Grant Membership
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* pagination footer */}
      {totalPages > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-4 border-t border-white/5 gap-3">
          <p className="text-xs text-zinc-500">
            Showing {from}–{to} of {totalElements}
          </p>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default NonMembersTable;
