import type {
  MerchVariantItemRequest,
  MerchVariantItemResponse,
} from "../interfaces/merch_variant_item/MerchVariantItemResponse";
import api from "./api";

/**
 * Add a single item to a variant.
 * Endpoint: POST /api/merch-variant-item/{merchVariantId}/add
 */
export const addItemToVariant = async (
  merchVariantId: number,
  item: MerchVariantItemRequest,
): Promise<MerchVariantItemResponse> => {
  try {
    const response = await api.post(
      `/merch-variant-item/${merchVariantId}/add`,
      item,
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error adding item to variant ${merchVariantId}:`, err);
    throw err;
  }
};

/**
 * Add multiple items to a variant.
 * Endpoint: POST /api/merch-variant-item/{merchVariantId}/add-multiple
 */
export const addMultipleItemsToVariant = async (
  merchVariantId: number,
  items: MerchVariantItemRequest[],
): Promise<MerchVariantItemResponse[]> => {
  try {
    const response = await api.post(
      `/merch-variant-item/${merchVariantId}/add-multiple`,
      items,
    );
    return response.data.data;
  } catch (err) {
    console.error(
      `Error adding multiple items to variant ${merchVariantId}:`,
      err,
    );
    throw err;
  }
};

/**
 * Get item by ID.
 * Endpoint: GET /api/merch-variant-item/{id}
 */
export const getItemById = async (
  id: number,
): Promise<MerchVariantItemResponse> => {
  try {
    const response = await api.get(`/merch-variant-item/${id}`);
    return response.data.data;
  } catch (err) {
    console.error(`Error fetching item ${id}:`, err);
    throw err;
  }
};

/**
 * Get item by variant and size.
 * Endpoint: GET /api/merch-variant-item/variant/{merchVariantId}/size/{size}
 */
export const getItemByVariantAndSize = async (
  merchVariantId: number,
  size: string,
): Promise<MerchVariantItemResponse> => {
  try {
    const response = await api.get(
      `/merch-variant-item/variant/${merchVariantId}/size/${size}`,
    );
    return response.data.data;
  } catch (err) {
    console.error(
      `Error fetching item for variant ${merchVariantId} and size ${size}:`,
      err,
    );
    throw err;
  }
};

/**
 * Get all items for a variant.
 * Endpoint: GET /api/merch-variant-item/variant/{merchVariantId}
 */
export const getItemsByVariant = async (
  merchVariantId: number,
): Promise<MerchVariantItemResponse[]> => {
  try {
    const response = await api.get(
      `/merch-variant-item/variant/${merchVariantId}`,
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error fetching items for variant ${merchVariantId}:`, err);
    throw err;
  }
};

/**
 * Update stock quantity for an item.
 * Endpoint: PATCH /api/merch-variant-item/{merchVariantItemId}/stock?quantity={quantity}
 */
export const updateItemStock = async (
  merchVariantItemId: number,
  quantity: number,
): Promise<MerchVariantItemResponse> => {
  try {
    const response = await api.patch(
      `/merch-variant-item/${merchVariantItemId}/stock`,
      null,
      { params: { quantity } },
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error updating stock for item ${merchVariantItemId}:`, err);
    throw err;
  }
};

/**
 * Update price for an item.
 * Endpoint: PATCH /api/merch-variant-item/{merchVariantItemId}/price?price={price}
 */
export const updateItemPrice = async (
  merchVariantItemId: number,
  price: number,
): Promise<MerchVariantItemResponse> => {
  try {
    const response = await api.patch(
      `/merch-variant-item/${merchVariantItemId}/price`,
      null,
      { params: { price } },
    );
    return response.data.data;
  } catch (err) {
    console.error(`Error updating price for item ${merchVariantItemId}:`, err);
    throw err;
  }
};

/**
 * Delete an item.
 * Endpoint: DELETE /api/merch-variant-item/{merchVariantItemId}
 */
export const deleteItem = async (merchVariantItemId: number): Promise<void> => {
  try {
    await api.delete(`/merch-variant-item/${merchVariantItemId}`);
  } catch (err) {
    console.error(`Error deleting item ${merchVariantItemId}:`, err);
    throw err;
  }
};

export default {
  addItemToVariant,
  addMultipleItemsToVariant,
  getItemById,
  getItemsByVariant,
  getItemByVariantAndSize,
  updateItemStock,
  updateItemPrice,
  deleteItem,
};
