import { useEffect, useState, useCallback } from "react";
import Layout from "../../../../components/Layout";
import AuthenticatedNav from "../../../../components/AuthenticatedNav";
import StatsStrip from "./components/StatsStrip";
import CustomerFilterBar from "./components/CustomerFilterBar";
import CustomerTable from "./components/CustomerTable";
import BulkPaymentModal from "./components/BulkPaymentModal";
import ImageSelectDropdown from "../../../../components/ImageSelectDropdown";
import {
  getMerchCustomers,
  getMerchCustomersByStatus,
  getMerchCustomerCount,
  bulkMerchPayment,
  exportMerchCustomers,
} from "../../../../api/merchCustomer";
import {
  getAllMerchWithoutVariants,
  getMerchById,
} from "../../../../api/merch";
import type {
  MerchSummaryResponse,
  MerchDetailedResponse,
} from "../../../../interfaces/merch/MerchResponse";
import type { MerchCustomerResponse } from "../../../../interfaces/merch_customer/MerchCustomerResponse";
import type { BulkPaymentEntry } from "../../../../interfaces/merch_customer/BulkMerchPaymentRequest";
import type { PaginatedResponse } from "../../../../interfaces/paginated";
import type { OrderStatus } from "../../../../enums/OrderStatus";
import usePermissions from "../../../../hooks/usePermissions";
import { S3_BASE_URL } from "../../../../constant";

/**
 * Admin page for viewing who purchased a specific merch,
 * filtering by status, and recording bulk payments.
 * CUD operations (Bulk Payment) are restricted to ADMIN_FINANCE only.
 */
const MerchCustomersPage = () => {
  const { canEditFinance } = usePermissions();

  // merch selector state
  const [merchList, setMerchList] = useState<MerchSummaryResponse[]>([]);
  const [selectedMerchId, setSelectedMerchId] = useState<number | null>(null);
  const [selectedMerchDetail, setSelectedMerchDetail] =
    useState<MerchDetailedResponse | null>(null);
  const [merchLoading, setMerchLoading] = useState(true);

  // stats state
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [claimedCount, setClaimedCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(false);

  // table state
  const [tableData, setTableData] =
    useState<PaginatedResponse<MerchCustomerResponse> | null>(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // bulk payment state
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // export state
  const [isExporting, setIsExporting] = useState(false);

  // load merch list on mount
  useEffect(() => {
    const loadMerchList = async () => {
      try {
        setMerchLoading(true);
        const data = await getAllMerchWithoutVariants();
        setMerchList(data);
        // auto-select first merch if available
        if (data.length > 0) {
          setSelectedMerchId(data[0].merchId);
        }
      } catch (err) {
        console.error("failed to load merch list:", err);
      } finally {
        setMerchLoading(false);
      }
    };
    loadMerchList();
  }, []);

  // load merch details when selected merch changes (for bulk payment SKU selector)
  useEffect(() => {
    if (!selectedMerchId) {
      setSelectedMerchDetail(null);
      return;
    }
    const loadMerchDetail = async () => {
      try {
        const detail = await getMerchById(selectedMerchId);
        setSelectedMerchDetail(detail);
      } catch (err) {
        console.error("failed to load merch detail:", err);
      }
    };
    loadMerchDetail();
  }, [selectedMerchId]);

  // fetch stats when selected merch changes
  useEffect(() => {
    if (!selectedMerchId) return;
    const loadStats = async () => {
      try {
        setStatsLoading(true);
        const [totalRes, pendingRes, claimedRes] = await Promise.all([
          getMerchCustomerCount(selectedMerchId),
          getMerchCustomersByStatus(
            selectedMerchId,
            "PENDING" as OrderStatus,
            0,
            1,
          ),
          getMerchCustomersByStatus(
            selectedMerchId,
            "CLAIMED" as OrderStatus,
            0,
            1,
          ),
        ]);
        setTotalCustomers(totalRes.count);
        setPendingCount(pendingRes.totalElements);
        setClaimedCount(claimedRes.totalElements);
      } catch (err) {
        console.error("failed to load stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    loadStats();
  }, [selectedMerchId]);

  // fetch customer table data
  const fetchCustomers = useCallback(async () => {
    if (!selectedMerchId) return;
    try {
      setTableLoading(true);
      let data: PaginatedResponse<MerchCustomerResponse>;
      if (selectedStatus === "All") {
        data = await getMerchCustomers(selectedMerchId, currentPage, 7);
      } else {
        data = await getMerchCustomersByStatus(
          selectedMerchId,
          selectedStatus as OrderStatus,
          currentPage,
          7,
        );
      }

      // client-side search filter by name or id
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        data = {
          ...data,
          content: (data.content ?? []).filter(
            (c) =>
              c.studentName.toLowerCase().includes(q) ||
              c.studentId.toLowerCase().includes(q),
          ),
        };
      }

      setTableData(data);
    } catch (err) {
      console.error("failed to load customers:", err);
    } finally {
      setTableLoading(false);
    }
  }, [selectedMerchId, currentPage, selectedStatus, searchQuery]);

  // reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedStatus, searchQuery, selectedMerchId]);

  // debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  // handle bulk payment submit
  const handleBulkPayment = async (
    entries: BulkPaymentEntry[],
    merchVariantItemId: number,
    quantity: number,
  ) => {
    try {
      setBulkSubmitting(true);
      setBulkError(null);
      await bulkMerchPayment({
        entries,
        merchVariantItemId,
        quantity,
      });
      // refresh table and stats
      fetchCustomers();
      if (selectedMerchId) {
        const totalRes = await getMerchCustomerCount(selectedMerchId);
        setTotalCustomers(totalRes.count);
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to process bulk payment. Please check stock availability.";
      setBulkError(message);
      throw err; // rethrow so panel knows it failed
    } finally {
      setBulkSubmitting(false);
    }
  };

  // handle CSV export
  const handleExport = async () => {
    if (!selectedMerchId || isExporting) return;
    try {
      setIsExporting(true);
      const data = await exportMerchCustomers(selectedMerchId);

      // Convert to CSV
      const headers = [
        "Student ID",
        "Full Name",
        "Year Level",
        "Variant",
        "Qty",
        "Total Paid",
        "Payment Status",
        "Purchase Timestamp",
      ];

      const rows = data.map((c) => [
        c.studentId,
        c.studentName,
        c.yearLevel,
        [c.design, c.color, c.size].filter(Boolean).join(" / ") || "-",
        c.quantity,
        c.totalPrice.toFixed(2),
        c.orderStatus,
        c.orderDate,
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");

      // Trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `merch_${merchList[selectedMerchId - 1].merchName.toLowerCase()}_customers.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("failed to export customers:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Layout>
        <div className="relative w-full max-w-[90rem] p-6 text-white">
          <AuthenticatedNav />

          <div className="mt-8">
            {/* page header */}
            <div className="mb-8">
              <p className="text-xs font-semibold text-zinc-500 tracking-widest uppercase mb-2">
                Admin Dashboard
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Merch Customers
              </h1>
              <p className="text-sm text-zinc-400">
                View customers and manage bulk payments.
              </p>
            </div>

            {/* merch selector with preview */}
            <div className="bg-[#110e31]  rounded-xl border border-zinc-800 p-6 mb-8 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Merch Selector with Image Preview */}
                <div className="flex-1">
                  <ImageSelectDropdown
                    label="Select Merchandise"
                    placeholder={
                      merchLoading ? "Loading..." : "Choose a product"
                    }
                    disabled={merchLoading}
                    emptyMessage="No merchandise available"
                    value={selectedMerchId}
                    onChange={(val) => setSelectedMerchId(Number(val))}
                    options={merchList.map((m) => ({
                      value: m.merchId,
                      label: m.merchName,
                      sublabel: `P${m.basePrice.toFixed(2)} | ${m.merchType || "Product"}`,
                      imageUrl: m.s3ImageKey
                        ? `${S3_BASE_URL}${m.s3ImageKey}`
                        : undefined,
                      badge: m.merchType,
                      badgeVariant: "default" as const,
                    }))}
                  />
                  {selectedMerchDetail && (
                    <p className="text-xs text-zinc-500 mt-2">
                      Total Customers: {totalCustomers}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 lg:flex-row lg:items-end">
                  <button
                    onClick={handleExport}
                    disabled={!selectedMerchId || isExporting || tableLoading}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExporting ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Export CSV
                      </>
                    )}
                  </button>
                  {canEditFinance && (
                    <button
                      onClick={() => setShowBulkModal(true)}
                      disabled={!selectedMerchId || !selectedMerchDetail}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Bulk Add
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* stats strip */}
            {selectedMerchId && (
              <StatsStrip
                totalCustomers={totalCustomers}
                pendingCount={pendingCount}
                claimedCount={claimedCount}
                loading={statsLoading}
              />
            )}

            {/* filter bar */}
            {selectedMerchId && (
              <div className="bg-[#110e31]  rounded-xl border border-zinc-800 p-5 mb-6 shadow-sm">
                <CustomerFilterBar
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>
            )}

            {/* customer table */}
            {selectedMerchId && (
              <div className="mb-6">
                <CustomerTable
                  data={tableData}
                  loading={tableLoading}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </Layout>

      {/* Bulk Payment Modal */}
      <BulkPaymentModal
        isOpen={showBulkModal}
        onClose={() => {
          setShowBulkModal(false);
          setBulkError(null);
        }}
        merch={selectedMerchDetail}
        onSubmit={handleBulkPayment}
        submitting={bulkSubmitting}
        error={bulkError}
      />
    </>
  );
};

export default MerchCustomersPage;
