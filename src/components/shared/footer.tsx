"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./language-selector";

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <footer className="bg-green-800 dark:bg-green-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t("footer.about_additional_life")}
            </h3>
            <p className="text-green-200 dark:text-green-300">
              {t("footer.about_description")}
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">
              {t("footer.quick_links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-green-200 dark:text-green-300 hover:text-white"
                >
                  {t("footer.about_us")}
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-green-200 dark:text-green-300 hover:text-white"
                >
                  {t("footer.how_it_works")}
                </Link>
              </li>
              {/* <li>
                <Link href="/faq" className="text-green-200 dark:text-green-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-200 dark:text-green-300 hover:text-white">
                  Contact Us
                </Link>
              </li> */}
            </ul>
          </div>
          <div>
            {/* <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#"
                className="text-green-200 dark:text-green-300 hover:text-white"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="text-green-200 dark:text-green-300 hover:text-white"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className="text-green-200 dark:text-green-300 hover:text-white"
              >
                <Instagram size={24} />
              </a>
            </div> */}
            <h3 className="text-xl font-semibold mb-4">
              {t("footer.legal_information")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms-and-conditions"
                  className="text-green-200 dark:text-green-300 hover:text-white text-sm"
                >
                  {t("footer.terms_and_conditions")}
                </Link>
              </li>
              <li>
                <Link
                  href="/data-privacy"
                  className="text-green-200 dark:text-green-300 hover:text-white text-sm"
                >
                  {t("footer.data_privacy_policy")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <LanguageSelector variant="footer" />
          </div>
        </div>
        <div className="mt-8 text-center text-green-200 dark:text-green-300">
          <p>
            &copy; {new Date().getFullYear()} Additional Life.{" "}
            {t("footer.all_rights_reserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
