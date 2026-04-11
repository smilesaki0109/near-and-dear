import Link from "next/link";
import { ui } from "@/lib/i18n/ui";

/** Shown when token is unknown or the in-memory store was cleared (e.g. server restart). */
export default function ShareNotFound() {
  const en = ui.en;
  const ja = ui.ja;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-page)] px-6 text-center">
      <p className="text-lg font-semibold text-[var(--text)]">{en.shareNotFoundTitle}</p>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
        {en.shareNotFoundBody}
      </p>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--text-muted)]">
        {ja.shareNotFoundBody}
      </p>
      <Link
        href="/"
        className="mt-10 rounded-full bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-white shadow-[var(--shadow-hover)]"
      >
        {en.shareBrowseMore}
      </Link>
    </div>
  );
}
