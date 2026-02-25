import api from "./api";
import type { MerchCustomerResponse } from "../interfaces/merch_customer/MerchCustomerResponse";
import type { BulkMerchPaymentRequest } from "../interfaces/merch_customer/BulkMerchPaymentRequest";
import type { OrderResponse } from "../interfaces/order/OrderResponse";
import type { PaginatedResponse } from "../interfaces/paginated";
import type { OrderStatus } from "../enums/OrderStatus";

/**
 * Get paginated list of customers who purchased a specific merch.
 * Endpoint: GET /api/merch-customers/{merchId}
 *
 * @param merchId - the merch ID to fetch customers for
 * @param page - zero-based page index (default 0)
 * @param size - items per page (default 7)
 * @returns paginated merch customer list
 */
export const getMerchCustomers = async (
  merchId: number,
  page: number = 0,
  size: number = 7,
): Promise<PaginatedResponse<MerchCustomerResponse>> => {
  const response = await api.get<PaginatedResponse<MerchCustomerResponse>>(
    `/merch-customers/${merchId}`,
    { params: { page, size } },
  );
  return response.data;
};

/**
 * Get paginated list of customers filtered by order status.
 * Endpoint: GET /api/merch-customers/{merchId}/by-status
 *
 * @param merchId - the merch ID to fetch customers for
 * @param status - order status filter (PENDING, TO_BE_CLAIMED, CLAIMED, REJECTED)
 * @param page - zero-based page index (default 0)
 * @param size - items per page (default 7)
 * @returns paginated merch customer list filtered by status
 */
export const getMerchCustomersByStatus = async (
  merchId: number,
  status: OrderStatus,
  page: number = 0,
  size: number = 7,
): Promise<PaginatedResponse<MerchCustomerResponse>> => {
  const response = await api.get<PaginatedResponse<MerchCustomerResponse>>(
    `/merch-customers/${merchId}/by-status`,
    { params: { status, page, size } },
  );
  return response.data;
};

/**
 * Get lightweight count of total customers for a merch.
 * Endpoint: GET /api/merch-customers/{merchId}/count
 *
 * @param merchId - the merch ID to count customers for
 * @returns object with count property
 */
export const getMerchCustomerCount = async (
  merchId: number,
): Promise<{ count: number }> => {
  const response = await api.get<{ count: number }>(
    `/merch-customers/${merchId}/count`,
  );
  return response.data;
};

/**
 * Batch-create orders for multiple students who already paid.
 * Uses saveAll() for performance. Stock is validated upfront —
 * if total stock needed exceeds availability, the entire batch is rejected.
 * Endpoint: POST /api/merch-customers/bulk-payment
 *
 * @param dto - bulk payment request with entries (studentId + orderDate pairs), merchVariantItemId, quantityPerStudent
 * @returns list of created order responses (201 Created)
 */
export const bulkMerchPayment = async (
  dto: BulkMerchPaymentRequest,
): Promise<OrderResponse[]> => {
  const response = await api.post<OrderResponse[]>(
    "/merch-customers/bulk-payment",
    dto,
  );
  return response.data;
};

/**
 * Export full unpaginated list of customers for a specific merch (CSV export).
 * Endpoint: GET /api/merch-customers/{merchId}/export
 *
 * @param merchId - the merch ID to export customers for
 * @returns full list of merch customer records
 */
export const exportMerchCustomers = async (
  merchId: number,
): Promise<MerchCustomerResponse[]> => {
  const response = await api.get<MerchCustomerResponse[]>(
    `/merch-customers/${merchId}/export`,
  );
  return response.data;
};

/**
 * Check if a student has a MEMBERSHIP merch in their cart or a PENDING order.
 * Endpoint: GET /api/merch-customers/membership-status/{studentId}
 *
 * @param studentId - the student ID to check
 * @returns object with hasMembership boolean
 */
export const checkMembershipStatus = async (
  studentId: string,
): Promise<{ hasMembership: boolean }> => {
  const response = await api.get<{ hasMembership: boolean }>(
    `/merch-customers/membership-status/${studentId}`,
  );
  return response.data;
};
