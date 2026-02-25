import type { CartItemRequest } from "../interfaces/cart/CartItemRequest";
import type { CartItemResponse } from "../interfaces/cart/CartItemResponse";
import type { CartResponse } from "../interfaces/cart/CartResponse";
import api from "./api";

// add a cart item
export const addCartItem = async (
  cartItem: CartItemRequest
): Promise<CartItemResponse> => {
  try {
    if (!cartItem || !cartItem.merchVariantItemId || cartItem.quantity <= 0) {
      throw new Error("Invalid cart item data");
    }

    const response = await api.post<CartItemResponse>(`cart-items`, cartItem);

    if (response.status === 400)
      throw new Error("Bad request: Unable to add cart item");

    return response.data;
  } catch (err) {
    console.error("Error adding cart item:", err);
    throw err;
  }
};

// get cart  by student
export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await api.get(`cart`);

    if (response.status === 404)
      throw new Error("Cart not found for the student");

    const cart = response.data.data;


    return cart;
  } catch (err) {
    console.error("Error fetching cart:", err);
    throw err;
  }
};

/**
 * Removes a cart item by its merchVariantItemId.
 * Called in the background after optimistic UI removal — the item
 * disappears from the UI instantly, and this request syncs with the server.
 *
 * @param merchVariantItemId - The unique identifier of the cart item to remove
 * @returns The API response data on success
 * @throws Propagates the error so the caller can revert the optimistic removal
 */
export const removeCartItem = async (
  merchVariantItemId: number,
): Promise<void> => {
  try {
    await api.delete(`cart-items/${merchVariantItemId}`);
  } catch (err) {
    console.error("Error removing cart item:", err);
    throw err;
  }
};
