import type { MerchVariantItemRequest } from "../merch_variant_item/MerchVariantItemRequest";

export interface MerchVariantRequest {
  color?: string;
  design?: string;
  variantImage: File;
  variantItems: MerchVariantItemRequest[];
}
