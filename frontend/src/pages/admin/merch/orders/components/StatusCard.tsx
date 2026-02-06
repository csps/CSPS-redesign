import React, { useState } from "react";
import StatusCardModal from "./StatusCardModal";
import type { OrderItemResponse } from "../../../../../interfaces/order/OrderResponse";
import { S3_BASE_URL } from "../../../../../constant";
import { updateOrderItemStatus } from "../../../../../api/order";
import { OrderStatus } from "../../../../../enums/OrderStatus";
import { MerchType } from "../../../../../enums/MerchType";
import { AnimatePresence, motion } from "framer-motion";

export const statusStyles = {
  [OrderStatus.CLAIMED]: {
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  [OrderStatus.TO_BE_CLAIMED]: {
    color: "text-[#FDE006]",
    bg: "bg-[#FDE006]/10",
    border: "border-[#FDE006]/20",
  },
  [OrderStatus.PENDING]: {
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
};

export const statusLabels = {
  [OrderStatus.CLAIMED]: "Claimed",
  [OrderStatus.TO_BE_CLAIMED]: "Ready for Pickup",
  [OrderStatus.PENDING]: "Processing",
};

interface StatusCardProps {
  orderItem: OrderItemResponse;
}

const StatusCard: React.FC<StatusCardProps> = ({ orderItem }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(orderItem.orderStatus as OrderStatus);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    try {
      await updateOrderItemStatus(orderItem.orderItemId, newStatus);
      setCurrentStatus(newStatus);
      setModalOpen(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const isClothing = orderItem.merchType === MerchType.CLOTHING;
  const statusStyle = statusStyles[currentStatus] || statusStyles[OrderStatus.PENDING];

  return (
    <>
      <div
        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-[#1E1E3F] p-4 sm:p-5 border border-white/5 rounded-2xl cursor-pointer hover:bg-[#252552] transition-colors mb-4"
        onClick={() => setModalOpen(true)}
      >
        {/* Image Container */}
        <div className="shrink-0 w-full sm:w-32 sm:h-32 md:w-40 md:h-40 aspect-square sm:aspect-auto bg-[#1E1E3F] rounded-xl sm:rounded-[2rem] flex items-center justify-center p-2 sm:p-4 overflow-hidden border border-white/5">
          <img
            src={orderItem.s3ImageKey ? S3_BASE_URL + orderItem.s3ImageKey : ""}
            alt={orderItem.merchName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Info Content */}
        <div className="flex flex-col flex-1 w-full py-1">
          <div className="flex flex-col sm:flex-row justify-between items-start w-full gap-2 sm:gap-0">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                CSPS OFFICIAL • {orderItem.merchType}
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {orderItem.merchName}
              </h3>

              {/* Status Badge */}
              <div className="pt-1 sm:pt-2">
                <span
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}
                >
                  {statusLabels[currentStatus] || currentStatus}
                </span>
              </div>
            </div>

            {/* Price & Quantity */}
            <div className="text-left sm:text-right w-full sm:w-auto flex sm:flex-col justify-between items-end sm:items-end mt-2 sm:mt-0">
              <p className="text-xl sm:text-2xl font-bold text-white">
                ₱{orderItem.totalPrice.toLocaleString()}
              </p>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                Qty: {orderItem.quantity}
              </p>
            </div>
          </div>

          {/* Row Footer with Details */}
          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-400">
            {isClothing && (
              <>
                <p className="text-[11px] font-medium uppercase">
                  Size:{" "}
                  <span className="text-white font-bold">
                    {orderItem.size || "N/A"}
                  </span>
                </p>
                <p className="text-[11px] font-medium uppercase">
                  Color:{" "}
                  <span className="text-white font-bold">{orderItem.color || "N/A"}</span>
                </p>
              </>
            )}
            {orderItem.design && (
              <p className="text-[11px] font-medium uppercase">
                Design:{" "}
                <span className="text-white font-bold">{orderItem.design}</span>
              </p>
            )}
            <p className="text-[11px] font-medium uppercase">
              Student:{" "}
              <span className="text-white font-bold">
                {orderItem.studentName}
              </span>
            </p>
            <p className="text-[11px] font-medium uppercase">
              Date:{" "}
              <span className="text-white font-bold">
                {new Date(orderItem.createdAt).toLocaleDateString()}
              </span>
            </p>
            <p className="text-[11px] font-medium uppercase ml-0 sm:ml-auto">
              ID: <span className="text-white/40">#{orderItem.orderId}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-green-500/90 border border-green-500 rounded-xl px-6 py-3">
              <p className="text-white text-sm font-semibold">
                Status updated successfully!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <StatusCardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        orderItem={orderItem}
        currentStatus={currentStatus}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
};

export default StatusCard;