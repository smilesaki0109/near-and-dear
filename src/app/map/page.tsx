import { JapanMapPage } from "@/components/map/JapanMapPage";
import { listJapanMapPosts } from "@/lib/supabase/map-posts";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const posts = await listJapanMapPosts();
  return <JapanMapPage initialPosts={posts} />;
}
