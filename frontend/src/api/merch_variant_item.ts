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
  item: MerchVariantItemRequest
): Promise<MerchVariantItemResponse> => {
  try {
    const response = await api.post(
      `/merch-variant-item/${merchVariantId}/add`,
      item
    );
    return response.data;
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
  items: MerchVariantItemRequest[]
): Promise<MerchVariantItemResponse[]> => {
  try {
    const response = await api.post(
      `/merch-variant-item/${merchVariantId}/add-multiple`,
      items
    );
    return response.data;
  } catch (err) {
    console.error(
      `Error adding multiple items to variant ${merchVariantId}:`,
      err
    );
    throw err;
  }
};

/**
 * Get all items for a variant.
 * Endpoint: GET /api/merch-variant-item/{merchVariantId}
 */
export const getItemsByVariant = async (
  merchVariantId: number
): Promise<MerchVariantItemResponse[]> => {
  try {
    const response = await api.get(`/merch-variant-item/${merchVariantId}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching items for variant ${merchVariantId}:`, err);
    throw err;
  }
};

/**
 * Update stock quantity for an item.
 * Endpoint: PUT /api/merch-variant-item/{merchVariantItemId}/stock?quantity={quantity}
 */
export const updateItemStock = async (
  merchVariantItemId: number,
  quantity: number
): Promise<MerchVariantItemResponse> => {
  try {
    const response = await api.put(
      `/merch-variant-item/${merchVariantItemId}/stock?quantity=${quantity}`
    );
    return response.data;
  } catch (err) {
    console.error(`Error updating stock for item ${merchVariantItemId}:`, err);
    throw err;
  }
};

/**
 * Update price for an item.
 * Endpoint: PUT /api/merch-variant-item/{merchVariantItemId}/price?price={price}
 */
export const updateItemPrice = async (
  merchVariantItemId: number,
  price: number
): Promise<MerchVariantItemResponse> => {
  try {
    const response = await api.put(
      `/merch-variant-item/${merchVariantItemId}/price?price=${price}`
    );
    return response.data;
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
