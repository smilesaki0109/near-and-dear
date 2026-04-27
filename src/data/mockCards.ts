/**
 * Static card templates for Phase 1 (browse UI).
 * Later: replace with rows from Supabase `card_templates` (or a single table).
 */

export type CardCategory =
  | "encouragement"
  | "birthday"
  | "gratitude"
  | "missing_home"
  | "new_chapter"
  | "japan";

export type MockCard = {
  id: string;
  category: CardCategory;
  titleEn: string;
  titleJa: string;
  image: string;
  gradientClass: string;
};

export const mockCards: MockCard[] = [
  {
    id: "1",
    category: "japan",
    titleEn: "Good luck is on your side",
    titleJa: "いいことが起こりますように",
    image: "/cards/japan_pop_luckycat.png",
    gradientClass: "from-[#ff9a9e] via-[#fad0c4] to-[#fad0c4]",
  },
  {
    id: "2",
    category: "japan",
    titleEn: "Shine your day",
    titleJa: "あなたの一日が輝きますように",
    image: "/cards/japan_pop_fuji_sun.png",
    gradientClass: "from-[#fddb92] via-[#d1fdff] to-[#c2e9fb]",
  },
  {
    id: "3",
    category: "japan",
    titleEn: "Enjoy the moment in Tokyo",
    titleJa: "この瞬間を楽しんで",
    image: "/cards/japan_pop_tokyo_city.png",
    gradientClass: "from-[#a1c4fd] via-[#c2e9fb] to-[#fbc2eb]",
  },
  {
    id: "4",
    category: "encouragement",
    titleEn: "You’re doing better than you think",
    titleJa: "あなたは思っているより、よくがんばっています",
    image: "/cards/effort.png",
    gradientClass: "from-[#e8dff5] via-[#f5e8f8] to-[#fdecef]",
  },
  {
    id: "5",
    category: "birthday",
    titleEn: "Celebrating you today",
    titleJa: "きょうはあなたの日",
    image: "/cards/birthday.png",
    gradientClass: "from-[#fde2e4] via-[#fce4ec] to-[#e8dff5]",
  },
  {
    id: "6",
    category: "gratitude",
    titleEn: "Thank you for being there",
    titleJa: "そばにいてくれてありがとう",
    image: "/cards/cat.png",
    gradientClass: "from-[#d9f2e3] via-[#e8f5e9] to-[#fff8f0]",
  },
  {
    id: "7",
    category: "missing_home",
    titleEn: "Thinking of home with you",
    titleJa: "ふるさとのことを、いっしょに思います",
    image: "/cards/matcha.png",
    gradientClass: "from-[#dceefb] via-[#e8f0fe] to-[#f3e8ff]",
  },
  {
    id: "8",
    category: "new_chapter",
    titleEn: "Brave new step",
    titleJa: "あたらしい一歩を、ほめたい",
    image: "/cards/sakura.png",
    gradientClass: "from-[#fff3e0] via-[#ffe8e0] to-[#f5e6ff]",
  },
  {
    id: "9",
    category: "encouragement",
    titleEn: "Rest is part of strength",
    titleJa: "やすむことも、つよさのひとつ",
    image: "/cards/effort.png",
    gradientClass: "from-[#e0f4f1] via-[#eef6ff] to-[#fce4ec]",
  },
  {
    id: "10",
    category: "japan",
    titleEn: "A quiet moment together",
    titleJa: "静かな時間を、いっしょに",
    image: "/cards/japan_couple_window.png",
    gradientClass: "from-[#f5e6ff] via-[#e8f0fe] to-[#fff8f0]",
  },
  {
    id: "11",
    category: "japan",
    titleEn: "Peace by the lake",
    titleJa: "湖のほとりのやすらぎ",
    image: "/cards/japan_fuji_lake.png",
    gradientClass: "from-[#dceefb] via-[#e8f0fe] to-[#f3e8ff]",
  },
  {
    id: "12",
    category: "japan",
    titleEn: "A gentle presence",
    titleJa: "やさしく寄り添う気配",
    image: "/cards/japan_kimono_woman.png",
    gradientClass: "from-[#fde2e4] via-[#fce4ec] to-[#e8dff5]",
  },
  {
    id: "13",
    category: "japan",
    titleEn: "Warm lights in winter",
    titleJa: "冬のあたたかな灯り",
    image: "/cards/japan_snow_village.png",
    gradientClass: "from-[#e0f4f1] via-[#eef6ff] to-[#fce4ec]",
  },
  {
    id: "14",
    category: "japan",
    titleEn: "Walking through time",
    titleJa: "時を歩く",
    image: "/cards/japan_street.png",
    gradientClass: "from-[#fff3e0] via-[#ffe8e0] to-[#f5e6ff]",
  },
  {
    id: "15",
    category: "japan",
    titleEn: "Strength in stillness",
    titleJa: "静けさの中の強さ",
    image: "/cards/japan_torii_water.png",
    gradientClass: "from-[#d9f2e3] via-[#e8f5e9] to-[#fff8f0]",
  },
  {
    id: "16",
    category: "japan",
    titleEn: "A journey with you",
    titleJa: "あなたと進む道",
    image: "/cards/japan_tram_sakura.png",
    gradientClass: "from-[#fdecef] via-[#f5e8f8] to-[#e8dff5]",
  },
  {
    id: "17",
    category: "japan",
    titleEn: "A view just for you",
    titleJa: "あなただけの景色",
    image: "/cards/japan_window_sakura_castle.png",
    gradientClass: "from-[#fce4ec] via-[#fde2e4] to-[#fff3e0]",
  },
];

/** Resolve a browse card by id (used by /create/[cardId] until Supabase backs this). */
export function getMockCardById(id: string): MockCard | undefined {
  return mockCards.find((c) => c.id === id);
}
