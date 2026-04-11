"use client";

import type { MockCard } from "@/data/mockCards";
import type { Locale } from "@/lib/i18n/ui";

type Props = {
  card: MockCard;
  locale: Locale;
};

/**
 * Browse tile styled like a small keepsake card: layered shadow, soft “paper”, gentle hover.
 */
export function CardTile({ card, locale }: Props) {
  const title = locale === "ja" ? card.titleJa : card.titleEn;

  return (
    <article className="group relative pt-1">
      {/* Soft stack behind — suggests a real card deck */}
      <div
        className="absolute left-2 right-2 top-0 h-4 rounded-t-[var(--radius-lg)] bg-white/50 shadow-[var(--shadow-soft)] ring-1 ring-white/60"
        aria-hidden
      />
      <div
        className="relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] ring-1 ring-white/90 transition duration-300 [box-shadow:var(--shadow-soft),inset_0_1px_0_rgba(255,255,255,0.75)] group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-hover)]"
      >
        <div
          className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${card.gradientClass}`}
          aria-hidden
        >
          {/* Inner vignette + sheen for tactile depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.55)_0%,transparent_55%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/[0.06] to-transparent opacity-60" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/25 via-transparent to-white/10" />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col border-t border-white/80 bg-gradient-to-b from-[var(--accent-cream)]/50 to-[var(--surface)] px-5 pb-5 pt-4">
          <h2 className="text-[1.02rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--text)]">
            {title}
          </h2>
          <p className="mt-3 text-xs font-medium text-[var(--text-muted)]">
            {locale === "en" ? "Preview" : "プレビュー"}
          </p>
        </div>
      </div>
    </article>
  );
}
