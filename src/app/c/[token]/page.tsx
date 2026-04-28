import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { SharedCardScreen } from "@/components/share/SharedCardScreen";
import { getMockCardById } from "@/data/mockCards";
import { getSharedCardByToken } from "@/lib/supabase/shared-cards";
import { createSupabaseAdmin } from "@/lib/supabase/server-admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
};

const getCachedShare = cache(getSharedCardByToken);

function getSiteOrigin(): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (siteUrl) return siteUrl;

  const vercelUrl = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "");
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

function isHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function absoluteUrl(pathOrUrl: string, origin: string): string {
  if (isHttpUrl(pathOrUrl)) return pathOrUrl.trim();
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${origin}${path}`;
}

function buildDescription(message: string, locale: "en" | "ja" | "tl"): string {
  const compact = message.replace(/\s+/g, " ").trim();
  if (compact) {
    return compact.length > 100 ? `${compact.slice(0, 100)}…` : compact;
  }

  if (locale === "ja") {
    return "Near & Dearから、あなたへのカードが届きました。";
  }
  if (locale === "tl") {
    return "May thoughtful card na na-share sa iyo sa Near & Dear.";
  }
  return "A thoughtful card was shared with you on Near & Dear.";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const share = await getCachedShare(token);
  if (!share) {
    return {
      title: "Near & Dear",
      description: "A thoughtful card was shared with you.",
    };
  }

  const card = getMockCardById(share.cardId);
  if (!card) {
    return {
      title: "Near & Dear",
      description: buildDescription(share.message, share.locale),
    };
  }

  const origin = getSiteOrigin();
  const title = `${share.locale === "ja" ? card.titleJa : card.titleEn} | Near & Dear`;
  const description = buildDescription(share.message, share.locale);
  const image =
    share.photoUrl && isHttpUrl(share.photoUrl)
      ? share.photoUrl.trim()
      : absoluteUrl(card.image, origin);
  const url = `${origin}/c/${token}`;

  return {
    title,
    description,
    metadataBase: new URL(origin),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Public read-only card at a share token. Data is loaded from Supabase `shared_cards`.
 */
export default async function SharedCardPage({ params }: Props) {
  if (!createSupabaseAdmin()) {
    console.error("[share-page] Supabase admin client is not configured");
    notFound();
  }

  const { token } = await params;
  const share = await getCachedShare(token);
  if (!share) {
    console.error("[share-page] No shared card found for token", { token });
    notFound();
  }

  const card = getMockCardById(share.cardId);
  if (!card) {
    console.error("[share-page] Shared card has an unknown card id", {
      token,
      cardId: share.cardId,
    });
    notFound();
  }

  return <SharedCardScreen card={card} share={share} />;
}
