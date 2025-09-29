"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Lock } from "lucide-react";
import { useUpdatePassword } from "@/src/hooks/users/use-update-password";
import { useSession } from "@/src/app/auth-provider";

export default function ResetPasswordPage() {
  const { t } = useTranslation("common");
  const updatePasswordMutation = useUpdatePassword();
  const { session, isLoading: sessionLoading } = useSession();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => setValidationError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [validationError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (newPassword.length < 8) {
      setValidationError(t("auth.at_least_8_characters"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setValidationError(t("auth.passwords_do_not_match"));
      return;
    }

    try {
      await updatePasswordMutation.mutateAsync({ newPassword });
      setPasswordUpdated(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setValidationError(error?.message || t("auth.password_update_error"));
    }
  };

  const showForm = !!session; // User has a (recovery) session

  return (
    <div className="bg-green-50 dark:bg-green-800 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link
        href="/auth/login"
        className="absolute top-24 left-8 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("auth.back_to_login")}
      </Link>

      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        {!showForm && !sessionLoading && (
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t("auth.reset_password")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t("auth.recovery_session_missing", {
                defaultValue:
                  "The recovery link is invalid or has expired. Please request a new password reset link.",
              })}
            </p>
            <Link
              href="/auth/forgot-password"
              className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              {t("auth.forgot_password")}
            </Link>
          </div>
        )}

        {showForm && !passwordUpdated && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2 text-center mb-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {t("auth.set_new_password", { defaultValue: t("auth.reset_password") })}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                {t("auth.enter_new_password", {
                  defaultValue: "Enter and confirm your new password below.",
                })}
              </p>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("auth.new_password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full pl-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder={t("auth.new_password_placeholder", {
                    defaultValue: "Enter new password",
                  })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("auth.confirm_new_password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder={t("auth.confirm_password_placeholder", {
                    defaultValue: "Confirm new password",
                  })}
                />
              </div>
            </div>

            {validationError && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">{validationError}</p>
              </div>
            )}

            {updatePasswordMutation.error && !validationError && (
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {updatePasswordMutation.error.message || t("auth.password_update_error")}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={updatePasswordMutation.isPending || !newPassword || !confirmPassword}
              className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatePasswordMutation.isPending && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {updatePasswordMutation.isPending
                ? t("auth.updating_password", {
                    defaultValue: t("auth.updating_password") || "Updating...",
                  })
                : t("auth.update_password", {
                    defaultValue: t("auth.update_password") || "Update Password",
                  })}
            </button>
          </form>
        )}

        {passwordUpdated && (
          <div className="space-y-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t("auth.password_updated", { defaultValue: "Password updated" })}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {t("auth.password_updated_success", {
                defaultValue: "Your password has been updated.",
              })}
            </p>
            <Link
              href="/auth/login"
              className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              {t("auth.back_to_login")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
