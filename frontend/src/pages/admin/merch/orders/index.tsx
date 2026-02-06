import { useEffect, useState, useMemo } from "react";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";
import Footer from "../../../../components/Footer";
import StatusCard from "./components/StatusCard";
import { PurchaseFilter } from "../../../merch/transactions/components/PurchaseFilter";
import Pagination from "../../../merch/transactions/components/Pagination";
import { getOrderItemByStatus, getOrdersByDate } from "../../../../api/order";
import type {
  PaginatedOrdersResponse,
  OrderItemResponse,
} from "../../../../interfaces/order/OrderResponse";
import type { PaginationParams } from "../../../../interfaces/pagination_params";
import { FiSearch, FiPackage } from "react-icons/fi";
import { OrderStatus } from "../../../../enums/OrderStatus";

const Index = () => {
  const [items, setItems] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [paginationInfo, setPaginationInfo] =
    useState<PaginatedOrdersResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Reset page when status changes
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStatus]);

  // Fetch orders on component mount and when page or status changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (selectedStatus === "All") {
          const response = await getOrdersByDate({
            page: currentPage,
            size: pageSize,
          } as PaginationParams);

          const orderItems = Array.isArray(response.content)
            ? response.content.flatMap((order) => order.orderItems || [])
            : [];
          setItems(orderItems);
          setPaginationInfo(response);
        } else {
          const fetchedItems = await getOrderItemByStatus(
            selectedStatus as OrderStatus,
          );
          setItems(fetchedItems.content || []);
          setPaginationInfo(fetchedItems as any);
        }
        setError(null);
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize, selectedStatus]);

  // Filter items by search
  const filteredItems = useMemo(() => {
    if (!Array.isArray(items)) return [];

    if (!searchQuery) return items;

    return items.filter(
      (item) =>
        item.merchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [items, searchQuery]);

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="mt-8">
            {/* Page Header */}
            <div className="mb-8">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                ADMIN DASHBOARD
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                Order Management
              </h1>
              <p className="text-white/50">Manage and track customer orders</p>
            </div>

            {/* Filter & Search Section */}
            <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 p-5 mb-6">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <PurchaseFilter
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                />
                <div className="relative w-full lg:w-auto lg:min-w-[350px]">
                  <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" size={18} />
                  <input
                    type="text"
                    placeholder="Search by merch, student name, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-24">
                <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredItems.length === 0 && (
              <div className="bg-[#1E1E3F] border border-white/5 rounded-2xl p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <FiPackage className="text-white/30" size={36} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Orders Found</h3>
                <p className="text-white/50 max-w-md mx-auto">
                  {searchQuery 
                    ? "No orders match your search criteria. Try adjusting your search terms."
                    : "There are no orders to display at the moment."}
                </p>
              </div>
            )}

            {/* Orders List */}
            {!loading && !error && filteredItems.length > 0 && (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <StatusCard key={item.orderItemId} orderItem={item} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading &&
              !error &&
              paginationInfo &&
              paginationInfo.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={paginationInfo.totalPages}
                    pageNumber={paginationInfo.number}
                    first={paginationInfo.first}
                    last={paginationInfo.last}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Index;
