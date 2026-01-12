import React, { useState } from "react";
import type { OrderPostRequest } from "../../../../interfaces/order/OrderRequest";

interface ConfirmOrderModalProps {
  open: boolean;
  onClose: () => void;
  /** action to perform the order; modal will await this */
  onConfirmAction: (orderRequest: OrderPostRequest) => Promise<void>;
  orderRequest: OrderPostRequest;
  totalAmount?: number;
  itemsCount?: number;
}

const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  open,
  onClose,
  onConfirmAction,
  orderRequest,
  totalAmount = 0,
  itemsCount = 0,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleConfirm = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await onConfirmAction(orderRequest);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to confirm order");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative z-10 w-11/12 max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-2">Confirm Order</h2>

        <div className="text-sm text-gray-700 space-y-2 mb-4">
          <p>
            <span className="font-medium">Items:</span> {itemsCount}
          </p>
          <p>
            <span className="font-medium">Total:</span> ₱{" "}
            {totalAmount.toFixed(2)}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded mb-3">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
          >
            {isProcessing ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderModal;
