import { useEffect, useState } from "react";
import {
  type Transaction,
  getTransactions,
  type TransactionStatus,
  printOrderSummary,
} from "../../../../api/sales";
import { X, Search, Calendar, Printer, Filter } from "lucide-react";
import OrderDetailModal from "./OrderDetailModal";
import Pagination from "../../../../pages/merch/transactions/components/Pagination";
import type { TransactionParams } from "../../../../api/sales";
import CustomDropdown from "../../../../components/CustomDropdown";
import order from "../../../../api/order";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [printingId, setPrintingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "">("");
  const [yearFilter, setYearFilter] = useState<string>("2026");

  const [orderDetailModal, setOrderDetailModal] = useState<{
    isOpen: boolean;
    orderId: number | null;
    studentName: string;
  }>({ isOpen: false, orderId: null, studentName: "" });

  // Pagination State
// ... (Pagination State and effects remain the same) ...
  const [currentPage, setCurrentPage] = useState(0);
  const [paginationInfo, setPaginationInfo] = useState<{
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, currentPage]);

  useEffect(() => {
    if (isOpen) {
      // Debounced search and filters
      const timer = setTimeout(() => {
        setCurrentPage(0); // Reset to first page when filters change
        loadHistory();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [search, statusFilter, yearFilter]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params: TransactionParams = {
        page: currentPage,
        size: 5,
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
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "CLAIMED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  const yearOptions = [
    { label: "2026", value: "2026" },
    { label: "2025", value: "2025" },
    { label: "2024", value: "2024" },
  ];

  const handleViewOrderDetails = (transaction: Transaction) => {
    setOrderDetailModal({
      isOpen: true,
      orderId: transaction.orderId || transaction.id,
      studentName: transaction.studentName,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrint = async (transaction: Transaction) => {
    setPrintingId(transaction.id);
    try {
      const orderData = await order.getOrderById(transaction.orderId);
      if (orderData) {
        printOrderSummary(orderData);
      }
    } catch (err) {
      console.error(`Error fetching order ${transaction.orderId}:`, err);
    } finally {
      setPrintingId(null);
    }
  };

  if (!isOpen) return null;
// ... (return JSX remains the same until the printer button) ...

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl bg-[#0F033C] border border-zinc-700 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200 overflow-hidden text-white">
        {/* Header */}
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black ">TRANSACTION HISTORY</h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Toolbar/Filters */}
        <div className="p-6 border-b border-white/5 bg-white/[0.01] flex flex-col lg:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">
              Search Records
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by name, ID or order number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="w-full lg:w-48">
            <CustomDropdown
              label="Status Filter"
              options={statusOptions}
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as any)}
            />
          </div>

          <div className="w-full lg:w-32">
            <CustomDropdown
              label="Year"
              options={yearOptions}
              value={yearFilter}
              onChange={setYearFilter}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/[0.03] sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Order Info
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Student Details
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Membership
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">
                  Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5 bg-white/[0.01]">
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-16 bg-white/10 rounded animate-pulse"></div>
                        <div className="h-3 w-24 bg-white/10 rounded animate-pulse"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-2">
                        <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                        <div className="h-3 w-20 bg-white/10 rounded animate-pulse"></div>
                      </div>
                    </td>
                    <td className="px-6 py-5"><div className="h-6 w-24 bg-white/10 rounded-lg animate-pulse"></div></td>
                    <td className="px-6 py-5 text-right"><div className="h-4 w-20 bg-white/10 rounded animate-pulse ml-auto"></div></td>
                    <td className="px-6 py-5 text-center"><div className="h-6 w-20 bg-white/10 rounded-full animate-pulse mx-auto"></div></td>
                    <td className="px-6 py-5"></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-12 h-12 text-zinc-800 mb-2" />
                      <p className="text-zinc-400 font-bold">
                        No transactions found
                      </p>
                      <p className="text-zinc-600 text-xs uppercase tracking-widest">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((t) => (
                  <tr
                    key={t.id}
                    className="group hover:bg-white/[0.02] transition-colors cursor-pointer border-none"
                    onClick={() =>
                      (t.status === "CLAIMED" || t.status === "PENDING") &&
                      handleViewOrderDetails(t)
                    }
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-black text-white">
                          #{t.orderId}
                        </span>
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          <Calendar size={12} />
                          <span className="text-[10px] font-bold uppercase">
                            {new Date(t.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-200 group-hover:text-purple-400 transition-colors">
                          {t.studentName}
                        </span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                          {t.idNumber}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                        {t.membershipType}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="text-sm font-black text-emerald-400">
                        ₱{t.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          t.status === "CLAIMED"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : t.status === "REJECTED"
                              ? "bg-red-500/10 text-red-400 border-red-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {t.status === "CLAIMED"
                          ? "Approved"
                          : t.status === "REJECTED"
                            ? "Rejected"
                            : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      {t.status === "CLAIMED" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrint(t);
                          }}
                          disabled={printingId === t.id}
                          className="p-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:scale-100"
                          title="Print Receipt"
                        >
                          {printingId === t.id ? (
                            <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                          ) : (
                            <Printer size={16} />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-white/[0.02] flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Record Count
              </span>
              <span className="text-sm font-bold text-zinc-300">
                {paginationInfo?.totalElements || 0} Total
              </span>
            </div>
            <div className="w-px h-8 bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                Current Page Sum
              </span>
              <span className="text-sm font-bold text-emerald-400">
                ₱
                {transactions
                  .reduce((acc, curr) => acc + curr.amount, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>

          {/* Pagination Controls */}
          {paginationInfo && paginationInfo.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginationInfo.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

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
}
