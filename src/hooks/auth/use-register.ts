"use client";

import { useMutation } from "@tanstack/react-query";
import { UserResponse } from "../../lib/api-client";

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  recaptchaToken: string;
}

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
