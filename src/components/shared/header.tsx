"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Sun,
  Moon,
  PlusCircle,
  LogIn,
  User,
  Bell,
  Globe,
  List,
  Package,
  Settings,
  Search,
  LogOut,
  ChevronDown,
  Recycle,
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
import { useSession } from "@/src/app/auth-provider";
import { useLogout } from "@/src/hooks/use-logout";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/src/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import React from "react";

const languages = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  const navItems = [
    { href: "/items", icon: <List size={18} />, label: t("nav.all_items") },
    // { href: "/categories", icon: null, label: t("nav.categories") },
    // { href: "/about", icon: null, label: t("nav.about") },
    // { href: "/contact", icon: null, label: t("nav.contact") },
  ];

  const mobileNavItems = [
    {
      href: "/items",
      icon: <List className="h-5 w-5" />,
      label: t("nav.all_items"),
    },
    // {
    //   href: "/categories",
    //   icon: <Package className="h-5 w-5" />,
    //   label: t("nav.categories"),
    // },
    // {
    //   href: "/about",
    //   icon: <User className="h-5 w-5" />,
    //   label: t("nav.about"),
    // },
    // {
    //   href: "/contact",
    //   icon: <MessageCircle className="h-5 w-5" />,
    //   label: t("nav.contact"),
    // },
  ];

  const accountNavItems = [
    {
      href: "/user/settings",
      icon: <Settings className="h-5 w-5" />,
      label: t("nav.user_settings"),
    },
    {
      href: "/items/published",
      icon: <Package className="h-5 w-5" />,
      label: t("nav.items_published"),
    },
    // {
    //   href: "/items-taken",
    //   icon: <Heart className="h-5 w-5" />,
    //   label: t("nav.itemsTaken"),
    // },
    // {
    //   href: "/notifications",
    //   icon: <Bell className="h-5 w-5" />,
    //   label: "Notifications",
    //   badge: notificationCount,
    // },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm"
          : "bg-green-600 dark:bg-green-800"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "text-2xl font-bold transition-colors duration-300 flex items-center gap-2",
            isScrolled
              ? "text-green-600 dark:text-green-400"
              : "text-white dark:text-green-100"
          )}
        >
          <Recycle className="h-8 w-8" />
          <span className="hidden sm:inline">{t("siteName")}</span>
        </Link>

        {/* Desktop Navigation */}
        <TooltipProvider>
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                      isActive(item.href)
                        ? isScrolled
                          ? "bg-gray-100 text-green-600 dark:bg-gray-800 dark:text-green-400"
                          : "bg-white/10 text-white dark:bg-green-700/50 dark:text-white"
                        : isScrolled
                        ? "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        : "text-white/90 hover:text-white dark:text-green-100 hover:bg-white/10 dark:hover:bg-green-700/50"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">{item.label}</TooltipContent>
              </Tooltip>
            ))}

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/items/create/new"
                  className={cn(
                    "ml-1 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5",
                    isActive("/items/create/new")
                      ? isScrolled
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-green-500 text-white dark:bg-green-700 dark:text-white"
                      : isScrolled
                      ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                      : "bg-white text-green-600 hover:bg-green-50 dark:bg-green-100 dark:text-green-800 dark:hover:bg-white"
                  )}
                >
                  <PlusCircle className="h-4 w-4" />
                  {t("nav.add_item")}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">{t("nav.add_item")}</TooltipContent>
            </Tooltip>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {/* Desktop Search */}
            {/* <div className="hidden md:block relative">
              <SearchDropdown />
            </div> */}

            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className={cn(
                "md:hidden transition-colors",
                isScrolled
                  ? "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  : "text-white hover:text-white dark:text-green-100 hover:bg-white/10 dark:hover:bg-green-700/50"
              )}
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-colors",
                    isScrolled
                      ? "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      : "text-white hover:text-white dark:text-green-100 hover:bg-white/10 dark:hover:bg-green-700/50 border border-white/20 dark:border-green-700"
                  )}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {languages
                      .find((l) => l.code === (i18n.language || "en"))
                      ?.code.toUpperCase()}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[180px] p-2">
                <DropdownMenuLabel className="text-xs text-gray-500 dark:text-gray-400 px-2 pb-1.5">
                  Select Language
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

            {/* Dark Mode Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDarkMode}
                  className={cn(
                    "transition-colors",
                    isScrolled
                      ? "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      : "text-white hover:text-white dark:text-green-100 hover:bg-white/10 dark:hover:bg-green-700/50"
                  )}
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  <span className="sr-only">
                    {darkMode ? "Switch to light mode" : "Switch to dark mode"}
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {darkMode ? "Switch to light mode" : "Switch to dark mode"}
              </TooltipContent>
            </Tooltip>

            {/* Notifications */}
            {/* {session && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/notifications"
                    className={cn(
                      "p-2 rounded-full relative transition-colors",
                      isActive("/notifications")
                        ? isScrolled
                          ? "bg-gray-100 text-green-600 dark:bg-gray-800 dark:text-green-400"
                          : "bg-white/10 text-white dark:bg-green-700/50 dark:text-white"
                        : isScrolled
                        ? "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        : "text-white hover:text-white dark:text-green-100 hover:bg-white/10 dark:hover:bg-green-700/50"
                    )}
                  >
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-[18px] h-[18px] flex items-center justify-center"
                      >
                        {notificationCount}
                      </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">Notifications</TooltipContent>
              </Tooltip>
            )} */}

            {/* User Menu (Desktop) */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative h-8 w-8 rounded-full p-0 overflow-hidden",
                      isScrolled
                        ? "ring-2 ring-white dark:ring-gray-800"
                        : "ring-2 ring-green-500 dark:ring-green-700"
                    )}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-lg">
                        {session.user.user_metadata.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.user_metadata.full_name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {accountNavItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center justify-between cursor-pointer",
                          isActive(item.href) &&
                            "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        )}
                      >
                        <div className="flex items-center">
                          <span className="mr-2 h-4 w-4">
                            {React.cloneElement(item.icon, { size: 16 })}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && item.badge > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center cursor-pointer text-red-500 dark:text-red-400 focus:text-red-500 dark:focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t("auth.logout")}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/user/login"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors",
                      isActive("/user/login")
                        ? isScrolled
                          ? "bg-gray-100 text-green-600 dark:bg-gray-800 dark:text-green-400"
                          : "bg-white/10 text-white dark:bg-green-700/50 dark:text-white"
                        : isScrolled
                        ? "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        : "text-white hover:text-white dark:text-green-100 hover:bg-white/10 dark:hover:bg-green-700/50"
                    )}
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("auth.login")}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t("auth.login")}</TooltipContent>
              </Tooltip>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "md:hidden transition-colors",
                    isScrolled
                      ? "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      : "text-white hover:text-white dark:text-green-100 hover:bg-white/10 dark:hover:bg-green-700/50"
                  )}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="text-left flex items-center gap-2">
                    <Recycle className="h-8 w-8" />
                    {t("siteName")}
                  </SheetTitle>
                </SheetHeader>
                <div className="py-4 px-6">
                  {session && (
                    <div className="mb-6 pb-6 border-b flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src="/placeholder.svg?height=48&width=48"
                          alt="User"
                        />
                        <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-lg">
                          JD
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">
                          john.doe@example.com
                        </p>
                      </div>
                    </div>
                  )}

                  <nav className="space-y-1">
                    {mobileNavItems.map((item) => (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                            isActive(item.href)
                              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </SheetClose>
                    ))}

                    <SheetClose asChild>
                      <Link
                        href="/items/create/new"
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          isActive("/items/create/new")
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-green-600 text-white hover:bg-green-700"
                        )}
                      >
                        <PlusCircle className="h-5 w-5" />
                        <span>{t("nav.add_item")}</span>
                      </Link>
                    </SheetClose>
                  </nav>

                  {session ? (
                    <>
                      <div className="mt-6 pt-6 border-t space-y-1">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 mb-2">
                          Account
                        </h3>
                        {accountNavItems.map((item) => (
                          <SheetClose asChild key={item.href}>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                isActive(item.href)
                                  ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                {item.icon}
                                <span>{item.label}</span>
                              </div>
                              {item.badge && item.badge > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="ml-auto"
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </SheetClose>
                        ))}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>{t("auth.logout")}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="mt-6 pt-6 border-t flex flex-col gap-2">
                      <SheetClose asChild>
                        <Link
                          href="/user/login"
                          className={cn(
                            "flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors",
                            isActive("/user/login")
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-green-600 text-white hover:bg-green-700"
                          )}
                        >
                          <LogIn className="h-5 w-5" />
                          <span>{t("auth.login")}</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/user/register"
                          className={cn(
                            "flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-colors",
                            isActive("/user/register")
                              ? "bg-gray-100 border-gray-200 text-green-700 dark:bg-gray-800 dark:border-gray-700 dark:text-green-400"
                              : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                        >
                          <User className="h-5 w-5" />
                          <span>{t("auth.register")}</span>
                        </Link>
                      </SheetClose>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Language
                        </span>
                      </div>
                      <div className="flex gap-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`px-2 py-1 text-xs rounded-md ${
                              (i18n.language || "en") === lang.code
                                ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 font-medium"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {lang.code.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        {darkMode ? (
                          <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {darkMode ? "Light Mode" : "Dark Mode"}
                        </span>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
                      >
                        <span className="sr-only">Toggle theme</span>
                        <span
                          className={`${
                            darkMode ? "translate-x-6" : "translate-x-1"
                          } inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-200 transition`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </TooltipProvider>
      </div>

      {/* Mobile Search Bar */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for items..."
                  className="pl-9 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
