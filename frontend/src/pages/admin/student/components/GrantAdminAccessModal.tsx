import React, { useState, useEffect } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import { toast } from "sonner";
import { AdminPosition } from "../../../../enums/AdminPosition";
import { getAvailablePositions, grantAdminAccess } from "../../../../api/admin";
import type { StudentResponse } from "../../../../interfaces/student/StudentResponse";

interface GrantAdminAccessModalProps {
  student: StudentResponse;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Format position enum to readable text
const formatPosition = (position: AdminPosition): string => {
  const formatted = position
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
  
  if (position === "VP_INTERNAL") return "VP Internal";
  if (position === "VP_EXTERNAL") return "VP External";
  if (position === "PIO") return "PIO";
  if (position === "PRO") return "PRO";
  
  return formatted;
};

const GrantAdminAccessModal: React.FC<GrantAdminAccessModalProps> = ({
  student,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [availablePositions, setAvailablePositions] = useState<AdminPosition[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<AdminPosition | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailablePositions();
      setSelectedPosition(null);
      setShowConfirmation(false);
    }
  }, [isOpen]);

  const fetchAvailablePositions = async () => {
    setLoading(true);
    setError(null);
    try {
      const positions = await getAvailablePositions();
      setAvailablePositions(positions);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to load positions";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantAccess = () => {
    if (!selectedPosition) {
      toast.error("Please select a position");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    if (!selectedPosition) return;

    setSubmitting(true);
    try {
      await grantAdminAccess(student.studentId, selectedPosition);
      toast.success(`Admin access granted successfully`);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to grant admin access";
      toast.error(errorMessage);
      setShowConfirmation(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Confirmation Modal
  if (showConfirmation && selectedPosition) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-sm bg-gradient-to-b from-[#1e1a4a] to-[#151238] rounded-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="px-6 py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <FaCheck className="text-purple-400" size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Confirm Admin Access</h3>
            <p className="text-white/60 text-sm">
              You are about to grant <span className="text-white font-medium">{formatPosition(selectedPosition)}</span> access to:
            </p>
            <div className="bg-white/5 rounded-xl px-4 py-3 mt-4 border border-white/10">
              <p className="text-white font-medium">
                {student.user.firstName} {student.user.lastName}
              </p>
              <p className="text-white/50 text-sm">{student.studentId}</p>
            </div>
            <p className="text-white/40 text-xs mt-4">
              A separate admin account will be created for this student.
            </p>
          </div>
          <div className="px-6 py-4 border-t border-white/10 flex gap-3">
            <button
              onClick={() => setShowConfirmation(false)}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {submitting ? "Granting..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-gradient-to-b from-[#1e1a4a] to-[#151238] rounded-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Grant Admin Access</h2>
              <p className="text-white/50 text-sm mt-1">Assign an admin role to this student</p>
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
        <div className="px-6 py-5 space-y-5">
          {/* Student Info */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Student</p>
            <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/10">
              <p className="text-white font-medium">
                {student.user.firstName} {student.user.lastName}
              </p>
              <p className="text-white/50 text-sm">{student.studentId}</p>
            </div>
          </div>

          {/* Position Selection - Grid of Buttons */}
          <div>
            <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Select Position</p>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-4 text-center">
                <p className="text-red-400 text-sm">{error}</p>
                <button onClick={fetchAvailablePositions} className="text-purple-400 text-sm mt-2 hover:underline">
                  Try again
                </button>
              </div>
            ) : availablePositions.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-6 text-center">
                <p className="text-white/50 text-sm">No positions available</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto">
                {availablePositions.map((position) => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => setSelectedPosition(position)}
                    className={`px-3 py-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedPosition === position
                        ? "bg-purple-500/20 border-purple-500 text-purple-300"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    {formatPosition(position)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-white/70 text-sm font-medium hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleGrantAccess}
            disabled={!selectedPosition || loading}
            className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Grant Access
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrantAdminAccessModal;
