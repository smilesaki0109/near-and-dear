"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CardGrid } from "@/components/cards/CardGrid";
import { CategoryChips, type CategoryFilter } from "@/components/home/CategoryChips";
import { Hero } from "@/components/home/Hero";
import { SearchBar } from "@/components/home/SearchBar";
import { mockCards } from "@/data/mockCards";
import { useLanguage } from "@/contexts/LanguageContext";
import { ui } from "@/lib/i18n/ui";

/**
 * Home = browse: search + category chips + grid.
 * Wired to mock data until Supabase templates are loaded in a later phase.
 */
export function HomeBrowse() {
  const { locale, setLocale } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const t = ui[locale];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockCards.filter((card) => {
      const matchCategory =
        category === "all" ? true : card.category === category;
      if (!matchCategory) return false;
      if (!q) return true;
      const en = card.titleEn.toLowerCase();
      const ja = card.titleJa.toLowerCase();
      return en.includes(q) || ja.includes(q);
    });
  }, [query, category]);

  return (
    <AppShell locale={locale} onLocaleChange={setLocale}>
      <div className="mx-auto max-w-6xl">
        <Hero locale={locale} />

        {/* Groups browse controls so the page reads as one calm “surface” */}
        <div className="rounded-[var(--radius-xl)] border border-white/60 bg-white/45 p-6 shadow-[var(--shadow-soft)] backdrop-blur-md md:p-8">
          <SearchBar locale={locale} value={query} onChange={setQuery} />
          <CategoryChips locale={locale} active={category} onChange={setCategory} />
        </div>

        <section className="mt-14 md:mt-16" aria-labelledby="cards-heading">
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="cards-heading"
                className="text-xl font-semibold tracking-tight text-[var(--text)] md:text-[1.35rem]"
              >
                {t.cardsHeading}
              </h2>
              <div
                className="mt-3 h-px w-12 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent opacity-70"
                aria-hidden
              />
            </div>
          </div>
          <CardGrid cards={filtered} locale={locale} />
        </section>

        <footer className="mt-20 border-t border-[var(--line)]/80 pt-10 text-center text-sm leading-relaxed text-[var(--text-muted)]">
          {t.footerNote}
        </footer>
      </div>
    </AppShell>
  );
}
