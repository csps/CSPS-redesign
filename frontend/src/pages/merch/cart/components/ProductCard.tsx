import React, { memo } from "react";
import SAMPLE from "../../../../assets/image 8.png";
import type { CartItemResponse } from "../../../../interfaces/cart/CartItemResponse";
import { MerchType } from "../../../../enums/MerchType";

export type ProductCardProps = {
  cartItem: CartItemResponse;
  isSelected: boolean;
  onToggle: () => void;
};

// Wrap the component in memo to prevent unnecessary re-renders
const ProductCard = memo(
  ({ cartItem, isSelected, onToggle }: ProductCardProps) => {
    const { merchVariant } = cartItem;

    const isClothing = cartItem.merchType === MerchType.CLOTHING;

    return (
      <div className="flex items-center gap-4 group">
        {/* Selection Toggle */}
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded border-2 transition-all cursor-pointer flex items-center justify-center shrink-0
          ${
            isSelected
              ? "bg-purple-500 border-purple-500"
              : "border-white/30 hover:border-white"
          }`}
        >
          {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
        </button>

        {/* Card Content */}
        <div
          className={`flex w-full bg-white/10 justify-between items-center p-6 md:p-10 rounded-3xl transition-all duration-300
        ${
          isSelected
            ? "ring-1 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            : "opacity-60"
        }`}
        >
          <div className="flex justify-center shrink-0">
            <img
              src={SAMPLE}
              alt={cartItem.merchName}
              className="w-[120px] sm:w-[150px] md:w-[180px] h-auto object-contain"
            />
          </div>

          <div className="flex flex-col items-end text-right">
            <div>
              <p className="text-lg sm:text-xl lg:text-3xl font-bold tracking-tight">
                {cartItem.merchName}
              </p>
              <p className="text-sm sm:text-lg text-purple-300">
                Quantity: x{cartItem.quantity}
              </p>

              {isClothing ? (
                <div>
                  <p className="text-sm sm:text-lg text-gray-400">
                    Size: {merchVariant.size || "N/A"}
                  </p>
                  <p className="text-sm sm:text-lg text-gray-400">
                    Color: {merchVariant.color}
                  </p>
                </div>
              ) : (
                <p className="text-sm sm:text-lg text-gray-400">
                  Design: {merchVariant.design}
                </p>
              )}

              <p className="text-sm sm:text-lg">Price: ₱{merchVariant.price}</p>
            </div>

            <div className="mt-4 md:mt-8 text-xl lg:text-3xl font-bold text-white">
              <p>₱{merchVariant.price * cartItem.quantity}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ProductCard;
