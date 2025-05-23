import { ItemRequest } from "@/src/lib/generated-api";

export const useCreateOrUpdateItem = async (
  itemPayload: ItemRequest,
  isEditMode: boolean,
  itemId?: string | null
): Promise<{ success: boolean; error?: string }> => {
  try {
    const endpoint =
      isEditMode && itemId ? `/api/items/${itemId}` : "/api/items";
    const method = isEditMode ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to save item");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Failed to save item:", error);
    return { success: false, error: error.message };
  }
};
