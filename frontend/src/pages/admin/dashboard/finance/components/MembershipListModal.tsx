import React, { useState, useEffect } from "react";
import { getPaginatedStudentMemberships } from "../../../../../api/studentMembership";
import type { StudentMembershipResponse } from "../../../../../interfaces/student/StudentMembership";
import Pagination from "../../../../../components/Pagination";

interface MembershipListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-white/5 rounded ${className}`}></div>
);

/**
 * A modal that displays a paginated list of student memberships in a table format.
 * Features a custom deep blue background and conditional color coding for status.
 * 
 * @param {MembershipListModalProps} props - Component properties.
 * @returns {JSX.Element | null} The rendered table-like modal.
 */
const MembershipListModal: React.FC<MembershipListModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [memberships, setMemberships] = useState<StudentMembershipResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMemberships(0);
    }
  }, [isOpen]);

  const fetchMemberships = async (pageNumber: number) => {
    setLoading(true);
    try {
      const result = await getPaginatedStudentMemberships(pageNumber, 7);
      setMemberships(result.content || []);
      setTotalPages(result.totalPages);
      setTotalElements(result.totalElements);
      setPage(pageNumber);
    } catch (err) {
      console.error("Error fetching paginated memberships:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="relative w-full max-w-4xl bg-[#110e31] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col h-[80vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Membership Records</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">
              Showing {memberships.length} of {totalElements} students
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-all text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#1a1635] text-white/50 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4 border-b border-white/5">Student ID</th>
                <th className="px-8 py-4 border-b border-white/5">Joined Date</th>
                <th className="px-8 py-4 border-b border-white/5">Academic Status</th>
                <th className="px-8 py-4 border-b border-white/5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-8 py-5"><LoadingSkeleton className="h-4 w-24" /></td>
                    <td className="px-8 py-5"><LoadingSkeleton className="h-4 w-32" /></td>
                    <td className="px-8 py-5"><LoadingSkeleton className="h-4 w-40" /></td>
                    <td className="px-8 py-5 text-right"><LoadingSkeleton className="h-6 w-16 ml-auto rounded-full" /></td>
                  </tr>
                ))
              ) : memberships.length > 0 ? (
                memberships.map((m) => (
                  <tr key={m.membershipId} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors">
                        {m.studentId}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-white/60 font-medium">
                        {new Date(m.dateJoined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs text-white/80 font-semibold">
                        {m.active 
                          ? `${m.academicYear}${m.academicYear === 1 ? "st" : m.academicYear === 2 ? "nd" : m.academicYear === 3 ? "rd" : "th"} Year, Sem ${m.semester}`
                          : "—"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        m.active 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-white/5 text-white/30 border-white/10"
                      }`}>
                        {m.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-white/20 text-sm font-medium uppercase tracking-widest italic">No membership records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-8 py-6 bg-black/20 border-t border-white/5 flex items-center justify-between">
          <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest">
            Page {page + 1} of {totalPages}
          </div>
          
          <Pagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={fetchMemberships}
          />
        </div>
      </div>
    </div>
  );
};

export default MembershipListModal;
