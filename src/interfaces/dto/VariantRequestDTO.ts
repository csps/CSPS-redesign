import type { ClothingSizing } from "../../enums/ClothingSizing";

export interface ClothingVariantRequestDTO {
  color: string;
  variantItems: ClothingVariantItem[];
}

export interface ClothingVariantItem {
  size?: ClothingSizing;
  stockQuantity: number;
  price: number;
}

export interface NonClothingVariantRequestDTO {
  design: string;
  variantItems: ClothingVariantItem[];
}
