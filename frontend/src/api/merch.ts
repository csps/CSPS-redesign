import type { MerchType } from "../enums/MerchType";
import type {
  MerchDetailedResponse,
  MerchSummaryResponse,
} from "../interfaces/merch/MerchResponse";
import api from "./api";

/**
 * Get all merchandise summaries without variant details.
 * Endpoint: GET /api/merch/summary
 */
export const getAllMerchWithoutVariants = async (): Promise<
  MerchSummaryResponse[]
> => {
  try {
    const response = await api.get("/merch/summary");
    return response.data;
  } catch (err) {
    console.error("Error fetching merch summaries:", err);
    throw err;
  }
};

/**
 * Get detailed merchandise by ID including all variants and items.
 * Endpoint: GET /api/merch/{merchId}
 */
export const getMerchById = async (
  merchId: number
): Promise<MerchDetailedResponse> => {
  try {
    const response = await api.get(`/merch/${merchId}`);

    if (response.status === 404) throw new Error("Merch not found");

    return response.data;
  } catch (err) {
    console.error(`Error fetching merch ${merchId}:`, err);
    throw err;
  }
};

/**
 * Get merchandise by type.
 * Endpoint: GET /api/merch/type/{type}
 */
export const getMerchByType = async (
  merchType: MerchType
): Promise<MerchSummaryResponse[]> => {
  try {
    const response = await api.get(`/merch/type/${merchType}`);
    return response.data;
  } catch (err) {
    console.error("Error fetching merch by type:", err);
    throw err;
  }
};

/**
 * Get all merchandise (for admin purposes).
 * Endpoint: GET /api/merch
 */
export const getAllMerch = async (): Promise<MerchDetailedResponse[]> => {
  try {
    const response = await api.get("/merch");
    return response.data;
  } catch (err) {
    console.error("Error fetching all merch:", err);
    throw err;
  }
};

