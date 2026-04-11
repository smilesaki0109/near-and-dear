import { notFound } from "next/navigation";
import { SharedCardScreen } from "@/components/share/SharedCardScreen";
import { getMockCardById } from "@/data/mockCards";
import { getShareByToken } from "@/lib/shareMemoryStore";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string }>;
};

/**
 * Public read-only card at a share token. Data comes from the in-memory store (Phase 3 mock).
 */
export default async function SharedCardPage({ params }: Props) {
  const { token } = await params;
  const share = getShareByToken(token);
  if (!share) notFound();

  const card = getMockCardById(share.cardId);
  if (!card) notFound();

  return <SharedCardScreen card={card} share={share} />;
}
