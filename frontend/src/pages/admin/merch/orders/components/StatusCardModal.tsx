import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import StatusDropdown from "./StatusDropdown";
import type { OrderItemResponse } from "../../../../../interfaces/order/OrderResponse";
import { S3_BASE_URL } from "../../../../../constant";

const options = [
  { label: "To be claimed", value: "toBeClaimed", color: "text-yellow-400" },
  { label: "Pending", value: "pending", color: "text-red-500" },
  { label: "Claimed", value: "claimed", color: "text-green-500" },
];

export type StatusOption = (typeof options)[0];

interface StatusCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempStatus: StatusOption;
  onStatusChange: (status: StatusOption) => void;
  onSave: () => void;
  onCancel: () => void;
  orderItem: OrderItemResponse;
}

const StatusCardModal: React.FC<StatusCardModalProps> = ({
  isOpen,
  onClose,
  tempStatus,
  onStatusChange,
  onSave,
  onCancel,
  orderItem,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="w-full max-w-6xl bg-[#1a0960] border border-gray-500 rounded-lg overflow-hidden lg:h-[270px]">
              {/* Main Content Row */}
              <div className="flex flex-col lg:flex-row items-stretch h-full ">
                <div className="text-white text-sm font-medium w-20 p-6">
                  #{orderItem.orderItemId}
                </div>

                {/* Left Section - Image and Student Info */}
                <div className="flex flex-col items-center justify-center bg-[#1a0960] p-6 lg:p-8">
                  <img
                    src={`${S3_BASE_URL}${orderItem.s3ImageKey}`}
                    className="w-[114.7px] h-[114.7px] lg:w-[114.7px] lg:h-[114.7px] object-cover mb-4"
                    alt={orderItem.merchName}
                  />
                  <p className="text-sm text-gray-200 text-center leading-tight max-w-[150px]">
                    {orderItem.studentName} <br />{" "}
                    <span className="text-gray-400">{orderItem.studentId}</span>
                  </p>
                </div>

                {/* Middle Section - Product Details */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-center ">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <h2 className="text-white text-2xl lg:text-3xl font-semibold">
                        {orderItem.merchName}
                      </h2>
                      <span className="text-gray-300 text-xl lg:text-2xl">
                        x{orderItem.quantity}
                      </span>
                    </div>

                    <div className=" text-gray-300">
                      {orderItem.size && (
                        <p className="text-base lg:text-lg">
                          Size: {orderItem.size}
                        </p>
                      )}
                      {orderItem.color && (
                        <p className="text-base lg:text-lg">
                          Color: {orderItem.color}
                        </p>
                      )}
                      {orderItem.design && (
                        <p className="text-base lg:text-lg">
                          Design: {orderItem.design}
                        </p>
                      )}
                      <p className="text-base lg:text-lg font-medium text-white">
                        Total Price: {orderItem.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Section - Status Dropdown */}
                <div className="flex flex-col justify-between p-6 lg:p-8  border-gray-600 bg-[#1a0960] min-w-[200px] lg:min-w-[280px]">
                  <div className="flex-1 flex items-center justify-center lg:justify-start">
                    <StatusDropdown
                      selected={tempStatus}
                      onSelect={onStatusChange}
                    />
                  </div>
                  {/* Buttons */}
                  <div className="flex gap-3 mt-6 justify-end">
                    <button
                      onClick={onCancel}
                      className="px-4 lg:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-base lg:text-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={onSave}
                      className="px-4 lg:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-base lg:text-lg"
                    >
                      Save
                    </button>
                  </div>
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
