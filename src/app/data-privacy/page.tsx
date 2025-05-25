"use client";

import { useTranslation } from "next-i18next";

export default function DataPrivacyPage() {
  const { t } = useTranslation("common");
  return (
    <div className="bg-green-50 dark:bg-green-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-100 text-center mb-12">
          {t("data_privacy_page.title")}
        </h1>

        <div className="max-w-4xl mx-auto bg-white dark:bg-green-800 rounded-lg shadow-md p-8">
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("data_privacy_page.introduction")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("data_privacy_page.information_we_collect_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("data_privacy_page.information_we_collect_text")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("data_privacy_page.how_we_use_your_information_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("data_privacy_page.how_we_use_your_information_text")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("data_privacy_page.data_security_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("data_privacy_page.data_security_text")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("data_privacy_page.sharing_your_information_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("data_privacy_page.sharing_your_information_text")}
          </p>

          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("data_privacy_page.your_rights_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("data_privacy_page.your_rights_text")}
          </p>

          <p className="text-gray-700 dark:text-gray-300 mt-8">
            {t("data_privacy_page.contact_us_text")}
          </p>
        </div>
      </div>
    </div>
  );
}
