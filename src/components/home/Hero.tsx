"use client";

import { Fraunces } from "next/font/google";
import type { ReactNode } from "react";
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
  const moodChips =
    locale === "en"
      ? ["🇯🇵 Japan days", "❤️ tiny care", "🌸 soft moments"]
      : ["🇯🇵 日本の毎日", "❤️ 小さな想い", "🌸 やさしい時間"];

  return (
    <header className="relative mx-auto mb-8 w-full max-w-6xl md:mb-14">
      {/* Decorative spark — tiny emotional cue, no extra copy */}
      <p
        className="mb-3 inline-flex items-center gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--primary-deep)]/80 md:mb-5"
        aria-hidden
      >
        <span className="inline-block h-px w-10 rounded-full bg-gradient-to-r from-transparent via-[var(--primary)]/70 to-transparent" />
        <span className="h-1 w-1 rounded-full bg-[var(--primary)]/45" />
        <span className="inline-block h-px w-10 rounded-full bg-gradient-to-l from-transparent via-[var(--primary)]/70 to-transparent" />
      </p>

      <div
        className="relative overflow-hidden rounded-[var(--radius-xl)] border border-white/70 bg-gradient-to-br from-[var(--surface-elevated)] via-[var(--surface)] to-[var(--primary-soft)]/35 px-5 py-8 shadow-[var(--shadow-soft)] sm:px-8 md:px-10 md:py-16"
      >
        <FloatingEmoji className="right-8 top-8 rotate-6 hidden sm:flex" label="Japan flag">
          🇯🇵
        </FloatingEmoji>
        <FloatingEmoji className="right-28 top-32 rotate-12 hidden lg:flex" label="heart">
          ❤️
        </FloatingEmoji>
        <FloatingEmoji className="bottom-6 left-6 rotate-3 hidden lg:flex" label="sakura">
          🌸
        </FloatingEmoji>
        <FloatingEmoji className="right-56 top-6 -rotate-12 hidden xl:flex" label="ramen">
          🍜
        </FloatingEmoji>

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
            className={`text-[1.45rem] font-semibold leading-[1.18] tracking-[-0.02em] text-[var(--text)] sm:text-4xl md:text-[2.35rem] ${fraunces.className}`}
          >
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-[1.7] text-[var(--text-muted)] md:mt-5 md:text-lg md:leading-relaxed">
            {t.heroSubtitle}
          </p>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-7">
            {moodChips.map((chip) => (
              <span
                key={chip}
                className="rounded-full bg-white/75 px-4 py-2 text-xs font-semibold text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-white/90"
              >
                {chip}
              </span>
            ))}
          </div>
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

function FloatingEmoji({
  className,
  children,
  label,
}: {
  className: string;
  children: ReactNode;
  label: string;
}) {
  return (
    <span
        className={`pointer-events-none absolute z-10 flex h-12 w-12 items-center justify-center text-3xl drop-shadow-sm ${className}`}
      aria-label={label}
      role="img"
    >
      {children}
    </span>
  );
}
