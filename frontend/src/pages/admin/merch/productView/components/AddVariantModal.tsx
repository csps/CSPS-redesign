import React, { useState } from "react";
import { ClothingSizing } from "../../../../../enums/ClothingSizing";
import type { MerchVariantResponse } from "../../../../../interfaces/merch_variant/MerchVariantResponse";
import type { MerchVariantItemResponse } from "../../../../../interfaces/merch_variant_item/MerchVariantItemResponse";
import type {
  ClothingVariant,
  NonClothingVariant,
} from "../../../../../hooks/useMerchForm";
import ClothingVariantCard from "../../../products/components/ClothingVariantCard";
import NonClothingVariantCard from "../../../products/components/NonClothingVariantCard";
import { toast } from "sonner";
import type { MerchType } from "../../../../../enums/MerchType";

interface AddVariantModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: {
    color?: string;
    design?: string;
    variantItems: { size?: string; stockQuantity: number; price: number }[];
    imageFile: File;
  }) => Promise<void>;
  merchType: MerchType;
}

const AddVariantModal: React.FC<AddVariantModalProps> = ({
  open,
  onClose,
  onConfirm,
  merchType,
}) => {
  const [clothingVariant, setClothingVariant] = useState<ClothingVariant>({
    color: "",
    price: "",
    imagePreview: "",
    imageFile: null,
    imageThumbnails: [],
    thumbnailFiles: [],
    sizeStock: Object.values(ClothingSizing).map((size) => ({
      size,
      stock: "",
      checked: false,
    })),
  });

  const [nonClothingVariant, setNonClothingVariant] =
    useState<NonClothingVariant>({
      design: "",
      price: "",
      imagePreview: "",
      imageFile: null,
      imageThumbnails: [],
      thumbnailFiles: [],
      stock: "",
    });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClothingColorChange = (value: string) => {
    setClothingVariant({ ...clothingVariant, color: value });
  };

  const handleClothingPriceChange = (value: string) => {
    setClothingVariant({
      ...clothingVariant,
      price: value === "" ? "" : parseFloat(value) || "",
    });
  };

  const handleClothingImageUpload = (imageIndex: number, file: File) => {
    setClothingVariant({ ...clothingVariant, imageFile: file });

    const reader = new FileReader();
    reader.onload = (event) => {
      setClothingVariant((prev) => ({
        ...prev,
        imagePreview: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleClothingSizeCheckChange = (
    sizeIndex: number,
    checked: boolean
  ) => {
    const updatedSizeStock = [...clothingVariant.sizeStock];
    updatedSizeStock[sizeIndex].checked = checked;
    setClothingVariant({ ...clothingVariant, sizeStock: updatedSizeStock });
  };

  const handleClothingStockQuantityChange = (
    sizeIndex: number,
    value: string
  ) => {
    const updatedSizeStock = [...clothingVariant.sizeStock];
    updatedSizeStock[sizeIndex].stock =
      value === "" ? "" : parseInt(value) || "";
    setClothingVariant({ ...clothingVariant, sizeStock: updatedSizeStock });
  };

  const handleNonClothingDesignChange = (value: string) => {
    setNonClothingVariant({ ...nonClothingVariant, design: value });
  };

  const handleNonClothingPriceChange = (value: string) => {
    setNonClothingVariant({
      ...nonClothingVariant,
      price: value === "" ? "" : parseFloat(value) || "",
    });
  };

  const handleNonClothingImageUpload = (imageIndex: number, file: File) => {
    setNonClothingVariant({ ...nonClothingVariant, imageFile: file });

    const reader = new FileReader();
    reader.onload = (event) => {
      setNonClothingVariant((prev) => ({
        ...prev,
        imagePreview: event.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleNonClothingStockChange = (value: string) => {
    setNonClothingVariant({
      ...nonClothingVariant,
      stock: value === "" ? "" : parseInt(value) || "",
    });
  };

  const handleSubmit = async () => {
    if (merchType === "CLOTHING") {
      if (!clothingVariant.color.trim()) {
        toast.error("Please enter a color");
        return;
      }

      if (!clothingVariant.imageFile) {
        toast.error("Please upload an image");
        return;
      }

      if (clothingVariant.price === "" || clothingVariant.price <= 0) {
        toast.error("Please enter a valid price");
        return;
      }

      const checkedSizes = clothingVariant.sizeStock.filter((s) => s.checked);
      if (checkedSizes.length === 0) {
        toast.error("Please select at least one size");
        return;
      }

      for (const size of checkedSizes) {
        if (size.stock === "" || size.stock <= 0) {
          toast.error(`Please enter stock quantity for ${size.size}`);
          return;
        }
      }

      setIsSubmitting(true);

      try {
        const data = {
          color: clothingVariant.color,
          variantItems: checkedSizes.map((item) => ({
            size: item.size,
            stockQuantity: item.stock as number,
            price: clothingVariant.price as number,
          })),
          imageFile: clothingVariant.imageFile!,
        };

        console.log("Submitting clothing variant:", data);

        await onConfirm(data);

        // Reset form
        setClothingVariant({
          color: "",
          price: "",
          imagePreview: "",
          imageFile: null,
          imageThumbnails: [],
          thumbnailFiles: [],
          sizeStock: Object.values(ClothingSizing).map((size) => ({
            size,
            stock: "",
            checked: false,
          })),
        });
      } catch (err) {
        console.error("Error adding variant:", err);
        // Error toast is handled in onConfirm
        // Reset image on error to allow re-upload
        setClothingVariant((prev) => ({
          ...prev,
          imageFile: null,
          imagePreview: "",
          imageThumbnails: [],
          thumbnailFiles: [],
        }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // NON_CLOTHING
      if (!nonClothingVariant.design.trim()) {
        toast.error("Please enter a design name");
        return;
      }

      if (!nonClothingVariant.imageFile) {
        toast.error("Please upload an image");
        return;
      }

      if (nonClothingVariant.price === "" || nonClothingVariant.price <= 0) {
        toast.error("Please enter a valid price");
        return;
      }

      if (nonClothingVariant.stock === "" || nonClothingVariant.stock <= 0) {
        toast.error("Please enter a valid stock quantity");
        return;
      }

      setIsSubmitting(true);

      try {
        const data = {
          design: nonClothingVariant.design,
          variantItems: [
            {
              stockQuantity: nonClothingVariant.stock as number,
              price: nonClothingVariant.price as number,
            },
          ],
          imageFile: nonClothingVariant.imageFile!,
        };

        await onConfirm(data);

        // Reset form
        setNonClothingVariant({
          design: "",
          price: "",
          imagePreview: "",
          imageFile: null,
          imageThumbnails: [],
          thumbnailFiles: [],
          stock: "",
        });
      } catch (err) {
        console.error("Error adding variant:", err);
        // Error toast is handled in onConfirm
        // Reset image on error to allow re-upload
        setNonClothingVariant((prev) => ({
          ...prev,
          imageFile: null,
          imagePreview: "",
        }));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#242050] rounded-2xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white">Add New Variant</h2>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/60 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Render appropriate variant card based on merchandise type */}
        {merchType === "CLOTHING" ? (
          <ClothingVariantCard
            variant={clothingVariant}
            variantIndex={0}
            onColorChange={handleClothingColorChange}
            onPriceChange={handleClothingPriceChange}
            onImageUpload={handleClothingImageUpload}
            onSizeCheckChange={handleClothingSizeCheckChange}
            onStockQuantityChange={handleClothingStockQuantityChange}
            onDelete={() => {}}
          />
        ) : (
          <NonClothingVariantCard
            variant={nonClothingVariant}
            variantIndex={0}
            onDesignChange={handleNonClothingDesignChange}
            onPriceChange={handleNonClothingPriceChange}
            onImageUpload={handleNonClothingImageUpload}
            onStockChange={handleNonClothingStockChange}
            onDelete={() => {}}
          />
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-semibold transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-[#341677] hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding..." : "Add Variant"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVariantModal;
