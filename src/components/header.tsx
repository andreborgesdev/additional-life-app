"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  Sun,
  Moon,
  PlusCircle,
  LogIn,
  User,
  Bell,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Corrected import
import { SearchDropdown } from "./search-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { useSession } from "../app/auth-provider";
import { useLogout } from "../hooks/use-logout";

const languages = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();
  const { t, i18n, ready } = useTranslation("common");
  const { session } = useSession();
  const logout = useLogout();

  useEffect(() => {
    setMounted(true);

    // Initialize Dark Mode
    const storedUserColorPreference = localStorage.getItem("color-mode");
    // Check system preference as a fallback
    const systemPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    let newDarkModeState;

    if (storedUserColorPreference) {
      newDarkModeState = storedUserColorPreference === "dark";
    } else {
      newDarkModeState = systemPrefersDark;
      // Optionally, you might want to save the determined initial state to localStorage here
      // localStorage.setItem("color-mode", newDarkModeState ? "dark" : "light");
    }

    setDarkMode(newDarkModeState);
    document.documentElement.classList.toggle("dark", newDarkModeState);

    // Initialize Language from localStorage
    const persistedLanguage = localStorage.getItem("language");
    if (persistedLanguage && persistedLanguage !== i18n.language) {
      i18n.changeLanguage(persistedLanguage).catch((error) => {
        console.error("Error setting persisted language on mount:", error);
      });
    }

    // In a real application, you would fetch the actual notification count from an API
    setNotificationCount(3);
  }, [i18n]); // Added i18n to dependency array

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("color-mode", newDarkMode ? "dark" : "light");
  };

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng); // Ensure i18next processes the change
      localStorage.setItem("language", lng); // Then, persist in localStorage
      // Reload the page to apply language changes throughout the app
      router.refresh();
    } catch (error) {
      console.error("Failed to change language:", error);
      // Optionally, inform the user via a toast or message
    }
  };

  if (!mounted) return null;

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-green-600 dark:bg-green-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-white dark:text-green-100"
        >
          Additional Life +
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="/items"
            className="text-white dark:text-green-100 hover:text-green-200"
          >
            {t("nav.allItems")}
          </Link>
          {/* <Link
            href="/categories"
            className="text-white dark:text-green-100 hover:text-green-200"
          >
            {t("nav.categories")}
          </Link> */}
          {/* <Link
            href="/about"
            className="text-white dark:text-green-100 hover:text-green-200"
          >
            {t("nav.about")}
          </Link>
          <Link
            href="/contact"
            className="text-white dark:text-green-100 hover:text-green-200"
          >
            {t("nav.contact")}
          </Link> */}
          {session && (
            <Link
              href="/create-item/new"
              className="text-white dark:text-green-100 hover:text-green-200"
            >
              <PlusCircle className="inline-block mr-1" size={18} />
              {t("nav.addItem")}
            </Link>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          <SearchDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white dark:text-green-100 hover:bg-green-700 dark:hover:bg-green-600 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-green-500 dark:border-green-700"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {languages
                    .find((l) => l.code === (i18n.language || "en"))
                    ?.code.toUpperCase()}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] p-2">
              <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 px-2 pb-1.5">
                {t("nav.selectLanguage")}
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
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-green-700 dark:hover:bg-green-600 text-white dark:text-green-100"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {session && (
            <Link
              href="/notifications"
              className="p-2 rounded-full hover:bg-green-700 dark:hover:bg-green-600 text-white dark:text-green-100 relative"
            >
              <Bell size={20} />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Link>
          )}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <User className="h-5 w-5 text-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.user_metadata.full_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.user_metadata.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/items-published">{t("nav.itemsPublished")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user-settings">{t("nav.userSettings")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  {logout.isPending ? "Logging out..." : t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link
              href="/login"
              className="p-2 rounded-full hover:bg-green-700 dark:hover:bg-green-600 text-white dark:text-green-100"
            >
              <LogIn size={20} />
            </Link>
          )}
          <button className="md:hidden text-white dark:text-green-100">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
