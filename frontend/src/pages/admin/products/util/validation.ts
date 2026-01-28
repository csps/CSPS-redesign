import type { MerchFormState } from "../../../../hooks/useMerchForm";

export interface ValidationErrors {
  [key: string]: string;
}

export const validateMerchInfo = (
  formState: MerchFormState,
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};

  if (!formState.merchName.trim()) {
    errors.merchName = "Merchandise name is required";
  } else if (formState.merchName.length > 100) {
    errors.merchName = "Merchandise name must not exceed 100 characters";
  }

  if (!formState.merchType) {
    errors.merchType = "Merchandise type is required";
  }

  if (!formState.basePrice) {
    errors.basePrice = "Price is required";
  } else if (
    isNaN(Number(formState.basePrice)) ||
    Number(formState.basePrice) <= 0
  ) {
    errors.basePrice = "Price must be a positive number";
  }

  if (!formState.merchImageFile) {
    errors.merchImage = "Product image is required";
  }

  if (formState.description.length > 500) {
    errors.description = "Description must not exceed 500 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateVariants = (
  formState: MerchFormState,
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};
  const { merchType, clothingVariants, nonClothingVariants } = formState;

  if (merchType === "CLOTHING") {
    if (clothingVariants.length === 0) {
      errors.variants = "At least one variant is required";
    } else {
      clothingVariants.forEach((variant, idx) => {
        if (!variant.color.trim()) {
          errors[`variant_${idx}_color`] = "Color is required";
        }

        const checkedSizes = variant.sizeStock.filter((s) => s.checked);
        if (checkedSizes.length === 0) {
          errors[`variant_${idx}_sizes`] = "At least one size must be selected";
        }

        checkedSizes.forEach((size, sizeIdx) => {
          if (size.stock === "" || size.stock <= 0) {
            errors[`variant_${idx}_size_${sizeIdx}`] =
              "Stock quantity must be greater than 0";
          }
        });
      });
    }
  } else {
    if (nonClothingVariants.length === 0) {
      errors.variants = "At least one variant is required";
    } else {
      nonClothingVariants.forEach((variant, idx) => {
        if (!variant.design.trim()) {
          errors[`variant_${idx}_design`] = "Design is required";
        }

        if (variant.stock === "" || variant.stock <= 0) {
          errors[`variant_${idx}_stock`] =
            "Stock quantity must be greater than 0";
        }
      });
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
