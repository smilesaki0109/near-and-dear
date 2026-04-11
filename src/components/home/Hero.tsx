"use client";

import { Fraunces } from "next/font/google";
import type { Locale } from "@/lib/i18n/ui";
import { ui } from "@/lib/i18n/ui";

type Props = { locale: Locale };

/** Soft serif for the headline — feels more “keepsake” than UI sans. */
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  adjustFontFallback: true,
});

/**
 * Hero: layered panel, soft glows, expressive type — same copy as before.
 */
export function Hero({ locale }: Props) {
  const t = ui[locale];

  return (
    <header className="relative mb-12 max-w-3xl">
      {/* Decorative spark — tiny emotional cue, no extra copy */}
      <p
        className="mb-5 inline-flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--primary-deep)]/80"
        aria-hidden
      >
        <span className="inline-block h-px w-10 rounded-full bg-gradient-to-r from-transparent via-[var(--primary)]/70 to-transparent" />
        <span className="h-1 w-1 rounded-full bg-[var(--primary)]/45" />
        <span className="inline-block h-px w-10 rounded-full bg-gradient-to-l from-transparent via-[var(--primary)]/70 to-transparent" />
      </p>

      <div
        className="relative overflow-hidden rounded-[var(--radius-xl)] border border-white/70 bg-gradient-to-br from-[var(--surface-elevated)] via-[var(--surface)] to-[var(--primary-soft)]/35 p-8 shadow-[var(--shadow-soft)] md:p-10"
      >
        {/* Soft color orbs for depth (Givingli-adjacent warmth, original layout) */}
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,_rgba(242,190,180,0.45)_0%,_transparent_68%)] blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,_rgba(149,120,198,0.2)_0%,_transparent_65%)] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-8 right-10 h-24 w-24 rounded-full bg-[radial-gradient(circle_at_center,_rgba(191,229,208,0.35)_0%,_transparent_70%)] blur-xl"
          aria-hidden
        />

        <div className="relative">
          <h1
            className={`text-[1.65rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--text)] sm:text-4xl md:text-[2.35rem] ${fraunces.className}`}
          >
            {t.heroTitle}
          </h1>
          <p className="mt-5 max-w-2xl text-[0.95rem] leading-[1.75] text-[var(--text-muted)] md:text-lg md:leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Bottom edge highlight — paper / premium card feel */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent"
          aria-hidden
        />
      </div>
    </header>
  );
}
