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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Overlay - Blur Only */}
      <div
        className="absolute inset-0 backdrop-blur-lg transition-opacity"
        onClick={!isProcessing ? onClose : undefined}
        aria-hidden
      />

      {/* Modal Surface: Glassmorphism with CSPS Dark Purple */}
      <div className="relative z-10 w-full max-w-md bg-[#242050] border border-white/10 rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-purple-500/10 blur-[60px]" />

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Security Icon Badge */}
          <h2 className="text-2xl font-bold text-white mb-2">
            Confirm Purchase
          </h2>
          <p className="text-white/40 text-sm mb-8 leading-relaxed px-4">
            You are about to place an order for{" "}
            <span className="text-white font-bold">
              {itemsCount} item{itemsCount !== 1 ? "s" : ""}
            </span>
            . Please review the total before proceeding.
          </p>

          {/* Pricing Box: Dark Glass with High-Contrast Typography */}
          <div className="w-full border-white/5 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white/30 uppercase">
                Payable Amount
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-white font-medium text-lg uppercase">
                Total
              </span>
              <span className="text-3xl font-bold text-white">
                ₱
                {totalAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {error && (
            <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          {/* Action Buttons: Responsive Stack */}
          <div className="flex flex-col w-full gap-3">
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-[#FDE006] text-black text-sm font-black uppercase hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale cursor-pointer shadow-xl shadow-yellow-500/5 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Order"
              )}
            </button>

            <button
              onClick={onClose}
              disabled={isProcessing}
              className="w-full py-4 rounded-xl bg-transparent border border-white/10 text-white/60 text-sm font-bold hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrderModal;
