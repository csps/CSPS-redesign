export interface OrderPostRequest {
  orderItems: OrderItemRequest[];
}

export interface OrderItemRequest {
  orderId?: number;
  merchVariantItemId: number;
  quantity: number; // >= 1
  priceAtPurchase: number; // >= 0
}
