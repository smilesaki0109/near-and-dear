"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaInstagram, FaLine, FaRegCopy, FaShareNodes, FaXTwitter } from "react-icons/fa6";
import type { Locale } from "@/lib/i18n/ui";
import { ui } from "@/lib/i18n/ui";

type Props = {
  locale: Locale;
};

function isAbortError(err: unknown): boolean {
  return (
    err instanceof DOMException ||
    (typeof err === "object" && err !== null && "name" in err)
  ) && (err as { name?: string }).name === "AbortError";
}

function openShareUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function SharedCardActions({ locale }: Props) {
  const t = ui[locale];
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [status, setStatus] = useState<
    "idle" | "copied" | "instagram-copied" | "copy-error" | "share-error"
  >("idle");
  const [isSharing, setIsSharing] = useState(false);
  const [showSentOverlay, setShowSentOverlay] = useState(false);
  const [showAfterglow, setShowAfterglow] = useState(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resetSoon = useCallback(
    (ms: number) => {
      clearTimer();
      timeoutRef.current = setTimeout(() => setStatus("idle"), ms);
    },
    [clearTimer],
  );

  useEffect(
    () => () => {
      clearTimer();
    },
    [clearTimer],
  );

  const copyCurrentUrl = useCallback(async (): Promise<boolean> => {
    if (typeof navigator.clipboard?.writeText !== "function") return false;

    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus("copied");
      resetSoon(2000);
      return true;
    } catch {
      setStatus("copy-error");
      resetSoon(4500);
      return false;
    }
  }, [resetSoon]);

  const copy = useCallback(() => {
    setStatus("idle");
    void copyCurrentUrl();
  }, [copyCurrentUrl]);

  const share = useCallback(async () => {
    setStatus("idle");
    setIsSharing(true);
    setShowSentOverlay(true);
    setShowAfterglow(true);
    const url = window.location.href;
    const payload: ShareData = {
      url,
      text: t.shareSocialText,
    };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(payload);
        return;
      } catch (err) {
        if (isAbortError(err)) return;
        setStatus("share-error");
        resetSoon(4500);
        return;
      }
    }

    await copyCurrentUrl();
  }, [copyCurrentUrl, resetSoon, t.shareSocialText]);

  const shareToLine = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    openShareUrl(`https://social-plugins.line.me/lineit/share?url=${url}`);
  }, []);

  const shareToTwitter = useCallback(() => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(t.shareSocialText);
    openShareUrl(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
  }, [t.shareSocialText]);

  const copyForInstagram = useCallback(async () => {
    setStatus("idle");
    const ok = await copyCurrentUrl();
    if (ok) {
      setStatus("instagram-copied");
      resetSoon(3200);
    }
  }, [copyCurrentUrl, resetSoon]);

  useEffect(() => {
    if (!isSharing) return;
    const id = setTimeout(() => setIsSharing(false), 900);
    return () => clearTimeout(id);
  }, [isSharing]);

  useEffect(() => {
    if (!showSentOverlay) return;
    const id = setTimeout(() => setShowSentOverlay(false), 1100);
    return () => clearTimeout(id);
  }, [showSentOverlay]);

  useEffect(() => {
    if (!showAfterglow) return;
    const id = setTimeout(() => setShowAfterglow(false), 3000);
    return () => clearTimeout(id);
  }, [showAfterglow]);

  const iconButtonClass =
    "group flex min-w-16 flex-col items-center gap-2 text-[0.68rem] font-semibold text-[var(--text-muted)] transition duration-200 active:scale-95 hover:text-[var(--primary-deep)] active:text-[var(--primary-deep)] focus-visible:outline-none";
  const iconWrapClass =
    "flex h-14 w-14 items-center justify-center rounded-full bg-white/75 text-xl text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-white/90 transition duration-200 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:bg-white group-hover:shadow-[var(--shadow-hover)] group-active:scale-95 group-active:bg-[var(--primary-soft)] group-active:ring-[var(--primary)]/25 group-focus-visible:ring-2 group-focus-visible:ring-[var(--primary-soft)] group-focus-visible:ring-offset-2";

  const feedback =
    status === "copied"
      ? t.shareCopied
      : status === "instagram-copied"
        ? t.shareInstagramCopied
        : status === "copy-error"
          ? t.shareCopyFailed
          : status === "share-error"
            ? t.shareUnable
            : null;

  return (
    <div className="relative mt-6 flex w-full max-w-lg flex-col items-center gap-3">
      <AnimatePresence>
        {showSentOverlay ? (
          <motion.div
            className="pointer-events-none absolute inset-x-4 -top-24 z-20 flex justify-center"
            aria-live="polite"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: -6, scale: 1.04 }}
            exit={{ opacity: 0, y: -28, scale: 0.98 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <motion.div
              className="flex min-w-[210px] flex-col items-center rounded-[var(--radius-xl)] bg-white/90 px-6 py-5 text-center shadow-[var(--shadow-hover)] ring-1 ring-white/90 backdrop-blur-md"
              animate={{
                boxShadow:
                  "0 24px 55px rgba(104, 74, 148, 0.18), 0 8px 22px rgba(104, 74, 148, 0.12)",
              }}
              transition={{ duration: 0.28 }}
            >
              <motion.div
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary-soft)] text-2xl font-bold text-[var(--primary-deep)]"
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08, duration: 0.24, ease: "easeOut" }}
              >
                ✓
              </motion.div>
              <p className="mt-3 text-sm font-semibold text-[var(--text)]">
                {t.shareSent}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-4">
        <button type="button" onClick={copy} className={iconButtonClass} aria-label={t.shareCopyLink}>
          <span className={iconWrapClass}>
            <FaRegCopy aria-hidden />
          </span>
          <span>{t.shareCopyShort}</span>
        </button>
        <button
          type="button"
          onClick={() => void share()}
          className={iconButtonClass}
          aria-label={t.shareNative}
          aria-busy={isSharing}
        >
          <span className={iconWrapClass}>
            <FaShareNodes aria-hidden />
          </span>
          <span>{isSharing ? t.shareSending : t.shareNative}</span>
        </button>
        <button type="button" onClick={shareToLine} className={iconButtonClass} aria-label={t.shareLine}>
          <span className={`${iconWrapClass} text-[#06C755]`}>
            <FaLine aria-hidden />
          </span>
          <span>{t.shareLine}</span>
        </button>
        <button type="button" onClick={shareToTwitter} className={iconButtonClass} aria-label={t.shareTwitter}>
          <span className={`${iconWrapClass} text-[var(--text)]`}>
            <FaXTwitter aria-hidden />
          </span>
          <span>{t.shareTwitter}</span>
        </button>
        <button type="button" onClick={() => void copyForInstagram()} className={iconButtonClass} aria-label={t.shareInstagram}>
          <span className={`${iconWrapClass} text-[#C13584]`}>
            <FaInstagram aria-hidden />
          </span>
          <span>{t.shareInstagram}</span>
        </button>
      </div>
      {feedback ? (
        <p
          className={`max-w-sm text-center text-xs leading-snug ${
            status === "copy-error" || status === "share-error"
              ? "text-red-800/90"
              : "text-[var(--primary-deep)]"
          }`}
          role={status === "copy-error" || status === "share-error" ? "alert" : "status"}
        >
          {feedback}
        </p>
      ) : null}
      <AnimatePresence>
        {showAfterglow ? (
          <motion.div
            className="pointer-events-none fixed inset-x-4 bottom-6 z-30 mx-auto max-w-sm rounded-full bg-white/85 px-5 py-3 text-center text-sm font-medium text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-white/90 backdrop-blur-md"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            role="status"
          >
            {t.shareAfterglow}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
