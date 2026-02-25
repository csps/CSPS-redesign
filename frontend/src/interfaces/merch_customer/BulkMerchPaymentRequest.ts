/**
 * Individual entry for bulk payment with custom order date.
 * @field studentId - 8-character student ID
 * @field orderDate - ISO 8601 datetime for the purchase timestamp
 */
export interface BulkPaymentEntry {
  studentId: string;
  orderDate: string;
}

/**
 * Request DTO for batch-creating orders for students who already paid.
 * Sent to POST /api/merch-customers/bulk-payment.
 *
 * @field entries - list of {studentId, orderDate} pairs for individual purchase timestamps
 * @field merchVariantItemId - the specific SKU (MerchVariantItem) they purchased
 * @field quantityPerStudent - quantity per student (min: 1, default: 1)
 */
export interface BulkMerchPaymentRequest {
  entries: BulkPaymentEntry[];
  merchVariantItemId: number;
  quantity?: number;
}
