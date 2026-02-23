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
 * Adheres to Stripe-inspired design principles: tight tracking, generous spacing, and structural minimalism.
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

  const [newMembership, setNewMembership] = useState<{
    academicYear: number;
    semester: number;
    status: "current" | "future";
  }>({
    academicYear: 1,
    semester: 1,
    status: "current",
  });

  useEffect(() => {
    fetchMemberships();
  }, [student.studentId]);

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

  const handleAddMembership = async () => {
    setIsSubmitting(true);
    try {
      const request: StudentMembershipRequest = {
        studentId: student.studentId,
        active: newMembership.status === "current",
        academicYear: newMembership.academicYear,
        semester: newMembership.semester,
      };

      await createStudentMembership(request);
      toast.success("Membership added successfully");
      setShowAddForm(false);
      setNewMembership({ academicYear: 1, semester: 1, status: "current" });
      await fetchMemberships();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Failed to add membership";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getYearSuffix = (year: number) => {
    if (year === 1) return "st";
    if (year === 2) return "nd";
    if (year === 3) return "rd";
    return "th";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const yearOptions = [1, 2, 3, 4].map((y) => ({
    label: `${y}${getYearSuffix(y)} year`,
    value: y.toString(),
  }));

  const semesterOptions = [
    { label: "1st semester", value: "1" },
    { label: "2nd semester", value: "2" },
  ];

  const statusOptions = [
    { label: "Active", value: "current" },
    { label: "Inactive", value: "future" },
  ];

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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CustomDropdown
                      label="Year"
                      options={yearOptions}
                      value={newMembership.academicYear.toString()}
                      onChange={(val) =>
                        setNewMembership({
                          ...newMembership,
                          academicYear: parseInt(val),
                        })
                      }
                    />
                    <CustomDropdown
                      label="Semester"
                      options={semesterOptions}
                      value={newMembership.semester.toString()}
                      onChange={(val) =>
                        setNewMembership({
                          ...newMembership,
                          semester: parseInt(val),
                        })
                      }
                    />
                    <CustomDropdown
                      label="Status"
                      options={statusOptions}
                      value={newMembership.status}
                      onChange={(val) =>
                        setNewMembership({
                          ...newMembership,
                          status: val as "current" | "future",
                        })
                      }
                    />
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
                  memberships.map((membership) => (
                    <div
                      key={membership.membershipId}
                      className="flex items-center justify-between px-6 py-4 rounded-xl border border-zinc-800 bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <p className="text-zinc-100 text-sm font-semibold tracking-[-0.01em]">
                          {membership.academicYear}
                          {getYearSuffix(membership.academicYear)} year,{" "}
                          {membership.semester}
                          {membership.semester === 1 ? "st" : "nd"} semester
                        </p>
                        <p className="text-zinc-500 text-xs tracking-[-0.01em]">
                          Joined {formatDate(membership.dateJoined)}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold tracking-[-0.01em] ${membership.active ? "text-purple-400" : "text-zinc-600"}`}
                      >
                        {membership.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  ))
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
