import type { MerchType } from "../../enums/MerchType";
import type { MerchVariantResponse } from "../merch_variant/MerchVariantResponse";

export interface MerchDetailedResponse {
  merchId: number;
  merchName: string;
  description: string;
  merchType: MerchType;
  price: number;
  variants: MerchVariantResponse[];
}

export interface MerchSummaryResponse {
  merchId: number;
  merchName: string;
  description: string;
  merchType: MerchType;
  price: number;
}
