import React, { useState, useMemo } from "react";
import type { MerchDetailedResponse } from "../../../../../interfaces/merch/MerchResponse";
import type { MerchVariantItemResponse } from "../../../../../interfaces/merch_variant_item/MerchVariantItemResponse";
import type { BulkPaymentEntry } from "../../../../../interfaces/merch_customer/BulkMerchPaymentRequest";
import { S3_BASE_URL } from "../../../../../constant";
import ImageSelectDropdown from "../../../../../components/ImageSelectDropdown";

/**
 * Modal for recording bulk payments with individual purchase dates.
 * Features a scrollable entry list with date picker per student,
 * SKU selector, quantity stepper, and submission handling.
 *
 * @param isOpen - whether the modal is visible
 * @param onClose - callback to dismiss the modal
 * @param merch - the currently selected merch with all variants/items
 * @param onSubmit - callback to submit the bulk payment (entries, merchVariantItemId, quantity)
 * @param submitting - whether the submit request is in progress
 * @param error - inline error message from a failed submission
 */

interface BulkPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  merch: MerchDetailedResponse | null;
  onSubmit: (
    entries: BulkPaymentEntry[],
    merchVariantItemId: number,
    quantity: number,
  ) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

interface SkuOption {
  merchVariantItemId: number;
  label: string;
  stockQuantity: number;
  item: MerchVariantItemResponse;
  s3ImageKey?: string | null;
}

interface EntryRow {
  id: string;
  studentId: string;
  orderDate: string;
}

const getCurrentDateTime = (): string => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
};

const BulkPaymentModal: React.FC<BulkPaymentModalProps> = ({
  isOpen,
  onClose,
  merch,
  onSubmit,
  submitting,
  error,
}) => {
  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null);
  const [entries, setEntries] = useState<EntryRow[]>([
    { id: crypto.randomUUID(), studentId: "", orderDate: getCurrentDateTime() },
  ]);
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Flatten all variant items into selectable SKU options
  const skuOptions: SkuOption[] = useMemo(() => {
    if (!merch) return [];
    return merch.variants.flatMap((variant) =>
      variant.items.map((item) => ({
        merchVariantItemId: item.merchVariantItemId,
        label: [variant.design, variant.color, item.size]
          .filter(Boolean)
          .join(" / "),
        stockQuantity: item.stockQuantity,
        item,
        s3ImageKey: variant.s3ImageKey,
      })),
    );
  }, [merch]);

  const selectedSku = skuOptions.find(
    (s) => s.merchVariantItemId === selectedSkuId,
  );

  // Parse and import CSV file
  const handleCsvImport = (file: File) => {
    setCsvError(null);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.trim().split("\n");

        if (lines.length < 2) {
          setCsvError("CSV must contain header and at least one data row");
          return;
        }

        // Parse header to find column indices
        const headerLine = lines[0];
        const headers = headerLine
          .split(",")
          .map((h) => h.trim().toLowerCase());

        const studentIdIndex = headers.findIndex((h) =>
          ["student id", "studentid", "id", "student_id"].includes(h),
        );
        const orderDateIndex = headers.findIndex((h) =>
          [
            "order date",
            "orderdate",
            "date",
            "order_date",
            "payment date",
            "paymentdate",
          ].includes(h),
        );

        if (studentIdIndex === -1) {
          setCsvError('CSV must contain a "Student ID" column');
          return;
        }

        // Parse data rows
        const newEntries: EntryRow[] = [];
        let validCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const values = line.split(",").map((v) => v.trim());
          const studentId = values[studentIdIndex]?.trim();

          if (!studentId) {
            continue;
          }

          // Use provided date or default to current date
          let orderDate = getCurrentDateTime();
          if (orderDateIndex !== -1 && values[orderDateIndex]) {
            try {
              const dateStr = values[orderDateIndex];
              const date = new Date(dateStr);
              if (!isNaN(date.getTime())) {
                const offset = date.getTimezoneOffset();
                const local = new Date(date.getTime() - offset * 60000);
                orderDate = local.toISOString().slice(0, 16);
              }
            } catch (err) {
              // Use default date on parse error
            }
          }

          newEntries.push({
            id: crypto.randomUUID(),
            studentId,
            orderDate,
          });
          validCount++;
        }

        if (validCount === 0) {
          setCsvError("No valid student entries found in CSV");
          return;
        }

        setEntries(newEntries);
      } catch (err) {
        setCsvError(err instanceof Error ? err.message : "Failed to parse CSV");
      }
    };

    reader.onerror = () => {
      setCsvError("Failed to read file");
    };

    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".csv")) {
      handleCsvImport(file);
    } else if (file) {
      setCsvError("Please select a valid CSV file");
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    const file = files?.[0];
    if (file && file.name.endsWith(".csv")) {
      handleCsvImport(file);
    } else if (file) {
      setCsvError("Please drop a valid CSV file");
    }
  };

  const downloadTemplate = () => {
    const headers = ["Student ID", "Order Date"];
    const rows = [
      ["12345678", new Date().toISOString().slice(0, 16)],
      ["12345679", new Date().toISOString().slice(0, 16)],
    ];
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bulk_payment_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Entry management
  const addEntry = () => {
    setEntries((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        studentId: "",
        orderDate: getCurrentDateTime(),
      },
    ]);
  };

  const removeEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEntry = (id: string, field: keyof EntryRow, value: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };

  // Handle paste for comma-separated IDs
  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    id: string,
  ) => {
    const pasted = e.clipboardData.getData("text");
    const ids = pasted
      .split(/[,\s\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (ids.length > 1) {
      e.preventDefault();
      const currentDate = getCurrentDateTime();
      const newEntries = ids.map((studentId) => ({
        id: crypto.randomUUID(),
        studentId,
        orderDate: currentDate,
      }));

      setEntries((prev) => {
        const updated = prev.map((entry) =>
          entry.id === id ? { ...entry, studentId: ids[0] } : entry,
        );
        return [...updated, ...newEntries.slice(1)];
      });
    }
  };

  const validEntries = entries.filter((e) => e.studentId.trim().length > 0);
  const totalItems = validEntries.length * quantity;
  const canSubmit =
    validEntries.length > 0 && selectedSkuId !== null && !submitting;

  const handleSubmitClick = () => {
    if (!canSubmit) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!selectedSkuId) return;
    const bulkEntries: BulkPaymentEntry[] = validEntries.map((e) => ({
      studentId: e.studentId,
      orderDate: e.orderDate + ":00",
    }));
    await onSubmit(bulkEntries, selectedSkuId, quantity);
    setShowConfirm(false);
    // Reset form on success
    setEntries([
      {
        id: crypto.randomUUID(),
        studentId: "",
        orderDate: getCurrentDateTime(),
      },
    ]);
    setSelectedSkuId(null);
    setQuantity(1);
    onClose();
  };

  const handleClose = () => {
    if (submitting) return;
    onClose();
  };

  if (!isOpen || !merch) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-labelledby="bulk-payment-title"
      aria-modal="true"
      onClick={handleClose}
    >
      <div
        className="bg-[#110e31]  border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Merch Preview */}
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-start gap-4">
            {/* Merch Image */}
            {merch.variants[0]?.s3ImageKey && (
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-zinc-700/50 shrink-0">
                <img
                  src={`${S3_BASE_URL}${merch.variants[0].s3ImageKey}`}
                  alt={merch.merchName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2
                id="bulk-payment-title"
                className="text-lg font-semibold text-white truncate"
              >
                Bulk Record Payment
              </h2>
              <p className="text-sm text-purple-400 font-medium truncate">
                {merch.merchName}
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={submitting}
              className="p-2 text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Error Banner */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* SKU Selector with Image Preview */}
          <div>
            <ImageSelectDropdown
              label="Select SKU (Variant + Size)"
              placeholder="Choose a variant item..."
              value={selectedSkuId}
              onChange={(val) => setSelectedSkuId(Number(val))}
              options={skuOptions.map((sku) => ({
                value: sku.merchVariantItemId,
                label: sku.label,
                sublabel: `Stock: ${sku.stockQuantity} available`,
                imageUrl: sku.s3ImageKey
                  ? `${S3_BASE_URL}${sku.s3ImageKey}`
                  : undefined,
                badge:
                  sku.stockQuantity > 10
                    ? "In Stock"
                    : sku.stockQuantity > 0
                      ? "Low Stock"
                      : "Out of Stock",
                badgeVariant:
                  sku.stockQuantity > 10
                    ? "success"
                    : sku.stockQuantity > 0
                      ? "warning"
                      : "danger",
              }))}
            />
          </div>

          {/* CSV Import Section */}
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-purple-300">
                  Import from CSV
                </span>
              </div>
              <button
                onClick={downloadTemplate}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                title="Download CSV template"
              >
                Download Template
              </button>
            </div>

            {/* CSV Error */}
            {csvError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2">
                <p className="text-xs text-red-400">{csvError}</p>
              </div>
            )}

            {/* File Input and Instructions */}
            <div className="space-y-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex items-center justify-center gap-2 w-full px-3 py-4 border-2 border-dashed rounded-lg transition-all cursor-pointer text-xs font-medium ${
                  isDragOver
                    ? "border-purple-500/80 bg-purple-500/20"
                    : "border-purple-500/40 bg-purple-500/5 hover:border-purple-500/60 hover:bg-purple-500/10"
                }`}
              >
                <svg
                  className="w-4 h-4 text-purple-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16v-4m0 0V8m0 4H8m4 0h4M4 20h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"
                  />
                </svg>
                <span
                  className={`transition-colors ${
                    isDragOver
                      ? "text-purple-200"
                      : "text-purple-300 hover:text-purple-200"
                  }`}
                >
                  {isDragOver
                    ? "Drop CSV file here"
                    : "Click to upload or drag CSV file"}
                </span>
              </div>
              <p className="text-xs text-purple-400/70 text-center">
                CSV should have columns: Student ID, Order Date (optional)
              </p>
            </div>
          </div>

          {/* Entry List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-medium text-zinc-500 tracking-wide uppercase">
                Student Entries ({validEntries.length})
              </label>
              <button
                onClick={addEntry}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                + Add Entry
              </button>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-2 bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-2"
                >
                  <span className="text-xs text-zinc-600 w-6 text-center">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={entry.studentId}
                    onChange={(e) =>
                      updateEntry(entry.id, "studentId", e.target.value)
                    }
                    onPaste={(e) => handlePaste(e, entry.id)}
                    placeholder="Student ID"
                    className="flex-1 min-w-0 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder-zinc-600 px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <input
                    type="datetime-local"
                    value={entry.orderDate}
                    onChange={(e) =>
                      updateEntry(entry.id, "orderDate", e.target.value)
                    }
                    className="w-44 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  {entries.length > 1 && (
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
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
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              Paste comma-separated IDs to add multiple entries at once
            </p>
          </div>

          {/* Quantity Stepper */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
              Quantity per Student
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-10 h-10 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                min={1}
                className="w-16 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 text-center px-2 py-2 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 space-y-4">
          {/* Summary */}
          {validEntries.length > 0 && selectedSku && (
            <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                {validEntries.length} student
                {validEntries.length !== 1 ? "s" : ""} x {quantity} ={" "}
                <span className="text-white font-medium">
                  {totalItems} item{totalItems !== 1 ? "s" : ""}
                </span>
              </span>
              <span className="text-xs text-zinc-500">
                Stock: {selectedSku.stockQuantity}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 border border-zinc-700 text-zinc-400 hover:text-zinc-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitClick}
              disabled={!canSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
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
                  Processing...
                </span>
              ) : (
                "Submit Batch"
              )}
            </button>
          </div>
        </div>

        {/* Confirmation Overlay */}
        {showConfirm && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex items-center justify-center p-6">
            <div className="bg-[#110e31]  border border-zinc-800 rounded-xl p-6 max-w-sm w-full space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Confirm Bulk Payment
              </h3>
              <p className="text-sm text-zinc-400">
                You are about to create{" "}
                <span className="text-white font-medium">{totalItems}</span>{" "}
                order
                {totalItems !== 1 ? "s" : ""} for{" "}
                <span className="text-purple-400 font-medium">
                  {merch.merchName}
                </span>
                .
              </p>
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Students</span>
                  <span className="text-white font-medium">
                    {validEntries.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">Qty per student</span>
                  <span className="text-white font-medium">{quantity}</span>
                </div>
                <div className="flex justify-between text-sm border-t border-zinc-700/50 pt-2">
                  <span className="text-zinc-500">Total items</span>
                  <span className="text-white font-bold">{totalItems}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                  className="flex-1 border border-zinc-700 text-zinc-400 hover:text-zinc-200 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={submitting}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkPaymentModal;
