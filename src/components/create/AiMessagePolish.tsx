"use client";

import { useCallback, useState } from "react";
import {
  polishMessage,
  toneLabels,
  type MessageTone,
  type PolishLanguage,
} from "@/lib/ai/polish-message";
import type { Locale } from "@/lib/i18n/ui";
import { ui } from "@/lib/i18n/ui";

type Props = {
  locale: Locale;
  value: string;
  onChange: (next: string) => void;
  cardCategory?: string;
};

const tones: MessageTone[] = ["gentle", "bright", "emotional", "short"];

const outputLanguages: { id: PolishLanguage; label: string }[] = [
  { id: "ja", label: "日本語" },
  { id: "en", label: "English" },
  { id: "tl", label: "Tagalog" },
  { id: "vi", label: "Tiếng Việt" },
];

/**
 * AI-assisted message polish — mock today, API-ready tomorrow.
 */
export function AiMessagePolish({
  locale,
  value,
  onChange,
  cardCategory,
}: Props) {
  const t = ui[locale];
  const [tone, setTone] = useState<MessageTone>("gentle");
  const [outputLang, setOutputLang] = useState<PolishLanguage>(
    locale === "ja" ? "ja" : locale === "tl" ? "tl" : "en",
  );
  const [isPolishing, setIsPolishing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePolish = useCallback(async () => {
    const raw = value.trim();
    if (!raw) {
      setError(t.aiPolishEmpty);
      return;
    }
    setError(null);
    setIsPolishing(true);
    setPreview(null);
    try {
      const result = await polishMessage({
        raw,
        tone,
        language: outputLang,
        cardCategory,
      });
      setPreview(result.text);
    } catch {
      setError(t.aiPolishError);
    } finally {
      setIsPolishing(false);
    }
  }, [cardCategory, outputLang, t.aiPolishEmpty, t.aiPolishError, tone, value]);

  const applyPreview = useCallback(() => {
    if (preview) {
      onChange(preview);
      setPreview(null);
    }
  }, [onChange, preview]);

  const uiLang = locale === "ja" ? "ja" : locale === "tl" ? "tl" : "en";

  return (
    <section
      className="rounded-[var(--radius-xl)] border border-[var(--line)]/60 bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] md:p-6"
      aria-labelledby="ai-polish-heading"
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-lg"
          aria-hidden
        >
          ✨
        </span>
        <div>
          <h3
            id="ai-polish-heading"
            className="text-base font-semibold text-[var(--text)]"
          >
            {t.aiPolishHeading}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-muted)]">
            {t.aiPolishSub}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {t.aiPolishToneLabel}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tones.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTone(item)}
              className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                tone === item
                  ? "bg-[var(--primary)] text-white shadow-[var(--shadow-soft)]"
                  : "bg-white text-[var(--text)] ring-1 ring-[var(--line)] hover:bg-[var(--primary-soft)]/40"
              }`}
              aria-pressed={tone === item}
            >
              {toneLabels[item][uiLang]}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
          {t.aiPolishLangLabel}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {outputLanguages.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setOutputLang(lang.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                outputLang === lang.id
                  ? "bg-[var(--text)] text-white"
                  : "bg-white text-[var(--text-muted)] ring-1 ring-[var(--line)] hover:text-[var(--text)]"
              }`}
              aria-pressed={outputLang === lang.id}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handlePolish()}
        disabled={isPolishing || !value.trim()}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-deep)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow-hover)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isPolishing ? (
          <>
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            {t.aiPolishLoading}
          </>
        ) : (
          t.aiPolishButton
        )}
      </button>

      {error ? (
        <p className="mt-3 text-sm text-[#b65f66]" role="alert">
          {error}
        </p>
      ) : null}

      {preview ? (
        <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--primary)]/20 bg-[var(--primary-soft)]/35 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-deep)]">
            {t.aiPolishPreview}
          </p>
          <p className="mt-3 whitespace-pre-wrap text-[0.95rem] leading-[1.75] text-[var(--text)]">
            {preview}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applyPreview}
              className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white shadow-[var(--shadow-soft)]"
            >
              {t.aiPolishApply}
            </button>
            <button
              type="button"
              onClick={() => setPreview(null)}
              className="rounded-full px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              {t.aiPolishDismiss}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
