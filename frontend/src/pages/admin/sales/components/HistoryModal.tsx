import { useEffect, useState } from "react";
import { type Transaction, getTransactions } from "../../../../api/sales";
import { X, Search, Calendar } from "lucide-react";
import OrderDetailModal from "./OrderDetailModal";
import Pagination from "../../../../pages/merch/transactions/components/Pagination";
import type { TransactionParams } from "../../../../api/sales";

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoryModal({ isOpen, onClose }: HistoryModalProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [orderDetailModal, setOrderDetailModal] = useState<{
    isOpen: boolean;
    orderId: number | null;
    studentName: string;
  }>({ isOpen: false, orderId: null, studentName: "" });

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
  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [currentPage]);

  useEffect(() => {
    if (isOpen) {
      // Debounced search
      const timer = setTimeout(() => {
        setCurrentPage(0); // Reset to first page when searching
        loadHistory();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [search]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const params: TransactionParams = {
        page: currentPage,
        size: 5, // Same page size as main table
        search: search || undefined,
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
  const filteredTransactions = transactions;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-[#0F033C]/80 border border-zinc-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">
              Transaction History
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Complete record of all sales and transactions
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#0F033C]/80 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b  bg-[#0F033C]/80 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F033C]/80 border border-zinc-700 text-zinc-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-900/80 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  ID Number
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">
                  Amount
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading records...
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    No transactions found matching "{search}"
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className={`hover:bg-zinc-800/50 transition-colors ${t.status === "CLAIMED" ? "cursor-pointer" : ""}`}
                    onClick={() =>
                      t.status === "CLAIMED" && handleViewOrderDetails(t)
                    }
                  >
                    <td className="px-6 py-4 text-sm font-mono text-zinc-500">
                      #{t.orderId}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-zinc-600" />
                        {new Date(t.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-zinc-500">
                      {t.idNumber}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-zinc-200">
                      {t.studentName}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-xs">
                        {t.membershipType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono font-medium text-emerald-400 text-right">
                      ₱{t.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${t.status === "CLAIMED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : t.status === "REJECTED" ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}
                      >
                        {t.status === "CLAIMED"
                          ? "Approved"
                          : t.status === "REJECTED"
                            ? "Rejected"
                            : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/30 flex justify-between items-center text-xs text-zinc-500">
          <span>Showing {filteredTransactions.length} records</span>
          <span>
            Total Volume: ₱
            {filteredTransactions
              .reduce((acc, curr) => acc + curr.amount, 0)
              .toLocaleString()}
          </span>
        </div>

        {/* Pagination Controls */}
        {paginationInfo && paginationInfo.totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800">
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
