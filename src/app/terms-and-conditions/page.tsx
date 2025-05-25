"use client";

import { useTranslation } from "react-i18next";

export default function TermsAndConditionsPage() {
  const { t } = useTranslation("common");

  return (
    <div className="bg-green-50 dark:bg-green-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-100 text-center mb-12">
          {t("terms_and_conditions_page.title")}
        </h1>

        <div className="max-w-4xl mx-auto bg-white dark:bg-green-800 rounded-lg shadow-md p-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("terms_and_conditions_page.introduction")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("terms_and_conditions_page.acceptance_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("terms_and_conditions_page.acceptance_text")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("terms_and_conditions_page.user_responsibilities_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("terms_and_conditions_page.user_responsibilities_text")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("terms_and_conditions_page.intellectual_property_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("terms_and_conditions_page.intellectual_property_text")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("terms_and_conditions_page.limitation_of_liability_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("terms_and_conditions_page.limitation_of_liability_text")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("terms_and_conditions_page.changes_to_terms_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("terms_and_conditions_page.changes_to_terms_text")}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mt-8">
            {t("terms_and_conditions_page.contact_us_text")}
          </p>
        </div>
      </div>
    </div>
  );
}
