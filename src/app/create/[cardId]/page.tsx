import { notFound } from "next/navigation";
import { CreateCardFlow } from "@/components/create/CreateCardFlow";
import { getMockCardById } from "@/data/mockCards";

type Props = {
  params: Promise<{ cardId: string }>;
};

/**
 * Compose flow for one template. Invalid ids 404 until Supabase-backed lookup exists.
 */
export default async function CreatePage({ params }: Props) {
  const { cardId } = await params;
  const card = getMockCardById(cardId);
  if (!card) notFound();

  return <CreateCardFlow card={card} />;
}
