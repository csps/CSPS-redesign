import type { MerchType } from "../../enums/MerchType";
import type { MerchVariantResponse } from "../merch_variant/MerchVariantResponse";

/**
 * Detailed merchandise response with all variants and items.
 * Returned from GET /api/merch/{merchId}
 */
export interface MerchDetailedResponse {
  merchId: number;
  merchName: string;
  description: string;
  merchType: MerchType;
  basePrice: number;
  s3ImageKey: string;
  variants: MerchVariantResponse[];
}

/**
 * Summary merchandise response without variant details.
 * Returned from GET /api/merch/summary and GET /api/merch/type/{type}
 */
export interface MerchSummaryResponse {
  merchId: number;
  merchName: string;
  description: string;
  merchType: MerchType;
  basePrice: number;
  s3ImageKey: string;
  totalStockQuantity?: number;
}
