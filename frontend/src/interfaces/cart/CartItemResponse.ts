import type { MerchType } from "../../enums/MerchType";
import type { MerchVariantResponse } from "../merch_variant/MerchVariantResponse";

export interface CartItemResponse {
  cartId: string;
  merchVariant: MerchVariantResponse;
  quantity: number;
  merchType: MerchType;
  merchName: string;
}
