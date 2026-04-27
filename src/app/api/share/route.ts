import { NextResponse } from "next/server";
import { getMockCardById } from "@/data/mockCards";
import {
  insertSharedCard,
  uploadSharedPhoto,
} from "@/lib/supabase/shared-cards";
import { createSupabaseAdmin } from "@/lib/supabase/server-admin";

type Body = {
  cardId?: string;
  message?: string;
  imageBase64?: string | null;
  imageMimeType?: string | null;
  locale?: "en" | "ja";
};

const MAX_MESSAGE = 12000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function logShareFailure(reason: string, details: Record<string, unknown>) {
  console.error("[api/share]", reason, details);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * POST /api/share — stores one card snapshot in Supabase, returns a token for /c/[token].
 */
export async function POST(req: Request) {
  if (!createSupabaseAdmin()) {
    logShareFailure("misconfigured", {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
    return NextResponse.json(
      { error: "Share storage is not configured" },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isObject(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const typedBody = body as Body;
  const cardId =
    typeof typedBody.cardId === "string" ? typedBody.cardId.trim() : "";
  if (!cardId) {
    return NextResponse.json({ error: "cardId is required" }, { status: 400 });
  }
  if (!getMockCardById(cardId)) {
    return NextResponse.json({ error: "Unknown card" }, { status: 400 });
  }

  if (typedBody.message != null && typeof typedBody.message !== "string") {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }
  const message =
    typeof typedBody.message === "string"
      ? typedBody.message.slice(0, MAX_MESSAGE)
      : "";

  if (
    typedBody.locale != null &&
    typedBody.locale !== "en" &&
    typedBody.locale !== "ja"
  ) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  const locale = typedBody.locale === "ja" ? "ja" : "en";

  let imageBase64: string | null = null;
  let imageMimeType: string | null = null;

  if (typedBody.imageBase64 != null && typedBody.imageBase64 !== "") {
    if (typeof typedBody.imageBase64 !== "string") {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
    if (
      typedBody.imageMimeType != null &&
      typeof typedBody.imageMimeType !== "string"
    ) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
    }
    if (
      typeof typedBody.imageMimeType === "string" &&
      !typedBody.imageMimeType.startsWith("image/")
    ) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 });
    }
    const trimmedBase64 = typedBody.imageBase64.trim();
    if (!trimmedBase64) {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
    const approxBytes = Math.floor((trimmedBase64.length * 3) / 4);
    if (approxBytes > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image too large" }, { status: 400 });
    }
    imageBase64 = trimmedBase64;
    imageMimeType =
      typeof typedBody.imageMimeType === "string"
        ? typedBody.imageMimeType
        : "image/jpeg";
  }

  const token = crypto.randomUUID();
  let photoUrl: string | null = null;

  if (imageBase64 && imageMimeType) {
    try {
      photoUrl = await uploadSharedPhoto({
        token,
        bytes: Buffer.from(imageBase64, "base64"),
        contentType: imageMimeType,
      });
      if (!photoUrl) {
        photoUrl = `data:${imageMimeType};base64,${imageBase64}`;
      }
    } catch (err) {
      logShareFailure("photo_upload_exception", {
        cardId,
        message: err instanceof Error ? err.message : String(err),
      });
      photoUrl = `data:${imageMimeType};base64,${imageBase64}`;
    }
  }

  const { error } = await insertSharedCard({
    token,
    cardId,
    message,
    locale,
    photoUrl,
  });

  if (error) {
    logShareFailure("insert_failed", { cardId, message: error });
    return NextResponse.json(
      { error },
      { status: 500 },
    );
  }

  return NextResponse.json({ token });
}
