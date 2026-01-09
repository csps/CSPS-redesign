import type { CartItemRequest } from "../interfaces/cart/CartItemRequest";
import type { CartItemResponse } from "../interfaces/cart/CartItemResponse";
import type { CartResponse } from "../interfaces/cart/CartResponse";
import api from "./api";

// add a cart item
export const addCartItem = async (
  cartItem: CartItemRequest
): Promise<CartItemResponse> => {
  try {
    if (!cartItem.merchVariantId || cartItem.quantity <= 0) {
      throw new Error("Invalid cart item data");
    }

    const response = await api.post<CartItemResponse>(`cart-items`, cartItem);
    console.log("Added cart item:", response.data);

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

    console.log("Fetched cart:", cart);

    return cart;
  } catch (err) {
    console.error("Error fetching cart:", err);
    throw err;
  }
};
