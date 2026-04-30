import { CompanyDashboardPage } from "@/components/company/CompanyDashboardPage";
import { listCompanyEvents, listCompanySpots } from "@/lib/supabase/company";

export const dynamic = "force-dynamic";

export default async function CompanyPage() {
  const [spots, events] = await Promise.all([
    listCompanySpots(),
    listCompanyEvents(),
  ]);

  return <CompanyDashboardPage initialSpots={spots} initialEvents={events} />;
}
