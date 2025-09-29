"use client";

import { useMutation } from "@tanstack/react-query";
import { RegisterPayload } from "@/src/app/api/auth/register/route";

interface RegisterSuccessResponse {
  success: boolean;
  message: string;
}

export interface RegisterErrorResponse {
  status: number;
  message: string;
}

export class RegistrationError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "RegistrationError";
    this.status = status;
  }
}

export const useRegister = () => {
  return useMutation<RegisterSuccessResponse, RegistrationError, RegisterPayload, unknown>({
    mutationFn: async (payload: RegisterPayload) => {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json();

      if (!response.ok) {
        throw new RegistrationError(
          (responseBody as RegisterErrorResponse).message ||
            `Registration failed with status ${response.status}`,
          response.status,
        );
      }
      return responseBody as RegisterSuccessResponse;
    },
  });
};
