import React from "react";
import type {
  OrderResponse,
  OrderItemResponse,
} from "../../../../../interfaces/order/OrderResponse";
import StatusCard from "./StatusCard";

interface OrderGroupProps {
  order: OrderResponse;
  // This is used when the list is filtered and we might not have the full OrderResponse
  // But for admin management, we usually want to show the context of the order.
}

const OrderGroup: React.FC<OrderGroupProps> = ({ order }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-[#1E1E3F]/40 border border-white/5 rounded-2xl overflow-hidden mb-8 shadow-lg">
      {/* Order Header */}
      <div className="bg-[#1E1E3F] px-6 py-4 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-2">
          {/* Order ID */}
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">
                Order ID
              </p>
              <p className="text-sm font-bold text-white">#{order.orderId}</p>
            </div>
          </div>

          {/* Student Name */}
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">
                Customer
              </p>
              <p className="text-sm font-bold text-white">
                {order.studentName}
              </p>
            </div>
          </div>

          {/* Order Date */}
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[14px] font-bold text-gray-500 uppercase tracking-widest">
                Order Date
              </p>
              <p className="text-sm font-bold text-white">
                {formatDate(order.orderDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Total Price */}
        <div className="text-right">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Total Amount
          </p>
          <p className="text-xl font-black text-[#FDE006]">
            ₱{order.totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6 space-y-4">
        {order.orderItems.map((item: OrderItemResponse) => (
          <StatusCard key={item.orderItemId} orderItem={item} />
        ))}
      </div>
    </div>
  );
};

export default OrderGroup;
