import type { MerchType } from "../../enums/MerchType";
import type { PurchaseItemStatus } from "../../enums/PurchaseItemStatus";
import type { MerchVariantResponse } from "../merch_variant/MerchVariantResponse";

export interface PurchaseItemResponse {
  purchaseId: number;
  items: MerchVariantResponse;
  merchName: string;
  merchType: MerchType;
  quantity: number;
  status: PurchaseItemStatus;
}
