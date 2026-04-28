import type { ShareRecord } from "@/types/share";
import { createSupabaseAdmin } from "@/lib/supabase/server-admin";

type SharedCardRow = {
  id: string;
  token: string;
  card_id: string;
  message: string | null;
  locale: string | null;
  photo_url: string | null;
  created_at: string;
};

function rowToShareRecord(row: SharedCardRow): ShareRecord {
  const locale =
    row.locale === "ja" || row.locale === "tl" ? row.locale : "en";

  return {
    cardId: row.card_id,
    message: row.message ?? "",
    locale,
    photoUrl: row.photo_url,
  };
}

/**
 * Load one shared card by URL token (server-side).
 */
export async function getSharedCardByToken(
  token: string,
): Promise<ShareRecord | null> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.error("[shared-cards] Supabase admin client is not configured");
    return null;
  }

  const { data, error } = await supabase
    .from("shared_cards")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) {
    console.error("[shared-cards] Failed to load share", {
      token,
      message: error.message,
    });
    return null;
  }

  if (!data) {
    console.error("[shared-cards] Share token was not found", { token });
    return null;
  }

  return rowToShareRecord(data as SharedCardRow);
}

/**
 * Upload raw image bytes to Storage. Returns public URL or null on failure.
 */
export async function uploadSharedPhoto(params: {
  token: string;
  bytes: Buffer;
  contentType: string;
}): Promise<string | null> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.error("[shared-cards] Supabase admin client is not configured");
    return null;
  }

  const ext = params.contentType.includes("png")
    ? "png"
    : params.contentType.includes("webp")
      ? "webp"
      : "jpg";
  const path = `shared/${params.token}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("card-photos")
    .upload(path, params.bytes, {
      contentType: params.contentType,
      upsert: false,
    });

  if (error) {
    console.error("[shared-cards] Failed to upload share photo", {
      token: params.token,
      message: error.message,
    });
    return null;
  }

  const { data } = supabase.storage.from("card-photos").getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Insert a row into shared_cards (id defaults in DB).
 */
export async function insertSharedCard(params: {
  token: string;
  cardId: string;
  message: string;
  locale: "en" | "ja" | "tl";
  photoUrl: string | null;
}): Promise<{ error: string | null }> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return { error: "Supabase is not configured" };
  }

  const { error } = await supabase.from("shared_cards").insert({
    token: params.token,
    card_id: params.cardId,
    message: params.message || null,
    locale: params.locale,
    photo_url: params.photoUrl,
  });

  if (error) {
    if (error.message.includes("public.shared_cards")) {
      return {
        error:
          "Supabase table public.shared_cards is missing. Run supabase/migrations/001_shared_cards.sql in the Supabase SQL editor.",
      };
    }
    return { error: error.message };
  }

  return { error: null };
}
