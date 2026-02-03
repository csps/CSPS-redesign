import React from "react";
import { FaChevronLeft, FaPlus } from "react-icons/fa";
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

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">Add Variants</h2>

      {errors.variants && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
          <p className="text-xs text-red-400">{errors.variants}</p>
        </div>
      )}

      {/* CLOTHING Type Variants */}
      {formState.merchType === MerchType.CLOTHING && (
        <div className="space-y-4">
          {formState.clothingVariants.length === 0 ? (
            <></>
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
            className="w-full border-2 border-dashed border-purple-500/50 hover:border-purple-400 text-purple-400 hover:text-purple-300 py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            <FaPlus size={14} /> Add Variant
          </button>
        </div>
      )}

      {/* NON-CLOTHING Type Variants */}
      {formState.merchType !== MerchType.CLOTHING &&
        formState.merchType !== null && (
          <div className="space-y-4">
            {formState.nonClothingVariants.length === 0 ? (
              <></>
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
              className="w-full border-2 border-dashed border-purple-500/50 hover:border-purple-400 text-purple-400 hover:text-purple-300 py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              <FaPlus size={14} /> Add Variant
            </button>
          </div>
        )}

      {/* No category selected */}
      {formState.merchType === null && (
        <div className="text-center py-8 text-white/40">
          Please select a category in Step 1 to add variants
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 pt-6 border-t border-white/10">
        <button
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 text-white/60 hover:text-white py-3 px-6 rounded-xl border border-white/20 hover:border-white/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaChevronLeft size={14} /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || isLoading}
          className="w-full sm:w-auto bg-[#4d4c7d] hover:bg-[#5e5c94] disabled:bg-[#4d4c7d]/50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </div>
    </div>
  );
};

export default VariantStep;
