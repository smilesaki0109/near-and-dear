import Image from "next/image";
import type { MockCard } from "@/data/mockCards";
import type { Locale } from "@/lib/i18n/ui";
import { ui } from "@/lib/i18n/ui";

type Props = {
  card: MockCard;
  message: string;
  photoUrl: string | null;
  locale: Locale;
};

/**
 * Read-only full card: matches create preview styling, tuned for small screens.
 */
export function SharedCardView({ card, message, photoUrl, locale }: Props) {
  const t = ui[locale];
  const title = locale === "ja" ? card.titleJa : card.titleEn;
  const trimmed = message.trim();
  const showPlaceholder = trimmed.length === 0;

  return (
    <div className="w-full max-w-lg overflow-hidden rounded-[var(--radius-xl)] bg-[var(--surface-elevated)] shadow-[var(--shadow-hover)] ring-1 ring-white/90 [box-shadow:var(--shadow-soft),inset_0_1px_0_rgba(255,255,255,0.75)]">
      <div
        className={`relative aspect-[16/11] overflow-hidden bg-gradient-to-br sm:aspect-[16/10] ${card.gradientClass}`}
      >
        <Image
          src={card.image}
          alt=""
          fill
          sizes="(min-width: 640px) 512px, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,255,255,0.5)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--text)]/[0.08] to-transparent" />

        {photoUrl ? (
          <div className="absolute bottom-3 right-3 max-w-[46%] overflow-hidden rounded-[var(--radius-md)] bg-white/90 p-1.5 shadow-[var(--shadow-hover)] ring-1 ring-white/90 sm:bottom-4 sm:right-4 sm:max-w-[42%]">
            {/* eslint-disable-next-line @next/next/no-img-element -- Supabase URL or data URL fallback */}
            <img
              src={photoUrl}
              alt=""
              className="max-h-36 w-full rounded-[calc(var(--radius-md)-4px)] object-cover sm:max-h-40"
            />
          </div>
        ) : null}
      </div>

      <div className="border-t border-white/80 bg-gradient-to-b from-[var(--accent-cream)]/60 to-[var(--surface)] px-5 py-6 sm:px-8 sm:py-7">
        <h1 className="text-lg font-semibold leading-snug text-[var(--text)] sm:text-xl">
          {title}
        </h1>
        <div className="mt-4 min-h-[4rem] rounded-[var(--radius-md)] border border-[var(--line)]/80 bg-white/75 px-4 py-3 text-[0.95rem] leading-relaxed text-[var(--text)] shadow-[var(--shadow-soft)] sm:min-h-[4.5rem]">
          {showPlaceholder ? (
            <span className="text-[var(--text-muted)]">{t.shareMessageEmpty}</span>
          ) : (
            <span className="whitespace-pre-wrap break-words">{trimmed}</span>
          )}
        </div>
      </div>
    </div>
  );
}
