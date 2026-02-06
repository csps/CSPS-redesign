import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaHistory, FaEnvelope, FaIdCard, FaGraduationCap } from "react-icons/fa";
import { toast } from "sonner";
import type { StudentResponse } from "../../../../interfaces/student/StudentResponse";
import type { StudentMembershipResponse, StudentMembershipRequest } from "../../../../interfaces/student/StudentMembership";
import { getStudentMembershipsByStudentId, createStudentMembership } from "../../../../api/studentMembership";

interface StudentDetailModalProps {
  student: StudentResponse;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
}) => {
  const [memberships, setMemberships] = useState<StudentMembershipResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for new membership
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
      // Sort by date, newest first
      setMemberships(data.sort((a, b) => new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime()));
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
      const errorMessage = error?.response?.data?.message || "Failed to add membership";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#1e1a4a] to-[#151238] rounded-3xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
          >
            <FaTimes size={16} />
          </button>

          <h2 className="text-xl font-bold text-white">Student Details</h2>
          <p className="text-white/50 text-sm mt-1">View and manage student information</p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* Student Info Card */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5 mb-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {student.user.firstName.charAt(0)}{student.user.lastName.charAt(0)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-white truncate">
                  {student.user.firstName} {student.user.middleName ? `${student.user.middleName} ` : ""}{student.user.lastName}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div className="flex items-center gap-2 text-sm">
                    <FaIdCard className="text-purple-400" size={14} />
                    <span className="text-white/50">ID:</span>
                    <span className="text-white font-medium">{student.studentId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FaGraduationCap className="text-purple-400" size={14} />
                    <span className="text-white/50">Year:</span>
                    <span className="text-white font-medium">{student.yearLevel}{getYearSuffix(student.yearLevel)} Year</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm sm:col-span-2">
                    <FaEnvelope className="text-purple-400" size={14} />
                    <span className="text-white/50">Email:</span>
                    <span className="text-white font-medium truncate">{student.user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Membership History Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaHistory className="text-purple-400" size={16} />
                <h4 className="text-white font-semibold">Membership History</h4>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FDE006] text-black text-sm font-semibold hover:brightness-110 transition"
              >
                <FaPlus size={12} />
                Add Membership
              </button>
            </div>

            {/* Add Membership Form */}
            {showAddForm && (
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <h5 className="text-white font-medium mb-4">New Membership</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Academic Year */}
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase mb-2">
                      Academic Year
                    </label>
                    <select
                      value={newMembership.academicYear}
                      onChange={(e) => setNewMembership({ ...newMembership, academicYear: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 [&>option]:bg-[#2a2650] [&>option]:text-white"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>

                  {/* Semester */}
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase mb-2">
                      Semester
                    </label>
                    <select
                      value={newMembership.semester}
                      onChange={(e) => setNewMembership({ ...newMembership, semester: parseInt(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 [&>option]:bg-[#2a2650] [&>option]:text-white"
                    >
                      <option value={1}>1st Semester</option>
                      <option value={2}>2nd Semester</option>
                    </select>
                  </div>

                  {/* Status (Current/Future) */}
                  <div>
                    <label className="block text-white/50 text-xs font-semibold uppercase mb-2">
                      Status
                    </label>
                    <select
                      value={newMembership.status}
                      onChange={(e) => setNewMembership({ ...newMembership, status: e.target.value as "current" | "future" })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 [&>option]:bg-[#2a2650] [&>option]:text-white"
                    >
                      <option value="current">Current (Active)</option>
                      <option value="future">Future (Inactive)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMembership}
                    disabled={isSubmitting}
                    className="px-6 py-2 rounded-xl bg-[#FDE006] text-black text-sm font-semibold hover:brightness-110 transition disabled:opacity-50"
                  >
                    {isSubmitting ? "Adding..." : "Add Membership"}
                  </button>
                </div>
              </div>
            )}

            {/* Membership List */}
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8 text-white/50">Loading memberships...</div>
              ) : memberships.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-2xl">
                  <FaHistory className="mx-auto text-white/20 mb-3" size={32} />
                  <p className="text-white/50">No membership history</p>
                  <p className="text-white/30 text-sm mt-1">Click "Add Membership" to create one</p>
                </div>
              ) : (
                memberships.map((membership) => (
                  <div
                    key={membership.membershipId}
                    className="bg-white/5 rounded-xl p-4 border border-white/5 flex items-center justify-between hover:bg-white/[0.07] transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        membership.active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}>
                        <FaGraduationCap size={18} />
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {membership.academicYear}{getYearSuffix(membership.academicYear)} Year - {membership.semester}{membership.semester === 1 ? "st" : "nd"} Semester
                        </p>
                        <p className="text-white/50 text-sm">
                          Joined: {formatDate(membership.dateJoined)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      membership.active
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}>
                      {membership.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
