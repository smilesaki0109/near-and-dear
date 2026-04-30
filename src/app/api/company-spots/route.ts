import { NextResponse } from "next/server";
import {
  createCompanySpot,
  listCompanySpots,
} from "@/lib/supabase/company";
import type { CompanySpotCategory } from "@/types/company";

type Body = {
  name?: unknown;
  category?: unknown;
  comment?: unknown;
  imageUrl?: unknown;
  image_url?: unknown;
  mapX?: unknown;
  mapY?: unknown;
  map_x?: unknown;
  map_y?: unknown;
  language?: unknown;
  createdBy?: unknown;
  created_by?: unknown;
};

const categories: CompanySpotCategory[] = [
  "food",
  "place",
  "culture",
  "nature",
  "comfort",
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function numberInRange(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  if (!Number.isFinite(n) || n < 0 || n > 100) return null;
  return n;
}

function language(value: unknown) {
  return value === "ja" || value === "tl" ? value : "en";
}

export async function GET() {
  const spots = await listCompanySpots();
  return NextResponse.json({ spots });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isObject(body)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const typed = body as Body;
  const name = text(typed.name, 120);
  const category = categories.includes(typed.category as CompanySpotCategory)
    ? (typed.category as CompanySpotCategory)
    : null;
  const comment = text(typed.comment, 280);
  const imageUrl = text(typed.imageUrl ?? typed.image_url, 500);
  const mapX = numberInRange(typed.mapX ?? typed.map_x);
  const mapY = numberInRange(typed.mapY ?? typed.map_y);

  if (!name) {
    return NextResponse.json({ error: "Spot name is required" }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const { spot, error } = await createCompanySpot({
    name,
    category,
    comment,
    imageUrl,
    mapX,
    mapY,
    language: language(typed.language),
    createdBy: text(typed.createdBy ?? typed.created_by, 120),
  });

  if (error || !spot) {
    return NextResponse.json(
      { error: error ?? "Could not save spot" },
      { status: 500 },
    );
  }

  return NextResponse.json({ spot });
}
