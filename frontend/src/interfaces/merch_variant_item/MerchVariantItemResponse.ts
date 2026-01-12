import type { ClothingSizing } from "../../enums/ClothingSizing";

/**
 * Merchandise variant item request (single or batch).
 * Size is required for CLOTHING, must be null for NON-CLOTHING.
 */
export interface MerchVariantItemRequest {
  size?: ClothingSizing; // null/undefined for non-clothing
  stockQuantity: number;
  price: number;
}

/**
 * Merchandise variant item response.
 * Represents a specific product with size and stock.
 */
export interface MerchVariantItemResponse {
  merchVariantItemId: number;
  size: ClothingSizing; //
  stockQuantity: number;
  price: number;
}
