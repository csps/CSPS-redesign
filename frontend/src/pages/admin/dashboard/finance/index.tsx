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
    memberPercentage: 75,
  };
  const chartData = dashboardData?.chartData ?? {
    weeklyOrders: [150, 180, 120, 210, 250, 180, 190],
    weeklyRevenue: [180, 216, 144, 252, 300, 216, 228],
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };

  // Use sales stats for revenue chart if available
  const revenueData = salesStats
    ? {
        data: salesStats.data,
        labels: salesStats.labels,
        value: `$${salesStats.totalSales.toFixed(2)}`,
        previous: "$0.00 previous period", // You might want to calculate this from previous period
      }
    : {
        data: chartData.weeklyRevenue,
        labels: chartData.days,
        value: `$${chartData.weeklyRevenue.reduce((a, b) => a + b, 0).toFixed(2)}`,
        previous: "$0.00 previous period",
      };

  // Count orders by status for stats display
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const toBeClaimedCount = orders.filter(
    (o) => o.status === "TO_BE_CLAIMED",
  ).length;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black flex justify-center">
      <div className="relative w-full max-w-[90rem] p-4 md:p-6 text-white">
        <AuthenticatedNav />

        <div className="py-6 space-y-8">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex items-center gap-3">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Finance Overview
              </h1>
              <p className="text-gray-400 mt-1">
                Track your inventory, orders, and membership statistics
              </p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-4 shadow-lg shadow-purple-900/10 hover:border-purple-500/40 transition-all duration-300">
              <Chart
                data={chartData.weeklyOrders}
                labels={chartData.days}
                title="Weekly Orders"
                value={`${chartData.weeklyOrders.reduce((a, b) => a + b, 0)}`}
              />
            </div>
            <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-4 shadow-lg shadow-purple-900/10 hover:border-purple-500/40 transition-all duration-300">
              <Chart
                data={revenueData.data}
                labels={revenueData.labels}
                title="Weekly Revenue"
                value={revenueData.value}
              />
            </div>
            <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-4 shadow-lg shadow-purple-900/10 hover:border-purple-500/40 transition-all duration-300">
              <Chart
                data={chartData.weeklyOrders.map((v) => v * 0.8)}
                labels={chartData.days}
                title="Customer Activity"
                value={`${chartData.weeklyOrders.reduce((a, b) => a + b, 0)}`}
              />
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Section */}
            <div className="bg-gradient-to-br from-[#0F033C] to-[#0a0226] border border-purple-500/20 rounded-xl p-5 shadow-lg shadow-purple-900/10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Inventory</h2>
                </div>
                <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                  {inventory.length} items
                </span>
              </div>

              <div className="bg-purple-900/20 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1fr_1fr] text-xs text-gray-400 uppercase tracking-wider px-4 py-3 border-b border-purple-500/20">
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
                        className="grid grid-cols-[2fr_1fr_1fr] items-center px-4 py-3 hover:bg-purple-500/5 transition-colors"
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
                        <div className="text-center font-mono text-sm">
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
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Order Status</h2>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-amber-500/20 text-amber-400 px-2 py-1 rounded">
                    {pendingCount} pending
                  </span>
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {toBeClaimedCount} to claim
                  </span>
                </div>
              </div>

              <div className="bg-purple-900/20 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr] text-xs text-gray-400 uppercase tracking-wider px-4 py-3 border-b border-purple-500/20">
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
                        className="grid grid-cols-[1.5fr_1fr_1.5fr_1fr] items-center px-4 py-3 hover:bg-purple-500/5 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                            {order.studentName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium truncate text-sm">
                            {order.studentName}
                          </span>
                        </div>
                        <div className="text-center font-mono text-sm text-gray-300">
                          {order.referenceNumber}
                        </div>
                        <div className="text-center text-sm text-gray-300 truncate px-2">
                          {order.productName}
                        </div>
                        <div className="flex justify-center">
                          <StatusBadge status={order.status} variant="order" />
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
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold">Membership Status</h2>
                </div>
                <span className="text-xs text-gray-400 bg-gray-800/50 px-2 py-1 rounded">
                  {students.length} shown
                </span>
              </div>

              <div className="bg-purple-900/20 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-[2fr_1fr_1fr] text-xs text-gray-400 uppercase tracking-wider px-4 py-3 border-b border-purple-500/20">
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
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-xs font-bold">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium truncate text-sm">
                            {student.fullName}
                          </span>
                        </div>
                        <div className="text-center font-mono text-sm text-gray-300">
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
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Member to Non-Member Ratio
                  </h2>
                  <p className="text-xs text-gray-400">
                    Static data • Updated periodically
                  </p>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row bg-purple-900/20 rounded-lg p-5 gap-6 items-center">
                {/* Radial Chart */}
                <div className="shrink-0">
                  {loading ? (
                    <div className="w-[260px] h-[260px] flex items-center justify-center">
                      <LoadingSkeleton className="w-48 h-48 rounded-full" />
                    </div>
                  ) : (
                    <RadialChart
                      members={memberRatio.memberPercentage}
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
                          {loading ? "--" : `${memberRatio.memberPercentage}%`}
                        </span>
                      </div>
                    </div>

                    {/* Non-Member Stat */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-[#A000FF]"></div>
                        <span className="text-sm font-medium">Non-Members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#A000FF]">
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
                      <p className="text-xs text-gray-400 mb-1">Paid Members</p>
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
  );
};

export default Index;
