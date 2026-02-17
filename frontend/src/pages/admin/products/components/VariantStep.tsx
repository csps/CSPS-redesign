import React from "react";
import { FaChevronLeft, FaPlus, FaSpinner } from "react-icons/fa";
import { MerchType } from "../../../../enums/MerchType";
import type {
  ClothingVariant,
  MerchFormState,
  NonClothingVariant,
} from "../../../../hooks/useMerchForm";
import type { ValidationErrors } from "../util/validation";
import ClothingVariantCard from "./ClothingVariantCard";
import NonClothingVariantCard from "./NonClothingVariantCard";

interface VariantStepProps {
  formState: MerchFormState;
  errors?: ValidationErrors;
  isLoading?: boolean;
  onBack: () => void;
  onAddClothingVariant: () => void;
  onAddNonClothingVariant: () => void;
  onClothingVariantChange: (
    index: number,
    field: "color" | "price",
    value: string,
  ) => void;
  onNonClothingVariantChange: (
    index: number,
    field: "design" | "stock" | "price",
    value: string,
  ) => void;
  onSizeCheckChange: (
    variantIndex: number,
    sizeIndex: number,
    checked: boolean,
  ) => void;
  onStockQuantityChange: (
    variantIndex: number,
    sizeIndex: number,
    value: string,
  ) => void;
  onPriceChangeForSize?: (
    variantIndex: number,
    sizeIndex: number,
    value: string,
  ) => void;
  onVariantImageUpload: (
    type: "clothing" | "nonClothing",
    variantIndex: number,
    imageIndex: number,
    file: File,
  ) => void;
  onDeleteClothingVariant: (index: number) => void;
  onDeleteNonClothingVariant: (index: number) => void;
  onSubmit: () => void;
}

const VariantStep: React.FC<VariantStepProps> = ({
  formState,
  errors = {},
  isLoading = false,
  onBack,
  onAddClothingVariant,
  onAddNonClothingVariant,
  onClothingVariantChange,
  onNonClothingVariantChange,
  onSizeCheckChange,
  onStockQuantityChange,
  onPriceChangeForSize,
  onVariantImageUpload,
  onDeleteClothingVariant,
  onDeleteNonClothingVariant,
  onSubmit,
}) => {
  const canSubmit =
    (formState.merchType === MerchType.CLOTHING &&
      formState.clothingVariants.length > 0) ||
    (formState.merchType !== MerchType.CLOTHING &&
      formState.merchType !== null &&
      formState.nonClothingVariants.length > 0);

  const variantCount =
    formState.merchType === MerchType.CLOTHING
      ? formState.clothingVariants.length
      : formState.nonClothingVariants.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with variant count */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Product Variants</h3>
          <p className="text-sm text-white/50 mt-1">
            {variantCount === 0
              ? "Add at least one variant to continue"
              : `${variantCount} variant${variantCount > 1 ? "s" : ""} configured`}
          </p>
        </div>
        {variantCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-green-400 font-medium">Ready</span>
          </div>
        )}
      </div>

      {errors.variants && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4">
          <p className="text-sm text-red-400">{errors.variants}</p>
        </div>
      )}

      {/* CLOTHING Type Variants */}
      {formState.merchType === MerchType.CLOTHING && (
        <div className="space-y-4">
          {formState.clothingVariants.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <FaPlus className="text-purple-400 text-xl" />
              </div>
              <p className="text-white/60 mb-2">No variants yet</p>
              <p className="text-white/40 text-sm">
                Click below to add your first variant
              </p>
            </div>
          ) : (
            formState.clothingVariants.map(
              (variant: ClothingVariant, variantIndex: number) => (
                <ClothingVariantCard
                  key={variantIndex}
                  variant={variant}
                  variantIndex={variantIndex}
                  errors={errors}
                  onColorChange={(value) =>
                    onClothingVariantChange(variantIndex, "color", value)
                  }
                  onPriceChange={(value) =>
                    onClothingVariantChange(variantIndex, "price", value)
                  }
                  onImageUpload={(imageIndex, file) =>
                    onVariantImageUpload(
                      "clothing",
                      variantIndex,
                      imageIndex,
                      file,
                    )
                  }
                  onSizeCheckChange={(sizeIndex, checked) =>
                    onSizeCheckChange(variantIndex, sizeIndex, checked)
                  }
                  onStockQuantityChange={(sizeIndex, value) =>
                    onStockQuantityChange(variantIndex, sizeIndex, value)
                  }
                  onPriceChangeForSize={(sizeIndex, value) =>
                    onPriceChangeForSize?.(variantIndex, sizeIndex, value)
                  }
                  onDelete={() => onDeleteClothingVariant(variantIndex)}
                />
              ),
            )
          )}

          <button
            onClick={onAddClothingVariant}
            className="w-full border-2 border-dashed border-purple-500/30 hover:border-purple-400/60 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 hover:text-purple-300 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 flex items-center justify-center transition-colors">
              <FaPlus size={12} />
            </div>
            <span className="font-medium">Add Color Variant</span>
          </button>
        </div>
      )}

      {/* NON-CLOTHING Type Variants */}
      {formState.merchType !== MerchType.CLOTHING &&
        formState.merchType !== null && (
          <div className="space-y-4">
            {formState.nonClothingVariants.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                  <FaPlus className="text-purple-400 text-xl" />
                </div>
                <p className="text-white/60 mb-2">No variants yet</p>
                <p className="text-white/40 text-sm">
                  Click below to add your first variant
                </p>
              </div>
            ) : (
              formState.nonClothingVariants.map(
                (variant: NonClothingVariant, variantIndex: number) => (
                  <NonClothingVariantCard
                    key={variantIndex}
                    variant={variant}
                    variantIndex={variantIndex}
                    errors={errors}
                    onDesignChange={(value) =>
                      onNonClothingVariantChange(variantIndex, "design", value)
                    }
                    onPriceChange={(value) =>
                      onNonClothingVariantChange(variantIndex, "price", value)
                    }
                    onImageUpload={(imageIndex, file) =>
                      onVariantImageUpload(
                        "nonClothing",
                        variantIndex,
                        imageIndex,
                        file,
                      )
                    }
                    onStockChange={(value) =>
                      onNonClothingVariantChange(variantIndex, "stock", value)
                    }
                    onDelete={() => onDeleteNonClothingVariant(variantIndex)}
                  />
                ),
              )
            )}

            <button
              onClick={onAddNonClothingVariant}
              className="w-full border-2 border-dashed border-purple-500/30 hover:border-purple-400/60 bg-purple-500/5 hover:bg-purple-500/10 text-purple-400 hover:text-purple-300 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 flex items-center justify-center transition-colors">
                <FaPlus size={12} />
              </div>
              <span className="font-medium">Add Design Variant</span>
            </button>
          </div>
        )}

      {/* No category selected */}
      {formState.merchType === null && (
        <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-white/60 font-medium mb-2">No category selected</p>
          <p className="text-white/40 text-sm">
            Please go back and select a category to add variants
          </p>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mt-6 pt-6 border-t border-white/10">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center justify-center gap-3 text-white/60 hover:text-white py-4 px-6 rounded-2xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft size={14} />
          <span className="font-medium">Previous Step</span>
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || isLoading}
          className="flex-1 sm:flex-initial sm:min-w-[200px] bg-[#FDE006] hover:brightness-110 disabled:bg-[#FDE006]/50 disabled:cursor-not-allowed text-black font-bold py-4 px-8 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <span>Create Product</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default VariantStep;
