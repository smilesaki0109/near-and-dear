import type { JapanMapPost } from "@/types/map";
import { createSupabaseAdmin } from "@/lib/supabase/server-admin";

type JapanMapPostRow = {
  id: string;
  category: string;
  title: string;
  description: string | null;
  x: number;
  y: number;
  image_url: string | null;
  created_at: string;
};

function rowToJapanMapPost(row: JapanMapPostRow): JapanMapPost {
  return {
    id: row.id,
    category:
      row.category === "place" ||
      row.category === "culture" ||
      row.category === "daily_life"
        ? row.category
        : "food",
    title: row.title,
    description: row.description,
    x: Number(row.x),
    y: Number(row.y),
    imageUrl: row.image_url,
    createdAt: row.created_at,
  };
}

export async function listJapanMapPosts(): Promise<JapanMapPost[]> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    console.error("[map-posts] Supabase admin client is not configured");
    return [];
  }

  const { data, error } = await supabase
    .from("map_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("[map-posts] Failed to list posts", {
      message: error.message,
    });
    return [];
  }

  return (data as JapanMapPostRow[]).map(rowToJapanMapPost);
}

export async function createJapanMapPost(params: {
  category: JapanMapPost["category"];
  title: string;
  description: string | null;
  x: number;
  y: number;
  imageUrl: string | null;
}): Promise<{ post: JapanMapPost | null; error: string | null }> {
  const supabase = createSupabaseAdmin();
  if (!supabase) {
    return { post: null, error: "Supabase is not configured" };
  }

  const { data, error } = await supabase
    .from("map_posts")
    .insert({
      category: params.category,
      title: params.title,
      description: params.description,
      x: params.x,
      y: params.y,
      image_url: params.imageUrl,
    })
    .select("*")
    .single();

  if (error) {
    if (error.message.includes("public.map_posts")) {
      return {
        post: null,
        error:
          "Supabase table public.map_posts is missing. Run supabase/migrations/003_map_posts.sql in the Supabase SQL editor.",
      };
    }
    return { post: null, error: error.message };
  }

  return { post: rowToJapanMapPost(data as JapanMapPostRow), error: null };
}
