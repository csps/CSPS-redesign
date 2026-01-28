import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import type { MerchDetailedResponse } from "../../../../../interfaces/merch/MerchResponse";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
  editedStocks: { [key: number]: { [key: string]: number } };
  editedPrices: { [key: number]: { [key: string]: number } };
  merch: MerchDetailedResponse;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  isSaving,
  editedStocks,
  editedPrices,
  merch,
}) => {
  if (!open) return null;

  const getChanges = () => {
    const changes: {
      variantName: string;
      itemName: string;
      oldStock: number;
      newStock: number;
      oldPrice: number;
      newPrice: number;
    }[] = [];

    merch.variants.forEach((variant, variantIdx) => {
      const stockMap = editedStocks[variantIdx] || {};
      const priceMap = editedPrices[variantIdx] || {};

      variant.items.forEach((item) => {
        const key = item.size || item.merchVariantItemId.toString();
        const newStock = stockMap[key];
        const newPrice = priceMap[key];

        const hasStockChange =
          newStock !== undefined && newStock !== item.stockQuantity;
        const hasPriceChange =
          newPrice !== undefined && newPrice !== item.price;

        if (hasStockChange || hasPriceChange) {
          changes.push({
            variantName:
              variant.color || variant.design || `Variant ${variantIdx + 1}`,
            itemName: item.size || `Item ${item.merchVariantItemId}`,
            oldStock: item.stockQuantity,
            newStock: hasStockChange ? newStock : item.stockQuantity,
            oldPrice: item.price,
            newPrice: hasPriceChange ? newPrice : item.price,
          });
        }
      });
    });

    return changes;
  };

  const changes = getChanges();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-10">
      <div className="bg-gray-900 border border-white/20 rounded-lg max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-xl font-bold text-white">Confirm Changes</h3>
              <p className="text-gray-400 text-sm">
                Review the changes before saving
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {changes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">
              No changes detected
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-white font-medium">
                The following changes will be applied:
              </p>
              <div className="space-y-3">
                {changes.map((change, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-purple-300 font-medium">
                        {change.variantName}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {change.itemName}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Stock</p>
                        <p className="text-white">
                          {change.oldStock} → {change.newStock}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400">Price</p>
                        <p className="text-white">
                          ₱{change.oldPrice.toFixed(2)} → ₱
                          {change.newPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving || changes.length === 0}
            className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Confirm & Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
