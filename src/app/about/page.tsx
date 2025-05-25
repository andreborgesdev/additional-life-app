"use client";

import Image from "next/image";
import { Leaf, Recycle, Users, Heart } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function AboutPage() {
  const { t } = useTranslation("common");
  return (
    <div className="bg-green-50 dark:bg-green-900">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-100 text-center mb-8">
          {t("about_page.title")}
        </h1>

        <div className="max-w-3xl mx-auto bg-white dark:bg-green-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("about_page.mission_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("about_page.mission_text")}
          </p>
          {/* <div className="flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=200&width=400"
              alt="People sharing items"
              width={400}
              height={200}
              className="rounded-lg"
            />
          </div> */}
        </div>

        <div className="max-w-3xl mx-auto bg-white dark:bg-green-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("about_page.vision_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("about_page.vision_text")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Leaf className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              {t("about_page.eco_friendly_title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("about_page.eco_friendly_text")}
            </p>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Recycle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              {t("about_page.circular_economy_title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("about_page.circular_economy_text")}
            </p>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Users className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              {t("about_page.community_driven_title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("about_page.community_driven_text")}
            </p>
          </div>
          <div className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
            <Heart className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold text-green-700 dark:text-green-200 mb-2">
              {t("about_page.generosity_title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {t("about_page.generosity_text")}
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-200 mb-4">
            {t("about_page.join_us_title")}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {t("about_page.join_us_text")}
          </p>
          <a
            href="/auth/login"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300"
          >
            {t("about_page.start_sharing_button")}
          </a>
        </div>
      </div>
    </div>
  );
}
