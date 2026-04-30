import { NextResponse } from "next/server";
import { addSpotInterest } from "@/lib/supabase/company";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
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

  const spotId = typeof body.spot_id === "string" ? body.spot_id : null;
  const userKey = typeof body.user_key === "string" ? body.user_key : null;

  if (!spotId || !userKey) {
    return NextResponse.json(
      { error: "spot_id and user_key are required" },
      { status: 400 },
    );
  }

  const { error } = await addSpotInterest({ spotId, userKey });
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
