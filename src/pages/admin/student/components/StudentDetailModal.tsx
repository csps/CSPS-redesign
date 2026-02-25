import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import type { StudentResponse } from "../../../../interfaces/student/StudentResponse";
import type {
  StudentMembershipResponse,
  StudentMembershipRequest,
} from "../../../../interfaces/student/StudentMembership";
import {
  getStudentMembershipsByStudentId,
  createStudentMembership,
} from "../../../../api/studentMembership";
import { AdminPosition } from "../../../../enums/AdminPosition";
import CustomDropdown from "../../../../components/CustomDropdown";
import {
  CURRENT_YEAR_START,
  CURRENT_YEAR_END,
} from "../../../../components/nav/constants";

interface StudentDetailModalProps {
  student: StudentResponse;
  onClose: () => void;
}

/**
 * Formats a position enum value into a human-readable string.
 *
 * @param {AdminPosition} position - The raw position enum value.
 * @returns {string} A human-readable representation of the position.
 */
const formatPosition = (position: AdminPosition): string => {
  if (position === "VP_INTERNAL") return "VP Internal";
  if (position === "VP_EXTERNAL") return "VP External";
  if (position === "PIO") return "PIO";
  if (position === "PRO") return "PRO";

  return position
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * A modal component for viewing and managing student-specific data.
 * Displays student identity, admin position, and the annual membership
 * history with the ability to add new membership records.
 *
 * @param {StudentDetailModalProps} props - Component properties.
 * @returns {JSX.Element} The rendered modal.
 */
const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
}) => {
  const [memberships, setMemberships] = useState<StudentMembershipResponse[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New membership form state — uses year range instead of academic year + semester
  const [selectedYearRange, setSelectedYearRange] = useState<string>(
    `${CURRENT_YEAR_START}-${CURRENT_YEAR_END}`,
  );

  useEffect(() => {
    fetchMemberships();
  }, [student.studentId]);

  /**
   * Fetches all membership records for the current student, sorted by date joined (newest first).
   */
  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const data = await getStudentMembershipsByStudentId(student.studentId);
      setMemberships(
        data.sort(
          (a, b) =>
            new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime(),
        ),
      );
    } catch (error) {
      console.error("Error fetching memberships:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submits a new membership record for the student. The server auto-determines
   * the active flag based on whether yearStart/yearEnd matches the current academic year.
   */
  const handleAddMembership = async () => {
    setIsSubmitting(true);
    try {
      const [yearStart, yearEnd] = selectedYearRange.split("-").map(Number);

      const request: StudentMembershipRequest = {
        studentId: student.studentId,
        yearStart,
        yearEnd,
      };

      await createStudentMembership(request);
      toast.success(`Membership added for ${yearStart}–${yearEnd}`);
      setShowAddForm(false);
      setSelectedYearRange(`${CURRENT_YEAR_START}-${CURRENT_YEAR_END}`);
      await fetchMemberships();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to add membership";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Formats an ISO date string to a readable short date.
   *
   * @param dateString - ISO datetime string
   * @returns formatted date like "Feb 23, 2026"
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /**
   * Returns the ordinal suffix for a year level number.
   *
   * @param year - year level number (1-4)
   * @returns ordinal suffix string
   */
  const getYearSuffix = (year: number) => {
    if (year === 1) return "st";
    if (year === 2) return "nd";
    if (year === 3) return "rd";
    return "th";
  };

  // Generate academic year range options for the dropdown
  const currentYear = new Date().getFullYear();
  const yearRangeOptions = Array.from({ length: 5 }, (_, i) => {
    const start = currentYear - 2 + i; // from 2 years ago to 2 years ahead
    return {
      label: `${start}–${start + 1}`,
      value: `${start}-${start + 1}`,
    };
  });

  /**
   * Determines the membership status label and style based on its active flag
   * and whether it matches the current academic year.
   *
   * @param m - the membership response
   * @returns an object with label and CSS class
   */
  const getMembershipStatus = (m: StudentMembershipResponse) => {
    if (m.active) {
      return { label: "Active", className: "text-purple-400" };
    }
    if (m.yearStart > CURRENT_YEAR_START) {
      return { label: "Pre-order", className: "text-amber-400" };
    }
    return { label: "Expired", className: "text-zinc-600" };
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-2xl bg-[#110e31] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="px-10 pt-10 pb-6 border-b border-zinc-800 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-[-0.025em] leading-[1.2]">
                Student profile
              </h2>
              <p className="text-zinc-400 text-sm mt-1 tracking-[-0.01em]">
                Manage academic and administrative records
              </p>
            </div>
          </div>
          {/* Content */}
          <div className="px-10 py-10 max-h-[60vh] overflow-y-auto space-y-12 custom-scrollbar">
            {/* Identity Section */}
            <div className="flex items-center justify-center gap-8">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-[-0.025em] leading-[1.2]">
                      {student.user.firstName}{" "}
                      {student.user.middleName
                        ? `${student.user.middleName} `
                        : ""}
                      {student.user.lastName}
                    </h3>
                    <p className="text-zinc-400 text-sm tracking-[-0.01em] mt-1">
                      {student.user.email}
                    </p>
                  </div>
                  {student.adminPosition && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                      {formatPosition(student.adminPosition)}
                    </span>
                  )}
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="text-xs tracking-[-0.01em]">
                    <span className="text-zinc-500 font-medium">
                      Student ID{" "}
                    </span>
                    <span className="text-zinc-200 font-semibold">
                      {student.studentId}
                    </span>
                  </div>
                  <div className="text-xs tracking-[-0.01em]">
                    <span className="text-zinc-500 font-medium">
                      Year level{" "}
                    </span>
                    <span className="text-zinc-200 font-semibold">
                      {student.yearLevel}
                      {getYearSuffix(student.yearLevel)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Memberships Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-zinc-400 tracking-[-0.01em]">
                  Membership history
                </h4>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
                >
                  {showAddForm ? "Cancel" : "Add record"}
                </button>
              </div>

              {showAddForm && (
                <div className="bg-zinc-800/40 rounded-xl p-8 border border-zinc-800 space-y-6 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomDropdown
                      label="Academic Year"
                      options={yearRangeOptions}
                      value={selectedYearRange}
                      onChange={(val) => setSelectedYearRange(val)}
                    />
                    <div className="flex items-end">
                      <div className="w-full">
                        <p className="text-xs text-zinc-500 mb-1.5">
                          Status Preview
                        </p>
                        {selectedYearRange ===
                        `${CURRENT_YEAR_START}-${CURRENT_YEAR_END}` ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-medium text-green-400">
                              Will be activated immediately
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                            <span className="text-xs font-medium text-amber-400">
                              Will be inactive (not current year)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddMembership}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Saving..." : "Save record"}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {loading ? (
                  <div className="py-12 text-center text-zinc-500 text-sm font-medium animate-pulse">
                    Loading records...
                  </div>
                ) : memberships.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-zinc-800 rounded-xl">
                    <p className="text-zinc-500 text-sm font-medium">
                      No history found
                    </p>
                  </div>
                ) : (
                  memberships.map((membership) => {
                    const status = getMembershipStatus(membership);
                    return (
                      <div
                        key={membership.membershipId}
                        className="flex items-center justify-between px-6 py-4 rounded-xl border border-zinc-800 bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-zinc-100 text-sm font-semibold tracking-[-0.01em]">
                              {membership.yearStart}–{membership.yearEnd} Pass
                            </p>
                            {membership.yearStart === CURRENT_YEAR_START &&
                              membership.yearEnd === CURRENT_YEAR_END && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20">
                                  Current
                                </span>
                              )}
                          </div>
                          <p className="text-zinc-500 text-xs tracking-[-0.01em]">
                            Joined {formatDate(membership.dateJoined)}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold tracking-[-0.01em] ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 py-8 border-t border-zinc-800 flex justify-end items-center">
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-lg bg-[#FDE006] text-black text-sm font-medium hover:bg-zinc-700 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetailModal;
