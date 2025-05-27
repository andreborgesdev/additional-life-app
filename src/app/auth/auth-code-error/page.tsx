"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AuthCodeErrorPage() {
  const { t } = useTranslation("common");

  return (
    <div className="bg-red-50 dark:bg-red-900 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="absolute top-24 left-8 flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("auth.back_to_home")}
      </Link>

      <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t("auth.authentication_error")}
          </h1>

          <p className="text-gray-500 dark:text-gray-400 text-center">
            {t("auth.authentication_error_description")}
          </p>

          <div className="flex flex-col w-full space-y-3 mt-8">
            <Link
              href="/auth/login"
              className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              {t("auth.try_again")}
            </Link>

            <Link
              href="/"
              className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800 transition-colors duration-200"
            >
              {t("auth.back_to_home")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
