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
  List,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { SearchDropdown } from "./search-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const languages = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();
  const { t, i18n, ready } = useTranslation("common");

  useEffect(() => {
    console.log("test " + ready);

    setMounted(true);
    setDarkMode(document.documentElement.classList.contains("dark"));
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    // In a real application, you would fetch the actual notification count from an API
    setNotificationCount(3);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("color-mode", newDarkMode ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    router.push("/");
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // In a real application, you might want to persist the language preference
    localStorage.setItem("language", lng);
    // Reload the page to apply language changes
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-green-600 dark:bg-green-800">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-white dark:text-green-100"
        >
          Additional Life
        </Link>
        <nav className="hidden md:flex space-x-4">
          <Link
            href="/items"
            className="text-white dark:text-green-100 hover:text-green-200"
          >
            <List className="inline-block mr-1" size={18} />
            {t("nav.allItems")}
          </Link>
          <Link
            href="/categories"
            className="text-white dark:text-green-100 hover:text-green-200"
          >
            {t("nav.categories")}
          </Link>
          <Link
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
          </Link>
          {isLoggedIn && (
            <Link
              href="/create-product"
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
                className="text-white dark:text-green-100"
              >
                <Globe className="h-5 w-5" />
                <span className="sr-only">Select language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onSelect={() => changeLanguage(lang.code)}
                >
                  {lang.name}
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
          {isLoggedIn && (
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
          {isLoggedIn ? (
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
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/items-published">{t("nav.itemsPublished")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/items-taken">{t("nav.itemsTaken")}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user-settings">{t("nav.userSettings")}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  {t("auth.logout")}
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
