"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useLogin } from "@/src/hooks/auth/use-login";
import { ArrowLeft, Eye, EyeOff, LogIn, Mail } from "lucide-react";
import { toast } from "@/src/hooks/use-toast";
import { useGoogleLogin } from "@/src/hooks/auth/use-login-google";
import { useFacebookLogin } from "@/src/hooks/auth/use-login-facebook";
import { useTranslation } from "react-i18next";

const LoadingSpinner = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
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
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const { mutate: login, isPending: isEmailLoading } = useLogin();
  const { mutate: googleLogin, isPending: isGoogleLoading } = useGoogleLogin();
  const { t } = useTranslation("common");

  const isAnyRequestPending = isEmailLoading || isGoogleLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: () => router.push("/"),
        onError: () => {
          toast({
            title: t("auth.login_failed"),
            description: t("auth.check_credentials"),
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleGoogleLogin = () => googleLogin();

  const disabledLinkClasses = isAnyRequestPending
    ? "pointer-events-none opacity-50"
    : "";

  return (
    <div className="bg-green-50 dark:bg-green-800 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className={`absolute top-24 left-8 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors ${disabledLinkClasses}`}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("auth.back_to_home")}
      </Link>

      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("auth.welcome_back")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {t("auth.enter_credentials")}
          </p>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="flex justify-center">
            <button
              onClick={handleGoogleLogin}
              disabled={isAnyRequestPending}
              className="flex items-center justify-center px-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <LoadingSpinner className="h-5 w-5 mr-2" />
              ) : (
                <FcGoogle className="h-5 w-5 mr-2" />
              )}
              <span>
                {isGoogleLoading ? t("auth.connecting") : t("auth.google")}
              </span>
            </button>
          </div>

          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              {t("auth.or_continue_email")}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("auth.email")}
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
                  disabled={isAnyRequestPending}
                  className="block w-full pl-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t("auth.email_placeholder")}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  {t("auth.password")}
                </label>
                <Link
                  href="/auth/forgot-password"
                  className={`text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 ${disabledLinkClasses}`}
                >
                  {t("auth.forgot_password")}
                </Link>
              </div>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isAnyRequestPending}
                  className="block w-full pl-4 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={t("auth.password_placeholder")}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isAnyRequestPending}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isAnyRequestPending}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  {t("auth.remember_me")}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAnyRequestPending}
              className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEmailLoading ? (
                <LoadingSpinner className="-ml-1 mr-2 h-4 w-4 text-white" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              {isEmailLoading ? t("auth.logging_in") : t("auth.login")}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("auth.no_account")}{" "}
          <Link
            href="/auth/register"
            className={`font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300 ${disabledLinkClasses}`}
          >
            {t("auth.sign_up_free")}
          </Link>
        </p>
      </div>
    </div>
  );
}
