import Link from "next/link";
import type { MockCard } from "@/data/mockCards";
import type { ShareRecord } from "@/types/share";
import { SharedCardActions } from "@/components/share/SharedCardActions";
import { SharedCardView } from "@/components/share/SharedCardView";
import { ui } from "@/lib/i18n/ui";

type Props = {
  card: MockCard;
  share: ShareRecord;
};

/**
 * Minimal shell for recipients: no sidebar, mobile-first padding, gentle footer CTA.
 */
export function SharedCardScreen({ card, share }: Props) {
  const locale = share.locale;
  const t = ui[locale];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-page)]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[var(--bg-page)]"
        aria-hidden
        style={{
          backgroundImage: `
            radial-gradient(900px 420px at 50% -10%, rgba(235, 227, 247, 0.75), transparent 55%),
            radial-gradient(700px 400px at 100% 40%, rgba(255, 230, 220, 0.4), transparent 50%)
          `,
        }}
      />

      <header className="px-4 pt-6 text-center sm:pt-10">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--primary-deep)]/85">
          {t.shareKicker}
        </p>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 pb-12 pt-6 sm:px-6 sm:pb-16 sm:pt-8">
        <SharedCardView
          card={card}
          message={share.message}
          photoUrl={share.photoUrl}
          locale={locale}
        />

        <SharedCardActions locale={locale} />

        <p className="mt-8 max-w-sm text-center text-sm leading-relaxed text-[var(--text-muted)]">
          {t.shareFooterNote}
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-white shadow-[var(--shadow-hover)] ring-1 ring-white/25 transition hover:brightness-[1.03]"
        >
          {t.shareBrowseMore}
        </Link>
      </main>
    </div>
  );
}
