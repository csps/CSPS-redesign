import { useEffect, useState, useMemo } from "react";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";
import Footer from "../../../../components/Footer";
import StatusCard from "./components/StatusCard";
import { PurchaseFilter } from "../../../merch/transactions/components/PurchaseFilter";
import Pagination from "../../../merch/transactions/components/Pagination";
import { getOrders } from "../../../../api/order";
import type {
  OrderResponse,
  PaginatedOrdersResponse,
} from "../../../../interfaces/order/OrderResponse";
import type { PaginationParams } from "../../../../interfaces/pagination_params";
import { FiSearch } from "react-icons/fi";

const Index = () => {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(1);
  const [paginationInfo, setPaginationInfo] =
    useState<PaginatedOrdersResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch orders on component mount and when page changes
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await getOrders({
          page: currentPage,
          size: pageSize,
        } as PaginationParams);

        console.log("Fetched orders:", response.content);
        setOrders(response.content || []);
        setPaginationInfo(response);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, pageSize]);

  // Filter orders by status and search
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (selectedStatus !== "All") {
      filtered = filtered.filter(
        (order) => order.orderStatus === selectedStatus,
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((order) =>
        order.orderItems.some(
          (item) =>
            item.merchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.studentName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            item.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    }

    return filtered;
  }, [orders, selectedStatus, searchQuery]);

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="mt-8">
            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
              <PurchaseFilter
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
              />
              <div>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search by merch name, student name, or order item ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>
            </div>

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

            {/* Orders */}
            {!loading && !error && filteredOrders.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No orders found</p>
              </div>
            )}

            {!loading &&
              !error &&
              filteredOrders.map((order) => (
                <div key={order.orderId} className="mb-8">
                  <div className="px-4 space-y-5">
                    {order.orderItems.map((item) => (
                      <StatusCard key={item.orderItemId} orderItem={item} />
                    ))}
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

export default Index;
