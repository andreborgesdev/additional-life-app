"use client";

import React from "react";
import { I18nextProvider } from "react-i18next";
import i18nInstance from "@/src/lib/i18n";

export function I18nAppProvider({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
}
