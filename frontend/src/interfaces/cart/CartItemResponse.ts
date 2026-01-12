import type { MerchType } from "../../enums/MerchType";
import type { MerchVariantResponse } from "../merch_variant/MerchVariantResponse";

export interface CartItemResponse {
  merchVariantItemId: number;
  merchName: string;
  size?: string;
  color?: string;
  design?: string;
  s3ImageKey: string;
  unitPrice: number;
  quantity: number;
  subTotal: number;
  merchType: MerchType;
}
