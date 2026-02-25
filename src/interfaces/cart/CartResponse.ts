import type { CartItemResponse } from "./CartItemResponse";

export interface CartResponse {
    studentId: string;
    items: CartItemResponse[];
}