export const PurchaseItemStatus = {
  TO_BE_CLAIMED: "TO_BE_CLAIMED",
  NOT_PAID: "NOT_PAID",
  CLAIMED: "CLAIMED",
} as const;

export type PurchaseItemStatus =
  (typeof PurchaseItemStatus)[keyof typeof PurchaseItemStatus];
