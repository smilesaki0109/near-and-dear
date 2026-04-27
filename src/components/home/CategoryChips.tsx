"use client";

import type { CardCategory } from "@/data/mockCards";
import { ui, type Locale } from "@/lib/i18n/ui";

export type CategoryFilter = "all" | CardCategory;

type Props = {
  locale: Locale;
  active: CategoryFilter;
  onChange: (next: CategoryFilter) => void;
};

const categories: { id: CategoryFilter; labelKey: keyof (typeof ui)["en"] }[] =
  [
    { id: "all", labelKey: "categoryAll" },
    { id: "encouragement", labelKey: "categoryEncouragement" },
    { id: "birthday", labelKey: "categoryBirthday" },
    { id: "gratitude", labelKey: "categoryGratitude" },
    { id: "missing_home", labelKey: "categoryMissingHome" },
    { id: "new_chapter", labelKey: "categoryNewChapter" },
    { id: "japan", labelKey: "categoryJapan" },
  ];

/** Pill filters: one active state, soft pastel fills when selected. */
export function CategoryChips({ locale, active, onChange }: Props) {
  const t = ui[locale];

  return (
    <div className="mt-8">
      <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        {t.chipHint}
      </p>
      <div
        className="flex flex-wrap gap-2.5"
        role="group"
        aria-label={t.chipHint}
      >
        {categories.map(({ id, labelKey }) => {
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition duration-200 ${
                selected
                  ? "bg-[var(--primary-soft)] text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--primary)]/25"
                  : "bg-white/70 text-[var(--text)] shadow-[var(--shadow-soft)] ring-1 ring-white/80 hover:bg-white hover:shadow-[var(--shadow-hover)]"
              }`}
            >
              {t[labelKey]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
