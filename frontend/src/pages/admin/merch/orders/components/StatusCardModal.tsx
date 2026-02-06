import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { OrderItemResponse } from "../../../../../interfaces/order/OrderResponse";
import { S3_BASE_URL } from "../../../../../constant";
import { OrderStatus } from "../../../../../enums/OrderStatus";
import { MerchType } from "../../../../../enums/MerchType";
import { FiX } from "react-icons/fi";
import { statusStyles } from "./StatusCard";

interface StatusCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderItem: OrderItemResponse;
  currentStatus: OrderStatus;
  onStatusUpdate: (status: OrderStatus) => void;
}

const statusOptions = [
  { value: OrderStatus.PENDING, label: "Processing" },
  { value: OrderStatus.TO_BE_CLAIMED, label: "To Be Claimed" },
  { value: OrderStatus.CLAIMED, label: "Claimed" },
];

const StatusCardModal: React.FC<StatusCardModalProps> = ({
  isOpen,
  onClose,
  orderItem,
  currentStatus,
  onStatusUpdate,
}) => {
  const [tempStatus, setTempStatus] = useState<OrderStatus>(currentStatus);
  const [isSaving, setIsSaving] = useState(false);

  const isClothing = orderItem.merchType === MerchType.CLOTHING;
  const hasChanges = tempStatus !== currentStatus;

  const handleSave = async () => {
    if (!hasChanges) return;
    setIsSaving(true);
    await onStatusUpdate(tempStatus);
    setIsSaving(false);
  };

  const handleClose = () => {
    setTempStatus(currentStatus); // Reset temp status on close
    onClose();
  };

  // Reset temp status when modal opens with new current status
  React.useEffect(() => {
    if (isOpen) {
      setTempStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-2xl bg-[#1E1E3F] border border-white/10 rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    ORDER #{orderItem.orderId}
                  </p>
                  <h2 className="text-xl font-bold text-white">
                    Manage Order Status
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Order Details */}
                <div className="flex gap-6 mb-8">
                  {/* Image */}
                  <div className="shrink-0 w-32 h-32 bg-[#151530] rounded-2xl flex items-center justify-center p-3 overflow-hidden border border-white/5">
                    <img
                      src={
                        orderItem.s3ImageKey
                          ? S3_BASE_URL + orderItem.s3ImageKey
                          : ""
                      }
                      alt={orderItem.merchName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      CSPS OFFICIAL • {orderItem.merchType}
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {orderItem.merchName}
                    </h3>
                    <p className="text-2xl font-bold text-[#FDE006] mb-3">
                      ₱{orderItem.totalPrice.toLocaleString()}
                    </p>

                    {/* Details Row */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-400">
                      <p className="text-[11px] font-medium uppercase">
                        Qty:{" "}
                        <span className="text-white font-bold">
                          {orderItem.quantity}
                        </span>
                      </p>
                      {isClothing && orderItem.size && (
                        <p className="text-[11px] font-medium uppercase">
                          Size:{" "}
                          <span className="text-white font-bold">
                            {orderItem.size}
                          </span>
                        </p>
                      )}
                      {isClothing && orderItem.color && (
                        <p className="text-[11px] font-medium uppercase">
                          Color:{" "}
                          <span className="text-white font-bold">
                            {orderItem.color}
                          </span>
                        </p>
                      )}
                      {orderItem.design && (
                        <p className="text-[11px] font-medium uppercase">
                          Design:{" "}
                          <span className="text-white font-bold">
                            {orderItem.design}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Student Info */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-4 mb-6">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    CUSTOMER
                  </p>
                  <p className="text-white font-bold">
                    {orderItem.studentName}
                  </p>
                  <p className="text-white/50 text-sm">{orderItem.studentId}</p>
                </div>

                {/* Status Selection - Button Grid */}
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
                    SELECT STATUS
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {statusOptions.map((option) => {
                      const style = statusStyles[option.value];
                      const isSelected = tempStatus === option.value;

                      return (
                        <button
                          key={option.value}
                          onClick={() => setTempStatus(option.value)}
                          className={`relative px-4 py-4 rounded-xl border-2 transition-all ${
                            isSelected
                              ? `${style.bg} ${style.border} ${style.color}`
                              : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-current" />
                          )}
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center">
                <div>
                  {hasChanges && (
                    <p className="text-[11px] text-yellow-400 font-medium">
                      You have unsaved changes
                    </p>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className={`px-8 py-3 rounded-xl font-bold transition-all ${
                      hasChanges
                        ? "bg-[#FDE006] hover:brightness-110 text-black"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatusCardModal;
