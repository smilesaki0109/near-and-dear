"use client";

import Link from "next/link";
import { Fraunces } from "next/font/google";
import type { Locale } from "@/lib/i18n/ui";
import { homeCopy } from "@/lib/i18n/home";

type Props = { locale: Locale };

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

/**
 * Hero — audience, value, and primary CTA above the fold.
 */
export function Hero({ locale }: Props) {
  const copy = homeCopy[locale];

  return (
    <header className="relative mx-auto mb-10 w-full max-w-6xl md:mb-16">
      <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.24em] text-[var(--primary-deep)]">
        {copy.eyebrow}
      </p>

      <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--line)]/60 bg-[var(--surface)] px-6 py-10 shadow-[var(--shadow-soft)] sm:px-10 md:px-14 md:py-14">
        <div
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--primary-soft)]/40 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[var(--accent-peach)]/25 blur-3xl"
          aria-hidden
        />

        <div className="relative max-w-3xl">
          <h1
            className={`text-[1.65rem] font-semibold leading-[1.22] tracking-[-0.03em] text-[var(--text)] sm:text-4xl md:text-[2.65rem] md:leading-[1.18] ${fraunces.className}`}
          >
            {copy.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-[1.8] text-[var(--text-muted)] md:text-lg md:leading-[1.75]">
            {copy.heroSubtitle}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)]/90">
            {copy.heroAudience}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#cards"
              className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-8 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-hover)] transition hover:brightness-[1.04] active:scale-[0.98]"
            >
              {copy.heroCta}
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--primary-deep)] transition hover:bg-[var(--primary-soft)]/30"
            >
              {copy.heroCtaSecondary}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
