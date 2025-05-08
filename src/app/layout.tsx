import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "@/src/components/header";
import Footer from "@/src/components/footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactQueryClientProvider } from "./provider";

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
      <body className={inter.className}>
        <ReactQueryClientProvider>
          <Header />
          <div className="pt-16">
            {" "}
            {/* Add padding to account for fixed header */}
            {children}
          </div>
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
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
