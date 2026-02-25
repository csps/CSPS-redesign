import React, { useState } from "react";
import { createStudentMembership } from "../../../../api/studentMembership";
import type { StudentResponse } from "../../../../interfaces/student/StudentResponse";
import {
  CURRENT_YEAR_START,
  CURRENT_YEAR_END,
} from "../../../../components/nav/constants";

interface GrantMembershipModalProps {
  isOpen: boolean;
  student: StudentResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal for granting an annual membership pass to a student.
 * Auto-fills with the current academic year and submits yearStart/yearEnd
 * to the backend, which auto-determines the active flag.
 *
 * @param isOpen    - whether the modal is visible
 * @param student   - the student receiving the membership
 * @param onClose   - callback to close the modal
 * @param onSuccess - callback on successful membership creation
 */
const GrantMembershipModal: React.FC<GrantMembershipModalProps> = ({
  isOpen,
  student,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !student) return null;

  const isCurrentYear = true; // Always granting for the current academic year

  const handleSubmit = async () => {
    if (!student) return;

    try {
      setIsLoading(true);
      setError(null);

      await createStudentMembership({
        studentId: student.studentId,
        yearStart: CURRENT_YEAR_START,
        yearEnd: CURRENT_YEAR_END,
      });

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error("failed to grant membership:", err);
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err instanceof Error ? err.message : "Failed to grant membership");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1E1E3F] border border-white/10 rounded-2xl shadow-2xl max-w-md w-full">
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Grant Membership</h2>
            <button
              onClick={handleClose}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            {/* Student Info */}
            <div className="mb-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                Student
              </p>
              <p className="text-white font-medium">
                {student.user.firstName} {student.user.lastName}
              </p>
              <p className="text-xs text-zinc-400 mt-1">{student.studentId}</p>
              <p className="text-xs text-zinc-400 mt-1">{student.user.email}</p>
            </div>

            {/* Academic Year Pass Info */}
            <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"
                  />
                </svg>
                <p className="text-sm font-semibold text-purple-300">
                  Annual Pass
                </p>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {CURRENT_YEAR_START}–{CURRENT_YEAR_END}
              </p>
              {isCurrentYear && (
                <p className="text-xs text-purple-400 mt-1">
                  This is the current academic year — membership will be
                  activated immediately
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-zinc-700 text-zinc-300 hover:text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Granting...
                </>
              ) : (
                "Grant Membership"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GrantMembershipModal;
