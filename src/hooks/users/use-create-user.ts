import { UserRequest, UserResponse } from "@/src/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createUser(userData: UserRequest): Promise<UserResponse> {
  const response = await fetch(`/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to create user" }));
    throw new Error(errorData.message || "Failed to create user");
  }
  return response.json();
}

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, UserRequest, unknown>({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userBySupabaseId", data.supabaseId],
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData(["user", data.id], data);
      if (data.supabaseId) {
        queryClient.setQueryData(["userBySupabaseId", data.supabaseId], data);
      }
    },
  });
};
