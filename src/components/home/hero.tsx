"use client";

import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { SparklesText } from "../magicui/sparkles-text";
import { useTranslation } from "react-i18next";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/items?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/items");
    }
  };

  const placeholders = [
    "Furniture",
    "Books",
    "Electronics",
    "Kitchen",
    "Garden",
  ];

  return (
    <section className="relative bg-green-50 dark:bg-green-900 py-10 md:py-32">
      <div className="absolute inset-0">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="blob-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "rgba(74, 222, 128, 0.2)" }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "rgba(34, 197, 94, 0.2)" }}
              />
            </linearGradient>
          </defs>
          <path fill="url(#blob-gradient)" d="M0,0 L100,0 L100,100 L0,100 Z">
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,0 C20,40 50,60 100,0 L100,100 L0,100 Z;
                M0,0 C30,30 70,70 100,0 L100,100 L0,100 Z;
                M0,0 C40,20 60,50 100,0 L100,100 L0,100 Z;
                M0,0 C20,40 50,60 100,0 L100,100 L0,100 Z
              "
            />
          </path>
        </svg>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-800 dark:text-white mb-6">
            {
              t("home.give_belongings_additional_life").split(
                "Additional Life"
              )[0]
            }
            <SparklesText className="text-green-800 dark:text-green-400">
              Additional Life
            </SparklesText>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10">
            {t("home.join_community_description")}
          </p>
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSubmit={handleSearchSubmit}
            />
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              asChild
              size="lg"
              className="bg-green-600 hover:bg-green-700 rounded-full"
            >
              <Link href="/items">
                {t("hero.browse_items")}
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link href="/items/create/new">
                {t("home.give_something_away")}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
