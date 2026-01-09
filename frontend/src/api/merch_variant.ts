import type { MerchVariantResponse } from "../interfaces/merch_variant/MerchVariantResponse";
import api from "./api";

export const getMerchVariantByMerchId = async (
  merchId: number
): Promise<MerchVariantResponse[]> => {
  try {
    // Fetch merch variants by merch ID
    const merchVariantResponse = await api.get(`/merchVariant/${merchId}/all`);

    return merchVariantResponse.data;
  } catch (err) {
    console.log("Error fetching merch variants:", err);
    throw err;
  }
};
