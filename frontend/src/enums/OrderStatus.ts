export const OrderStatus = {
  TO_BE_CLAIMED: "TO_BE_CLAIMED",
  PENDING: "PENDING",
  CLAIMED: "CLAIMED",
  REJECTED: "REJECTED",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];
