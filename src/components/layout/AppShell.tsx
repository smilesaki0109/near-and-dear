"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Plus, Search } from "lucide-react";
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
      <main className="min-w-0 flex-1 px-4 pb-28 pt-4 sm:px-6 md:px-12 md:py-12 lg:px-16">
        {children}
      </main>
      <MobileTabBar />
    </div>
  );
}

function MobileTabBar() {
  const pathname = usePathname();
  const isCreate = pathname.startsWith("/create");
  const isMap = pathname === "/map";
  const isHome = pathname === "/";

  const items = [
    {
      href: "/",
      label: "Cards",
      icon: Home,
      active: isHome,
    },
    {
      href: "/map",
      label: "Map",
      icon: MapPin,
      active: isMap,
    },
    {
      href: "/",
      label: "Create",
      icon: Plus,
      active: isCreate,
    },
    {
      href: "/#cards",
      label: "Explore",
      icon: Search,
      active: false,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] md:hidden"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around rounded-[2rem] border border-white/70 bg-white/82 px-2 shadow-[0_10px_35px_rgba(54,47,61,0.16)] ring-1 ring-white/70 backdrop-blur-xl">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-semibold transition ${
                item.active
                  ? "bg-[var(--primary-soft)] text-[var(--primary-deep)] shadow-sm"
                  : "text-[var(--text-muted)] active:bg-[var(--primary-soft)]/60"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
