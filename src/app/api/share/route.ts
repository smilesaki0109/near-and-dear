import { NextResponse } from "next/server";
import { getMockCardById } from "@/data/mockCards";
import { createShare } from "@/lib/shareMemoryStore";

type Body = {
  cardId?: string;
  message?: string;
  imageBase64?: string | null;
  imageMimeType?: string | null;
  locale?: "en" | "ja";
};

const MAX_MESSAGE = 12000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/**
 * POST /api/share — stores one card snapshot in memory, returns a token for /c/[token].
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const cardId = body.cardId?.trim();
  if (!cardId || !getMockCardById(cardId)) {
    return NextResponse.json({ error: "Unknown card" }, { status: 400 });
  }

  const message =
    typeof body.message === "string" ? body.message.slice(0, MAX_MESSAGE) : "";
  const locale = body.locale === "ja" ? "ja" : "en";

  let imageBase64: string | null = null;
  let imageMimeType: string | null = null;

  if (body.imageBase64 != null && body.imageBase64 !== "") {
    if (typeof body.imageBase64 !== "string") {
      return NextResponse.json({ error: "Invalid image" }, { status: 400 });
    }
    const approxBytes = Math.floor((body.imageBase64.length * 3) / 4);
    if (approxBytes > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image too large" }, { status: 400 });
    }
    imageBase64 = body.imageBase64;
    imageMimeType =
      typeof body.imageMimeType === "string" && body.imageMimeType.startsWith("image/")
        ? body.imageMimeType
        : "image/jpeg";
  }

  const token = createShare({
    cardId,
    message,
    imageBase64,
    imageMimeType,
    locale,
  });

  return NextResponse.json({ token });
}
