import { useEffect, useState, useMemo } from "react";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";
import OrderGroup from "./components/OrderGroup";
import StatusHeader from "./components/StatusHeader";
import Pagination from "../../../merch/transactions/components/Pagination";
import { getOrdersByDate, type OrderSearchParams } from "../../../../api/order";
import type {
  PaginatedOrdersResponse,
  OrderItemResponse,
  OrderResponse,
} from "../../../../interfaces/order/OrderResponse";
import { FiPackage } from "react-icons/fi";
import Layout from "../../../../components/Layout";

const Index = () => {
  const [items, setItems] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(3);
  const [paginationInfo, setPaginationInfo] =
    useState<PaginatedOrdersResponse | null>(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStatus, searchQuery, startDate, endDate]);

  // Fetch orders
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: OrderSearchParams = {
          page: currentPage,
          size: pageSize,
          status: selectedStatus,
          studentName: searchQuery, // Search acts as student name/ID filter
          startDate: startDate ? `${startDate}T00:00:00` : undefined,
          endDate: endDate ? `${endDate}T23:59:59` : undefined,
        };

        // If searchQuery looks like an ID (digits), use studentId instead
        if (/^\d+$/.test(searchQuery)) {
          params.studentId = searchQuery;
          delete params.studentName;
        }

        const response = await getOrdersByDate(params);

        const orderItems = Array.isArray(response.content)
          ? response.content.flatMap((order) => order.orderItems || [])
          : [];
        setItems(orderItems);
        setPaginationInfo(response);
      } catch (err) {
        setError("Failed to load orders. Please try again later.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [currentPage, pageSize, selectedStatus, searchQuery, startDate, endDate]);

  // Group items by orderId (Client-side grouping for display)
  const groupedOrders = useMemo(() => {
    if (!Array.isArray(items)) return [];

    const groups: Record<number, OrderResponse> = {};

    items.forEach((item) => {
      if (!groups[item.orderId]) {
        groups[item.orderId] = {
          orderId: item.orderId,
          studentName: item.studentName,
          orderDate: item.createdAt,
          totalPrice: 0, // Recalculated below
          orderItems: [],
        };
      }
      groups[item.orderId].orderItems.push(item);
    });

    // Calculate totals and sort
    return Object.values(groups)
      .map((group) => ({
        ...group,
        totalPrice: group.orderItems.reduce(
          (sum, item) => sum + item.totalPrice,
          0,
        ),
      }))
      .sort((a, b) => b.orderId - a.orderId);
  }, [items]);

  return (
    <>
      <Layout>
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
            <div className="bg-[#1E1E3F] rounded-2xl border border-white/5 p-6 mb-6">
              <StatusHeader
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                startDate={startDate}
                onStartDateChange={setStartDate}
                endDate={endDate}
                onEndDateChange={setEndDate}
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#1E1E3F]/40 border border-white/5 rounded-2xl p-6 h-40 animate-pulse flex flex-col justify-between"
                  >
                    <div className="flex gap-4">
                      <div className="h-4 w-32 bg-white/5 rounded"></div>
                      <div className="h-4 w-48 bg-white/5 rounded"></div>
                    </div>
                    <div className="h-16 w-full bg-white/5 rounded"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && groupedOrders.length === 0 && (
              <div className="bg-[#1E1E3F] border border-white/5 rounded-2xl p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <FiPackage className="text-white/30" size={36} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Orders Found
                </h3>
                <p className="text-white/50 max-w-md mx-auto">
                  {searchQuery ||
                  selectedStatus !== "All" ||
                  startDate ||
                  endDate
                    ? "No orders match your search criteria. Try adjusting your filters."
                    : "There are no orders to display at the moment."}
                </p>
              </div>
            )}

            {/* Orders List */}
            {!loading && !error && groupedOrders.length > 0 && (
              <div className="space-y-6">
                {groupedOrders.map((order) => (
                  <OrderGroup key={order.orderId} order={order} />
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
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Index;
