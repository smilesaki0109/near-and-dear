"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode, SVGProps } from "react";
import { NearDearMascot } from "@/components/icons/NearDearMascot";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Locale } from "@/lib/i18n/ui";

let splashShownForCurrentPageLoad = false;

type Props = {
  children: ReactNode;
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

/** App frame: soft sidebar + scrollable main area (Givingli-like calm shell). */
export function AppShell({ children, locale, onLocaleChange }: Props) {
  const [splashDone, setSplashDone] = useState(false);
  const completeSplash = useCallback(() => setSplashDone(true), []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <SplashScreen onComplete={completeSplash} />
      {splashDone ? (
        <FloatingLanguageSwitch locale={locale} onLocaleChange={onLocaleChange} />
      ) : null}
      <Sidebar locale={locale} onLocaleChange={onLocaleChange} />
      <main className="min-w-0 flex-1 px-4 pb-28 pt-4 sm:px-6 md:px-12 md:py-12 lg:px-16">
        {children}
      </main>
      <MobileTabBar locale={locale} />
    </div>
  );
}

function FloatingLanguageSwitch({
  locale,
  onLocaleChange,
}: {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}) {
  const languages: { locale: Locale; label: string }[] = [
    { locale: "en", label: "EN" },
    { locale: "ja", label: "JP" },
    { locale: "tl", label: "TL" },
  ];

  return (
    <div
      className="fixed right-4 top-[calc(env(safe-area-inset-top)+0.9rem)] z-40 flex rounded-full border border-white/75 bg-white/82 p-1 shadow-[0_12px_32px_rgba(54,47,61,0.12)] ring-1 ring-white/80 backdrop-blur-xl md:right-6 md:top-5"
      aria-label="Language selector"
    >
      {languages.map((item) => (
        <button
          key={item.locale}
          type="button"
          onClick={() => onLocaleChange(item.locale)}
          className={`rounded-full px-3 py-1.5 text-[0.68rem] font-bold transition active:scale-95 ${
            locale === item.locale
              ? "bg-gradient-to-br from-[var(--primary-soft)] to-[#fff0f7] text-[var(--primary-deep)] shadow-sm"
              : "text-[var(--text-muted)] hover:bg-white/75"
          }`}
          aria-pressed={locale === item.locale}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (splashShownForCurrentPageLoad) {
      onComplete();
      return;
    }

    splashShownForCurrentPageLoad = true;
    setVisible(true);

    const fadeTimer = window.setTimeout(() => setLeaving(true), 5000);
    const removeTimer = window.setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 5700);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.98)_0%,rgba(250,244,250,0.96)_42%,rgba(239,247,255,0.95)_100%)] px-6 transition-opacity duration-700 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <CloudMark className="left-[8%] top-[12%] h-24 w-32 -rotate-6 opacity-35" />
        <CloudMark className="right-[7%] top-[18%] h-20 w-28 rotate-6 opacity-30" />
        <CloudMark className="bottom-[18%] left-[10%] h-16 w-24 rotate-3 opacity-25" />
        <CloudMark className="bottom-[12%] right-[13%] h-28 w-36 -rotate-3 opacity-28" />
      </div>
      <div className="flex flex-col items-center text-center">
        <div className="near-dear-splash-float">
          <NearDearMascot className="near-dear-mascot-glow h-64 w-64 sm:h-80 sm:w-80" />
        </div>
        <div className="mt-8 space-y-4">
          <p className="near-dear-splash-text text-[1.7rem] font-semibold tracking-[-0.035em] text-[var(--text)] sm:text-[2.2rem]">
            It’s time to unwind. <SoftHeartMark className="ml-1 inline h-[0.72em] w-[0.72em] translate-y-[0.03em]" />
          </p>
          <p className="near-dear-splash-text-delay max-w-sm text-base font-medium leading-relaxed text-[var(--text-muted)] sm:text-lg">
            Small moments can feel like home.
          </p>
        </div>
      </div>
    </div>
  );
}

function SoftHeartMark({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path
        d="M16 26S6 20 6 12.8C6 8.7 10.5 7.1 16 11.7c5.5-4.6 10-3 10 1.1C26 20 16 26 16 26Z"
        fill="#F4AFC1"
        stroke="#D88EA4"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path
        d="M10.8 12.4c1.5-1.7 3.3-1.4 4.8.2"
        stroke="white"
        strokeLinecap="round"
        strokeWidth="1.4"
        opacity="0.75"
      />
    </svg>
  );
}

function CloudMark({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 120 72"
      fill="none"
      className={`absolute ${className}`}
      aria-hidden
    >
      <path
        d="M24 51h69c11 0 18-7 18-16.5C111 26 104.5 19 95.5 18.5 91.5 8.5 82 3 70 3 59.5 3 51 8.3 46.8 17.2A27 27 0 0 0 35 14.5C23 14.5 13.5 23.5 13.5 34.2 13.5 44.5 18 51 24 51Z"
        fill="white"
        stroke="#D8CFE4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M45 29c3 2.6 6.2 2.6 9.2 0M65 29c3 2.6 6.2 2.6 9.2 0"
        stroke="#B9A8D7"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function MobileTabBar({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const isCreate = pathname.startsWith("/create");
  const isMap = pathname === "/map";
  const isHome = pathname === "/";
  const isVision = pathname === "/vision";

  const items = [
    {
      href: "/",
      label: locale === "ja" ? "カード" : "Cards",
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
      label: locale === "ja" ? "作る" : locale === "tl" ? "Gawa" : "Create",
      icon: PlusTabIcon,
      active: isCreate,
    },
    {
      href: "/vision",
      label: "Vision",
      icon: HeartTabIcon,
      active: isVision,
    },
    {
      href: "/#cards",
      label: locale === "ja" ? "さがす" : "Explore",
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

function HeartTabIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 20s-7-4.4-7-10a4.2 4.2 0 0 1 7-3.1A4.2 4.2 0 0 1 19 10c0 5.6-7 10-7 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
