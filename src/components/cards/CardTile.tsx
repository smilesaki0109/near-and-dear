"use client";

import Image from "next/image";
import type { MockCard } from "@/data/mockCards";
import { categoryMeta } from "@/data/mockCards";
import type { Locale } from "@/lib/i18n/ui";
import { ui } from "@/lib/i18n/ui";

type Props = {
  card: MockCard;
  locale: Locale;
};

export function CardTile({ card, locale }: Props) {
  const title = locale === "ja" ? card.titleJa : card.titleEn;
  const categoryLabel = ui[locale][categoryMeta[card.category].labelKey];

  return (
    <article className="group relative">
      <div className="relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--surface)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--line)]/60 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--shadow-hover)]">
        <div
          className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${card.gradientClass}`}
        >
          <Image
            src={card.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/10 via-transparent to-white/20" />
        </div>

        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[var(--primary-deep)]">
            {categoryLabel}
          </span>
          <h2 className="mt-2 text-[1.05rem] font-semibold leading-snug tracking-[-0.01em] text-[var(--text)]">
            {title}
          </h2>
        </div>
      </div>
    </article>
  );
}
