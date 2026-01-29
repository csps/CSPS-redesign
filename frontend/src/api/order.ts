import type {
  OrderResponse,
  OrderItemResponse,
  PaginatedOrdersResponse,
  PaginatedOrderItemsResponse,
} from "../interfaces/order/OrderResponse";
import type {
  OrderPostRequest,
  OrderItemRequest,
} from "../interfaces/order/OrderRequest";
import api from "./api";
import type { PaginationParams } from "../interfaces/pagination_params";
import type { OrderStatus } from "../enums/OrderStatus";

const ORDERS = "orders";
const ORDER_ITEMS = "order-items";

/**
 * Create a new order.
 * Endpoint: POST /api/orders
 */
export const createOrder = async (
  payload?: OrderPostRequest,
): Promise<OrderResponse> => {
  try {
    const response = await api.post<OrderResponse>(ORDERS, payload ?? {});
    return response.data;
  } catch (err) {
    console.error("Error creating order:", err);
    throw err;
  }
};

/**
 * Get all orders (admin).
 * Endpoint: GET /api/orders
 */
export const getAllOrders = async (): Promise<OrderResponse[]> => {
  try {
    const response = await api.get<OrderResponse[]>(ORDERS);
    return response.data;
  } catch (err) {
    console.error("Error fetching all orders:", err);
    throw err;
  }
};

/**
 * Get order by id.
 * Endpoint: GET /api/orders/{orderId}
 */
export const getOrderById = async (orderId: number): Promise<OrderResponse> => {
  try {
    const response = await api.get<OrderResponse>(`${ORDERS}/${orderId}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching order ${orderId}:`, err);
    throw err;
  }
};

export const getMyOrders = async (
  paginationParams?: PaginationParams,
): Promise<PaginatedOrdersResponse> => {
  try {
    const params = new URLSearchParams();

    if (paginationParams) {
      if (paginationParams.page !== undefined) {
        params.append("page", paginationParams.page.toString());
      }
      if (paginationParams.size !== undefined) {
        params.append("size", paginationParams.size.toString());
      }
      if (paginationParams.sort) {
        params.append("sort", paginationParams.sort);
      }
    }

    const url = params.toString()
      ? `${ORDERS}/my-orders?${params.toString()}`
      : `${ORDERS}/my-orders`;

    const response = await api.get<{ data: PaginatedOrdersResponse }>(url);

    console.log("getMyOrders response:", response);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching my orders:", err);
    throw err;
  }
};

/**
 * Get all orders (admin) with pagination.
 * Endpoint: GET /api/orders
 */
export const getOrders = async (
  paginationParams?: PaginationParams,
): Promise<PaginatedOrdersResponse> => {
  try {
    const params = new URLSearchParams();

    if (paginationParams) {
      if (paginationParams.page !== undefined) {
        params.append("page", paginationParams.page.toString());
      }
      if (paginationParams.size !== undefined) {
        params.append("size", paginationParams.size.toString());
      }
      if (paginationParams.sort) {
        params.append("sort", paginationParams.sort);
      }
    }

    const url = params.toString() ? `${ORDERS}?${params.toString()}` : ORDERS;

    const response = await api.get<{ data: PaginatedOrdersResponse }>(url);

    console.log("getOrders response:", response);
    return response.data.data;
  } catch (err) {
    console.error("Error fetching orders:", err);
    throw err;
  }
};

/**
 * Delete an order.
 * Endpoint: DELETE /api/orders/{orderId}
 */
export const deleteOrder = async (orderId: number): Promise<void> => {
  try {
    await api.delete(`${ORDERS}/${orderId}`);
  } catch (err) {
    console.error(`Error deleting order ${orderId}:`, err);
    throw err;
  }
};

/* OrderItem APIs */

/**
 * Create an order item.
 * Endpoint: POST /api/order-items
 */
export const createOrderItem = async (
  payload: OrderItemRequest,
): Promise<OrderItemResponse> => {
  try {
    const response = await api.post<OrderItemResponse>(ORDER_ITEMS, payload);
    return response.data;
  } catch (err) {
    console.error("Error creating order item:", err);
    throw err;
  }
};

/**
 * Get order item by id.
 * Endpoint: GET /api/order-items/{id}
 */
export const getOrderItemById = async (
  id: number,
): Promise<OrderItemResponse> => {
  try {
    const response = await api.get<OrderItemResponse>(`${ORDER_ITEMS}/${id}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching order item ${id}:`, err);
    throw err;
  }
};

/**
 * Get items by order id.
 * Endpoint: GET /api/order-items?orderId={orderId}
 */
export const getOrderItemsByOrderId = async (
  orderId: number,
): Promise<OrderItemResponse[]> => {
  try {
    const response = await api.get<OrderItemResponse[]>(ORDER_ITEMS, {
      params: { orderId },
    });
    return response.data;
  } catch (err) {
    console.error(`Error fetching items for order ${orderId}:`, err);
    throw err;
  }
};

/**
 * Get order item by status
 *
 * @param status
 * @returns
 */
export const getOrderItemByStatus = async (
  status: OrderStatus,
): Promise<PaginatedOrderItemsResponse> => {
  try {
    const response = await api.get<{ data: PaginatedOrderItemsResponse }>(
      `${ORDER_ITEMS}/status`,
      {
        params: { status },
      },
    );

    console.log(
      `Fetched order items with status ${status}:`,
      response.data.data,
    );

    return response.data.data;
  } catch (err) {
    console.error(`Error fetching order items with status ${status}:`, err);
    throw err;
  }
};

/**
 * Update order item status.
 * Endpoint: PATCH /api/order-items/{id}/status?status={STATUS}
 */
export const updateOrderItemStatus = async (
  id: number,
  status: OrderStatus,
): Promise<OrderItemResponse> => {
  try {
    const response = await api.patch<OrderItemResponse>(
      `${ORDER_ITEMS}/${id}/status`,
      null,
      { params: { status } },
    );
    return response.data;
  } catch (err) {
    console.error(`Error updating status for order item ${id}:`, err);
    throw err;
  }
};

/**
 * Delete order item.
 * Endpoint: DELETE /api/order-items/{id}
 */
export const deleteOrderItem = async (id: number): Promise<void> => {
  try {
    await api.delete(`${ORDER_ITEMS}/${id}`);
  } catch (err) {
    console.error(`Error deleting order item ${id}:`, err);
    throw err;
  }
};

export default {
  createOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  getOrders,
  deleteOrder,
  createOrderItem,
  getOrderItemById,
  getOrderItemByStatus,
  getOrderItemsByOrderId,
  updateOrderItemStatus,
  deleteOrderItem,
};
