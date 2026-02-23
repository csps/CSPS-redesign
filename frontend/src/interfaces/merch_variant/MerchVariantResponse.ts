import type { MerchVariantItemResponse } from "../merch_variant_item/MerchVariantItemResponse";

/**
 * Merchandise variant with all items.
 * Variants contain color/design and multiple size/quantity options.
 */
export interface MerchVariantResponse {
  merchVariantId: number;
  color?: string; // null for non-clothing
  design: string;
  s3ImageKey: string;
  items: MerchVariantItemResponse[];
  stockQuantity: number;
}
