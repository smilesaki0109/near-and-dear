import { NextResponse } from "next/server";
import {
  createCompanyEvent,
  listCompanyEvents,
} from "@/lib/supabase/company";

type Body = {
  spotId?: unknown;
  spot_id?: unknown;
  title?: unknown;
  description?: unknown;
  eventDate?: unknown;
  event_date?: unknown;
  eventTime?: unknown;
  event_time?: unknown;
  capacity?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function capacity(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : Number.NaN;
  if (!Number.isInteger(n) || n < 1 || n > 999) return null;
  return n;
}

export async function GET() {
  const events = await listCompanyEvents();
  return NextResponse.json({ events });
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
  const title = text(typed.title, 140);
  if (!title) {
    return NextResponse.json({ error: "Event title is required" }, { status: 400 });
  }

  const { event, error } = await createCompanyEvent({
    spotId: text(typed.spotId ?? typed.spot_id, 80),
    title,
    description: text(typed.description, 500),
    eventDate: text(typed.eventDate ?? typed.event_date, 20),
    eventTime: text(typed.eventTime ?? typed.event_time, 40),
    capacity: capacity(typed.capacity),
  });

  if (error || !event) {
    return NextResponse.json(
      { error: error ?? "Could not create event" },
      { status: 500 },
    );
  }

  return NextResponse.json({ event });
}
