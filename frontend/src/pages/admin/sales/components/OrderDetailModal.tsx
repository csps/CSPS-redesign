import { useEffect, useState } from "react";
import { getOrderById, updateOrderItemStatus } from "../../../../api/order";
import type {
  OrderResponse,
  OrderItemResponse,
} from "../../../../interfaces/order/OrderResponse";
import { S3_BASE_URL } from "../../../../constant";
import { formatDate } from "../../../../helper/dateUtils";
import { OrderStatus } from "../../../../enums/OrderStatus";
import StatusCardModal from "../../merch/orders/components/StatusCardModal";
import { usePermissions } from "../../../../hooks/usePermissions";

interface OrderDetailModalProps {
  isOpen: boolean;
  orderId: number | null;
  studentName: string;
  onClose: () => void;
}

export default function OrderDetailModal({
  isOpen,
  orderId,
  studentName,
  onClose,
}: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<OrderItemResponse | null>(
    null,
  );
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const { canManageOrder } = usePermissions();

  useEffect(() => {
    if (isOpen && orderId) {
      loadOrderDetails();
    }
  }, [isOpen, orderId]);

  const loadOrderDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      if (orderId) {
        const data = await getOrderById(orderId);
        setOrder(data);

        console.log(`Loaded order details for orderId ${orderId}:`, data);
      }
    } catch (err) {
      console.error("Failed to load order details", err);
      setError("Failed to load order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: OrderStatus) => {
    if (!selectedItem) return;
    try {
      await updateOrderItemStatus(selectedItem.orderItemId, status);
      // Reload order details to reflect changes
      await loadOrderDetails();
      setIsStatusModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error("Failed to update status", err);
      // Could add error handling here
    }
  };

  const handleCardClick = (item: OrderItemResponse) => {
    if (canManageOrder) {
      setSelectedItem(item);
      setIsStatusModalOpen(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-[#0F033C]/80 border-zinc-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Order Details</h2>
            <p className="text-sm text-zinc-400 mt-1">
              {studentName} - Order #{orderId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-400">{error}</div>
          ) : !order ? (
            <div className="p-6 text-center text-zinc-400">
              No items found for this order.
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {order.orderItems.map((item) => (
                <div
                  key={item.orderItemId}
                  className={`bg-zinc-900/80 border border-zinc-700 rounded-xl p-4 transition-colors ${
                    canManageOrder
                      ? "hover:border-purple-500/50 cursor-pointer"
                      : ""
                  }`}
                  onClick={() => handleCardClick(item)}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {item.s3ImageKey ? (
                        <img
                          src={`${S3_BASE_URL}${item.s3ImageKey}`}
                          alt={item.merchName}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-zinc-800 rounded-lg flex items-center justify-center">
                          <span className="text-zinc-500 text-sm">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.merchName}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-zinc-500">Type:</span>{" "}
                          <span className="text-zinc-200">
                            {item.merchType}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Quantity:</span>{" "}
                          <span className="text-zinc-200">{item.quantity}</span>
                        </div>
                        {(item.size || item.color || item.design) && (
                          <div className="md:col-span-2">
                            <span className="text-zinc-500">Variant:</span>
                            <div className="mt-1 space-y-1">
                              {item.size && (
                                <div className="text-zinc-200">
                                  Size: {item.size}
                                </div>
                              )}
                              {item.color && (
                                <div className="text-zinc-200">
                                  Color: {item.color}
                                </div>
                              )}
                              {item.design && (
                                <div className="text-zinc-200">
                                  Design: {item.design}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <div>
                          <span className="text-zinc-500">Price:</span>{" "}
                          <span className="text-emerald-400 font-medium">
                            ₱{item.totalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Status:</span>{" "}
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium border ${
                              item.orderStatus === "CLAIMED"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : item.orderStatus === "REJECTED"
                                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                                  : item.orderStatus === "TO_BE_CLAIMED"
                                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}
                          >
                            {item.orderStatus === "TO_BE_CLAIMED"
                              ? "To Be Claimed"
                              : item.orderStatus === "CLAIMED"
                                ? "Claimed"
                                : item.orderStatus === "REJECTED"
                                  ? "Rejected"
                                  : "Pending"}
                          </span>
                        </div>
                        <div className="md:col-span-2 text-xs text-zinc-500">
                          <div>Created: {formatDate(item.createdAt)}</div>
                          <div>Updated: {formatDate(item.updatedAt)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {order && (
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex justify-between items-center text-sm">
            <span className="text-zinc-400">
              {order.orderItems.length} item(s)
            </span>
            <span className="text-white font-semibold">
              Total: ₱{order.totalPrice.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {selectedItem && (
        <StatusCardModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          orderItem={selectedItem}
          currentStatus={selectedItem.orderStatus}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}
