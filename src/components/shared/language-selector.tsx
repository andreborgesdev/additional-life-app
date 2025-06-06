"use client";

import { Globe, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

const languages = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
];

interface LanguageSelectorProps {
  variant?: "header" | "footer";
  className?: string;
}

export default function LanguageSelector({
  variant = "footer",
  className = "",
}: LanguageSelectorProps) {
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng);
      localStorage.setItem("language", lng);
      router.refresh();
    } catch (error) {
      console.error("Failed to change language:", error);
    }
  };

  if (!mounted) return null;

  const buttonStyles = {
    header:
      "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700",
    footer:
      "text-green-200 hover:text-white dark:text-green-300 dark:hover:text-white hover:bg-green-700/50 dark:hover:bg-green-800/50 border border-green-700 dark:border-green-800",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors",
            buttonStyles[variant],
            className
          )}
        >
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">
            {languages
              .find((l) => l.code === (i18n.language || "en"))
              ?.code.toUpperCase()}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px] p-2">
        <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 px-2 pb-1.5">
          {t("ui.select_language")}
        </DropdownMenuLabel>
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onSelect={() => changeLanguage(lang.code)}
            className={`flex items-center gap-2 px-2 py-1.5 my-0.5 rounded-md cursor-pointer ${
              (i18n.language || "en") === lang.code
                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium"
                : ""
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center text-xs font-bold bg-gray-100 dark:bg-gray-800 rounded-full">
              {lang.code.toUpperCase()}
            </div>
            <span>{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
