import React, { type ChangeEvent } from "react";
import { FaTrash, FaCloudUploadAlt } from "react-icons/fa";
import type { NonClothingVariant } from "../../../../hooks/useMerchForm";
import type { ValidationErrors } from "../util/validation";

interface NonClothingVariantCardProps {
  variant: NonClothingVariant;
  variantIndex: number;
  errors?: ValidationErrors;
  onDesignChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onImageUpload: (imageIndex: number, file: File) => void;
  onStockChange: (value: string) => void;
  onDelete: () => void;
}

const NonClothingVariantCard: React.FC<NonClothingVariantCardProps> = ({
  variant,
  variantIndex,
  errors = {},
  onDesignChange,
  onPriceChange,
  onImageUpload,
  onStockChange,
  onDelete,
}) => {
  const handleImageUpload = (
    imageIndex: number,
    e: ChangeEvent<HTMLInputElement>,
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
        <h3 className="text-2xl font-bold">Variant {variantIndex + 1}</h3>
        <button
          onClick={onDelete}
          className="text-white/40 hover:text-red-400 transition"
          aria-label="Delete variant"
        >
          <FaTrash size={20} />
        </button>
      </div>

      {/* Design Input */}
      <div className="mb-5">
        <label className="block text-xl font-medium text-white/60 mb-2">
          Design
        </label>
        <input
          type="text"
          value={variant.design}
          onChange={(e) => onDesignChange(e.target.value)}
          placeholder="e.g., Gold Logo, Holographic"
          className={`w-full bg-[#1a163d] rounded-lg px-4 py-5 outline-none placeholder-white/30 text-lg text-white border transition ${
            errors[`variant_${variantIndex}_design`]
              ? "border-red-500"
              : "border-transparent focus:border-white/20"
          }`}
        />
        {errors[`variant_${variantIndex}_design`] && (
          <span className="text-sm text-red-400 mt-2 block">
            {errors[`variant_${variantIndex}_design`]}
          </span>
        )}
      </div>

      {/* Price Input */}
      <div className="mb-5">
        <label className="block text-xl font-medium text-white/60 mb-2">
          Price
        </label>
        <input
          type="number"
          value={variant.price === "" ? "" : variant.price}
          onChange={(e) => onPriceChange(e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
          placeholder="0.00"
          min="0"
          step="0.01"
          className={`w-full bg-[#1a163d] rounded-lg px-4 py-5 outline-none placeholder-white/30 text-lg text-white border transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
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
      <div className="flex flex-col items-center mb-5">
        <span className="text-lg font-medium text-white/60 mb-2">
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
                <span className="text-white text-sm font-semibold">
                  Change Image
                </span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <FaCloudUploadAlt
                size={32}
                className="text-white/30 group-hover:text-white/50 transition-colors"
              />
              <span className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Upload
              </span>
            </div>
          )}
        </label>
      </div>

      {/* Stock Input */}
      <div>
        <label className="block text-xl font-medium text-white/60 mb-2">
          Stock Quantity
        </label>
        <input
          type="number"
          value={variant.stock}
          onChange={(e) => onStockChange(e.target.value)}
          onWheel={(e) => e.currentTarget.blur()}
          placeholder="0"
          min="0"
          className={`w-full bg-[#1a163d] rounded-lg px-4 py-4 outline-none placeholder-white/30 text-lg text-white border transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            errors[`variant_${variantIndex}_stock`]
              ? "border-red-500"
              : "border-transparent focus:border-white/20"
          }`}
        />
        {errors[`variant_${variantIndex}_stock`] && (
          <span className="text-lg text-red-400 mt-2 block">
            {errors[`variant_${variantIndex}_stock`]}
          </span>
        )}
      </div>
    </div>
  );
};

export default NonClothingVariantCard;
