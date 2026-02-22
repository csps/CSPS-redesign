import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiSolidCartAdd } from "react-icons/bi";
import { ClothingSizing } from "../../../../enums/ClothingSizing";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  merchName: string;
  design?: string;
  quantity: number;
  size?: ClothingSizing | null;
  isProcessing?: boolean;
};

const BuyNowModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
  merchName,
  design,
  quantity,
  size,
  isProcessing = false,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={!isProcessing ? onClose : undefined}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-[#1a1635] border border-white/10 rounded-3xl p-8 text-white shadow-2xl z-10"
          >
            <h3 className="text-2xl font-bold mb-4">Confirm Purchase</h3>
            <p className="text-sm text-white/50 mb-6">Review order details below:</p>
            
            <div className="space-y-4 mb-8 bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 bg-purple-500/10 rounded-lg flex items-center justify-center shrink-0 border border-white/5">
                  <BiSolidCartAdd className="text-3xl text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-base mb-2 line-clamp-2">{merchName}</p>
                  {design && (
                    <p className="text-sm text-white/60 mb-1">Design: <span className="text-white/80">{design}</span></p>
                  )}
                  {size && (
                    <p className="text-sm text-white/60 mb-1">Size: <span className="text-white/80">{size}</span></p>
                  )}
                  <p className="text-sm text-white/60">Qty: <span className="text-white/80 font-semibold">{quantity}</span></p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await onConfirm();
                }}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-[#FDE006] text-black font-bold hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Purchase"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyNowModal;
