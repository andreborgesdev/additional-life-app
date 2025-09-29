"use client";

import { useState } from "react";
import { useForgotPassword } from "@/src/hooks/auth/use-forgot-password";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRedirectIfAuthenticated } from "@/src/hooks/auth/use-redirect-if-authenticated";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const forgotPasswordMutation = useForgotPassword();
  const { t } = useTranslation("common");
  const { checking } = useRedirectIfAuthenticated();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    try {
      await forgotPasswordMutation.mutateAsync(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to send reset email:", error);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 dark:bg-green-800">
        <span className="text-gray-600 dark:text-gray-300 text-sm">Loading...</span>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 dark:bg-green-800 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Link
          href="/auth/login"
          className="absolute top-24 left-8 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("auth.back_to_login")}
        </Link>

        <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
          <div className="flex flex-col space-y-2 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {t("auth.check_your_email")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">{t("auth.password_reset_sent")}</p>
            <p className="text-green-600 dark:text-green-400 font-medium">{email}</p>
          </div>

          <div className="space-y-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                {t("auth.check_your_email_instructions")}
              </p>
            </div>

            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              {t("auth.try_again")}
            </button>

            <Link
              href="/auth/login"
              className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              {t("auth.back_to_login")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 dark:bg-green-800 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Link
        href="/auth/login"
        className="absolute top-24 left-8 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("auth.back_to_login")}
      </Link>

      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("auth.forgot_password_title")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("auth.forgot_password_description")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("auth.email_address")}
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                placeholder={t("auth.email_placeholder")}
              />
            </div>
          </div>

          {forgotPasswordMutation.error && (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                {forgotPasswordMutation.error.message || t("auth.reset_email_error")}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={forgotPasswordMutation.isPending || !email.trim()}
            className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {forgotPasswordMutation.isPending ? (
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
            ) : null}
            {forgotPasswordMutation.isPending ? t("auth.sending") : t("auth.send_reset_link")}
          </button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
            >
              {t("auth.back_to_login")}
            </Link>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("auth.no_account")}{" "}
          <Link
            href="/auth/register"
            className="font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
          >
            {t("auth.sign_up_free")}
          </Link>
        </p>
      </div>
    </div>
  );
}
