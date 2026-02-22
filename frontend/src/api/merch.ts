import { ClothingSizing } from "../enums/ClothingSizing";
import { MerchType } from "../enums/MerchType";
import type {
  ClothingVariant,
  MerchFormState,
  NonClothingVariant,
} from "../hooks/useMerchForm";
import type {
  MerchDetailedResponse,
  MerchSummaryResponse,
} from "../interfaces/merch/MerchResponse";
import type {
  ClothingVariantRequestDTO,
  NonClothingVariantRequestDTO,
} from "../interfaces/dto/VariantRequestDTO";
import api from "./api";
import type { MerchVariantRequest } from "../interfaces/merch_variant/MerchVariantRequest";
import type { MerchVariantResponse } from "../interfaces/merch_variant/MerchVariantResponse";

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
  merchId: number,
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
  merchType: MerchType,
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

export const createMerch = async (
  formState: MerchFormState,
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    console.log(`Creating merch with form state:`, formState);

    const formData = new FormData();

    // Add base merch fields
    formData.append("merchName", formState.merchName);
    formData.append("description", formState.description);
    formData.append("merchType", formState.merchType as string);
    formData.append("basePrice", formState.basePrice.toString());

    // Add main merch image
    if (formState.merchImageFile) {
      formData.append("merchImage", formState.merchImageFile);
    }

    // Add thumbnail images
    formState.thumbnailFiles.forEach((file) => {
      if (file) {
        formData.append(`thumbnailImages`, file);
      }
    });

    // Build variants array based on merch type
    let variants: (ClothingVariantRequestDTO | NonClothingVariantRequestDTO)[] =
      [];

    if (formState.merchType === "CLOTHING") {
      variants = formState.clothingVariants.map((variant: ClothingVariant) => ({
        color: variant.color,
        s3ImageKey: null,
        variantItems: variant.sizeStock
          .filter((item) => item.checked)
          .map((item) => ({
            size: item.size as ClothingSizing,
            stockQuantity: Number(item.stock),
            price: Number(variant.price),
          })),
      }));
    } else {
      variants = formState.nonClothingVariants.map(
        (variant: NonClothingVariant) => ({
          design: variant.design,
          s3ImageKey: null,
          variantItems: [
            {
              stockQuantity: Number(variant.stock),
              price: Number(variant.price),
            },
          ],
        }),
      );
    }

    // Add variants as JSON string
    formData.append("variants", JSON.stringify(variants));

    // Add variant images
    const variantImages: File[] = [];
    if (formState.merchType === "CLOTHING") {
      formState.clothingVariants.forEach((variant: ClothingVariant) => {
        if (variant.imageFile) {
          variantImages.push(variant.imageFile);
        }
      });
    } else {
      formState.nonClothingVariants.forEach((variant: NonClothingVariant) => {
        if (variant.imageFile) {
          variantImages.push(variant.imageFile);
        }
      });
    }

    variantImages.forEach((file) => {
      formData.append("variantImages", file);
    });

    console.log(Object.fromEntries(formData.entries()));
    const response = await api.post("/merch/post", formData);

    console.log("Merch created successfully:", response.data.data);
    return {
      success: response.data.status === "CREATED",
      data: response.data.data,
    };
  } catch (err: any) {
    console.error("Error creating merch:", err);

    // Return error response instead of throwing
    return {
      success: false,
      error:
        err.response?.data?.message ||
        err.message ||
        "Failed to create merchandise",
    };
  }
};

export const addVariantToMerch = async (
  merchId: number,
  variantRequest: MerchVariantRequest,
): Promise<MerchVariantResponse> => {
  try {
    const formData = new FormData();

    if (variantRequest.color) {
      formData.append("color", variantRequest.color);
    }

    // Check if 'design' is a File object before appending
    if (variantRequest.design) {
      formData.append("design", variantRequest.design);
    }

    // FIX: Iterate and append each field individually using index notation
    if (variantRequest.variantItems && variantRequest.variantItems.length > 0) {
      variantRequest.variantItems.forEach((item, index) => {
        // Assuming your item has stockQuantity, price, and optional size
        formData.append(
          `variantItems[${index}].stockQuantity`,
          item.stockQuantity.toString(),
        );
        formData.append(`variantItems[${index}].price`, item.price.toString());
        if (item.size) {
          formData.append(`variantItems[${index}].size`, item.size);
        }
      });
    }

    formData.append("variantImage", variantRequest.variantImage);

    console.log(
      `FormData entries before sending:`,
      Object.fromEntries(formData.entries()),
    );
    const response = await api.post(`/merch-variant/${merchId}/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    console.error(`Error adding variant to merch ${merchId}:`, err);
    throw err;
  }
};

/**
 * Delete merch by ID.
 * Cascades to delete all variants and items.
 * Endpoint: DELETE /api/merch/{merchId}
 */
export const deleteMerch = async (merchId: number): Promise<void> => {
  try {
    await api.delete(`/merch/${merchId}`);
  } catch (err) {
    console.error(`Error deleting merch ${merchId}:`, err);
    throw err;
  }
};

/**
 * Delete merch variant by ID.
 * Cascades to delete all items in the variant.
 * Endpoint: DELETE /api/merch-variant/{merchVariantId}
 */
export const deleteMerchVariant = async (
  merchVariantId: number,
): Promise<void> => {
  try {
    await api.delete(`/merch-variant/${merchVariantId}`);
  } catch (err) {
    console.error(`Error deleting merch variant ${merchVariantId}:`, err);
    throw err;
  }
};

/**
 * Get archived merchandise with pagination.
 * Endpoint: GET /api/merch/archive
 */
export const getArchivedMerch = async (
  page: number = 0,
  size: number = 10,
): Promise<any> => {
  try {
    const response = await api.get("/merch/archive", {
      params: { page, size },
    });
    return response.data.data;
  } catch (err) {
    console.error("Error fetching archived merch:", err);
    throw err;
  }
};

/**
 * Revert archived merchandise back to active.
 * Endpoint: PUT /api/merch/{merchId}/revert
 */
export const revertMerch = async (merchId: number): Promise<void> => {
  try {
    await api.put(`/merch/${merchId}/revert`);
  } catch (err) {
    console.error(`Error reverting merch ${merchId}:`, err);
    throw err;
  }
};
