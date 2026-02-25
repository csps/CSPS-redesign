import React from "react";

/**
 * Confirmation modal for bulk payment operations.
 * Displays a summary of the batch and asks admin to confirm or cancel.
 *
 * @param isOpen - whether the modal is visible
 * @param onClose - callback to dismiss the modal
 * @param onConfirm - callback when the admin confirms the action
 * @param studentCount - number of students in the batch
 * @param merchName - name of the merch being purchased
 * @param quantity - quantity per student
 * @param submitting - whether the submit request is in progress
 */

interface BulkPaymentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentCount: number;
  merchName: string;
  quantity: number;
  submitting: boolean;
}

const BulkPaymentConfirmModal: React.FC<BulkPaymentConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studentCount,
  merchName,
  quantity,
  submitting,
}) => {
  if (!isOpen) return null;

  const totalOrders = studentCount * quantity;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="bulk-confirm-title"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-[#110e31]  border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 p-8 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <h2
          id="bulk-confirm-title"
          className="text-lg font-semibold text-white mb-2"
        >
          Confirm Bulk Payment
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          You are about to create{" "}
          <span className="text-white font-medium">{totalOrders}</span> order
          {totalOrders !== 1 ? "s" : ""} for{" "}
          <span className="text-purple-400 font-medium">{merchName}</span>.
        </p>

        {/* summary */}
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Students</span>
            <span className="text-white font-medium">{studentCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500">Quantity per student</span>
            <span className="text-white font-medium">{quantity}</span>
          </div>
          <div className="flex justify-between text-sm border-t border-zinc-700/50 pt-2">
            <span className="text-zinc-500">Total items</span>
            <span className="text-white font-bold">{totalOrders}</span>
          </div>
        </div>

        {/* actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 border border-zinc-700 text-zinc-400 hover:text-zinc-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkPaymentConfirmModal;
