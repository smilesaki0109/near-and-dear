"use client";

import Image from "next/image";
import type { MockCard } from "@/data/mockCards";
import type { Locale } from "@/lib/i18n/ui";
import { ui } from "@/lib/i18n/ui";

type Props = {
  card: MockCard;
  message: string;
  photoUrl: string | null;
  locale: Locale;
};

/**
 * Full-bleed “final card” mockup: gradient, optional photo, title + message on soft paper.
 * Uses the same visual language as browse tiles for consistency.
 */
export function CreateLivePreview({
  card,
  message,
  photoUrl,
  locale,
}: Props) {
  const t = ui[locale];
  const title = locale === "ja" ? card.titleJa : card.titleEn;
  const trimmed = message.trim();
  const showPlaceholder = trimmed.length === 0;

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-[var(--surface-elevated)] shadow-[var(--shadow-soft)] ring-1 ring-white/90 [box-shadow:var(--shadow-soft),inset_0_1px_0_rgba(255,255,255,0.75)]">
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-gradient-to-br ${card.gradientClass}`}
      >
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.5)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/[0.08] to-transparent" />

        {photoUrl ? (
          <div className="absolute bottom-4 right-4 max-w-[42%] overflow-hidden rounded-[var(--radius-md)] bg-white/90 p-1.5 shadow-[var(--shadow-hover)] ring-1 ring-white/90">
            {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs from local upload */}
            <img
              src={photoUrl}
              alt=""
              className="max-h-40 w-full rounded-[calc(var(--radius-md)-4px)] object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/80 bg-gradient-to-b from-[var(--accent-cream)]/60 to-[var(--surface)] px-6 py-6 md:px-8 md:py-7">
        <h2 className="text-lg font-semibold leading-snug text-[var(--text)] md:text-xl">
          {title}
        </h2>
        <div className="mt-5 min-h-[4.5rem] rounded-[var(--radius-md)] border border-[var(--line)]/80 bg-white/70 px-4 py-3 text-[0.95rem] leading-relaxed text-[var(--text)] shadow-[var(--shadow-soft)]">
          {showPlaceholder ? (
            <span className="text-[var(--text-muted)]">{t.createPreviewEmpty}</span>
          ) : (
            <span className="whitespace-pre-wrap">{trimmed}</span>
          )}
        </div>
      </div>
    </div>
  );
}
