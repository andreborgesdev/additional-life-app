"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemResponse, ItemStatusRequest } from "@/src/lib/generated-api";
import { toast } from "@/src/hooks/use-toast";

interface MarkItemAsTakenVariables {
  itemId: string;
  requestBody: ItemStatusRequest;
}

async function updateItemStatusRequest({
  itemId,
  requestBody,
}: MarkItemAsTakenVariables): Promise<ItemResponse> {
  const response = await fetch(`/api/items/${itemId}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error || "Failed to mark item as taken/change status"
    );
  }
  return response.json();
}

export const useUpdateItemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<ItemResponse, Error, MarkItemAsTakenVariables>({
    mutationFn: updateItemStatusRequest,
    onSuccess: (data) => {
      toast({
        title: "Item Updated",
        description: `"${data.title}" status changed to ${data.status}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["userItems"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item", data.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description:
          error.message || "Could not mark item as taken/change status.",
        variant: "destructive",
      });
    },
  });
};
