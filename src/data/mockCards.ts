/**
 * Static card templates for Phase 1 (browse UI).
 * Later: replace with rows from Supabase `card_templates` (or a single table).
 */

export type CardCategory =
  | "encouragement"
  | "birthday"
  | "gratitude"
  | "missing_home"
  | "new_chapter";

export type MockCard = {
  id: string;
  category: CardCategory;
  titleEn: string;
  titleJa: string;
  /** Tailwind gradient classes for the preview area (no external images in Phase 1) */
  gradientClass: string;
};

export const mockCards: MockCard[] = [
  {
    id: "1",
    category: "encouragement",
    titleEn: "You’re doing better than you think",
    titleJa: "あなたは思っているより、よくがんばっています",
    gradientClass: "from-[#e8dff5] via-[#f5e8f8] to-[#fdecef]",
  },
  {
    id: "2",
    category: "birthday",
    titleEn: "Celebrating you today",
    titleJa: "きょうはあなたの日",
    gradientClass: "from-[#fde2e4] via-[#fce4ec] to-[#e8dff5]",
  },
  {
    id: "3",
    category: "gratitude",
    titleEn: "Thank you for being there",
    titleJa: "そばにいてくれてありがとう",
    gradientClass: "from-[#d9f2e3] via-[#e8f5e9] to-[#fff8f0]",
  },
  {
    id: "4",
    category: "missing_home",
    titleEn: "Thinking of home with you",
    titleJa: "ふるさとのことを、いっしょに思います",
    gradientClass: "from-[#dceefb] via-[#e8f0fe] to-[#f3e8ff]",
  },
  {
    id: "5",
    category: "new_chapter",
    titleEn: "Brave new step",
    titleJa: "あたらしい一歩を、ほめたい",
    gradientClass: "from-[#fff3e0] via-[#ffe8e0] to-[#f5e6ff]",
  },
  {
    id: "6",
    category: "encouragement",
    titleEn: "Rest is part of strength",
    titleJa: "やすむことも、つよさのひとつ",
    gradientClass: "from-[#e0f4f1] via-[#eef6ff] to-[#fce4ec]",
  },
];

/** Resolve a browse card by id (used by /create/[cardId] until Supabase backs this). */
export function getMockCardById(id: string): MockCard | undefined {
  return mockCards.find((c) => c.id === id);
}
