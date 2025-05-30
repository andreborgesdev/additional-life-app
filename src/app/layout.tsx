import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/src/components/shared/header";
import Footer from "@/src/components/shared/footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactQueryClientProvider } from "./react-query-client-provider";
import { I18nAppProvider } from "./i18n-provider";
import { AuthProvider } from "./auth-provider";
import { NotificationProvider } from "@/src/contexts/notication-context";
import { Toaster } from "@/src/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Additional Life - Free Item Marketplace",
  description:
    "A platform for giving away and finding free items, promoting sustainability and reducing waste.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ReactQueryClientProvider>
          <I18nAppProvider>
            <AuthProvider>
              <NotificationProvider>
                <Toaster />
                <Header />
                <main className="flex-1 pt-14">{children}</main>
                <Footer />
                <Script id="handle-prefers-color-scheme">
                  {`
            (function() {
              function getInitialColorMode() {
                const persistedColorPreference = window.localStorage.getItem('color-mode');
                const hasPersistedPreference = typeof persistedColorPreference === 'string';
                if (hasPersistedPreference) {
                  return persistedColorPreference;
                }
                const mql = window.matchMedia('(prefers-color-scheme: dark)');
                const hasMediaQueryPreference = typeof mql.matches === 'boolean';
                if (hasMediaQueryPreference) {
                  return mql.matches ? 'dark' : 'light';
                }
                return 'light';
              }
              const colorMode = getInitialColorMode();
              document.documentElement.classList.toggle('dark', colorMode === 'dark');
            })();
          `}
                </Script>
              </NotificationProvider>
            </AuthProvider>
          </I18nAppProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
