import React, { useState, useMemo } from "react";
import type { MerchDetailedResponse } from "../../../../../interfaces/merch/MerchResponse";
import type { MerchVariantResponse } from "../../../../../interfaces/merch_variant/MerchVariantResponse";
import type { MerchVariantItemResponse } from "../../../../../interfaces/merch_variant_item/MerchVariantItemResponse";
import BulkPaymentConfirmModal from "./BulkPaymentConfirmModal";

/**
 * Collapsible accordion panel for recording bulk payments.
 * Contains a SKU selector, student ID multi-select (chip-based),
 * quantity stepper, summary line, and submit button.
 * Only visible to ADMIN_FINANCE via usePermissions().canEditFinance.
 *
 * @param merch - the currently selected merch with all variants/items
 * @param onSubmit - callback to submit the bulk payment (studentIds, merchVariantItemId, quantity)
 * @param submitting - whether the submit request is in progress
 * @param error - inline error message from a failed submission
 */

interface BulkPaymentPanelProps {
  merch: MerchDetailedResponse | null;
  onSubmit: (
    studentIds: string[],
    merchVariantItemId: number,
    quantity: number
  ) => Promise<void>;
  submitting: boolean;
  error: string | null;
}

/**
 * Flattened SKU option combining variant + item data for the dropdown.
 */
interface SkuOption {
  merchVariantItemId: number;
  label: string;
  stockQuantity: number;
  variant: MerchVariantResponse;
  item: MerchVariantItemResponse;
}

const BulkPaymentPanel: React.FC<BulkPaymentPanelProps> = ({
  merch,
  onSubmit,
  submitting,
  error,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSkuId, setSelectedSkuId] = useState<number | null>(null);
  const [studentInput, setStudentInput] = useState("");
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);

  // flatten all variant items into selectable SKU options
  const skuOptions: SkuOption[] = useMemo(() => {
    if (!merch) return [];
    return merch.variants.flatMap((variant) =>
      variant.items.map((item) => ({
        merchVariantItemId: item.merchVariantItemId,
        label: [variant.design, variant.color, item.size]
          .filter(Boolean)
          .join(" / "),
        stockQuantity: item.stockQuantity,
        variant,
        item,
      }))
    );
  }, [merch]);

  const selectedSku = skuOptions.find(
    (s) => s.merchVariantItemId === selectedSkuId
  );

  // add student IDs via enter or comma
  const handleStudentInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addStudentIds(studentInput);
    }
  };

  // parse and add student IDs from input or pasted text
  const addStudentIds = (input: string) => {
    const ids = input
      .split(/[,\s]+/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0 && !studentIds.includes(id));

    if (ids.length > 0) {
      setStudentIds((prev) => [...prev, ...ids]);
    }
    setStudentInput("");
  };

  // handle paste for comma-separated IDs
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    addStudentIds(pasted);
  };

  // remove a single student ID chip
  const removeStudentId = (id: string) => {
    setStudentIds((prev) => prev.filter((s) => s !== id));
  };

  const totalItems = studentIds.length * quantity;
  const canSubmit =
    studentIds.length > 0 && selectedSkuId !== null && !submitting;

  const handleSubmitClick = () => {
    if (!canSubmit) return;
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (!selectedSkuId) return;
    await onSubmit(studentIds, selectedSkuId, quantity);
    setShowConfirm(false);
    // reset form on success
    setStudentIds([]);
    setSelectedSkuId(null);
    setQuantity(1);
    setStudentInput("");
  };

  if (!merch) return null;

  return (
    <>
      <div className="bg-[#110e31]  rounded-xl border border-zinc-800 overflow-hidden shadow-sm">
        {/* accordion header */}
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-zinc-800/50 transition-colors"
        >
          <span className="text-sm font-semibold text-white tracking-tight">
            Record Bulk Payment
          </span>
          <svg
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19 9-7 7-7-7"
            />
          </svg>
        </button>

        {/* accordion body */}
        {isExpanded && (
          <div className="px-6 pb-6 space-y-5 border-t border-zinc-800">
            {/* error banner */}
            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* sku selector */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
                Select SKU (Variant + Size)
              </label>
              <select
                value={selectedSkuId ?? ""}
                onChange={(e) =>
                  setSelectedSkuId(
                    e.target.value ? Number(e.target.value) : null,
                  )
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200 px-3 py-2.5 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer appearance-none"
              >
                <option value="">Choose a variant item...</option>
                {skuOptions.map((sku) => (
                  <option
                    key={sku.merchVariantItemId}
                    value={sku.merchVariantItemId}
                  >
                    {sku.label} — Stock: {sku.stockQuantity}
                  </option>
                ))}
              </select>
            </div>

            {/* student multi-select */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
                Student IDs
              </label>
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-2 min-h-[48px] flex flex-wrap gap-1.5 items-start focus-within:border-purple-500 transition-colors">
                {studentIds.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 bg-purple-500/15 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-500/20"
                  >
                    {id}
                    <button
                      onClick={() => removeStudentId(id)}
                      className="hover:text-white transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
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
                  </span>
                ))}
                <input
                  type="text"
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                  onKeyDown={handleStudentInputKeyDown}
                  onPaste={handlePaste}
                  onBlur={() => {
                    if (studentInput.trim()) addStudentIds(studentInput);
                  }}
                  placeholder={
                    studentIds.length === 0
                      ? "Type student IDs (press Enter or comma to add)..."
                      : ""
                  }
                  className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-200 placeholder-zinc-600 px-1 py-0.5 outline-none"
                />
              </div>
              <p className="text-xs text-zinc-600 mt-1.5">
                Press Enter, comma, or paste comma-separated IDs
              </p>
            </div>

            {/* quantity stepper */}
            <div>
              <label className="block text-xs font-medium text-zinc-500 tracking-wide uppercase mb-2">
                Quantity per student
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  −
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

            {/* summary line */}
            {studentIds.length > 0 && selectedSku && (
              <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4 flex items-center justify-between">
                <span className="text-sm text-zinc-400">
                  {studentIds.length} student
                  {studentIds.length !== 1 ? "s" : ""} × {quantity} ={" "}
                  <span className="text-white font-medium">
                    {totalItems} item{totalItems !== 1 ? "s" : ""}
                  </span>
                </span>
                {selectedSku && (
                  <span className="text-xs text-zinc-500">
                    Stock remaining: {selectedSku.stockQuantity}
                  </span>
                )}
              </div>
            )}

            {/* submit button */}
            <button
              onClick={handleSubmitClick}
              disabled={!canSubmit}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Processing..." : "Submit Bulk Payment"}
            </button>
          </div>
        )}
      </div>

      {/* confirmation modal */}
      <BulkPaymentConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        studentCount={studentIds.length}
        merchName={merch.merchName}
        quantity={quantity}
        submitting={submitting}
      />
    </>
  );
};

export default BulkPaymentPanel;
