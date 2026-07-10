"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  addImportantDate,
  loadImportantDates,
  monthlyFamilyPrompt,
  removeImportantDate,
  type ImportantDate,
} from "@/lib/home/retention-storage";
import type { Locale } from "@/lib/i18n/ui";
import { homeCopy } from "@/lib/i18n/home";

type Props = { locale: Locale };

const albumMoments = [
  { emoji: "🌤", key: "sky" as const },
  { emoji: "❄️", key: "snow" as const },
  { emoji: "🏪", key: "konbini" as const },
  { emoji: "🌆", key: "commute" as const },
  { emoji: "🌸", key: "sakura" as const },
  { emoji: "🍱", key: "food" as const },
];

/**
 * Retention hooks: important dates, monthly letter, Japan life album.
 */
export function RetentionSection({ locale }: Props) {
  const copy = homeCopy[locale];
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [label, setLabel] = useState("");
  const [date, setDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const monthlyLine = monthlyFamilyPrompt(locale);

  useEffect(() => {
    setDates(loadImportantDates());
  }, []);

  const handleAdd = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!label.trim() || !date) return;
      setDates(addImportantDate({ label: label.trim(), date }));
      setLabel("");
      setDate("");
      setShowForm(false);
    },
    [date, label],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Important dates */}
      <article className="flex flex-col rounded-[var(--radius-xl)] border border-[var(--line)]/50 bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
        <span className="text-2xl" aria-hidden>
          📅
        </span>
        <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[var(--text)]">
          {copy.retentionDatesTitle}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-[1.75] text-[var(--text-muted)]">
          {copy.retentionDatesBody}
        </p>

        {dates.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {dates.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] bg-[var(--bg-page)] px-3 py-2.5 text-sm"
              >
                <span className="font-medium text-[var(--text)]">{d.label}</span>
                <span className="shrink-0 text-[var(--text-muted)]">
                  {formatDisplayDate(d.date, locale)}
                </span>
                <button
                  type="button"
                  onClick={() => setDates(removeImportantDate(d.id))}
                  className="shrink-0 text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                  aria-label="Remove"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        {showForm ? (
          <form onSubmit={handleAdd} className="mt-4 space-y-3">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={copy.retentionDatesPlaceholder}
              className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-white px-3 py-2.5 text-sm"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-white px-3 py-2.5 text-sm"
              required
            />
            <button
              type="submit"
              className="w-full rounded-full bg-[var(--primary)] py-2.5 text-sm font-semibold text-white"
            >
              {copy.retentionDatesSave}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-5 rounded-full border border-[var(--line)] bg-white px-4 py-2.5 text-sm font-semibold text-[var(--primary-deep)] transition hover:bg-[var(--primary-soft)]/30"
          >
            {copy.retentionDatesCta}
          </button>
        )}
      </article>

      {/* Monthly letter */}
      <article className="flex flex-col rounded-[var(--radius-xl)] border border-[var(--line)]/50 bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
        <span className="text-2xl" aria-hidden>
          💌
        </span>
        <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[var(--text)]">
          {copy.retentionMonthlyTitle}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-[1.75] text-[var(--text-muted)]">
          {copy.retentionMonthlyBody}
        </p>
        <blockquote className="mt-4 rounded-[var(--radius-md)] border-l-[3px] border-[var(--primary)] bg-[var(--primary-soft)]/25 px-4 py-3 text-sm italic leading-[1.75] text-[var(--text)]">
          &ldquo;{monthlyLine}&rdquo;
        </blockquote>
        <Link
          href="/create/9"
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:brightness-[1.03]"
        >
          {copy.retentionMonthlyCta}
        </Link>
      </article>

      {/* Japan life album */}
      <article className="flex flex-col rounded-[var(--radius-xl)] border border-[var(--line)]/50 bg-[var(--surface)] p-6 shadow-[var(--shadow-soft)]">
        <span className="text-2xl" aria-hidden>
          📷
        </span>
        <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-[var(--text)]">
          {copy.retentionAlbumTitle}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-[1.75] text-[var(--text-muted)]">
          {copy.retentionAlbumBody}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {albumMoments.map((item) => (
            <div
              key={item.key}
              className="flex flex-col items-center rounded-[var(--radius-md)] bg-[var(--bg-page)] px-2 py-3 text-center"
            >
              <span className="text-xl" aria-hidden>
                {item.emoji}
              </span>
              <span className="mt-1 text-[0.65rem] font-medium leading-tight text-[var(--text-muted)]">
                {copy.albumMoments[item.key]}
              </span>
            </div>
          ))}
        </div>
        <Link
          href="/create/2"
          className="mt-5 inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-white px-5 py-2.5 text-sm font-semibold text-[var(--primary-deep)] transition hover:bg-[var(--primary-soft)]/25"
        >
          {copy.retentionAlbumCta}
        </Link>
      </article>
    </div>
  );
}

function formatDisplayDate(iso: string, locale: Locale): string {
  try {
    const d = new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString(
      locale === "ja" ? "ja-JP" : locale === "tl" ? "en-PH" : "en-US",
      { month: "short", day: "numeric" },
    );
  } catch {
    return iso;
  }
}
