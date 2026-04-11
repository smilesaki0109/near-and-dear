import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client for Next.js (App Router).
 * Returns null if env vars are missing so Phase 1 can run with mock data only.
 * Later phases will call Supabase after you add .env.local.
 */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key);
}
