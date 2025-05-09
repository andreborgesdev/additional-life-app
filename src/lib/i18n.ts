import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

// Configuration values (normally from next-i18next.config.js)
const defaultLocale = "en";
const locales = ["en", "de", "fr", "it"];
const defaultNS = "common";
const useSuspense = true; // From your next-i18next.config.js react.useSuspense

i18n
  .use(HttpApi) // Loads translations from your /public/locales folder
  .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    fallbackLng: defaultLocale,
    supportedLngs: locales,
    defaultNS: defaultNS,
    ns: [defaultNS], // Namespaces to load
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json", // Path to your translation files
    },
    detection: {
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "language", // localStorage key to look for language
      lookupCookie: "next-i18next", // Cookie name next-i18next uses
    },
    react: {
      useSuspense: useSuspense,
    },
    // debug: process.env.NODE_ENV === 'development', // Uncomment for debugging
  });

export default i18n;
