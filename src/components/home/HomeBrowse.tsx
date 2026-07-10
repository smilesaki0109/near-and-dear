"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CardGrid } from "@/components/cards/CardGrid";
import { CardTile } from "@/components/cards/CardTile";
import { CategoryChips, type CategoryFilter } from "@/components/home/CategoryChips";
import { Hero } from "@/components/home/Hero";
import { RetentionSection } from "@/components/home/RetentionSection";
import { SearchBar } from "@/components/home/SearchBar";
import { mockCards } from "@/data/mockCards";
import { useLanguage } from "@/contexts/LanguageContext";
import { homeCopy } from "@/lib/i18n/home";
import { ui } from "@/lib/i18n/ui";

export function HomeBrowse() {
  const { locale, setLocale } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const t = ui[locale];
  const copy = homeCopy[locale];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockCards.filter((card) => {
      const matchCategory =
        category === "all" ? true : card.category === category;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        card.titleEn.toLowerCase().includes(q) ||
        card.titleJa.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const japanCards = useMemo(
    () =>
      mockCards
        .filter((c) => c.category === "seasonal_japan" || c.category === "doing_well")
        .slice(0, 6),
    [],
  );

  return (
    <AppShell locale={locale} onLocaleChange={setLocale}>
      <div className="mx-auto max-w-6xl">
        <Hero locale={locale} />

        {/* Value proposition */}
        <section className="mb-14 rounded-[var(--radius-xl)] border border-[var(--line)]/50 bg-[var(--surface)] px-6 py-8 md:px-10 md:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--primary-deep)]">
            {copy.valueKicker}
          </p>
          <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-3xl">
            {copy.valueTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.8] text-[var(--text-muted)]">
            {copy.valueBody}
          </p>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mb-14 scroll-mt-28">
          <div className="mb-8 text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--primary-deep)]">
              {copy.howKicker}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-3xl">
              {copy.howTitle}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[var(--radius-xl)] border border-[var(--line)]/50 bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-deep)]">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-semibold leading-snug text-[var(--text)]">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.75] text-[var(--text-muted)]">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Retention */}
        <section className="mb-14">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-3xl">
              {copy.retentionHeading}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-[1.75] text-[var(--text-muted)]">
              {copy.retentionSub}
            </p>
          </div>
          <RetentionSection locale={locale} />
        </section>

        {/* Card browse */}
        <section id="cards" aria-labelledby="cards-heading" className="mb-14 scroll-mt-28">
          <div className="mb-8">
            <h2
              id="cards-heading"
              className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-3xl"
            >
              {t.cardsHeading}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-[1.75] text-[var(--text-muted)]">
              {copy.cardsBody}
            </p>
          </div>

          <div className="mb-8 rounded-[var(--radius-xl)] border border-[var(--line)]/50 bg-[var(--surface)] p-5 md:p-8">
            <SearchBar locale={locale} value={query} onChange={setQuery} />
            <CategoryChips locale={locale} active={category} onChange={setCategory} />
          </div>

          <CardGrid cards={filtered} locale={locale} />
        </section>

        {/* Japan life album strip */}
        <section className="mb-14 rounded-[var(--radius-xl)] border border-[var(--line)]/50 bg-[var(--surface)] p-6 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--primary-deep)]">
            {copy.albumKicker}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-3xl">
            {copy.albumTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-[1.75] text-[var(--text-muted)]">
            {copy.albumBody}
          </p>

          <div className="mt-8 flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {japanCards.map((card) => (
              <Link
                key={card.id}
                href={`/create/${card.id}`}
                className="block w-[240px] shrink-0 snap-start"
              >
                <CardTile card={card} locale={locale} />
              </Link>
            ))}
          </div>
        </section>

        {/* Map teaser */}
        <section className="mb-14 rounded-[var(--radius-xl)] border border-[var(--line)]/50 bg-[var(--bg-page)] px-6 py-8 md:px-10">
          <h2 className="text-xl font-semibold text-[var(--text)] md:text-2xl">
            {copy.mapTitle}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-[1.75] text-[var(--text-muted)] md:text-base">
            {copy.mapBody}
          </p>
          <Link
            href="/map"
            className="mt-6 inline-flex rounded-full border border-[var(--line)] bg-white px-6 py-2.5 text-sm font-semibold text-[var(--primary-deep)] transition hover:bg-[var(--primary-soft)]/25"
          >
            {copy.exploreMap}
          </Link>
        </section>

        {/* Final CTA */}
        <section className="rounded-[var(--radius-xl)] bg-[var(--text)] px-6 py-12 text-center md:px-12 md:py-14">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">
            {copy.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-[1.75] text-white/75">
            {copy.ctaBody}
          </p>
          <Link
            href="/create/5"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-[var(--text)] shadow-lg transition hover:bg-[var(--accent-cream)] active:scale-[0.98]"
          >
            {copy.createButton}
          </Link>
        </section>

        <footer className="mt-14 border-t border-[var(--line)] pt-8 text-center text-sm text-[var(--text-muted)] md:mt-20">
          {t.footerNote}
        </footer>
      </div>
    </AppShell>
  );
}
