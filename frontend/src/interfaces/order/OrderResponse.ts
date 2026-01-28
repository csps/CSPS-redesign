import type { MerchType } from "../../enums/MerchType";
import type { OrderStatus } from "../../enums/OrderStatus";

export interface OrderItemResponse {
  orderItemId: number;
  orderId: number;
  studentId: string;
  studentName: string;
  merchName: string;
  color?: string | null;
  design?: string | null;
  size?: string | null;
  quantity: number;
  totalPrice: number;
  s3ImageKey?: string | null;
  merchType: MerchType;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  orderId: number;
  studentName: string;
  totalPrice: number;
  orderDate: string;
  orderItems: OrderItemResponse[];
  orderStatus: OrderStatus;
}

export interface PaginatedOrdersResponse {
  content: OrderResponse[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  numberOfElements: number;
  last: boolean;
  first: boolean;
  empty: boolean;
}
