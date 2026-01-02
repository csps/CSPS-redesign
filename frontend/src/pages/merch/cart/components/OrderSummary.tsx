import React from "react";
import { FaCheck } from "react-icons/fa";
import type { ProductCardProps } from "./ProductCard";

const OrderSummary = ({
  items,
  totalPrice,
}: {
  items: ProductCardProps[];
  totalPrice: number;
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-2xl w-full lg:max-w-md p-8 relative">
      <div className="flex justify-center mb-6">
        <div className="bg-indigo-200 rounded-full p-6">
          <FaCheck className="w-8 h-8 text-indigo-600" strokeWidth={3} />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-center text-purple-900 mb-8">
        Order Summary
      </h1>
      <div className="border-t-2 border-purple-900 mb-6"></div>
      <div className="flex justify-between mb-4">
        <span className="text-purple-900 font-semibold text-sm">Item(s)</span>
        <div className="flex gap-12">
          <span className="text-purple-900 font-semibold text-sm">Qty</span>
          <span className="text-purple-900 font-semibold text-sm">Price</span>
        </div>
      </div>
      <div className="space-y-3 mb-32">
        {items.map((item, index) => (
          <div className="flex justify-between items-center" key={index}>
            <span className="text-gray-800 text-sm">
              {item.name} ({item.size})
            </span>
            <div className="flex gap-16">
              <span className="text-gray-800 text-sm">{item.quantity}</span>
              <span className="text-gray-800 text-sm">₱{item.price}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t-2  border-purple-900 mb-6"></div>
      <div className="flex justify-between items-center mb-8">
        <span className="text-purple-900 font-bold text-lg">Total</span>
        <span className="text-purple-900 font-bold text-lg">{totalPrice}</span>
      </div>
      <div className="border-t-2  border-purple-900 mb-6"></div>

      <button className="w-full bg-white border-2 border-indigo-600 text-indigo-600 rounded-full py-3 px-6 font-semibold hover:bg-indigo-50 transition-colors duration-200">
        Confirm order
      </button>
    </div>
  );
};

export default OrderSummary;
