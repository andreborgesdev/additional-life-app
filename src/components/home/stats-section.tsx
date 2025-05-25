"use client";

import { NumberTicker } from "../magicui/number-ticker";
import { useTranslation } from "react-i18next";

export default function StatsSection() {
  const { t } = useTranslation("common");
  return (
    <section className="py-2">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              <NumberTicker
                value={500}
                className="text-green-600 dark:text-green-400"
              />
              +
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              {t("home_stats_section.items_shared")}
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              <NumberTicker
                value={100}
                className="text-green-600 dark:text-green-400"
              />
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              {t("home_stats_section.active_users")}
            </div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              <NumberTicker
                value={500}
                className="text-green-600 dark:text-green-400"
              />
              KGs
            </div>
            <div className="text-lg text-gray-700 dark:text-gray-300">
              {t("home_stats_section.saved_from_landfill")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
