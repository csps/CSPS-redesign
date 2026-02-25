import type { ClothingSizing } from "../../enums/ClothingSizing";

export interface MerchVariantItemRequest {
  size?: ClothingSizing;
  stockQuantity: number;
  price: number;
}
