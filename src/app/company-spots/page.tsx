import { CompanySpotsPage } from "@/components/company/CompanySpotsPage";
import { listCompanyEvents, listCompanySpots } from "@/lib/supabase/company";

export const dynamic = "force-dynamic";

export default async function CompanySpotsRoute() {
  const [spots, events] = await Promise.all([
    listCompanySpots(),
    listCompanyEvents(),
  ]);

  return <CompanySpotsPage initialSpots={spots} initialEvents={events} />;
}
