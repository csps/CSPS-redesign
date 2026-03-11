import { useState, useEffect } from "react";
import Chart from "./components/Chart";
import RadialChart from "./components/RadialChart";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";
import { S3_BASE_URL } from "../../../../constant";
import {
  getFinanceDashboard,
  type FinanceDashboardDTO,
  type InventorySummaryDTO,
  type OrderSummaryDTO,
  type StudentMembershipDTO,
} from "../../../../api/dashboard";
import { getSalesStats, type SalesStats } from "../../../../api/sales";
import { useNavigate } from "react-router-dom";
import OrderDetailModal from "../../sales/components/OrderDetailModal";
import MembershipListModal from "./components/MembershipListModal";

// Loading Skeleton Component
const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-700/50 rounded ${className}`}></div>
);

// Status Badge Component
const StatusBadge = ({
  status,
  variant = "default",
}: {
  status: string;
  variant?: "stock" | "order" | "membership" | "default";
}) => {
  let colorClasses = "";

  if (variant === "stock") {
    switch (status) {
      case "IN_STOCK":
        colorClasses =
          "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
        break;
      case "LOW_STOCK":
        colorClasses = "bg-amber-500/20 text-amber-400 border-amber-500/30";
        break;
      case "OUT_OF_STOCK":
        colorClasses = "bg-red-500/20 text-red-400 border-red-500/30";
        break;
      default:
        colorClasses = "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  } else if (variant === "order") {
    const statusUpper = status.toUpperCase();
    if (statusUpper === "PENDING") {
      colorClasses = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    } else if (statusUpper === "TO_BE_CLAIMED") {
      colorClasses = "bg-blue-500/20 text-blue-400 border-blue-500/30";
    } else if (statusUpper === "CLAIMED") {
      colorClasses = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    } else if (statusUpper === "CANCELLED") {
      colorClasses = "bg-red-500/20 text-red-400 border-red-500/30";
    } else {
      colorClasses = "bg-purple-500/20 text-purple-400 border-purple-500/30";
    }
  } else if (variant === "membership") {
    colorClasses =
      status === "Paid"
        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
        : "bg-red-500/20 text-red-400 border-red-500/30";
  } else {
    colorClasses = "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }

  // Format status text for display (replace underscores with spaces)
  const displayStatus = status.replace(/_/g, " ");

  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${colorClasses}`}
    >
      {displayStatus}
    </span>
  );
};

const Index = () => {
  const [dashboardData, setDashboardData] =
    useState<FinanceDashboardDTO | null>(null);
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Order detail modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedStudentName, setSelectedStudentName] = useState<string>("");

  // Membership modal state
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both dashboard and sales data in parallel
        const [dashboardResult, salesResult] = await Promise.all([
          getFinanceDashboard(),
          getSalesStats("WEEKLY"),
        ]);

        setDashboardData(dashboardResult);
        setSalesStats(salesResult);
      } catch (err) {
        console.error("Error fetching finance data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract data with fallbacks
  const inventory = dashboardData?.inventory ?? [];
  const orders = dashboardData?.recentOrders ?? [];
  const students = dashboardData?.recentMemberships ?? [];
  const memberRatio = dashboardData?.membershipRatio ?? {
    totalStudents: 0,
    paidMembersCount: 0,
    nonMembersCount: 0,
    memberPercentage: 0,
  };

  // Base chart data from dashboard aggregated data
  const baseChartData = dashboardData?.chartData ?? {
    weeklyOrders: [],
    weeklyRevenue: [],
    days: [],
  };

  // Helper to format currency
  const formatCurrency = (amount: number, currency: string = "PHP") => {
    const symbol = currency === "PHP" ? "₱" : "$";
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Use sales stats for revenue chart if available and contains data, otherwise fallback to dashboard chart data
  const revenueData =
    salesStats && salesStats.data.length > 0
      ? {
          data: salesStats.data,
          labels: salesStats.labels,
          value: formatCurrency(salesStats.totalSales, salesStats.currency),
        }
      : {
          data: baseChartData.weeklyRevenue,
          labels: baseChartData.days,
          value: formatCurrency(
            baseChartData.weeklyRevenue.reduce((a, b) => a + b, 0),
          ),
        };

  const ordersCount =
    baseChartData.weeklyOrders.length > 0
      ? baseChartData.weeklyOrders.reduce((a, b) => a + b, 0)
      : 0;

  // Order detail modal handlers
  const handleOrderClick = (order: OrderSummaryDTO) => {
    setSelectedOrderId(order.orderId);
    setSelectedStudentName(order.studentName);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrderId(null);
    setSelectedStudentName("");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="relative w-full max-w-[90rem] p-4 md:p-6 text-white">
        <AuthenticatedNav />

          <div className="py-6 space-y-8">
            {/* Error Banner */}
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg animate-in fade-in slide-in-from-top-4 duration-300">
                {error}
              </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent tracking-tight">
                  Finance Overview
                </h1>
                <p className="text-zinc-400 mt-2 text-base tracking-tight">
                  Track your inventory, orders, and membership statistics
                </p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-5 shadow-lg shadow-purple-900/10 hover:border-purple-500/40 transition-all duration-300">
                <Chart
                  data={baseChartData.weeklyOrders}
                  labels={baseChartData.days}
                  title="Weekly Orders"
                  value={ordersCount.toString()}
                />
              </div>
              <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-5 shadow-lg shadow-purple-900/10 hover:border-purple-500/40 transition-all duration-300">
                <Chart
                  data={revenueData.data}
                  labels={revenueData.labels}
                  title="Weekly Revenue"
                  value={revenueData.value}
                />
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inventory Section */}
              <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-5 shadow-lg shadow-purple-900/10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">Inventory</h2>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                    {inventory.length} items
                  </span>
                </div>
                <div className="bg-purple-900/20 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[2fr_1fr_1fr] text-xs text-gray-400 uppercase px-4 py-3 border-b border-purple-500/20">
                    <div>Product</div>
                    <div className="text-center">Stock</div>
                    <div className="text-center">Status</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-purple-500/10 max-h-[320px] overflow-y-auto">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[2fr_1fr_1fr] items-center px-4 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <LoadingSkeleton className="w-10 h-10 rounded-lg" />
                            <LoadingSkeleton className="h-4 w-24" />
                          </div>
                          <LoadingSkeleton className="h-4 w-12 mx-auto" />
                          <LoadingSkeleton className="h-6 w-16 mx-auto rounded-full" />
                        </div>
                      ))
                    ) : inventory.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        No inventory items found
                      </div>
                    ) : (
                      inventory.map((item: InventorySummaryDTO) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-[2fr_1fr_1fr] cursor-pointer items-center px-4 py-3 hover:bg-purple-500/5 transition-colors"
                          onClick={() => navigate(`/admin/merch/${item.id}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                              <img
                                src={
                                  item.s3ImageKey
                                    ? `${S3_BASE_URL}${item.s3ImageKey}`
                                    : "/placeholder.png"
                                }
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span className="font-medium truncate text-sm">
                              {item.name}
                            </span>
                          </div>
                          <div className="text-center  text-sm">
                            {item.stock}
                          </div>
                          <div className="flex justify-center">
                            <StatusBadge
                              status={item.stockStatus}
                              variant="stock"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Order Status Section */}
              <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-5 shadow-lg shadow-purple-900/10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">Order Status</h2>
                  </div>
                  <h2
                    className="cursor-pointer hover:text-violet-400"
                    onClick={() => navigate("/admin/merch/orders")}
                  >
                    See more
                  </h2>
                </div>

                <div className="bg-purple-900/20 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr] text-xs text-gray-400 uppercase px-4 py-3 border-b border-purple-500/20">
                    <div>Customer</div>
                    <div className="text-center">Order #</div>
                    <div className="text-center">Product</div>
                    <div className="text-center">Status</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-purple-500/10 max-h-[320px] overflow-y-auto">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr] items-center px-4 py-3"
                        >
                          <LoadingSkeleton className="h-4 w-24" />
                          <LoadingSkeleton className="h-4 w-12 mx-auto" />
                          <LoadingSkeleton className="h-4 w-20 mx-auto" />
                          <LoadingSkeleton className="h-6 w-16 mx-auto rounded-full" />
                        </div>
                      ))
                    ) : orders.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        No recent orders found
                      </div>
                    ) : (
                      orders.map((order: OrderSummaryDTO) => (
                        <div
                          key={order.orderItemId}
                          className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr] items-center px-4 py-3 hover:bg-purple-500/5 transition-colors cursor-pointer"
                          onClick={() => handleOrderClick(order)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate text-sm">
                              {order.studentName}
                            </span>
                          </div>
                          <div className="text-center  text-sm text-gray-300">
                            {order.referenceNumber}
                          </div>
                          <div className="text-center text-sm text-gray-300 truncate px-2">
                            {order.productName}
                          </div>
                          <div className="flex justify-center">
                            <StatusBadge
                              status={order.status}
                              variant="order"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Membership Status Section */}
              <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-5 shadow-lg shadow-purple-900/10">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold">Membership Status</h2>
                  </div>
                </div>

                <div className="bg-purple-900/20 rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-[2fr_1fr_1fr] text-xs text-gray-400 uppercase px-4 py-3 border-b border-purple-500/20">
                    <div>Name</div>
                    <div className="text-center">ID Number</div>
                    <div className="text-center">Status</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-purple-500/10 max-h-[320px] overflow-y-auto">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[2fr_1fr_1fr] items-center px-4 py-3"
                        >
                          <LoadingSkeleton className="h-4 w-32" />
                          <LoadingSkeleton className="h-4 w-16 mx-auto" />
                          <LoadingSkeleton className="h-6 w-16 mx-auto rounded-full" />
                        </div>
                      ))
                    ) : students.length === 0 ? (
                      <div className="text-center text-gray-400 py-8">
                        No students found
                      </div>
                    ) : (
                      students.map((student: StudentMembershipDTO) => (
                        <div
                          key={student.studentId}
                          className="grid grid-cols-[2fr_1fr_1fr] items-center px-4 py-3 hover:bg-purple-500/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-medium truncate text-sm">
                              {student.fullName}
                            </span>
                          </div>
                          <div className="text-center  text-sm text-gray-300">
                            {student.idNumber}
                          </div>
                          <div className="flex justify-center">
                            <StatusBadge
                              status={student.isPaid ? "Paid" : "Not Paid"}
                              variant="membership"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Member to Non-Member Ratio Section */}
              <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-5 shadow-lg shadow-purple-900/10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-bold">
                      Member to Non-Member Ratio
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate("/admin/membership")}
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 uppercase tracking-widest transition-colors"
                  >
                    See More
                  </button>
                </div>

                <div className="flex flex-col bg-purple-900/20 rounded-lg p-5 gap-6 items-center">
                  <div className="flex flex-col lg:flex-row gap-6 items-center">
                    {/* Radial Chart */}
                    <div className="shrink-0">
                      {loading ? (
                        <div className="w-[260px] h-[260px] flex items-center justify-center">
                          <LoadingSkeleton className="w-48 h-48 rounded-full" />
                        </div>
                      ) : (
                        <RadialChart
                          members={Number(
                            memberRatio.memberPercentage.toFixed(2),
                          )}
                          nonMembers={100 - memberRatio.memberPercentage}
                          totalCount={memberRatio.totalStudents}
                        />
                      )}
                    </div>

                    {/* Stats Panel */}
                    <div className="flex-1 w-full space-y-4">
                      <div className="bg-purple-900/40 rounded-lg p-4 space-y-4">
                        {/* Member Stat */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#FDE006]"></div>
                            <span className="text-sm font-medium">Members</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-[#FDE006]">
                              {loading
                                ? "--"
                                : `${memberRatio.memberPercentage}%`}
                            </span>
                          </div>
                        </div>

                        {/* Non-Member Stat */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#A000FF]"></div>
                            <span className="text-sm font-medium">
                              Non-Members
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold text-[#A000FF] ml-5">
                              {loading
                                ? "--"
                                : `${100 - memberRatio.memberPercentage}%`}
                            </span>
                          </div>
                        </div>

                        {/* Total Count */}
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-sm text-gray-400">
                            Total Students
                          </span>
                          <span className="text-lg font-semibold">
                            {loading
                              ? "--"
                              : memberRatio.totalStudents.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Quick Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-400 mb-1">
                            Paid Members
                          </p>
                          <p className="text-lg font-bold text-emerald-400">
                            {loading ? "--" : memberRatio.paidMembersCount}
                          </p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-400 mb-1">Unpaid</p>
                          <p className="text-lg font-bold text-red-400">
                            {loading ? "--" : memberRatio.nonMembersCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Order Detail Modal */}
        <OrderDetailModal
          isOpen={isOrderModalOpen}
          orderId={selectedOrderId}
          studentName={selectedStudentName}
          onClose={handleCloseOrderModal}
        />
        {/* Membership List Modal */}
        <MembershipListModal
          isOpen={isMembershipModalOpen}
          onClose={() => setIsMembershipModalOpen(false)}
        />
      </div>
  );
};

export default Index;
