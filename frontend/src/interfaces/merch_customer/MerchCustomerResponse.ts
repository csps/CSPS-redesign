import type { ClothingSizing } from "../../enums/ClothingSizing";
import type { OrderStatus } from "../../enums/OrderStatus";

/**
 * Represents a customer who purchased a specific merch.
 * Returned from GET /api/merch-customers/{merchId} endpoints.
 *
 * @field studentId - 8-character student ID
 * @field studentName - full name (first + last)
 * @field yearLevel - 1–4
 * @field merchName - name of the purchased merch
 * @field color - variant color (null for non-clothing)
 * @field design - variant design
 * @field size - item size (null for non-clothing)
 * @field quantity - number of items purchased
 * @field totalPrice - quantity × priceAtPurchase
 * @field orderStatus - current status of the order item
 * @field orderDate - ISO 8601 date when the order was placed
 * @field s3ImageKey - S3 key for the variant image
 */
export interface MerchCustomerResponse {
  studentId: string;
  studentName: string;
  yearLevel: number;
  merchName: string;
  color?: string | null;
  design?: string | null;
  size?: ClothingSizing | null;
  quantity: number;
  totalPrice: number;
  orderStatus: OrderStatus;
  orderDate: string;
  s3ImageKey?: string | null;
}
