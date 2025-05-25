"use client";

import { Check } from "lucide-react";
import { useTranslation } from "next-i18next";

export default function HowItWorksPage() {
  const { t } = useTranslation("common");

  const steps = t("how_it_works_page.steps", { returnObjects: true }) as Array<{
    title: string;
    description: string;
  }>;

  return (
    <div className="bg-green-50 dark:bg-green-900 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-green-800 dark:text-green-100 text-center mb-12">
          {t("how_it_works_page.title")}
        </h1>

        <div className="max-w-4xl mx-auto">
          <p className="text-xl text-green-700 dark:text-green-200 text-center mb-12">
            {t("how_it_works_page.subtitle")}
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-500 rounded-full p-2 mr-4">
                    <Check className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200">
                    {step.title}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold text-green-800 dark:text-green-200 mb-4">
              {t("how_it_works_page.ready_to_start_title")}
            </h2>
            <a
              href="/auth/register"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300"
            >
              {t("how_it_works_page.join_button")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
