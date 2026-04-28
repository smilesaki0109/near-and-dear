"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, SVGProps } from "react";
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
      icon: CardsTabIcon,
      active: isHome,
    },
    {
      href: "/map",
      label: "Map",
      icon: MapTabIcon,
      active: isMap,
    },
    {
      href: "/",
      label: "Create",
      icon: PlusTabIcon,
      active: isCreate,
    },
    {
      href: "/#cards",
      label: "Explore",
      icon: SearchTabIcon,
      active: false,
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+0.65rem)] md:hidden"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around rounded-[2rem] border border-white/75 bg-white/86 px-2 shadow-[0_14px_42px_rgba(54,47,61,0.18)] ring-1 ring-white/80 backdrop-blur-xl">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[0.68rem] font-semibold transition active:scale-95 ${
                item.active
                  ? "bg-gradient-to-br from-[var(--primary-soft)] to-[#fff0f7] text-[var(--primary-deep)] shadow-[0_8px_18px_rgba(149,120,198,0.18)] ring-1 ring-white/80"
                  : "text-[var(--text-muted)] active:bg-[var(--primary-soft)]/60"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function CardsTabIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect x="4" y="5" width="16" height="14" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="m5.5 8 6.5 5 6.5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function MapTabIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path d="M12 21s6-5.2 6-11a6 6 0 0 0-12 0c0 5.8 6 11 6 11Z" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function PlusTabIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function SearchTabIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}
