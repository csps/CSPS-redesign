import React, { type ChangeEvent } from "react";
import { FaTrash, FaCloudUploadAlt } from "react-icons/fa";
import type { ClothingVariant } from "../../../../hooks/useMerchForm";
import type { ValidationErrors } from "../util/validation";

interface ClothingVariantCardProps {
  variant: ClothingVariant;
  variantIndex: number;
  errors?: ValidationErrors;
  onColorChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onImageUpload: (imageIndex: number, file: File) => void;
  onSizeCheckChange: (sizeIndex: number, checked: boolean) => void;
  onStockQuantityChange: (sizeIndex: number, value: string) => void;
  onDelete: () => void;
}

const ClothingVariantCard: React.FC<ClothingVariantCardProps> = ({
  variant,
  variantIndex,
  errors = {},
  onColorChange,
  onPriceChange,
  onImageUpload,
  onSizeCheckChange,
  onStockQuantityChange,
  onDelete,
}) => {
  const handleImageUpload = (
    imageIndex: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(imageIndex, file);
    }
  };

  return (
    <div className="bg-[#242050] rounded-2xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <h3 className="text-xl font-bold">Variant {variantIndex + 1}</h3>
        <button
          onClick={onDelete}
          className="text-white/40 hover:text-red-400 transition"
          aria-label="Delete variant"
        >
          <FaTrash size={20} />
        </button>
      </div>

      {/* Color Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/60 mb-2">
          Color
        </label>
        <input
          type="text"
          value={variant.color}
          onChange={(e) => onColorChange(e.target.value)}
          placeholder="e.g., Black, Navy Blue"
          className={`w-full bg-[#1a163d] rounded-lg px-4 py-3 outline-none placeholder-white/30 text-base text-white border transition ${
            errors[`variant_${variantIndex}_color`]
              ? "border-red-500"
              : "border-transparent focus:border-white/20"
          }`}
        />
        {errors[`variant_${variantIndex}_color`] && (
          <span className="text-sm text-red-400 mt-2 block">
            {errors[`variant_${variantIndex}_color`]}
          </span>
        )}
      </div>

      {/* Price Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-white/60 mb-2">
          Price
        </label>
        <input
          type="number"
          value={variant.price}
          onChange={(e) => onPriceChange(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
          className={`w-full bg-[#1a163d] rounded-lg px-4 py-3 outline-none placeholder-white/30 text-base text-white border transition ${
            errors[`variant_${variantIndex}_price`]
              ? "border-red-500"
              : "border-transparent focus:border-white/20"
          }`}
        />
        {errors[`variant_${variantIndex}_price`] && (
          <span className="text-sm text-red-400 mt-2 block">
            {errors[`variant_${variantIndex}_price`]}
          </span>
        )}
      </div>

      {/* Image Upload */}
      <div className="flex flex-col items-center mb-6">
        <span className="text-base font-medium text-white/60 mb-3">
          Design Image
        </span>
        <label className="relative aspect-[4/3] w-full cursor-pointer bg-[#1a163d] rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden group hover:bg-[#2f2b60] transition-colors">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload(0, e)}
          />

          {variant.imagePreview ? (
            <>
              <img
                src={variant.imagePreview}
                alt="Variant"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-base font-semibold">
                  Change Image
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FaCloudUploadAlt
                size={36}
                className="text-white/30 group-hover:text-white/50 transition-colors"
              />
              <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Upload
              </span>
            </div>
          )}
        </label>
      </div>

      {/* Size/Stock Table */}
      <div>
        <label className="block text-base font-semibold text-white/80 mb-3">
          Sizes & Stock
        </label>
        {errors[`variant_${variantIndex}_sizes`] && (
          <p className="text-sm text-red-400 mb-3">
            {errors[`variant_${variantIndex}_sizes`]}
          </p>
        )}
        <div className="space-y-3">
          {variant.sizeStock.map((item: SizeStockData, sizeIndex: number) => (
            <div
              key={sizeIndex}
              className={`flex items-center gap-4 bg-[#1a163d] p-4 rounded-xl border ${
                errors[`variant_${variantIndex}_size_${sizeIndex}`]
                  ? "border-red-500/50"
                  : "border-transparent"
              }`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => onSizeCheckChange(sizeIndex, e.target.checked)}
                className="accent-purple-500 w-5 h-5 cursor-pointer"
              />
              <span className="text-lg font-bold text-white w-15 min-w-15">
                {item.size}
              </span>
              <input
                type="number"
                disabled={!item.checked}
                value={item.stock}
                onChange={(e) =>
                  onStockQuantityChange(sizeIndex, e.target.value)
                }
                placeholder="0"
                min="0"
                className="flex-1 bg-transparent border-none outline-none text-lg font-medium text-white placeholder-white/30 disabled:opacity-30 disabled:cursor-not-allowed"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClothingVariantCard;
