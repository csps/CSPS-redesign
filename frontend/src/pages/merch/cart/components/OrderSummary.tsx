import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import type { CartItemResponse } from "../../../../interfaces/cart/CartItemResponse";
import { MerchType } from "../../../../enums/MerchType";
import type {
  OrderItemRequest,
  OrderPostRequest,
} from "../../../../interfaces/order/OrderRequest";
import { createOrder } from "../../../../api/order";
import { toast } from "sonner";
import ConfirmOrderModal from "./ConfirmOrderModal";

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

      // Call the API
      await createOrder(orderRequest);

      toast.success("Order created successfully!");

      // Call the success callback if provided
      onOrderSuccess?.();

      // TODO: Redirect to order confirmation page or show success toast
      // Example: navigate("/orders/" + response.orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
      console.error("Error creating order:", err);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* h-full and items-stretch in parent grid ensure this balances with the product cards */
    <div className="bg-white rounded-[40px] shadow-2xl w-[700px] p-8 flex flex-col h-full text-purple-900 min-h-[600px]">
      {/* Header Icon Section */}
      <div className="flex justify-center mb-6">
        <div className="bg-[#C7D2FE] rounded-full p-5">
          <FaCheck className="w-8 h-8 text-[#4F46E5]" />
        </div>
      </div>

      <h2 className="text-3xl font-extrabold text-center mb-8 tracking-tight">
        Order Summary
      </h2>

      {/* Top Divider */}
      <div className="border-t-[3px] border-purple-900 mb-6"></div>

      {/* Column Headers - Using Grid for pixel-perfect alignment */}
      <div className="grid grid-cols-12 gap-2 mb-4 px-1">
        <span className="col-span-6 font-bold text-sm uppercase tracking-wider">
          Item(s)
        </span>
        <span className="col-span-2 font-bold text-sm uppercase tracking-wider text-center">
          Qty
        </span>
        <span className="col-span-4 font-bold text-sm uppercase tracking-wider text-right">
          Price
        </span>
      </div>

      {/* Dynamic Item List */}
      <div className="flex-1 overflow-y-auto space-y-5 mb-8 pr-2 custom-scrollbar">
        {items.map((item) => (
          <div
            className="grid grid-cols-12 gap-2 items-start px-1"
            key={item.merchVariantItemId}
          >
            <div className="col-span-6 flex flex-col">
              <span className="text-sm font-medium leading-tight text-gray-800">
                {item.merchName}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5">
                {item.merchType === MerchType.CLOTHING
                  ? `(${item.size})`
                  : `(${item.design || "Standard"})`}
              </span>
            </div>
            <span className="col-span-2 text-sm text-gray-700 text-center font-medium">
              {item.quantity}
            </span>
            <span className="col-span-4 text-sm text-gray-700 text-right font-semibold">
              ₱
              {(item.unitPrice * item.quantity).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        ))}
      </div>

      {/* Footer / Calculation Section */}
      <div className="mt-auto">
        <div className="border-t-[3px] border-purple-900 mb-6"></div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold">Total</span>
          <span className="text-2xl font-bold">
            ₱
            {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="border-t-[3px] border-purple-900 mb-8"></div>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={() => setShowConfirmModal(true)}
          disabled={items.length === 0 || isLoading}
          className="w-full bg-white border-[3px] border-[#4F46E5] text-[#4F46E5] rounded-full py-4 px-6 text-lg font-bold hover:bg-indigo-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
        >
          {isLoading ? "Processing..." : "Confirm order"}
        </button>
      </div>

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
