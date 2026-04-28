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
    <ul className="-mx-4 grid snap-x snap-mandatory grid-flow-col gap-4 overflow-x-auto px-4 pb-4 [grid-auto-columns:78%] [scrollbar-width:none] md:mx-0 md:grid-flow-row md:grid-cols-2 md:gap-9 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3 xl:gap-10 [&::-webkit-scrollbar]:hidden">
      {cards.map((card, index) => (
        <li
          key={card.id}
          className="animate-card-rise snap-start"
          style={{ animationDelay: `${Math.min(index, 10) * 55}ms` }}
        >
          <Link
            href={`/create/${card.id}`}
            className="block cursor-pointer rounded-[var(--radius-lg)] transition active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-page)] md:active:scale-100"
          >
            <CardTile card={card} locale={locale} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
