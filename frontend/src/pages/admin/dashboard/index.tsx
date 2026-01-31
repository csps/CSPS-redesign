import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import { getAllMerchWithoutVariants } from "../../../api/merch";
import { getUpcomingEvents } from "../../../api/event";
import { getOrders, getOrderItemByStatus } from "../../../api/order";
import type { MerchSummaryResponse } from "../../../interfaces/merch/MerchResponse";
import type { OrderItemResponse } from "../../../interfaces/order/OrderResponse";
import { OrderStatus } from "../../../enums/OrderStatus";
import { S3_BASE_URL } from "../../../constant";

interface DashboardStats {
  upcomingEventsCount: number;
  totalMerch: number;
  totalOrders: number;
}

interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  imageKey: string;
  isLowStock: boolean;
}

const LOW_STOCK_THRESHOLD = 20;
const MAX_PENDING_ORDERS_DISPLAY = 4;

const Index = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    upcomingEventsCount: 0,
    totalMerch: 0,
    totalOrders: 0,
  });
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [pendingOrders, setPendingOrders] = useState<OrderItemResponse[]>([]);
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [merchData, eventsData, ordersData, pendingOrdersData] =
          await Promise.all([
            getAllMerchWithoutVariants(),
            getUpcomingEvents(),
            getOrders({ page: 0, size: 1 }), // Just to get totalElements
            getOrderItemByStatus(OrderStatus.PENDING),
          ]);

        // Set stats
        setStats({
          upcomingEventsCount: eventsData.length,
          totalMerch: merchData.length,
          totalOrders: ordersData.totalElements,
        });

        // Transform merch data for inventory display
        const inventoryItems: InventoryItem[] = merchData.map(
          (merch: MerchSummaryResponse) => ({
            id: merch.merchId,
            name: merch.merchName,
            stock: merch.totalStockQuantity ?? 0,
            imageKey: merch.s3ImageKey,
            isLowStock: (merch.totalStockQuantity ?? 0) < LOW_STOCK_THRESHOLD,
          })
        );
        setInventory(inventoryItems.slice(0, 5)); // Show top 5

        // Set pending orders
        setTotalPendingOrders(pendingOrdersData.totalElements);
        setPendingOrders(
          pendingOrdersData.content.slice(0, MAX_PENDING_ORDERS_DISPLAY)
        );
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleViewOrder = (orderId: number) => {
    navigate(`/admin/merch/orders?orderId=${orderId}`);
  };

  const handleViewMoreOrders = () => {
    navigate("/admin/merch/orders");
  };

  // Loading skeleton component
  const LoadingSkeleton = ({ className }: { className?: string }) => (
    <div
      className={`animate-pulse bg-gray-700/50 rounded ${className}`}
    ></div>
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="w-full max-w-[90rem] p-4 md:p-6 text-white">
        <AuthenticatedNav />

        <div className="w-full space-y-10">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Top Grid - Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {/* Upcoming Events Card */}
            <div className="bg-[#0F033C] text-gray-200 border border-gray-500 h-40 sm:h-48 rounded-md flex flex-col justify-between py-5 px-4">
              <p className="text-lg text-white">Upcoming Events</p>
              {isLoading ? (
                <LoadingSkeleton className="h-12 w-20 mx-auto" />
              ) : (
                <p className="text-center text-5xl font-semibold">
                  {stats.upcomingEventsCount}
                </p>
              )}
              <p className="text-sm text-gray-400">scheduled events</p>
            </div>

            {/* Total Merch Card */}
            <div className="bg-[#0F033C] border border-gray-500 h-40 sm:h-48 rounded-md flex flex-col py-5 px-4">
              <p className="text-lg text-white">Total Merch</p>
              {isLoading ? (
                <LoadingSkeleton className="h-12 w-20 mx-auto my-4" />
              ) : (
                <p className="text-center text-5xl font-semibold py-4">
                  {stats.totalMerch}
                </p>
              )}
            </div>

            {/* Total Orders Card */}
            <div className="bg-[#0F033C] border border-gray-500 h-40 sm:h-48 rounded-md flex flex-col py-5 px-4">
              <p className="text-lg text-white">Total Orders</p>
              {isLoading ? (
                <LoadingSkeleton className="h-12 w-20 mx-auto my-4" />
              ) : (
                <p className="text-center text-5xl font-semibold py-4">
                  {stats.totalOrders}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row w-full gap-10">
            {/* Inventory Section */}
            <div className="w-full lg:w-1/2 space-y-3">
              <p className="text-lg font-medium">Inventory</p>

              <div className="bg-[#0F033C] w-full rounded-md p-4">
                {/* Header */}
                <div className="grid grid-cols-3 text-center text-sm text-white px-1 pb-2">
                  <div>Product</div>
                  <div>Stocks</div>
                  <div>Status</div>
                </div>

                <div className="space-y-3 overflow-auto max-h-[400px]">
                  {isLoading ? (
                    // Loading skeletons
                    Array.from({ length: 5 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="grid grid-cols-3 md:grid-cols-[2fr_1fr_1fr] gap-3 items-center border-b border-gray-400 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <LoadingSkeleton className="w-10 h-10 md:w-12 md:h-12" />
                          <LoadingSkeleton className="h-4 w-24" />
                        </div>
                        <LoadingSkeleton className="h-4 w-12 mx-auto" />
                        <LoadingSkeleton className="h-6 w-16 mx-auto" />
                      </div>
                    ))
                  ) : inventory.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                      No merchandise found
                    </div>
                  ) : (
                    inventory.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-3 md:grid-cols-[2fr_1fr_1fr] gap-3 items-center border-b border-gray-400 p-3"
                      >
                        {/* Product */}
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              item.imageKey
                                ? `${S3_BASE_URL}${item.imageKey}`
                                : "/placeholder.png"
                            }
                            alt={item.name}
                            className="w-10 h-10 md:w-12 md:h-12 object-cover rounded"
                          />
                          <span className="font-medium truncate">
                            {item.name}
                          </span>
                        </div>

                        {/* Stocks */}
                        <div className="flex justify-center md:justify-center">
                          <span className="font-mono">{item.stock}</span>
                        </div>

                        {/* Status */}
                        <div className="flex justify-center">
                          {item.isLowStock ? (
                            <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded">
                              Low Stock
                            </span>
                          ) : (
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">
                              In Stock
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Pending Orders Section */}
            <div className="w-full lg:w-1/2 space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">Pending Orders</p>
                {!isLoading && totalPendingOrders > 0 && (
                  <span className="text-sm text-gray-400">
                    {totalPendingOrders} total
                  </span>
                )}
              </div>

              <div className="w-full space-y-4">
                {isLoading ? (
                  // Loading skeletons
                  Array.from({ length: 2 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-[#0F033C] w-full rounded-md px-6 py-5"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <LoadingSkeleton className="w-14 h-14 rounded" />
                          <div className="space-y-2">
                            <LoadingSkeleton className="h-4 w-32" />
                            <LoadingSkeleton className="h-3 w-24" />
                          </div>
                        </div>
                        <LoadingSkeleton className="h-3 w-16" />
                      </div>
                    </div>
                  ))
                ) : pendingOrders.length === 0 ? (
                  <div className="bg-[#0F033C] w-full rounded-md px-6 py-10 text-center text-gray-400">
                    No pending orders
                  </div>
                ) : (
                  <>
                    {pendingOrders.map((order) => (
                      <div
                        key={order.orderItemId}
                        className="bg-[#0F033C] w-full rounded-md px-6 py-5 hover:bg-[#150950] transition-colors cursor-pointer"
                        onClick={() => handleViewOrder(order.orderId)}
                      >
                        <div className="w-full flex flex-col sm:flex-row sm:justify-between gap-4 sm:items-center">
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden bg-gray-700 flex-shrink-0">
                              <img
                                src={
                                  order.s3ImageKey
                                    ? `${S3_BASE_URL}${order.s3ImageKey}`
                                    : "/placeholder.png"
                                }
                                alt={order.merchName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-base sm:text-lg font-semibold truncate">
                                {order.merchName}
                              </p>
                              <p className="text-sm text-gray-300">
                                {order.studentName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {order.size && `Size: ${order.size}`}
                                {order.size && order.color && " • "}
                                {order.color && `Color: ${order.color}`}
                                {(order.size || order.color) && " • "}
                                Qty: {order.quantity}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-end gap-2">
                            <p className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                              {formatDate(order.createdAt)}
                            </p>
                            <span className="text-sm font-medium text-purple-300">
                              ₱{order.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-600 flex justify-between items-center">
                          <span className="text-sm text-gray-400">
                            Order #{order.orderId}
                          </span>
                          <button
                            className="px-4 py-1.5 bg-[#AB83C2] hover:bg-[#9a72b1] transition-colors rounded-md text-sm font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewOrder(order.orderId);
                            }}
                          >
                            View Order
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* View More Button */}
                    {totalPendingOrders > MAX_PENDING_ORDERS_DISPLAY && (
                      <button
                        onClick={handleViewMoreOrders}
                        className="w-full py-3 bg-[#1a0a4a] hover:bg-[#251060] border border-gray-600 rounded-md text-gray-300 hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <span>View More Orders</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
