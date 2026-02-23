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
  canEdit?: boolean;
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
  canEdit = true,
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
    setTempStatus(currentStatus);
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      setTempStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-2xl bg-[#1E1E3F] border border-white/10 rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="relative px-6 py-5 border-b border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Order #{orderItem.orderId}
                  </p>
                  <h2 className="text-xl font-bold text-white">
                    Manage Order Status
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6 mb-8">
                  {/* Image */}
                  <div className="shrink-0 w-32 h-32 bg-black/20 rounded-xl flex items-center justify-center p-2 overflow-hidden border border-white/5">
                    <img
                      src={orderItem.s3ImageKey ? S3_BASE_URL + orderItem.s3ImageKey : ""}
                      alt={orderItem.merchName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">
                      CSPS Official • {orderItem.merchType}
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {orderItem.merchName}
                    </h3>
                    <p className="text-2xl font-bold text-white mb-4">
                      ₱{orderItem.totalPrice.toLocaleString()}
                    </p>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                      <p>Qty: <span className="font-bold text-white">{orderItem.quantity}</span></p>
                      {isClothing && orderItem.size && (
                        <p>Size: <span className="font-bold text-white">{orderItem.size}</span></p>
                      )}
                      {isClothing && orderItem.color && (
                        <p>Color: <span className="font-bold text-white">{orderItem.color}</span></p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Section */}
                <div className="bg-black/20 border border-white/5 rounded-xl p-4 mb-8">
                  <p className="text-xs text-gray-500 mb-2">CUSTOMER</p>
                  <p className="text-white font-bold">{orderItem.studentName}</p>
                  <p className="text-gray-400 text-sm">{orderItem.studentId}</p>
                </div>

                {/* Status Selection */}
                <div>
                  <p className="text-xs text-gray-500 mb-4">
                    {canEdit ? "SELECT STATUS" : "CURRENT STATUS"}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {statusOptions.map((option) => {
                      const style = statusStyles[option.value];
                      const isSelected = tempStatus === option.value;

                      return (
                        <button
                          key={option.value}
                          onClick={() => canEdit && setTempStatus(option.value)}
                          disabled={!canEdit}
                          className={`px-4 py-4 rounded-xl border transition-all text-sm font-bold ${
                            isSelected
                              ? `${style.bg} ${style.border} ${style.color}`
                              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                          }`}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-5 border-t border-white/5 flex justify-end items-center gap-3 bg-black/10">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
                >
                  {canEdit ? "Cancel" : "Close"}
                </button>
                {canEdit && (
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      hasChanges
                        ? "bg-[#FDE006] text-black hover:bg-gray-200"
                        : "bg-[#FDE006]/5 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StatusCardModal;