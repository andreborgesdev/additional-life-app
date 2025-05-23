import { OauthUserRegisterPayload } from "@/src/app/api/users/oauth-register/route";
import { UserRequest, UserResponse } from "@/src/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function createUser(
  payload: OauthUserRegisterPayload
): Promise<UserResponse> {
  const response = await fetch(`/api/users/oauth-register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Failed to create user" }));
    throw new Error(errorData.message || "Failed to create user");
  }
  return response.json();
}

export const useRegisterOauthUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    OauthUserRegisterPayload,
    Error,
    OauthUserRegisterPayload,
    unknown
  >({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["userBySupabaseId", data.userData.supabaseId],
      });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.setQueryData(["user", data.userData.id], data);
      if (data.userData.supabaseId) {
        queryClient.setQueryData(
          ["userBySupabaseId", data.userData.supabaseId],
          data
        );
      }
    },
  });
};
