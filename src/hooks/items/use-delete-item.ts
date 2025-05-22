"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/src/hooks/use-toast";

async function deleteItemRequest(itemId: string): Promise<void> {
  const response = await fetch(`/api/items/${itemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to delete item");
  }
}

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteItemRequest,
    onSuccess: () => {
      toast({
        title: "Item Deleted",
        description: "The item has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["userItems"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Item",
        description: error.message || "Could not delete the item.",
        variant: "destructive",
      });
    },
  });
};
