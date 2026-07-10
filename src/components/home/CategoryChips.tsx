"use client";

import type { CardCategory } from "@/data/mockCards";
import { categoryMeta } from "@/data/mockCards";
import { ui, type Locale } from "@/lib/i18n/ui";

export type CategoryFilter = "all" | CardCategory;

type Props = {
  locale: Locale;
  active: CategoryFilter;
  onChange: (next: CategoryFilter) => void;
};

const categories: CategoryFilter[] = [
  "all",
  "family_birthday",
  "parent",
  "child",
  "miss_you",
  "doing_well",
  "thank_you",
  "salary_day",
  "new_beginning",
  "homesick",
  "seasonal_japan",
];

/** Pill filters for family-life card moments. */
export function CategoryChips({ locale, active, onChange }: Props) {
  const t = ui[locale];

  return (
    <div className="mt-8">
      <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {t.chipHint}
      </p>
      <div
        className="-mx-4 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label={t.chipHint}
      >
        {categories.map((id) => {
          const selected = active === id;
          const label =
            id === "all"
              ? t.categoryAll
              : t[categoryMeta[id].labelKey];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition duration-200 active:scale-95 md:active:scale-100 ${
                selected
                  ? "bg-[var(--primary)] text-white shadow-[var(--shadow-soft)]"
                  : "bg-white text-[var(--text)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--line)]/80 hover:ring-[var(--primary)]/25"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
