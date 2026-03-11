import React from "react";
import type { StudentMembershipResponse } from "../../../../interfaces/student/StudentMembership";
import type { PaginatedResponse } from "../../../../interfaces/paginated";
import Pagination from "../../../../components/Pagination";
import {
  CURRENT_YEAR_START,
  CURRENT_YEAR_END,
} from "../../../../components/nav/constants";

/**
 * Paginated table of active members displaying student ID,
 * academic year pass range, date joined, and status badge.
 *
 * @param data        - paginated response of active student memberships
 * @param loading     - whether data is being fetched
 * @param currentPage - current zero-based page index
 * @param onPageChange - callback when the page changes
 */

interface ActiveMembersTableProps {
  data: PaginatedResponse<StudentMembershipResponse> | null;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

/**
 * Formats an ISO date string to a readable short date.
 *
 * @param iso - ISO datetime string
 * @returns formatted date like "Feb 23, 2026"
 */
const formatDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Determines whether a membership belongs to the current academic year.
 *
 * @param yearStart - membership start year
 * @param yearEnd   - membership end year
 * @returns true if the membership matches the current academic year
 */
const isCurrentAcademicYear = (yearStart: number, yearEnd: number): boolean =>
  yearStart === CURRENT_YEAR_START && yearEnd === CURRENT_YEAR_END;

// Removed SkeletonRow component

const ActiveMembersTable: React.FC<ActiveMembersTableProps> = ({
  data,
  loading,
  currentPage,
  onPageChange,
}) => {
  const members = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const from = currentPage * (data?.size ?? 7) + 1;
  const to = Math.min(from + (data?.numberOfElements ?? 0) - 1, totalElements);

  // empty state
  if (!loading && members.length === 0) {
    return (
      <div className="bg-[#1E1E3F] border border-white/5 rounded-2xl p-16 text-center">
        <h3 className="text-xl font-bold text-white mb-2">
          No Active Members
        </h3>
        <p className="text-white/50 max-w-md mx-auto">
          There are no students with active memberships at this time.
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
                Academic Year
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase"> 
                Date Joined
              </th>
              <th className="px-4 py-3 text-xs font-medium text-zinc-500 tracking-wide uppercase"> 
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5 animate-pulse">
                    <td className="px-4 py-4">
                      <div className="h-4 w-24 bg-white/10 rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-20 bg-white/10 rounded-md"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-3 w-16 bg-white/10 rounded"></div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                    </td>
                  </tr>
                ))
              : members.map((m) => (                  <tr
                    key={m.membershipId}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-4">
                      <p className="text-white font-medium">{m.studentId}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white/5 text-sm font-medium text-zinc-300">
                          {m.yearStart}–{m.yearEnd}
                        </span>
                        {isCurrentAcademicYear(m.yearStart, m.yearEnd) && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20">
                            Current
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-zinc-400 text-xs whitespace-nowrap">
                      {formatDate(m.dateJoined)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                        Active
                      </span>
                    </td>
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

export default ActiveMembersTable;
