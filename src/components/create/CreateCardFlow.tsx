"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CreateLivePreview } from "@/components/create/CreateLivePreview";
import type { MockCard } from "@/data/mockCards";
import { messageTemplates } from "@/data/messageTemplates";
import { useLanguage } from "@/contexts/LanguageContext";
import { ui } from "@/lib/i18n/ui";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function readFileAsDataParts(file: File): Promise<{
  base64: string;
  mime: string;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
      if (!m) {
        reject(new Error("Could not read image"));
        return;
      }
      resolve({ mime: m[1], base64: m[2] });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

type Props = {
  card: MockCard;
};

type ShareResponse = {
  token?: string;
  error?: string;
};

/**
 * Compose message + photo + live preview; Save posts to /api/share then opens /c/[token].
 */
export function CreateCardFlow({ card }: Props) {
  const router = useRouter();
  const { locale, setLocale } = useLanguage();
  const t = ui[locale];
  const title = locale === "ja" ? card.titleJa : card.titleEn;

  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageId = useId();
  const photoInputId = useId();

  useEffect(() => {
    if (!photoFile) {
      setPhotoUrl(null);
      return;
    }
    const url = URL.createObjectURL(photoFile);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const insertTemplate = useCallback(
    (text: string) => {
      setMessage((prev) => {
        const next = prev.trim();
        if (!next) return text;
        return `${next}\n\n${text}`;
      });
      setSaveError(null);
    },
    [],
  );

  const onPickPhoto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      setPhotoFile(file);
      setSaveError(null);
    },
    [],
  );

  const clearPhoto = useCallback(() => {
    setPhotoFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setSaveError(null);
  }, []);

  const saveAndOpenShare = useCallback(async () => {
    setSaveError(null);
    if (photoFile && photoFile.size > MAX_IMAGE_BYTES) {
      setSaveError(t.createShareError);
      return;
    }
    setIsSaving(true);
    try {
      let imageBase64: string | null = null;
      let imageMimeType: string | null = null;

      if (photoFile) {
        const parts = await readFileAsDataParts(photoFile);
        imageBase64 = parts.base64;
        imageMimeType = parts.mime;
      }

      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardId: card.id,
          message,
          imageBase64,
          imageMimeType,
          locale,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as ShareResponse;

      if (!res.ok) {
        setSaveError(data.error || t.createShareError);
        return;
      }

      if (!data.token) {
        setSaveError(data.error || t.createShareError);
        return;
      }

      router.push(`/c/${data.token}`);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : t.createShareError);
    } finally {
      setIsSaving(false);
    }
  }, [card.id, locale, message, photoFile, router, t.createShareError]);

  return (
    <AppShell locale={locale} onLocaleChange={setLocale}>
      <div className="mx-auto max-w-6xl pb-16">
        <nav className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-white/90 transition hover:bg-white hover:shadow-[var(--shadow-hover)]"
          >
            <span aria-hidden>←</span>
            {t.createBack}
          </Link>
        </nav>

        {/* Selected template — compact echo of the browse card */}
        <section
          className="mb-10 overflow-hidden rounded-[var(--radius-xl)] border border-white/70 bg-gradient-to-br from-[var(--surface-elevated)] to-[var(--primary-soft)]/40 p-6 shadow-[var(--shadow-soft)] md:flex md:items-center md:gap-8 md:p-8"
          aria-labelledby="selected-card-heading"
        >
          <div
            className={`relative mx-auto aspect-[4/3] w-full max-w-[220px] shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-gradient-to-br shadow-[var(--shadow-soft)] ring-1 ring-white/80 ${card.gradientClass}`}
          >
            <Image
              src={card.image}
              alt=""
              fill
              sizes="220px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.5)_0%,transparent_55%)]" />
          </div>
          <div className="mt-6 md:mt-0">
            <p
              id="selected-card-heading"
              className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]"
            >
              {t.createSelectedLabel}
            </p>
            <h1 className="mt-2 text-2xl font-semibold leading-tight text-[var(--text)] md:text-3xl">
              {title}
            </h1>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:items-start">
          <div className="space-y-8">
            <header>
              <h2 className="text-xl font-semibold text-[var(--text)] md:text-2xl">
                {t.createHeading}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--text-muted)] md:text-[0.95rem]">
                {t.createSub}
              </p>
            </header>

            <div>
              <label
                htmlFor={messageId}
                className="text-sm font-semibold text-[var(--text)]"
              >
                {t.createMessageLabel}
              </label>
              <textarea
                id={messageId}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  setSaveError(null);
                }}
                rows={6}
                placeholder={t.createMessagePlaceholder}
                className="mt-3 w-full resize-y rounded-[var(--radius-lg)] border border-white/80 bg-white/75 px-4 py-3 text-[0.95rem] leading-relaxed text-[var(--text)] shadow-[var(--shadow-soft)] backdrop-blur-md placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {t.createTemplatesHint}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {messageTemplates.map((tpl) => {
                  const label =
                    locale === "ja"
                      ? tpl.textJa
                      : locale === "tl"
                        ? tpl.textTl
                        : tpl.textEn;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() =>
                        insertTemplate(
                          locale === "ja"
                            ? tpl.textJa
                            : locale === "tl"
                              ? tpl.textTl
                              : tpl.textEn,
                        )
                      }
                      className="max-w-full rounded-full border border-[var(--line)]/90 bg-white/80 px-3 py-2 text-left text-sm leading-snug text-[var(--text)] shadow-[var(--shadow-soft)] transition hover:border-[var(--primary)]/30 hover:bg-white hover:shadow-[var(--shadow-hover)]"
                      title={label}
                    >
                      <span className="line-clamp-2">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[var(--radius-xl)] border border-white/60 bg-white/45 p-6 shadow-[var(--shadow-soft)] backdrop-blur-md">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <label
                  htmlFor={photoInputId}
                  className="text-sm font-semibold text-[var(--text)]"
                >
                  {t.createPhotoLabel}
                </label>
                <span className="text-xs text-[var(--text-muted)]">
                  {t.createPhotoHint}
                </span>
              </div>
              <input
                ref={fileInputRef}
                id={photoInputId}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onPickPhoto}
              />
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-[var(--primary-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--primary)]/20 transition hover:bg-white"
                >
                  {photoFile ? t.createPhotoReplace : t.createPhotoButton}
                </button>
                {photoFile ? (
                  <button
                    type="button"
                    onClick={clearPhoto}
                    className="text-sm font-medium text-[var(--text-muted)] underline-offset-4 hover:underline"
                  >
                    {t.createPhotoRemove}
                  </button>
                ) : null}
              </div>
              {photoUrl ? (
                <div className="mt-5 overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)]/80 bg-white/80 p-2 shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt=""
                    className="max-h-48 w-full rounded-[calc(var(--radius-md)-6px)] object-contain"
                  />
                </div>
              ) : null}
            </div>
          </div>

          <aside className="lg:sticky lg:top-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              {t.createPreviewLabel}
            </p>
            <div className="mt-4">
              <CreateLivePreview
                card={card}
                message={message}
                photoUrl={photoUrl}
                locale={locale}
              />
            </div>
          </aside>
        </div>

        <div className="mt-14 flex flex-col items-center gap-4 border-t border-[var(--line)]/80 pt-10">
          <button
            type="button"
            onClick={() => void saveAndOpenShare()}
            disabled={isSaving}
            className="min-w-[220px] rounded-full bg-[var(--primary)] px-10 py-3.5 text-base font-semibold text-white shadow-[var(--shadow-hover)] ring-1 ring-white/30 transition hover:brightness-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-soft)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSaving ? t.createSaving : t.createSave}
          </button>
          <p className="max-w-md text-center text-sm text-[var(--text-muted)]">
            {t.createSaveNote}
          </p>
          {saveError ? (
            <p
              className="max-w-lg rounded-[var(--radius-lg)] border border-[var(--accent-peach)]/70 bg-[var(--accent-peach)]/20 px-5 py-3 text-center text-sm leading-relaxed text-[var(--text)]"
              role="alert"
            >
              {saveError}
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
