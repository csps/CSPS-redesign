import type { MerchType } from "../enums/MerchType";
import type {
  MerchDetailedResponse,
  MerchSummaryResponse,
} from "../interfaces/merch/MerchResponse";
import api from "./api";

// Fetch all merch summaries without variants
export const getAllMerchWithoutVariants = async (): Promise<
  MerchSummaryResponse[]
> => {
  try {
    const response = await api.get("/merch/summary");

    return response.data;
  } catch (err) {
    console.error("Error fetching merch:", err);
    throw err;
  }
};

// Fetch detailed merch by ID, including variants
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
