import type { MerchType } from "../../enums/MerchType";

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
