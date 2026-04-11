"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Locale } from "@/lib/i18n/ui";

type Props = {
  children: ReactNode;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

/** App frame: soft sidebar + scrollable main area (Givingli-like calm shell). */
export function AppShell({ children, locale, onLocaleChange }: Props) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar locale={locale} onLocaleChange={onLocaleChange} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 md:px-12 md:py-12 lg:px-16">
        {children}
      </main>
    </div>
  );
}
