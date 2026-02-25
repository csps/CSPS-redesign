import React from "react";
import type { MembershipRatioResponse } from "../../../../interfaces/student/MembershipRatioResponse";
import {
  CURRENT_YEAR_START,
  CURRENT_YEAR_END,
} from "../../../../components/nav/constants";

/**
 * Displays 3-column stat grid (Total Students, Active Members, Non-Members),
 * a current academic year banner, and a full-width progress bar
 * visualizing the membership percentage.
 *
 * @param ratio   - membership ratio data from the API
 * @param loading - whether ratio data is being fetched
 */

interface RatioCardsProps {
  ratio: MembershipRatioResponse | null;
  loading: boolean;
}

const RatioCards: React.FC<RatioCardsProps> = ({ ratio, loading }) => {
  const totalStudents = ratio?.totalStudents ?? 0;
  const paidMembersCount = ratio?.paidMembersCount ?? 0;
  const nonMembersCount = ratio?.nonMembersCount ?? 0;
  const memberPercentage = ratio?.memberPercentage ?? 0;

  return (
    <div className="mb-6">
      {/* Current Academic Year Banner */}
      <div className="mb-4 p-4 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 border border-purple-500/20 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-purple-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-purple-400/60 uppercase tracking-widest">
              Current Academic Year
            </p>
            <p className="text-lg font-bold text-white tracking-tight">
              {CURRENT_YEAR_START}–{CURRENT_YEAR_END}
            </p>
          </div>
        </div>
       
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {/* total students */}
        <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 p-6">
          <p className="text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
            Total Students
          </p>
          {loading ? (
            <div className="h-9 w-20 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-white tracking-tight">
              {totalStudents.toLocaleString()}
            </p>
          )}
        </div>

        {/* active members */}
        <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 p-6">
          <p className="text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
            Active Members
          </p>
          {loading ? (
            <div className="h-9 w-20 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <>
              <p className="text-3xl font-bold text-green-400 tracking-tight">
                {paidMembersCount.toLocaleString()}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {memberPercentage.toFixed(1)}% of total
              </p>
            </>
          )}
        </div>

        {/* non-members */}
        <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 p-6">
          <p className="text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
            Non-Members
          </p>
          {loading ? (
            <div className="h-9 w-20 bg-white/5 rounded-lg animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-red-400 tracking-tight">
              {nonMembersCount.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* progress bar */}
      <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-zinc-500">
            Membership Ratio
          </span>
          {!loading && (
            <span className="text-xs font-medium text-zinc-400">
              {memberPercentage.toFixed(1)}%
            </span>
          )}
        </div>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          {loading ? (
            <div className="h-full w-1/3 bg-white/5 rounded-full animate-pulse" />
          ) : (
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${Math.min(memberPercentage, 100)}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RatioCards;
