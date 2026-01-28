import React, { useState } from "react";
import StatusCardModal from "./StatusCardModal";
import type { OrderItemResponse } from "../../../../../interfaces/order/OrderResponse";
import { S3_BASE_URL } from "../../../../../constant";

const options = [
  { label: "To be claimed", value: "toBeClaimed", color: "text-yellow-400" },
  { label: "Pending", value: "pending", color: "text-red-500" },
  { label: "Claimed", value: "claimed", color: "text-green-500" },
];

interface StatusCardProps {
  orderItem: OrderItemResponse;
}

const StatusCard: React.FC<StatusCardProps> = ({ orderItem }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(options[0]);
  const [tempStatus, setTempStatus] = useState(selectedStatus);

  const handleSave = () => {
    setSelectedStatus(tempStatus);
    setModalOpen(false);
  };

  const handleCancel = () => {
    setTempStatus(selectedStatus);
    setModalOpen(false);
  };

  return (
    <>
      <div
        className="w-full bg-[#170657] border border-gray-500/90 relative rounded-lg px-6 py-4 cursor-pointer  hover:bg-[#1f096b] transition-colors"
        onClick={() => setModalOpen(true)}
      >
        {/* Index Number - Absolute Position Top Left */}
        <p className="text-white text-base font-bold absolute top-4 left-4">
          #{orderItem.orderId}
        </p>

        {/* Grid Container for Perfect Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* LEFT: Image & Student Info (Span 3/12) */}
          <div className="md:col-span-3 flex flex-col items-center pt-6 md:pt-0">
            <div className="w-[114px] h-[114px] flex items-center justify-center bg-black/20 rounded-sm overflow-hidden mb-3">
              <img
                src={`${S3_BASE_URL}${orderItem.s3ImageKey}`}
                className="w-full h-full object-cover"
                alt={orderItem.merchName}
              />
            </div>
            <p className="text-sm text-gray-200 text-center leading-tight max-w-[150px]">
              {orderItem.studentName} <br />{" "}
              <span className="text-gray-400">{orderItem.studentId}</span>
            </p>
          </div>

          {/* MIDDLE: Product Details (Span 6/12 - Perfectly Centered) */}
          <div className="md:col-span-6 flex flex-col items-center md:items-start text-center md:text-left pl-0 md:pl-8 border-t md:border-t-0 md:border-l border-white/5 py-4 md:py-0">
            <div className="flex items-center gap-4 mb-2">
              <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">
                {orderItem.merchName}
              </h3>
              <span className="text-2xl font-light text-gray-300">
                x{orderItem.quantity}
              </span>
            </div>

            <div className="space-y-0.5">
              {orderItem.design && (
                <p className="text-base text-gray-300">
                  Design:{" "}
                  <span className="text-white font-medium">
                    {orderItem.design}
                  </span>
                </p>
              )}
              {orderItem.size && (
                <p className="text-base text-gray-300">
                  Size:{" "}
                  <span className="text-white font-medium">
                    {orderItem.size}
                  </span>
                </p>
              )}
              {orderItem.color && (
                <p className="text-base text-gray-300">
                  Color:{" "}
                  <span className="text-white font-medium">
                    {orderItem.color}
                  </span>
                </p>
              )}
              <p className="text-base text-gray-300">
                Total Price:{" "}
                <span className="text-white font-medium">
                  {orderItem.totalPrice}
                </span>
              </p>
            </div>
          </div>

          {/* RIGHT: Status (Span 3/12) */}
          <div className="md:col-span-3 flex justify-center md:justify-end items-center">
            <p className="text-white text-base">
              Status:{" "}
              <span className={`font-bold ml-1 ${selectedStatus.color}`}>
                {selectedStatus.label}
              </span>
            </p>
          </div>
        </div>
      </div>

      <StatusCardModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tempStatus={tempStatus}
        onStatusChange={setTempStatus}
        onSave={handleSave}
        onCancel={handleCancel}
        orderItem={orderItem}
      />
    </>
  );
};

export default StatusCard;
