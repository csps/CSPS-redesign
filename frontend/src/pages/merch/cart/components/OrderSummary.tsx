import { useState } from "react";
import type { CartItemResponse } from "../../../../interfaces/cart/CartItemResponse";
import { MerchType } from "../../../../enums/MerchType";
import type {
  OrderItemRequest,
  OrderPostRequest,
} from "../../../../interfaces/order/OrderRequest";
import { createOrder } from "../../../../api/order";
import { toast } from "sonner";
import ConfirmOrderModal from "./ConfirmOrderModal";
import { FaCartShopping } from "react-icons/fa6";

const OrderSummary = ({
  items,
  totalPrice,
  onOrderSuccess,
}: {
  items: CartItemResponse[];
  totalPrice: number;
  onOrderSuccess?: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const listOfOrderItems: OrderItemRequest[] = items.map((item) => ({
    merchVariantItemId: item.merchVariantItemId,
    quantity: item.quantity,
    priceAtPurchase: item.unitPrice,
  }));

  const handleConfirmOrder = async (orderRequest: OrderPostRequest) => {
    try {
      setIsLoading(true);
      setError(null);
      await createOrder(orderRequest);
      toast.success("Order created successfully!");
      onOrderSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* Background White, Primary Text color set to #242050 */
    <div className="flex flex-col h-full bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
      {/* Header section */}
      <div className="flex items-center gap-4 mb-8">
        <FaCartShopping className="w-9 h-6 text-[#242050]" />
        <h2 className="text-xl font-bold text-[#242050]">Order Summary</h2>
      </div>

      {/* Itemized List */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-2 custom-scrollbar-dark max-h-[400px]">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              className="grid grid-cols-12 gap-3 items-center"
              key={item.merchVariantItemId}
            >
              <div className="col-span-8">
                <p className="text-sm font-semibold text-[#242050] truncate">
                  {item.merchName}
                </p>
                <p className="text-[11px] text-[#242050]/50 font-medium uppercase mt-0.5">
                  {item.merchType === MerchType.CLOTHING
                    ? `Size: ${item.size}`
                    : `Design: ${item.design || "Standard"}`}
                  {" • "} Qty: {item.quantity}
                </p>
              </div>
              <div className="col-span-4 text-right">
                <p className="text-sm font-bold text-[#242050]">
                  ₱
                  {(item.unitPrice * item.quantity).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#242050]/30 text-sm italic text-center py-4">
            No items selected
          </p>
        )}
      </div>

      {/* Calculation Section */}
      <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-[#242050]/60 text-sm font-medium">
            Subtotal
          </span>
          <span className="text-[#242050]/60 text-sm">
            ₱
            {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex justify-between items-end pt-2">
          <span className="text-lg  text-[#242050]">Total Amount</span>
          <span className="text-2xl font-bold text-[#242050]">
            ₱
            {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={items.length === 0 || isLoading}
          className="w-full bg-[#FDE006] text-black rounded-2xl py-4 text-sm font-black uppercase hover:bg-[#ebd005] transition-all active:scale-[0.98] disabled:opacity-30 disabled:grayscale shadow-lg shadow-yellow-500/10 mt-4"
        >
          {isLoading ? "Processing..." : "Confirm Order"}
        </button>
      </div>

      {/* Loading Modal */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-[#242050] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-purple-500/10 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white font-medium text-lg">
              Creating your order...
            </p>
          </div>
        </div>
      )}

      <ConfirmOrderModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirmAction={handleConfirmOrder}
        orderRequest={{ orderItems: listOfOrderItems }}
        totalAmount={totalPrice}
        itemsCount={items.length}
      />
    </div>
  );
};

export default OrderSummary;
