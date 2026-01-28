import { useEffect, useState, useMemo } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import Footer from "../../../components/Footer";
import { PurchaseCard } from "./components/PurchaseCard";
import { PurchaseFilter } from "./components/PurchaseFilter";
import Pagination from "./components/Pagination";
import { getMyOrders } from "../../../api/order";
import type {
  OrderResponse,
  PaginatedOrdersResponse,
} from "../../../interfaces/order/OrderResponse";
import { OrderStatus } from "../../../enums/OrderStatus";
import type { PaginationParams } from "../../../interfaces/pagination_params";

interface GroupedPurchases {
  [orderId: number]: OrderResponse;
}

const index = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(1);
  const [paginationInfo, setPaginationInfo] =
    useState<PaginatedOrdersResponse | null>(null);

  // Fetch purchases on component mount and when page changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getMyOrders({
          page: currentPage,
          size: pageSize,
        } as PaginationParams);

        console.log("Fetched orders:", response);
        setOrders(response.content || []);
        setPaginationInfo(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch purchases:", err);
        setError("Failed to load purchases. Please try again later.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, pageSize]);

  // Group purchases by orderId and filter by status
  const groupedPurchases = useMemo(() => {
    const filtered =
      selectedStatus === "All"
        ? orders
        : orders.filter((purchase) =>
            purchase.orderItems.some(
              (_item) =>
                (selectedStatus === OrderStatus.NOT_PAID &&
                  purchase.orderStatus === OrderStatus.NOT_PAID) ||
                (selectedStatus === OrderStatus.CLAIMED &&
                  purchase.orderStatus === OrderStatus.CLAIMED) ||
                (selectedStatus === OrderStatus.TO_BE_CLAIMED &&
                  purchase.orderStatus === OrderStatus.TO_BE_CLAIMED),
            ),
          );

    const grouped: GroupedPurchases = {};
    filtered.forEach((purchase) => {
      grouped[purchase.orderId] = purchase;
    });

    return grouped;
  }, [orders, selectedStatus]);

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="mt-8">
            {/* Filter Section */}
            <PurchaseFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Purchases Grouped by OrderId */}
            {!loading &&
              !error &&
              Object.keys(groupedPurchases).length === 0 && (
                <div className="text-center py-20">
                  <p className="text-gray-400 text-lg">No purchases found</p>
                </div>
              )}

            {!loading &&
              !error &&
              Object.entries(groupedPurchases).map(([orderId, purchase]) => (
                <div key={orderId} className="mb-8">
                  <div className="px-4 mb-4">
                    <p className="text-lg font-semibold text-gray-300">
                      Order #{orderId}
                    </p>
                  </div>
                  <div className="px-4 space-y-5">
                    <PurchaseCard purchase={purchase} />
                  </div>
                </div>
              ))}

            {/* Pagination Controls */}
            {!loading &&
              !error &&
              paginationInfo &&
              paginationInfo.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={paginationInfo.totalPages}
                  pageNumber={paginationInfo.number}
                  first={paginationInfo.first}
                  last={paginationInfo.last}
                  onPageChange={setCurrentPage}
                />
              )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default index;
