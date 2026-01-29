import { useEffect, useState, useMemo } from "react";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import Footer from "../../../components/Footer";
import { PurchaseCard } from "./components/PurchaseCard";
import { PurchaseFilter } from "./components/PurchaseFilter";
import Pagination from "./components/Pagination";
import { getMyOrders, getOrderItemByStatus } from "../../../api/order";
import type {
  OrderResponse,
  PaginatedOrdersResponse,
  OrderItemResponse,
} from "../../../interfaces/order/OrderResponse";
import { OrderStatus } from "../../../enums/OrderStatus";
import type { PaginationParams } from "../../../interfaces/pagination_params";
import { FiSearch } from "react-icons/fi";

interface GroupedPurchaseItem {
  [orderId: number]: OrderResponse;
}

const index = () => {
  const [items, setItems] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(1);
  const [paginationInfo, setPaginationInfo] =
    useState<PaginatedOrdersResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Reset page when status changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStatus]);

  // Fetch purchases on component mount and when page or status changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (selectedStatus === "All") {
          const response = await getMyOrders({
            page: currentPage,
            size: pageSize,
          } as PaginationParams);

          console.log("Fetched orders:", response);
          setItems(response.content.flatMap((order) => order.orderItems));
          setPaginationInfo(response);
        } else {
          const fetchedItems = await getOrderItemByStatus(
            selectedStatus as OrderStatus,
          );
          setItems(fetchedItems.content || []);
          setPaginationInfo(null);
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch purchases:", err);
        setError("Failed to load purchases. Please try again later.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, selectedStatus]);

  // Group purchases by orderId and filter by search
  const filteredOrders = useMemo(() => {
    if (!Array.isArray(items)) return [];

    let filteredItems = items;

    if (searchQuery) {
      filteredItems = filteredItems.filter(
        (item) =>
          item.merchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    const grouped: GroupedPurchaseItem = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.orderId]) {
        grouped[item.orderId] = {
          orderId: item.orderId,
          studentName: item.studentName,
          totalPrice: 0,
          orderDate: item.createdAt,
          orderItems: [],
        };
      }
      grouped[item.orderId].orderItems.push(item);
      grouped[item.orderId].totalPrice += item.totalPrice;
    });

    return Object.values(grouped);
  }, [items, searchQuery]);

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

            {/* Purchases Grouped by OrderId */}
            {!loading && !error && Object.keys(filteredOrders).length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No purchases found</p>
              </div>
            )}

            {!loading &&
              !error &&
              filteredOrders.map((purchase) => (
                <div key={purchase.orderId} className="mb-8">
                  <div className="px-4 mb-4 flex justify-between">
                    <p className="text-lg font-semibold text-gray-300">
                      Order #{purchase.orderId}
                    </p>
                    <p></p>
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
