import React, { useState } from "react";
import { ClothingSizing } from "../../../../../enums/ClothingSizing";
import type {
  ClothingVariant,
  NonClothingVariant,
} from "../../../../../hooks/useMerchForm";
import ClothingVariantCard from "../../../products/components/ClothingVariantCard";
import NonClothingVariantCard from "../../../products/components/NonClothingVariantCard";
import { toast } from "sonner";
import type { MerchType } from "../../../../../enums/MerchType";

interface AddVariantModalProps {
  isAddingVariant: boolean;
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
  isAddingVariant,
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
      price: "",
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

  // Helper handlers remained functionally identical to ensure logic stability
  const handleClothingColorChange = (value: string) => {
    setClothingVariant({ ...clothingVariant, color: value });
  };

  const handleClothingPriceChange = (value: string) => {
    setClothingVariant({
      ...clothingVariant,
      price: value === "" ? "" : parseFloat(value) || "",
    });
  };

  const handleClothingImageUpload = (_imageIndex: number, file: File) => {
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
    checked: boolean,
  ) => {
    const updatedSizeStock = [...clothingVariant.sizeStock];
    updatedSizeStock[sizeIndex].checked = checked;
    setClothingVariant({ ...clothingVariant, sizeStock: updatedSizeStock });
  };

  const handleClothingStockQuantityChange = (
    sizeIndex: number,
    value: string,
  ) => {
    const updatedSizeStock = [...clothingVariant.sizeStock];
    updatedSizeStock[sizeIndex].stock =
      value === "" ? "" : parseInt(value) || "";
    setClothingVariant({ ...clothingVariant, sizeStock: updatedSizeStock });
  };

  const handleClothingPriceChangeForSize = (
    sizeIndex: number,
    value: string,
  ) => {
    const updatedSizeStock = [...clothingVariant.sizeStock];
    updatedSizeStock[sizeIndex].price =
      value === "" ? "" : parseFloat(value) || "";
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

  const handleNonClothingImageUpload = (_imageIndex: number, file: File) => {
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
        if (size.price === "" || size.price <= 0) {
          toast.error(`Please enter price for ${size.size}`);
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
            price: item.price as number,
          })),
          imageFile: clothingVariant.imageFile!,
        };
        await onConfirm(data);
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
            price: "",
            checked: false,
          })),
        });
      } catch (err) {
        setClothingVariant((prev) => ({
          ...prev,
          imageFile: null,
          imagePreview: "",
        }));
      } finally {
        setIsSubmitting(false);
      }
    } else {
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

  if (isAddingVariant)
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex items-center justify-center z-50">
        <div className="bg-[#242050] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-white font-medium text-lg">Adding variant...</p>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#242050] rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl custom-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
            Add New Variant
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-full transition-all"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-6">
          {merchType === "CLOTHING" ? (
            <ClothingVariantCard
              variant={clothingVariant}
              variantIndex={0}
              onColorChange={handleClothingColorChange}
              onPriceChange={handleClothingPriceChange}
              onImageUpload={handleClothingImageUpload}
              onSizeCheckChange={handleClothingSizeCheckChange}
              onStockQuantityChange={handleClothingStockQuantityChange}
              onPriceChangeForSize={handleClothingPriceChangeForSize}
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
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button
            onClick={onClose}
            className="flex-1 px-7 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 px-7 py-4 bg-[#FDE006] hover:brightness-110 text-black rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#FDE006]/10"
          >
            {isSubmitting ? "Adding..." : "Add Variant"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVariantModal;
