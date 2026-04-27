"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ui, type Locale } from "@/lib/i18n/ui";

type Props = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

/**
 * Left navigation: brand, primary link, gentle hint that create is coming later.
 */
export function Sidebar({ locale, onLocaleChange }: Props) {
  const t = ui[locale];
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isMap = pathname === "/map";
  const navBase =
    "rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition";
  const navActive =
    "bg-white/85 text-[var(--text)] shadow-[var(--shadow-soft)] ring-1 ring-white/90";
  const navInactive = "text-[var(--text-muted)] hover:bg-white/65 hover:text-[var(--text)]";

  return (
    <aside
      className="flex w-full shrink-0 flex-col border-b border-[var(--line)] bg-[var(--bg-sidebar)] px-5 py-6 md:h-auto md:w-[260px] md:border-b-0 md:border-r md:py-8"
      aria-label="Main navigation"
    >
      <div className="mb-6 md:mb-10">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-soft)] to-white shadow-[var(--shadow-soft)] ring-1 ring-white/80"
            aria-hidden
          >
            <span className="text-lg text-[var(--primary-deep)]">✦</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-[var(--text)]">
              {t.brand}
            </p>
            <p className="mt-1 text-xs leading-snug text-[var(--text-muted)]">
              {locale === "en" ? "Emotional support cards" : "心に寄り添うカード"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 sm:flex-row sm:flex-wrap md:flex-col">
        <Link
          href="/"
          className={`${navBase} ${isHome ? navActive : navInactive}`}
          aria-current={isHome ? "page" : undefined}
        >
          {t.navHome}
        </Link>
        <Link
          href="/map"
          className={`${navBase} ${isMap ? navActive : navInactive}`}
          aria-current={isMap ? "page" : undefined}
        >
          {t.navMap}
        </Link>
        <span
          className="rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--text-muted)]"
          title={t.navCreateHint}
        >
          {t.navCreateHint}
        </span>
      </nav>

      <div className="mt-6 space-y-2 border-t border-[var(--line)] pt-6 md:mt-auto">
        <p className="text-xs text-[var(--text-muted)]">
          {locale === "en" ? "Language" : "言語"}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onLocaleChange("en")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              locale === "en"
                ? "bg-[var(--primary-soft)] text-[var(--text)]"
                : "bg-white/60 text-[var(--text-muted)] hover:bg-white"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLocaleChange("ja")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              locale === "ja"
                ? "bg-[var(--primary-soft)] text-[var(--text)]"
                : "bg-white/60 text-[var(--text-muted)] hover:bg-white"
            }`}
          >
            日本語
          </button>
        </div>
      </div>
    </aside>
  );
}
