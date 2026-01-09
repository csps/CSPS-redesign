import type { PurchaseItemResponse } from "./PurchaseItemResponse";

export interface PurchaseResponse {
  purchaseId: string;
  studentId: string;
  items: PurchaseItemResponse[];
  purchasedAt: string;
  totalPrice: number;
  receivedMoney: number;
}
