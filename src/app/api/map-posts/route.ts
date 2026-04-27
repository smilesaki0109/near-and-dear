import { NextResponse } from "next/server";
import { createJapanMapPost } from "@/lib/supabase/map-posts";
import { createSupabaseAdmin } from "@/lib/supabase/server-admin";
import type { JapanMapCategory } from "@/types/map";

type Body = {
  category?: unknown;
  title?: unknown;
  description?: unknown;
  x?: unknown;
  y?: unknown;
  imageUrl?: unknown;
};

const CATEGORIES: JapanMapCategory[] = [
  "food",
  "place",
  "culture",
  "daily_life",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCategory(value: unknown): value is JapanMapCategory {
  return typeof value === "string" && CATEGORIES.includes(value as JapanMapCategory);
}

function optionalText(value: unknown, max: number): string | null {
  if (value == null) return null;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function isValidOptionalHttpUrl(value: string | null): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function numberInRange(value: unknown, min: number, max: number): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(n) || n < min || n > max) return null;
  return n;
}

export async function POST(req: Request) {
  if (!createSupabaseAdmin()) {
    console.error("[api/map-posts] Supabase admin client is not configured", {
      hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      hasServiceRoleKey: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
    return NextResponse.json(
      { error: "Map storage is not configured" },
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
  const title = optionalText(typedBody.title, 120);
  const description = optionalText(typedBody.description, 280);
  const imageUrl = optionalText(typedBody.imageUrl, 500);
  const x = numberInRange(typedBody.x, 0, 100);
  const y = numberInRange(typedBody.y, 0, 100);

  if (!isCategory(typedBody.category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (x == null || y == null) {
    return NextResponse.json(
      { error: "Please choose a point on the map" },
      { status: 400 },
    );
  }
  if (!isValidOptionalHttpUrl(imageUrl)) {
    return NextResponse.json(
      { error: "Image URL must start with http:// or https://" },
      { status: 400 },
    );
  }

  const { post, error } = await createJapanMapPost({
    category: typedBody.category,
    title,
    description,
    x,
    y,
    imageUrl,
  });

  if (error || !post) {
    console.error("[api/map-posts] insert_failed", {
      category: typedBody.category,
      title,
      x,
      y,
      message: error,
    });
    return NextResponse.json(
      { error: error ?? "Could not save map post" },
      { status: 500 },
    );
  }

  return NextResponse.json({ post });
}
