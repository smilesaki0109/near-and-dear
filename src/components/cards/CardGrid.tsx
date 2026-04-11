"use client";

import Link from "next/link";
import type { MockCard } from "@/data/mockCards";
import { CardTile } from "@/components/cards/CardTile";
import type { Locale } from "@/lib/i18n/ui";
import { ui } from "@/lib/i18n/ui";

type Props = {
  cards: MockCard[];
  locale: Locale;
};

/** Responsive grid of card tiles (card-based layout, generous spacing). */
export function CardGrid({ cards, locale }: Props) {
  const t = ui[locale];

  if (cards.length === 0) {
    return (
      <p
        className="rounded-[var(--radius-lg)] border border-dashed border-[var(--line)]/90 bg-white/60 px-8 py-14 text-center text-sm leading-relaxed text-[var(--text-muted)] shadow-[var(--shadow-soft)] backdrop-blur-sm"
        role="status"
      >
        {t.cardsEmpty}
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-9 xl:grid-cols-3 xl:gap-10">
      {cards.map((card, index) => (
        <li
          key={card.id}
          className="animate-card-rise"
          style={{ animationDelay: `${Math.min(index, 10) * 55}ms` }}
        >
          <Link
            href={`/create/${card.id}`}
            className="block cursor-pointer rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)]"
          >
            <CardTile card={card} locale={locale} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
