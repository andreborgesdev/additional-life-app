"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

import {
  Menu,
  Sun,
  Moon,
  PlusCircle,
  LogIn,
  User,
  Bell,
  List,
  Package,
  Settings,
  Search,
  LogOut,
  Recycle,
  MessageCircle,
  Wifi,
  WifiOff,
} from "lucide-react";

import { useSession } from "@/src/app/auth-provider";
import { useLogout } from "@/src/hooks/auth/use-logout";
import { useNotificationContext } from "@/src/contexts/notication-context";
import {
  getUserDisplayName,
  getUserInitials,
  getUserAvatarUrl,
} from "@/src/utils/user-metadata-utils";
import { cn } from "@/src/lib/utils";

import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";

interface NavigationItem {
  href: string;
  icon?: React.ReactElement | null;
  label: string;
}

interface AccountNavigationItem extends NavigationItem {
  icon: React.ReactElement;
  badge?: number;
}

interface HeaderProps {}

const THEME_STORAGE_KEY = "color-mode";
const LANGUAGE_STORAGE_KEY = "language";

interface AccountNavigationItem extends NavigationItem {
  icon: React.ReactElement;
  badge?: number;
}

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation("common");
  const { session } = useSession();
  const logout = useLogout();
  const { unreadCount, isWebSocketConnected: isNotificationsConnected } =
    useNotificationContext();

  const handleStorageAccess = useCallback((key: string, fallback?: string) => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  }, []);

  const setStorageValue = useCallback((key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to set localStorage key ${key}:`, error);
    }
  }, []);

  const initializeTheme = useCallback(() => {
    const storedTheme = handleStorageAccess(THEME_STORAGE_KEY);
    const systemPrefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;

    const shouldUseDarkMode =
      storedTheme === "dark" || (!storedTheme && systemPrefersDark);

    setDarkMode(shouldUseDarkMode);
    document.documentElement.classList.toggle("dark", shouldUseDarkMode);
  }, [handleStorageAccess]);

  const initializeLanguage = useCallback(async () => {
    const persistedLanguage = handleStorageAccess(LANGUAGE_STORAGE_KEY);

    if (persistedLanguage && persistedLanguage !== i18n.language) {
      try {
        await i18n.changeLanguage(persistedLanguage);
      } catch (error) {
        console.error("Error setting persisted language:", error);
      }
    }
  }, [handleStorageAccess, i18n]);

  useEffect(() => {
    setMounted(true);
    initializeTheme();
    initializeLanguage();
  }, [initializeTheme, initializeLanguage]);

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    setStorageValue(THEME_STORAGE_KEY, newDarkMode ? "dark" : "light");
  }, [darkMode, setStorageValue]);

  const handleLogout = useCallback(() => {
    logout.mutate();
  }, [logout]);

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }
      return pathname?.startsWith(href);
    },
    [pathname]
  );

  const handleMobileSearchToggle = useCallback(() => {
    setMobileSearchOpen((prev) => !prev);
  }, []);

  const navItems: NavigationItem[] = useMemo(
    () => [
      { href: "/items", icon: <List size={18} />, label: t("nav.all_items") },
      { href: "/categories", icon: null, label: t("nav.categories") },
      { href: "/about", icon: null, label: t("nav.about") },
    ],
    [t]
  );

  const mobileNavItems: NavigationItem[] = useMemo(
    () => [
      {
        href: "/items",
        icon: <List className="h-5 w-5" />,
        label: t("nav.all_items"),
      },
      {
        href: "/categories",
        icon: <Package className="h-5 w-5" />,
        label: t("nav.categories"),
      },
      {
        href: "/about",
        icon: <User className="h-5 w-5" />,
        label: t("nav.about"),
      },
    ],
    [t]
  );

  const accountNavItems: AccountNavigationItem[] = useMemo(
    () => [
      {
        href: "/users/settings",
        icon: <Settings className="h-5 w-5" />,
        label: t("nav.user_settings"),
      },
      {
        href: "/items/published",
        icon: <Package className="h-5 w-5" />,
        label: t("nav.items_published"),
      },
    ],
    [t]
  );

  const headerClassNames = useMemo(
    () =>
      cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm"
          : "bg-green-600 dark:bg-green-800"
      ),
    [isScrolled]
  );

  const logoClassNames = useMemo(
    () =>
      cn(
        "text-2xl font-bold transition-colors duration-300 flex items-center gap-2",
        isScrolled
          ? "text-green-600 dark:text-green-400"
          : "text-white dark:text-green-100"
      ),
    [isScrolled]
  );

  const getNavLinkClasses = useCallback(
    (href: string, isAddButton = false) => {
      const baseClasses = isAddButton
        ? "ml-1 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5"
        : "px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5";

      if (isActive(href)) {
        return cn(
          baseClasses,
          isScrolled
            ? isAddButton
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              : "bg-gray-100 text-green-600 dark:bg-gray-800 dark:text-green-400"
            : isAddButton
            ? "bg-green-500 text-white dark:bg-green-700 dark:text-white"
            : "bg-white/10 text-white dark:bg-green-700/50 dark:text-white"
        );
      }

      return cn(
        baseClasses,
        isScrolled
          ? isAddButton
            ? "bg-green-600 text-white hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
            : "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          : isAddButton
          ? "bg-white text-green-600 hover:bg-green-50 dark:bg-green-100 dark:text-green-800 dark:hover:bg-white"
          : "text-white/90 hover:text-white dark:text-green-100 hover:bg-white/10 dark:hover:bg-green-700/50"
      );
    },
    [isActive, isScrolled]
  );

  const getIconButtonClasses = useCallback(
    (href?: string) =>
      cn(
        "transition-colors",
        href && isActive(href)
          ? isScrolled
            ? "bg-gray-100 text-green-600 dark:bg-gray-800 dark:text-green-400"
            : "bg-white/10 text-white dark:bg-green-700/50 dark:text-white"
          : isScrolled
          ? "text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          : "text-white hover:text-white dark:text-green-100 hover:bg-white/10 dark:hover:bg-green-700/50"
      ),
    [isActive, isScrolled]
  );

  if (!mounted) return null;

  return (
    <header className={headerClassNames}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className={logoClassNames} aria-label={t("siteName")}>
          <Recycle className="h-8 w-8" />
          <span className="hidden sm:inline">{t("siteName")}</span>
        </Link>

        <TooltipProvider>
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={getNavLinkClasses(item.href)}
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
                  className={getNavLinkClasses("/items/create/new", true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  {t("nav.add_item")}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">{t("nav.add_item")}</TooltipContent>
            </Tooltip>
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileSearchToggle}
              className={cn("md:hidden", getIconButtonClasses())}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {!session && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleDarkMode}
                    className={getIconButtonClasses()}
                    aria-label={
                      darkMode
                        ? t("ui.switch_to_light_mode")
                        : t("ui.switch_to_dark_mode")
                    }
                  >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {darkMode
                    ? t("ui.switch_to_light_mode")
                    : t("ui.switch_to_dark_mode")}
                </TooltipContent>
              </Tooltip>
            )}

            {session && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/chat"
                      className={cn(
                        "p-2 rounded-full relative",
                        getIconButtonClasses("/chat")
                      )}
                      aria-label={t("ui.messages")}
                    >
                      <MessageCircle size={20} />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {t("ui.messages")}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/notifications"
                      className={cn(
                        "p-2 rounded-full relative",
                        getIconButtonClasses("/notifications")
                      )}
                      aria-label={t("ui.notifications")}
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-[18px] h-[18px] flex items-center justify-center"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                      {isNotificationsConnected ? (
                        <Wifi
                          size={8}
                          className="absolute bottom-0 right-0 text-green-500"
                        />
                      ) : (
                        <WifiOff
                          size={8}
                          className="absolute bottom-0 right-0 text-red-500"
                        />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {t("ui.notifications")}
                  </TooltipContent>
                </Tooltip>

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
                      aria-label="User menu"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={getUserAvatarUrl(session)}
                          alt="User avatar"
                        />
                        <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-lg">
                          {getUserInitials(session)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {getUserDisplayName(session)}
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
                      onClick={toggleDarkMode}
                      className="flex items-center cursor-pointer"
                    >
                      {darkMode ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      <span>
                        {darkMode
                          ? t("ui.switch_to_light_mode")
                          : t("ui.switch_to_dark_mode")}
                      </span>
                    </DropdownMenuItem>
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
              </>
            )}

            {!session && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/auth/login"
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors",
                      getNavLinkClasses("/auth/login")
                    )}
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("auth.login")}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">{t("auth.login")}</TooltipContent>
              </Tooltip>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("md:hidden", getIconButtonClasses())}
                  aria-label={t("ui.open_menu")}
                >
                  <Menu className="h-5 w-5" />
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
                          src={getUserAvatarUrl(session)}
                          alt="User avatar"
                        />
                        <AvatarFallback className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-lg">
                          {getUserInitials(session)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {getUserDisplayName(session)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.user.email}
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
                    <div className="mt-6 pt-6 border-t space-y-1">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-3 mb-2">
                        {t("ui.account")}
                      </h3>

                      <SheetClose asChild>
                        <Link
                          href="/chat"
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                            isActive("/chat")
                              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400"
                          )}
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span>{t("ui.messages")}</span>
                        </Link>
                      </SheetClose>

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
                              <Badge variant="destructive" className="ml-auto">
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
                  ) : (
                    <div className="mt-6 pt-6 border-t flex flex-col gap-2">
                      <SheetClose asChild>
                        <Link
                          href="/auth/login"
                          className={cn(
                            "flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-colors",
                            isActive("/auth/login")
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
                          href="/auth/register"
                          className={cn(
                            "flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border transition-colors",
                            isActive("/auth/register")
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
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        {darkMode ? (
                          <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        ) : (
                          <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        )}
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {darkMode ? t("ui.light_mode") : t("ui.dark_mode")}
                        </span>
                      </div>
                      <button
                        onClick={toggleDarkMode}
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700"
                        aria-label={t("ui.toggle_theme")}
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 transform rounded-full bg-white dark:bg-gray-200 transition",
                            darkMode ? "translate-x-6" : "translate-x-1"
                          )}
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
                  placeholder={t("ui.search_for_items")}
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
