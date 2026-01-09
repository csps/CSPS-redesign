import type { ClothingSizing } from "../../enums/ClothingSizing";

export interface MerchVariantResponse {
  merchVariantId: number;
  color: string;
  size: ClothingSizing;
  price: number;
  stockQuantity: number;
  design: string;

  merchId: number;
}
