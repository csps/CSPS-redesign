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
          className="fixed inset-0 z-[2000] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-[#130318] border border-white/10 rounded-2xl p-6 text-white shadow-xl z-10"
          >
            <h3 className="text-lg font-bold">Confirm Purchase</h3>
            <p className="text-sm text-gray-300 mt-2">You're buying:</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="h-20 w-20 bg-white/5 rounded-md flex items-center justify-center">
                <BiSolidCartAdd className="text-2xl" />
              </div>
              <div>
                <p className="font-semibold">{merchName}</p>
                {design && (
                  <p className="text-sm text-gray-300">Design: {design}</p>
                )}
                {size && <p className="text-sm text-gray-300">Size: {size}</p>}
                <p className="text-sm text-gray-300">Quantity: {quantity}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 rounded-full border border-white/10 text-white/80 hover:bg-white/5 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await onConfirm();
                }}
                disabled={isProcessing}
                className="px-4 py-2 rounded-full bg-[#FDE006] text-black font-semibold hover:bg-[#e6cc05] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Confirm Purchase"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyNowModal;
