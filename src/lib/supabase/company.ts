import type { CompanyEvent, CompanySpot, CompanySpotCategory } from "@/types/company";
import { createSupabaseAdmin } from "@/lib/supabase/server-admin";

type SpotRow = {
  id: string;
  name: string;
  category: string;
  comment: string | null;
  image_url: string | null;
  map_x: number | null;
  map_y: number | null;
  lat: number | null;
  lng: number | null;
  language: string | null;
  created_by: string | null;
  created_at: string;
};

type EventRow = {
  id: string;
  spot_id: string | null;
  title: string;
  description: string | null;
  event_date: string | null;
  event_time: string | null;
  capacity: number | null;
  created_at: string;
  company_spots?: SpotRow | null;
};

type CountRow = {
  spot_id?: string | null;
  event_id?: string | null;
};

const spotCategories: CompanySpotCategory[] = [
  "food",
  "place",
  "culture",
  "nature",
  "comfort",
];

function toCategory(value: string): CompanySpotCategory {
  return spotCategories.includes(value as CompanySpotCategory)
    ? (value as CompanySpotCategory)
    : "food";
}

function toLanguage(value: string | null): CompanySpot["language"] {
  return value === "ja" || value === "tl" ? value : "en";
}

function makeCountMap(rows: CountRow[], key: "spot_id" | "event_id") {
  return rows.reduce<Map<string, number>>((map, row) => {
    const id = row[key];
    if (!id) return map;
    map.set(id, (map.get(id) ?? 0) + 1);
    return map;
  }, new Map<string, number>());
}

function rowToSpot(row: SpotRow, interestCount = 0): CompanySpot {
  return {
    id: row.id,
    name: row.name,
    category: toCategory(row.category),
    comment: row.comment,
    imageUrl: row.image_url,
    mapX: row.map_x == null ? null : Number(row.map_x),
    mapY: row.map_y == null ? null : Number(row.map_y),
    lat: row.lat == null ? null : Number(row.lat),
    lng: row.lng == null ? null : Number(row.lng),
    language: toLanguage(row.language),
    createdBy: row.created_by,
    createdAt: row.created_at,
    interestCount,
  };
}

function rowToEvent(row: EventRow, participantCount = 0): CompanyEvent {
  return {
    id: row.id,
    spotId: row.spot_id,
    title: row.title,
    description: row.description,
    eventDate: row.event_date,
    eventTime: row.event_time,
    capacity: row.capacity,
    createdAt: row.created_at,
    participantCount,
    spot: row.company_spots ? rowToSpot(row.company_spots) : null,
  };
}

export async function listCompanySpots(): Promise<CompanySpot[]> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];

  const [{ data: spots, error }, { data: interests }] = await Promise.all([
    supabase
      .from("company_spots")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("spot_interests").select("spot_id"),
  ]);

  if (error) {
    console.error("[company-spots] Failed to list spots", { message: error.message });
    return [];
  }

  const counts = makeCountMap((interests ?? []) as CountRow[], "spot_id");
  return ((spots ?? []) as SpotRow[]).map((row) =>
    rowToSpot(row, counts.get(row.id) ?? 0),
  );
}

export async function createCompanySpot(params: {
  name: string;
  category: CompanySpotCategory;
  comment: string | null;
  imageUrl: string | null;
  mapX: number | null;
  mapY: number | null;
  language: CompanySpot["language"];
  createdBy: string | null;
}): Promise<{ spot: CompanySpot | null; error: string | null }> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { spot: null, error: "Supabase is not configured" };

  const { data, error } = await supabase
    .from("company_spots")
    .insert({
      name: params.name,
      category: params.category,
      comment: params.comment,
      image_url: params.imageUrl,
      map_x: params.mapX,
      map_y: params.mapY,
      language: params.language,
      created_by: params.createdBy,
    })
    .select("*")
    .single();

  if (error) return { spot: null, error: error.message };
  return { spot: rowToSpot(data as SpotRow), error: null };
}

export async function addSpotInterest(params: {
  spotId: string;
  userKey: string;
}): Promise<{ error: string | null }> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { error: "Supabase is not configured" };

  const { error } = await supabase.from("spot_interests").upsert(
    {
      spot_id: params.spotId,
      user_key: params.userKey,
    },
    { onConflict: "spot_id,user_key", ignoreDuplicates: true },
  );

  return { error: error?.message ?? null };
}

export async function listCompanyEvents(): Promise<CompanyEvent[]> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return [];

  const [{ data: events, error }, { data: participants }] = await Promise.all([
    supabase
      .from("company_events")
      .select("*, company_spots(*)")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("event_participants").select("event_id"),
  ]);

  if (error) {
    console.error("[company-events] Failed to list events", { message: error.message });
    return [];
  }

  const counts = makeCountMap((participants ?? []) as CountRow[], "event_id");
  return ((events ?? []) as EventRow[]).map((row) =>
    rowToEvent(row, counts.get(row.id) ?? 0),
  );
}

export async function createCompanyEvent(params: {
  spotId: string | null;
  title: string;
  description: string | null;
  eventDate: string | null;
  eventTime: string | null;
  capacity: number | null;
}): Promise<{ event: CompanyEvent | null; error: string | null }> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { event: null, error: "Supabase is not configured" };

  const { data, error } = await supabase
    .from("company_events")
    .insert({
      spot_id: params.spotId,
      title: params.title,
      description: params.description,
      event_date: params.eventDate,
      event_time: params.eventTime,
      capacity: params.capacity,
    })
    .select("*, company_spots(*)")
    .single();

  if (error) return { event: null, error: error.message };
  return { event: rowToEvent(data as EventRow), error: null };
}

export async function joinCompanyEvent(params: {
  eventId: string;
  userKey: string;
}): Promise<{ error: string | null }> {
  const supabase = createSupabaseAdmin();
  if (!supabase) return { error: "Supabase is not configured" };

  const { error } = await supabase.from("event_participants").upsert(
    {
      event_id: params.eventId,
      user_key: params.userKey,
    },
    { onConflict: "event_id,user_key", ignoreDuplicates: true },
  );

  return { error: error?.message ?? null };
}
