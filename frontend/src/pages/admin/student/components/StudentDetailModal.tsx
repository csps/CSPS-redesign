import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaGraduationCap, FaUserShield } from "react-icons/fa";
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
import { usePermissions } from "../../../../hooks/usePermissions";
import GrantAdminAccessModal from "./GrantAdminAccessModal";

interface StudentDetailModalProps {
  student: StudentResponse;
  onClose: () => void;
}

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
  const [showGrantAdminModal, setShowGrantAdminModal] = useState(false);
  const { isExecutive } = usePermissions();

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
      toast.success("Membership added successfully!");
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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-xl bg-gradient-to-b from-[#1e1a4a] to-[#151238] rounded-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  Student Details
                </h2>
                <p className="text-white/50 text-sm mt-1">
                  View and manage student information
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 max-h-[60vh] overflow-y-auto space-y-5">
            {/* Student Info */}
            <div>
              <p className="text-white/40 text-xs uppercase tracking-wider mb-2">
                Student Information
              </p>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {student.user.firstName.charAt(0)}
                    {student.user.lastName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">
                      {student.user.firstName}{" "}
                      {student.user.middleName
                        ? `${student.user.middleName} `
                        : ""}
                      {student.user.lastName}
                    </h3>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm">
                      <span className="text-white/50">
                        ID:{" "}
                        <span className="text-white">{student.studentId}</span>
                      </span>
                      <span className="text-white/50">
                        Year:{" "}
                        <span className="text-white">
                          {student.yearLevel}
                          {getYearSuffix(student.yearLevel)}
                        </span>
                      </span>
                    </div>
                    <p className="text-white/50 text-sm mt-1 truncate">
                      {student.user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Membership History */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/40 text-xs uppercase tracking-wider">
                  Membership History
                </p>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1.5 text-purple-400 text-sm font-medium hover:text-purple-300 transition"
                >
                  <FaPlus size={10} />
                  Add
                </button>
              </div>

              {/* Add Form */}
              {showAddForm && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-white/40 text-xs mb-1.5">
                        Year
                      </label>
                      <select
                        value={newMembership.academicYear}
                        onChange={(e) =>
                          setNewMembership({
                            ...newMembership,
                            academicYear: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 [&>option]:bg-[#1e1a4a] [&>option]:text-white"
                      >
                        <option value={1}>1st</option>
                        <option value={2}>2nd</option>
                        <option value={3}>3rd</option>
                        <option value={4}>4th</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/40 text-xs mb-1.5">
                        Semester
                      </label>
                      <select
                        value={newMembership.semester}
                        onChange={(e) =>
                          setNewMembership({
                            ...newMembership,
                            semester: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 [&>option]:bg-[#1e1a4a] [&>option]:text-white"
                      >
                        <option value={1}>1st</option>
                        <option value={2}>2nd</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white/40 text-xs mb-1.5">
                        Status
                      </label>
                      <select
                        value={newMembership.status}
                        onChange={(e) =>
                          setNewMembership({
                            ...newMembership,
                            status: e.target.value as "current" | "future",
                          })
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 [&>option]:bg-[#1e1a4a] [&>option]:text-white"
                      >
                        <option value="current">Active</option>
                        <option value="future">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 text-white/60 text-sm hover:text-white transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMembership}
                      disabled={isSubmitting}
                      className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </button>
                  </div>
                </div>
              )}

              {/* Membership List */}
              <div className="space-y-2">
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                  </div>
                ) : memberships.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                    <FaGraduationCap
                      className="mx-auto text-white/20 mb-2"
                      size={24}
                    />
                    <p className="text-white/40 text-sm">
                      No membership history
                    </p>
                  </div>
                ) : (
                  memberships.map((membership) => (
                    <div
                      key={membership.membershipId}
                      className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            membership.active
                              ? "bg-green-500/20 text-green-400"
                              : "bg-white/10 text-white/40"
                          }`}
                        >
                          <FaGraduationCap size={14} />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">
                            {membership.academicYear}
                            {getYearSuffix(membership.academicYear)} Year -{" "}
                            {membership.semester}
                            {membership.semester === 1 ? "st" : "nd"} Sem
                          </p>
                          <p className="text-white/40 text-xs">
                            {formatDate(membership.dateJoined)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          membership.active
                            ? "bg-green-500/20 text-green-400"
                            : "bg-white/10 text-white/50"
                        }`}
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
          <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center">
            {isExecutive ? (
              <button
                onClick={() => setShowGrantAdminModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium transition"
              >
                <FaUserShield size={12} />
                Grant Admin Access
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 text-white/60 text-sm font-medium hover:text-white transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Grant Admin Access Modal */}
      <GrantAdminAccessModal
        student={student}
        isOpen={showGrantAdminModal}
        onClose={() => setShowGrantAdminModal(false)}
        onSuccess={() => {}}
      />
    </>
  );
};

export default StudentDetailModal;
