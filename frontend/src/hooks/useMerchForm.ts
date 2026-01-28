import { useState, useCallback } from "react";
import { ClothingSizing } from "../enums/ClothingSizing";
import { MerchType } from "../enums/MerchType";
import type { MerchRequest } from "../interfaces/merch/MerchRequest";

export interface MerchFormState extends MerchRequest {
  merchImagePreview?: string;
  merchImageFile?: File | null;
  imageThumbnails: string[];
  thumbnailFiles: (File | null)[];
  clothingVariants: ClothingVariant[];
  nonClothingVariants: NonClothingVariant[];
}

export interface ClothingVariant {
  color: string;
  price: number | "";
  imagePreview: string;
  imageFile: File | null;
  imageThumbnails: string[];
  thumbnailFiles: (File | null)[];
  sizeStock: Array<{
    size: ClothingSizing | "";
    stock: number | "";
    checked: boolean;
  }>;
}

export interface NonClothingVariant {
  design: string;
  price: number | "";
  imagePreview: string;
  imageFile: File | null;
  imageThumbnails: string[];
  thumbnailFiles: (File | null)[];
  stock: number | "";
}

/**
 * Convert MerchFormState to MerchRequest for API submission
 */
export const convertFormStateToMerchRequest = (
  formState: MerchFormState & {
    merchImageFile?: File | null;
    thumbnailFiles?: (File | null)[];
    clothingVariants?: ClothingVariant[];
    nonClothingVariants?: NonClothingVariant[];
  }
): MerchRequest => {
  const { ...merchRequest } = formState;

  console.log("Converting form state to MerchRequest:", merchRequest);
  return merchRequest as MerchRequest;
};

export const useMerchForm = () => {
  const [formState, setFormState] = useState<MerchFormState>({
    merchName: "",
    description: "",
    merchType: "" as MerchType,
    basePrice: 0,
    s3ImageKey: 0,
    variants: [],
    merchImagePreview: "",
    merchImageFile: null,
    imageThumbnails: ["", "", "", ""],
    thumbnailFiles: [null, null, null, null],
    clothingVariants: [],
    nonClothingVariants: [],
  });

  // --- Merch Info Handlers ---
  const setMerchName = useCallback((name: string) => {
    setFormState((prev) => ({ ...prev, merchName: name }));
  }, []);

  const setDescription = useCallback((desc: string) => {
    setFormState((prev) => ({ ...prev, description: desc.slice(0, 500) }));
  }, []);

  const setMerchType = useCallback((type: MerchType) => {
    setFormState((prev) => ({
      ...prev,
      merchType: MerchType[type] as MerchType,
    }));
  }, []);

  const setBasePrice = useCallback((price: number) => {
    setFormState((prev) => ({ ...prev, basePrice: price }));
  }, []);

  const handleMerchImageUpload = useCallback((index: number, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setFormState((prev) => {
        if (index === 0) {
          return {
            ...prev,
            merchImagePreview: preview,
            merchImageFile: file,
          };
        } else {
          const updated = { ...prev };
          updated.imageThumbnails[index] = preview;
          updated.thumbnailFiles[index] = file;
          return updated;
        }
      });
    };
    reader.readAsDataURL(file);
  }, []);

  // --- Clothing Variant Handlers ---
  const handleAddClothingVariant = useCallback(() => {
    const newVariant: ClothingVariant = {
      color: "",
      price: "",
      imagePreview: "",
      imageFile: null,
      imageThumbnails: ["", "", "", ""],
      thumbnailFiles: [null, null, null, null],
      sizeStock: Object.values(ClothingSizing).map((size) => ({
        size,
        stock: "",
        checked: false,
      })),
    };
    setFormState((prev) => ({
      ...prev,
      clothingVariants: [...prev.clothingVariants, newVariant],
    }));
  }, []);

  const handleClothingVariantChange = useCallback(
    (index: number, field: "color" | "price", value: string) => {
      setFormState((prev) => {
        const updated = [...prev.clothingVariants];
        if (field === "price") {
          updated[index] = {
            ...updated[index],
            [field]: value === "" ? "" : Number(value),
          };
        } else {
          updated[index] = { ...updated[index], [field]: value };
        }
        return { ...prev, clothingVariants: updated };
      });
    },
    []
  );

  const handleSizeCheckChange = useCallback(
    (variantIndex: number, sizeIndex: number, checked: boolean) => {
      setFormState((prev) => {
        const updated = [...prev.clothingVariants];
        updated[variantIndex].sizeStock[sizeIndex] = {
          ...updated[variantIndex].sizeStock[sizeIndex],
          checked,
        };
        return { ...prev, clothingVariants: updated };
      });
    },
    []
  );

  const handleStockQuantityChange = useCallback(
    (variantIndex: number, sizeIndex: number, value: string) => {
      setFormState((prev) => {
        const updated = [...prev.clothingVariants];
        updated[variantIndex].sizeStock[sizeIndex] = {
          ...updated[variantIndex].sizeStock[sizeIndex],
          stock: value === "" ? "" : Number(value),
        };
        return { ...prev, clothingVariants: updated };
      });
    },
    []
  );

  const handleDeleteClothingVariant = useCallback((index: number) => {
    setFormState((prev) => ({
      ...prev,
      clothingVariants: prev.clothingVariants.filter((_, i) => i !== index),
    }));
  }, []);

  const handleVariantImageUpload = useCallback(
    (
      type: "clothing" | "nonClothing",
      variantIndex: number,
      imageIndex: number,
      file: File
    ) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setFormState((prev) => {
          if (type === "clothing") {
            const updated = [...prev.clothingVariants];
            if (imageIndex === 0) {
              updated[variantIndex] = {
                ...updated[variantIndex],
                imagePreview: preview,
                imageFile: file,
              };
            } else {
              updated[variantIndex].imageThumbnails[imageIndex] = preview;
              updated[variantIndex].thumbnailFiles[imageIndex] = file;
            }
            return { ...prev, clothingVariants: updated };
          } else {
            const updated = [...prev.nonClothingVariants];
            if (imageIndex === 0) {
              updated[variantIndex] = {
                ...updated[variantIndex],
                imagePreview: preview,
                imageFile: file,
              };
            } else {
              updated[variantIndex].imageThumbnails[imageIndex] = preview;
              updated[variantIndex].thumbnailFiles[imageIndex] = file;
            }
            return { ...prev, nonClothingVariants: updated };
          }
        });
      };
      reader.readAsDataURL(file);
    },
    []
  );

  // --- Non-Clothing Variant Handlers ---
  const handleAddNonClothingVariant = useCallback(() => {
    const newVariant: NonClothingVariant = {
      design: "",
      price: "",
      imagePreview: "",
      imageFile: null,
      imageThumbnails: ["", "", "", ""],
      thumbnailFiles: [null, null, null, null],
      stock: "",
    };
    setFormState((prev) => ({
      ...prev,
      nonClothingVariants: [...prev.nonClothingVariants, newVariant],
    }));
  }, []);

  const handleNonClothingVariantChange = useCallback(
    (index: number, field: "design" | "stock" | "price", value: string) => {
      setFormState((prev) => {
        const updated = [...prev.nonClothingVariants];
        if (field === "stock" || field === "price") {
          updated[index] = {
            ...updated[index],
            [field]: value === "" ? "" : Number(value),
          };
        } else {
          updated[index] = { ...updated[index], [field]: value };
        }
        return { ...prev, nonClothingVariants: updated };
      });
    },
    []
  );

  const handleDeleteNonClothingVariant = useCallback((index: number) => {
    setFormState((prev) => ({
      ...prev,
      nonClothingVariants: prev.nonClothingVariants.filter(
        (_, i) => i !== index
      ),
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      merchName: "",
      description: "",
      merchType: "" as MerchType,
      basePrice: 0,
      s3ImageKey: 0,
      variants: [],
      merchImagePreview: "",
      merchImageFile: null,
      imageThumbnails: ["", "", "", ""],
      thumbnailFiles: [null, null, null, null],
      clothingVariants: [],
      nonClothingVariants: [],
    });
  }, []);

  const getMerchRequest = useCallback((): MerchRequest => {
    return convertFormStateToMerchRequest(formState);
  }, [formState]);

  return {
    formState,
    getMerchRequest,
    setMerchName,
    setDescription,
    setMerchType,
    setBasePrice,
    handleMerchImageUpload,
    handleAddClothingVariant,
    handleClothingVariantChange,
    handleSizeCheckChange,
    handleStockQuantityChange,
    handleDeleteClothingVariant,
    handleVariantImageUpload,
    handleAddNonClothingVariant,
    handleNonClothingVariantChange,
    handleDeleteNonClothingVariant,
    resetForm,
  };
};
