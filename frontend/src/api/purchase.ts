import type { PurchaseResponse } from "../interfaces/purchase/PurchaseResponse";
import api from "./api";

export const getPurchaseByStudent = async (): Promise<PurchaseResponse[]> => {
  try {
    const response = await api.get<PurchaseResponse[]>("/purchase/me");

    console.log("Fetched purchase items:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error fetching purchase items:", err);
    throw err;
  }
};
