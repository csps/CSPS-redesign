import { memo } from "react";
import SAMPLE from "../../../../assets/image 8.png";
import { FaCheck } from "react-icons/fa";
import type { CartItemResponse } from "../../../../interfaces/cart/CartItemResponse";
import { MerchType } from "../../../../enums/MerchType";
import { S3_BASE_URL } from "../../../../constant";

export type ProductCardProps = {
  cartItem: CartItemResponse;
  isSelected: boolean;
  onToggle: () => void;
};

const ProductCard = memo(
  ({ cartItem, isSelected, onToggle }: ProductCardProps) => {
    const isClothing = cartItem.merchType === MerchType.CLOTHING;

    return (
      <div className="flex items-center gap-6 group relative">
        {/* Premium Selection Toggle - Desktop */}
        <button
          onClick={onToggle}
          className={`hidden md:flex w-7 h-7 rounded-full border-2 transition-all duration-300 items-center justify-center shrink-0 
        ${
          isSelected
            ? "bg-[#FDE006] border-[#FDE006] shadow-[0_0_15px_rgba(253,224,6,0.3)]"
            : "bg-white/5 border-white/20 hover:border-white/40"
        }`}
        >
          {isSelected && <FaCheck className="w-3 h-3 text-black" />}
        </button>

        {/* Main Card Surface */}
        <div
          className={`flex-1 flex flex-col md:flex-row gap-6 bg-[#242050] border transition-all duration-500 p-5 rounded-[2.5rem] relative
        ${
          isSelected
            ? "border-purple-500/50 shadow-2xl shadow-purple-900/20"
            : "border-white/5 opacity-80 hover:opacity-100 hover:border-white/10"
        }`}
        >
          {/* Premium Selection Toggle - Mobile (inside card) */}
          <button
            onClick={onToggle}
            className={`md:hidden absolute top-4 right-4 w-7 h-7 rounded-full border-2 transition-all duration-300 flex items-center justify-center z-10 
        ${
          isSelected
            ? "bg-[#FDE006] border-[#FDE006] shadow-[0_0_15px_rgba(253,224,6,0.3)]"
            : "bg-white/5 border-white/20 hover:border-white/40"
        }`}
          >
            {isSelected && <FaCheck className="w-3 h-3 text-black" />}
          </button>
          {/* Product Image Container - Inspired by the eStore rounded image blocks */}
          <div className="shrink-0 aspect-square w-32 md:w-44 bg-white/5 border border-white/5 rounded-[2rem] flex items-center justify-center p-4 relative overflow-hidden group-hover:bg-white/10 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-transparent" />
            <img
              src={
                cartItem.s3ImageKey
                  ? `${S3_BASE_URL}${cartItem.s3ImageKey}`
                  : SAMPLE
              }
              alt={cartItem.merchName}
              className="w-full h-full object-contain relative  transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col justify-between flex-1 py-1">
            <div className="flex flex-col md:flex-row justify-between items-start gap-2">
              <div>
                <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">
                  {cartItem.merchType}
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-white ">
                  {cartItem.merchName}
                </h3>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <p className="text-xs font-medium text-white/40 uppercase mb-1">
                    Qty:{" "}
                    <span className="text-white/80">{cartItem.quantity}</span>
                  </p>
                  {isClothing ? (
                    <>
                      <p className="text-xs font-medium text-white/40 uppercase mb-1">
                        Size:{" "}
                        <span className="text-white/80">
                          {cartItem.size || "N/A"}
                        </span>
                      </p>
                      <p className="text-xs font-medium text-white/40 uppercase mb-1">
                        Color:{" "}
                        <span className="text-white/80">{cartItem.color}</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-xs font-medium text-white/40 uppercase mb-1">
                      Design:{" "}
                      <span className="text-white/80">
                        {cartItem.design || "Standard"}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Individual Unit Price */}
              <div className="text-left md:text-right">
                <p className="text-[10px] font-bold text-white/20 uppercase mb-1">
                  Unit Price
                </p>
                <p className="text-sm font-semibold text-white/60">
                  ₱{cartItem.unitPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Subtotal for this line item */}
            <div className="mt-4 md:mt-0 flex justify-between items-end border-t border-white/5 pt-4">
              <span className="text-[15px] font-bold text-white uppercase mb-1">
                Item Subtotal
              </span>
              <p className="text-xl md:text-2xl font-bold text-white">
                ₱
                {(cartItem.unitPrice * cartItem.quantity).toLocaleString(
                  undefined,
                  { minimumFractionDigits: 2 },
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default ProductCard;
