import React, { useState } from "react";
import { FaPlus, FaBox, FaTrash } from "react-icons/fa";
import { ClothingSizing } from "../../../../../enums/ClothingSizing";
import type { MerchVariantResponse } from "../../../../../interfaces/merch_variant/MerchVariantResponse";
import CustomDropdown from "../../../../../components/CustomDropdown";

interface StockManagementProps {
  // ... rest of the props ...
  variant: MerchVariantResponse;
  variantIndex: number;
  editedStocks: { [key: number]: { [key: string]: number } };
  editedPrices: { [key: number]: { [key: string]: number } };
  onStockChange: (
    variantIdx: number,
    sizeOrId: string,
    quantity: number,
  ) => void;
  onPriceChange: (variantIdx: number, sizeOrId: string, price: number) => void;
  onAddSize?: (variantIdx: number, size: string) => void;
  onDeleteItem?: (itemId: number) => void;
  isClothing?: boolean;
  canEdit?: boolean; // If false, component is read-only
}

const StockManagement: React.FC<StockManagementProps> = ({
  variant,
  variantIndex,
  editedStocks,
  editedPrices,
  onStockChange,
  onPriceChange,
  onAddSize,
  onDeleteItem,
  isClothing = false,
  canEdit = true,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");

  const variantStocks = editedStocks[variantIndex];
  const variantPrices = editedPrices[variantIndex];
  const allClothingSizes = Object.values(ClothingSizing);
  const existingSizes = new Set(
    variant.items.map((item) => item.size).filter(Boolean),
  );
  const availableSizes = allClothingSizes.filter(
    (size) => !existingSizes.has(size),
  );

  const handleQuantityChange = (sizeOrId: string, value: string) => {
    if (value === "") {
      onStockChange(variantIndex, sizeOrId, 0);
      return;
    }

    const num = parseInt(value);
    if (!isNaN(num) && num >= 0) {
      onStockChange(variantIndex, sizeOrId, num);
    }
  };

  const handlePriceChange = (sizeOrId: string, value: string) => {
    if (value === "") {
      onPriceChange(variantIndex, sizeOrId, 0);
      return;
    }

    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      onPriceChange(variantIndex, sizeOrId, num);
    }
  };

  const getStockValue = (sizeOrId: string) => {
    const stock = variantStocks?.[sizeOrId];
    return stock !== undefined ? stock : 0;
  };

  const getPriceValue = (sizeOrId: string) => {
    const price = variantPrices?.[sizeOrId];
    return price !== undefined ? price : 0;
  };

  const handleAddSize = () => {
    if (selectedSize && onAddSize) {
      onAddSize(variantIndex, selectedSize);
      setSelectedSize("");
    }
  };

  const totalStock = Object.values(variantStocks || {}).reduce(
    (a, b) => a + b,
    0,
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm text-gray-400">Stock: {totalStock}</p>
          </div>
        </div>

        {/* Inline Add Size - only show when canEdit */}
        {canEdit && isClothing && availableSizes.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="w-40">
              <CustomDropdown
                options={availableSizes.map(s => ({ label: s, value: s }))}
                value={selectedSize}
                onChange={setSelectedSize}
                placeholder="Add size..."
                className="!bg-transparent"
              />
            </div>
            <button
              onClick={handleAddSize}
              disabled={!selectedSize}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 h-[46px]"
            >
              <FaPlus size={12} /> Add
            </button>
          </div>
        )}
      </div>

      {/* Stock Items */}
      <div className="space-y-2">
        {variant.items.length > 0 ? (
          variant.items.map((item) => {
            const sizeOrId = item.size || item.merchVariantItemId.toString();
            const currentStock = getStockValue(sizeOrId);
            const currentPrice = getPriceValue(sizeOrId);
            const originalStock = item.stockQuantity;
            const originalPrice = item.price;
            const hasChanged =
              currentStock !== originalStock || currentPrice !== originalPrice;

            return (
              <div
                key={item.merchVariantItemId}
                className={`p-4 rounded-lg border transition-all ${
                  hasChanged
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-white/5 border-white/10 hover:bg-white/8"
                }`}
              >
                {/* Size/Item Label */}
                <div className="flex items-center gap-3 mb-3">
                  {item.size && (
                    <>
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-purple-300">
                          {item.size ? item.size.substring(0, 2) : "•"}
                        </span>
                      </div>
                      <span className="font-medium text-white truncate flex-1">
                        {item.size || `Item ${item.merchVariantItemId}`}
                      </span>
                    </>
                  )}
                  {onDeleteItem && canEdit && item.merchVariantItemId !== -1 && (
                    <button
                      onClick={() => onDeleteItem(item.merchVariantItemId)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all ml-auto"
                      title="Delete item"
                    >
                      <FaTrash size={12} />
                    </button>
                  )}
                </div>

                {/* Stock and Price Section */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Stock Column */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Stock:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          hasChanged
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        {originalStock}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={currentStock === 0 ? "" : currentStock}
                      onChange={(e) =>
                        handleQuantityChange(sizeOrId, e.target.value)
                      }
                      min="0"
                      placeholder="New stock"
                      disabled={!canEdit}
                      className={`w-full px-3 py-2 bg-black/40 border rounded-lg text-white text-center font-medium focus:outline-none focus:ring-2 transition-all ${!canEdit ? "opacity-50 cursor-not-allowed border-white/10" : "border-white/20 focus:border-purple-500 focus:ring-purple-500/50"}`}
                    />
                  </div>

                  {/* Price Column */}
                  <div>
                    <div className="flex  items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Price:</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          getPriceValue(sizeOrId) !== item.price
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                      >
                        ₱{item.price.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={
                        getPriceValue(sizeOrId) === 0
                          ? ""
                          : getPriceValue(sizeOrId)
                      }
                      onChange={(e) =>
                        handlePriceChange(sizeOrId, e.target.value)
                      }
                      min="0"
                      step="0.01"
                      placeholder="New price"
                      disabled={!canEdit}
                      className={`w-full px-3 py-2 bg-black/40 border rounded-lg text-white text-center font-medium focus:outline-none focus:ring-2 transition-all ${!canEdit ? "opacity-50 cursor-not-allowed border-white/10" : "border-white/20 focus:border-purple-500 focus:ring-purple-500/50"}`}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg bg-white/5 border border-white/10 p-8 text-center">
            <FaBox className="text-gray-400 text-3xl mx-auto mb-2" />
            <p className="text-gray-400 text-sm">
              No {isClothing ? "sizes" : "items"} available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManagement;
