import { useEffect, useState } from "react";
import LineChart from "./components/LineChart";
import AuthenticatedNav from "../../../components/AuthenticatedNav";
import { FaClockRotateLeft, FaDownload, FaPrint } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import {
  IoClose,
  IoSearch,
  IoFilter,
  IoSwapVertical,
  IoChevronDown,
} from "react-icons/io5";
import {
  getSalesStats,
  getTransactions,
  approveTransaction,
  rejectTransaction,
  getFullHistory,
  exportTransactionsCSV,
  printTransactionsSummary,
  type SalesStats,
  type Transaction,
  type TransactionStatus,
} from "../../../api/sales";
import HistoryModal from "./components/HistoryModal";
import ConfirmationModal from "./components/ConfirmationModal";
import OrderDetailModal from "./components/OrderDetailModal";
import { usePermissions } from "../../../hooks/usePermissions";
import Pagination from "../../merch/transactions/components/Pagination";
import type { TransactionParams } from "../../../api/sales";

// Status display mapping
const getStatusDisplay = (status: TransactionStatus) => {
  switch (status) {
    case "CLAIMED":
      return {
        label: "Approved",
        className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
      };
    case "REJECTED":
      return {
        label: "Rejected",
        className: "bg-red-500/20 text-red-400 border-red-500/20",
      };
    case "PENDING":
    default:
      return {
        label: "Pending",
        className: "bg-amber-500/20 text-amber-400 border-amber-500/20",
      };
  }
};

// Period labels mapping
const periodLabels = {
  DAILY: "Daily revenue analysis",
  WEEKLY: "Weekly revenue analysis",
  MONTHLY: "Monthly revenue analysis",
  YEARLY: "Yearly revenue analysis",
  ALL_TIME: "All-time revenue analysis",
};

const Index = () => {
  // Stats State
  const [stats, setStats] = useState<SalesStats>({
    totalSales: 0,
    currency: "PHP",
    labels: [],
    data: [],
  });

  // Period State
  const [period, setPeriod] = useState<
    "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY" | "ALL_TIME"
  >("DAILY");

  // Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "">("");
  const [yearFilter, setYearFilter] = useState("2026");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState<{
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  } | null>(null);

  // Modal State
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [orderDetailModal, setOrderDetailModal] = useState<{
    isOpen: boolean;
    orderId: number | null;
    studentName: string;
  }>({ isOpen: false, orderId: null, studentName: "" });
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject";
    id: number | null;
  }>({ isOpen: false, type: "approve", id: null });

  // Export State
  const [exporting, setExporting] = useState(false);

  // Permissions - check if user can approve/reject transactions
  const { canApproveTransactions, canManageOrder } = usePermissions();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  useEffect(() => {
    // Debounced search / filter update
    const timer = setTimeout(() => {
      setCurrentPage(0); // Reset to first page when filters change
      fetchTransactions();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, yearFilter]);

  useEffect(() => {
    // Fetch transactions when page changes
    fetchTransactions();
  }, [currentPage]);

  const fetchDashboardData = async () => {
    setStatsLoading(true);
    try {
      const [statsData, historyData] = await Promise.all([
        getSalesStats(period),
        getFullHistory(),
      ]);
      setStats(statsData);
      setAllTransactions(historyData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params: TransactionParams = {
        page: currentPage,
        size: 5, // Changed from 10 to 5
        search: search || undefined,
        status: statusFilter || undefined,
        year: parseInt(yearFilter),
      };
      const response = await getTransactions(params);
      setTransactions(response.content);
      setPaginationInfo({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        size: response.size,
        number: response.number,
        first: response.number === 0,
        last: response.number === response.totalPages - 1,
      });
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (id: number, type: "approve" | "reject") => {
    setConfirmModal({ isOpen: true, type, id });
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.id) return;
    try {
      if (confirmModal.type === "approve") {
        await approveTransaction(confirmModal.id);
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === confirmModal.id
              ? { ...t, status: "CLAIMED" as TransactionStatus }
              : t,
          ),
        );
      } else {
        await rejectTransaction(confirmModal.id);
        setTransactions((prev) =>
          prev.map((t) =>
            t.id === confirmModal.id
              ? { ...t, status: "REJECTED" as TransactionStatus }
              : t,
          ),
        );
      }
      setConfirmModal({ ...confirmModal, isOpen: false });
      // Refetch to ensure pagination is correct after status change
      fetchTransactions();
    } catch (error) {
      console.error("Action failed:", error);
    }
  };

  const handleViewOrderDetails = (transaction: Transaction) => {
    setOrderDetailModal({
      isOpen: true,
      orderId: transaction.orderId || transaction.id,
      studentName: transaction.studentName,
    });
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const data =
        allTransactions.length > 0 ? allTransactions : await getFullHistory();
      exportTransactionsCSV(data);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const handlePrintSummary = async () => {
    try {
      const data =
        allTransactions.length > 0 ? allTransactions : await getFullHistory();
      printTransactionsSummary(data, stats.totalSales);
    } catch (error) {
      console.error("Print failed:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#41169C] via-[#20113F] to-black">
      <div className="relative w-full max-w-[90rem] mx-auto px-4 md:px-6 py-4 md:py-6 text-white">
        <AuthenticatedNav />

        {/* MAIN CONTENT */}
        <div className="mt-6 space-y-6">
          {/* ================= SALES CHART & ACTIONS ROW ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chart Section - Takes 3 columns */}
            <div className="lg:col-span-3 bg-[#0F033C]/80 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                    Sales Performance
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    {periodLabels[period]}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {/* Period Dropdown */}
                  <div className="relative">
                    <select
                      value={period}
                      onChange={(e) =>
                        setPeriod(
                          e.target.value as
                            | "DAILY"
                            | "WEEKLY"
                            | "MONTHLY"
                            | "YEARLY"
                            | "ALL_TIME",
                        )
                      }
                      className="bg-[#1a0b4d] border border-purple-500/20 text-sm px-4 py-2 pr-8 rounded-lg outline-none focus:border-purple-500 appearance-none cursor-pointer"
                    >
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                      <option value="ALL_TIME">All-time</option>
                    </select>
                    <IoChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={14}
                    />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live
                  </div>
                </div>
              </div>

              <div className="h-[320px]">
                {statsLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <LineChart
                    data={stats.data}
                    labels={stats.labels}
                    totalSales={stats.totalSales}
                  />
                )}
              </div>
            </div>

            {/* Quick Actions Panel - Takes 1 column */}
            <div className="flex flex-col gap-4">
              {/* Total Revenue Card */}
              <div className="bg-[#0F033C]/80 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-xl">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-emerald-400">
                  {statsLoading
                    ? "..."
                    : `₱${stats.totalSales.toLocaleString()}`}
                </p>
                <div className="mt-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => setShowHistoryModal(true)}
                    className="w-full flex items-center justify-center gap-2 text-sm bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/25"
                  >
                    <FaClockRotateLeft size={14} />
                    View Full History
                  </button>
                </div>
              </div>

              {/* Export Options Card */}
              <div className="bg-[#0F033C]/80 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-xl flex-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
                  Export Options
                </p>
                <div className="space-y-2">
                  <button
                    onClick={handleExportCSV}
                    disabled={exporting}
                    className="w-full flex items-center justify-center gap-2 text-sm text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaDownload size={12} />
                    {exporting ? "Exporting..." : "Download Report (CSV)"}
                  </button>
                  <button
                    onClick={handlePrintSummary}
                    className="w-full flex items-center justify-center gap-2 text-sm text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 py-2.5 rounded-lg transition-all"
                  >
                    <FaPrint size={12} />
                    Print Summary
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ================= TRANSACTIONS TABLE ================= */}
          <div className="bg-[#0F033C]/80 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-xl">
            {/* Table Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold">Recent Transactions</h2>
                <p className="text-xs text-gray-400 mt-1">
                  Manage and verify incoming payments
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Search */}
                <div className="relative">
                  <IoSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-48 bg-[#1a0b4d] border border-purple-500/20 text-sm px-4 py-2 pl-9 rounded-lg outline-none focus:border-purple-500 transition-colors placeholder:text-gray-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <IoSwapVertical
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={14}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as TransactionStatus | "")
                    }
                    className="bg-[#1a0b4d] border border-purple-500/20 text-sm px-4 py-2 pl-9 pr-8 rounded-lg outline-none focus:border-purple-500 appearance-none cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="CLAIMED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                {/* Year Filter */}
                <div className="relative">
                  <IoFilter
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={14}
                  />
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="bg-[#1a0b4d] border border-purple-500/20 text-sm px-4 py-2 pl-9 pr-8 rounded-lg outline-none focus:border-purple-500 appearance-none cursor-pointer"
                  >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto rounded-xl border border-purple-500/10">
              <table className="w-full min-w-[800px]">
                <thead className="bg-[#1a0b4d]/70 text-xs font-semibold uppercase text-gray-400">
                  <tr>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Student ID</th>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Membership</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    {canApproveTransactions && (
                      <th className="px-4 py-3 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10 text-sm">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={canApproveTransactions ? 7 : 6}
                        className="py-12 text-center text-gray-400"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                          Loading transactions...
                        </div>
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={canManageOrder ? 7 : 6}
                        className="py-12 text-center text-gray-400"
                      >
                        No transactions found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t) => {
                      const statusDisplay = getStatusDisplay(t.status);
                      return (
                        <tr
                          key={t.id}
                          className={`group ${t.status === "CLAIMED" ? "hover:bg-white/5 transition-colors cursor-pointer" : ""}`}
                          onClick={() =>
                            t.status === "CLAIMED" && handleViewOrderDetails(t)
                          }
                        >
                          <td className="px-4 py-3  text-gray-400 text-xs">
                            #{t.orderId}
                          </td>
                          <td className="px-4 py-3  text-gray-400 text-xs">
                            {t.idNumber}
                          </td>
                          <td className="px-4 py-3 font-medium text-white">
                            {t.studentName}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-gray-300 text-xs bg-white/5 px-2 py-1 rounded">
                              {t.membershipType}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right  text-emerald-400 font-medium">
                            ₱{t.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(t.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold border ${statusDisplay.className}`}
                            >
                              {statusDisplay.label}
                            </span>
                          </td>
                          {canApproveTransactions && (
                            <td className="px-4 py-3">
                              <div className="flex gap-2 justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                                {t.status === "PENDING" ? (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleActionClick(t.id, "approve");
                                      }}
                                      className="w-8 h-8 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center transition-colors"
                                      title="Approve"
                                    >
                                      <FaCheck size={12} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleActionClick(t.id, "reject");
                                      }}
                                      className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center transition-colors"
                                      title="Reject"
                                    >
                                      <IoClose size={16} />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-500 italic">
                                    —
                                  </span>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {paginationInfo && paginationInfo.totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={paginationInfo.totalPages}
                  pageNumber={paginationInfo.number}
                  first={paginationInfo.first}
                  last={paginationInfo.last}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmAction}
        type={confirmModal.type}
        title={
          confirmModal.type === "approve"
            ? "Confirm Payment"
            : "Reject Transaction"
        }
        message={
          confirmModal.type === "approve"
            ? "Are you sure you want to APPROVE this transaction? The order status will be updated to CLAIMED."
            : "Are you sure you want to REJECT this transaction? The order status will be updated to REJECTED."
        }
      />

      <OrderDetailModal
        isOpen={orderDetailModal.isOpen}
        orderId={orderDetailModal.orderId}
        studentName={orderDetailModal.studentName}
        onClose={() =>
          setOrderDetailModal({
            isOpen: false,
            orderId: null,
            studentName: "",
          })
        }
      />
    </div>
  );
};

export default Index;
