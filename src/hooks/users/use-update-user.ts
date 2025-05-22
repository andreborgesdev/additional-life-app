import { UserRequest, UserResponse } from "@/src/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateUserPayload {
  userId: string;
  userData: UserRequest;
}

async function updateUser({
  userId,
  userData,
}: UpdateUserPayload): Promise<UserResponse> {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update user");
  }
  return response.json();
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserResponse, Error, UpdateUserPayload, unknown>({
    mutationFn: updateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["userBySupabaseId", data.supabaseId],
      });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
      // Potentially update the specific user query if needed
      // queryClient.setQueryData(['user', variables.userId], data);
    },
  });
};
