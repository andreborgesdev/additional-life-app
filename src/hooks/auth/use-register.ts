"use client";

import { useMutation } from "@tanstack/react-query";
import { RegisterPayload } from "@/src/app/api/users/register/route";

export const useRegister = () => {
  return useMutation<RegisterPayload, Error, RegisterPayload, unknown>({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
      return response.json();
    },
  });
};
