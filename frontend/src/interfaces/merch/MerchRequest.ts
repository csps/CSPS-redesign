import type { MerchType } from "../../enums/MerchType";

export interface MerchRequest {
  merchName: string;
  description: string;
  merchType: MerchType;
  basePrice: number;
  s3ImageKey: string;
}
