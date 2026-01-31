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
import Layout from "../../../components/Layout";

interface GroupedPurchaseItem {
  [orderId: number]: OrderResponse;
}

const Index = () => {
  const [items, setItems] = useState<OrderItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(2);
  const [paginationInfo, setPaginationInfo] =
    useState<PaginatedOrdersResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStatus]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (selectedStatus === "All") {
          const response = await getMyOrders({
            page: currentPage,
            size: pageSize,
          } as PaginationParams);
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
        setError("Failed to load purchases. Please try again later.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, pageSize, selectedStatus]);

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
    <Layout>
      <AuthenticatedNav />

      {/* Responsive padding: px-4 for mobile, px-6 for desktop */}
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-6 sm:py-10 lg:py-16">
        {/* Page Header - Centered on mobile */}
        <header className="mb-8 sm:mb-12 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            My Purchases
          </h1>
          <p className="text-white/40 mt-2 font-medium uppercase tracking-[0.2em] text-[10px] sm:text-xs">
            Transaction History
          </p>
        </header>

        {/* Filter & Search Bar - Responsive stacking */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 mb-8 sm:mb-10 bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl sm:rounded-[2rem] backdrop-blur-md">
          {/* PurchaseFilter should ideally be responsive internally, 
              but here we ensure it doesn't break the parent layout */}
          <div className="w-full lg:flex-1 overflow-x-auto no-scrollbar">
            <PurchaseFilter
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
            />
          </div>

          <div className="relative w-full lg:max-w-md">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/5 rounded-xl sm:rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* States Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 sm:py-32 space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">
              Loading Records
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 text-center">
            <p className="text-red-400 text-sm sm:font-medium">{error}</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-[#242050]/50 border border-white/5 rounded-2xl sm:rounded-[3rem] py-24 sm:py-32 text-center">
            <p className="text-white/20 text-lg sm:text-xl font-bold italic px-4">
              No records found.
            </p>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-12">
            {filteredOrders.map((purchase) => (
              <section key={purchase.orderId} className="group">
                {/* Responsive Header: Stacks price and ID on mobile if needed */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 mb-4 gap-2">
                  <div className="flex items-center gap-3">
    
                    <div className="h-[1px] flex-1 min-w-[20px] bg-white/5 sm:hidden" />
                  </div>

                  <div className="hidden sm:block h-[1px] flex-1 mx-6 bg-white/5" />

                  <p className="text-white/60 text-xs sm:text-sm font-semibold">
                    Total:{" "}
                    <span className="text-white font-bold">
                      ₱{purchase.totalPrice.toFixed(2)}
                    </span>
                  </p>
                </div>

                <PurchaseCard purchase={purchase} />
              </section>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {!loading &&
          !error &&
          paginationInfo &&
          paginationInfo.totalPages > 1 && (
            <div className="mt-12 sm:mt-16 flex justify-center scale-90 sm:scale-100">
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
      <Footer />
    </Layout>
  );
};

export default Index;
