import type { MerchType } from "../../enums/MerchType";
import type { MerchVariantRequest } from "../merch_variant/MerchVariantRequest";

export interface MerchRequest {
  merchName: string;
  description: string;
  merchType: MerchType;
  basePrice: number;
  s3ImageKey: number;
  variants: MerchVariantRequest[];
}
