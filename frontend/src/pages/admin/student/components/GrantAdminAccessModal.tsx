import React, { useState, useEffect } from "react";
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

/**
 * Formats a position enum value into a human-readable string.
 * Special cases for acronyms like VP, PIO, and PRO are handled specifically.
 *
 * @param {AdminPosition} position - The raw position enum value from the API.
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
 * A modal component for promoting students to administrative roles.
 * Features a selection stage and a confirmation stage to prevent accidental promotions.
 *
 * @param {GrantAdminAccessModalProps} props - The component props.
 * @returns {JSX.Element | null} The rendered modal or null if not open.
 */
const GrantAdminAccessModal: React.FC<GrantAdminAccessModalProps> = ({
  student,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [availablePositions, setAvailablePositions] = useState<AdminPosition[]>(
    [],
  );
  const [selectedPosition, setSelectedPosition] =
    useState<AdminPosition | null>(null);
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

  /**
   * Fetches available positions from the admin API.
   *
   * @returns {Promise<void>}
   */
  const fetchAvailablePositions = async () => {
    setLoading(true);
    setError(null);
    try {
      const positions = await getAvailablePositions();
      setAvailablePositions(positions);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to load positions";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Transitions to the confirmation view if a position is selected.
   */
  const handleGrantAccess = () => {
    if (!selectedPosition) {
      toast.error("Please select a position");
      return;
    }
    setShowConfirmation(true);
  };

  /**
   * Executes the promotion API call.
   *
   * @returns {Promise<void>}
   */
  const handleConfirm = async () => {
    if (!selectedPosition) return;

    setSubmitting(true);
    try {
      await grantAdminAccess(student.studentId, selectedPosition);
      toast.success("Admin access granted successfully");
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Failed to grant admin access";
      toast.error(errorMessage);
      setShowConfirmation(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Confirmation view
  if (showConfirmation && selectedPosition) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
        <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="px-10 py-12 text-center">
            <h3 className="text-xl font-bold text-white tracking-[-0.025em] mb-4">
              {student.adminPosition ? "Change position" : "Confirm promotion"}
            </h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-10 tracking-[-0.01em]">
              Are you sure you want to {student.adminPosition ? "reassign" : "appoint"}{" "}
              <span className="text-zinc-200 font-semibold">
                {student.user.firstName} {student.user.lastName}
              </span>{" "}
              as{" "}
              <span className="text-purple-400 font-bold">
                {formatPosition(selectedPosition)}
              </span>
              ?
            </p>

            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full py-3 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-500 transition-all disabled:opacity-50"
              >
                {submitting
                  ? "Processing..."
                  : student.adminPosition
                    ? "Confirm change"
                    : "Confirm appointment"}
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={submitting}
                className="w-full py-3 rounded-lg border border-zinc-700 text-zinc-400 text-sm font-medium hover:text-white transition-all disabled:opacity-50"
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Position selection view
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-[#110e31] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-10 py-8 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-[-0.025em]">
              Select position
            </h2>
            <p className="text-zinc-500 text-xs mt-1 font-medium tracking-[-0.01em]">
              Admin appointment
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-sm font-medium transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Content */}
        <div className="p-10 space-y-10">
          {/* Target student info */}
          <div className="flex items-center justify-between gap-6 p-6 rounded-xl bg-zinc-800/40 border border-zinc-800">
            <div>
              <p className="text-zinc-200 font-bold tracking-[-0.01em]">
                {student.user.firstName} {student.user.lastName}
              </p>
              <p className="text-zinc-500 text-xs font-medium tracking-[-0.01em] mt-0.5">
                {student.studentId}
              </p>
            </div>
            {student.adminPosition && (
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                  Current Role
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  {formatPosition(student.adminPosition)}
                </span>
              </div>
            )}
          </div>

          {/* Positions grid */}
          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-zinc-400 tracking-[-0.01em]">
              Available administrative roles
            </h4>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-6 h-6 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
                <span className="text-zinc-500 text-sm font-medium">
                  Loading roles...
                </span>
              </div>
            ) : error ? (
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-8 text-center">
                <p className="text-red-400 text-sm font-medium mb-4">{error}</p>
                <button
                  onClick={fetchAvailablePositions}
                  className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Retry connection
                </button>
              </div>
            ) : availablePositions.length === 0 ? (
              <div className="bg-zinc-800/20 border border-dashed border-zinc-800 rounded-xl py-12 text-center">
                <p className="text-zinc-500 text-sm font-medium">
                  No positions currently available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {availablePositions.map((position) => (
                  <button
                    key={position}
                    type="button"
                    onClick={() => setSelectedPosition(position)}
                    className={`px-5 py-5 rounded-xl border text-sm font-medium transition-all text-left tracking-[-0.01em] ${
                      selectedPosition === position
                        ? "bg-purple-600/10 border-purple-500 text-purple-400 shadow-lg shadow-purple-900/10"
                        : "bg-zinc-800/40 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                    }`}
                  >
                    {formatPosition(position)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action footer */}
        <div className="px-10 py-8 bg-zinc-800/20 border-t border-zinc-800">
          <button
            onClick={handleGrantAccess}
            disabled={!selectedPosition || loading}
            className="w-full py-3.5 rounded-lg bg-[#FDE006] text-black white text-sm font-medium hover:bg-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
          >
            Grant access
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrantAdminAccessModal;
