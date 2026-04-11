"use client";

import type { Locale } from "@/lib/i18n/ui";
import { ui } from "@/lib/i18n/ui";

type Props = {
  locale: Locale;
  value: string;
  onChange: (value: string) => void;
};

/** Simple filter box for card titles (client-side only in Phase 1). */
export function SearchBar({ locale, value, onChange }: Props) {
  const t = ui[locale];

  return (
    <div className="relative max-w-xl">
      <label htmlFor="card-search" className="sr-only">
        {t.searchPlaceholder}
      </label>
      <span
        className="pointer-events-none absolute left-5 top-1/2 z-[1] -translate-y-1/2 text-[var(--primary)]/70"
        aria-hidden
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        id="card-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="w-full rounded-full border border-white/80 bg-white/75 py-3.5 pl-[3.25rem] pr-6 text-[0.9375rem] text-[var(--text)] shadow-[var(--shadow-soft)] backdrop-blur-md placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]/35 focus:bg-white/90 focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
        autoComplete="off"
      />
    </div>
  );
}
