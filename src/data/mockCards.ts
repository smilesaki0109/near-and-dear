/**
 * Card templates for browse UI — categories aligned with family life abroad.
 */

export type CardCategory =
  | "family_birthday"
  | "parent"
  | "child"
  | "miss_you"
  | "doing_well"
  | "thank_you"
  | "salary_day"
  | "new_beginning"
  | "homesick"
  | "seasonal_japan";

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
    category: "seasonal_japan",
    titleEn: "A little luck from Japan",
    titleJa: "日本からの小さな幸運",
    image: "/cards/japan_pop_luckycat.png",
    gradientClass: "from-[#f5ebe3] via-[#faf6f2] to-[#f0e8f4]",
  },
  {
    id: "2",
    category: "doing_well",
    titleEn: "A good day here in Japan",
    titleJa: "日本で、いい一日でした",
    image: "/cards/japan_pop_fuji_sun.png",
    gradientClass: "from-[#f8f0e6] via-[#faf8f4] to-[#eef4f8]",
  },
  {
    id: "3",
    category: "seasonal_japan",
    titleEn: "Tokyo from my window",
    titleJa: "窓から見える東京",
    image: "/cards/japan_pop_tokyo_city.png",
    gradientClass: "from-[#eef2f8] via-[#f8f6fc] to-[#f5eef2]",
  },
  {
    id: "4",
    category: "salary_day",
    titleEn: "Working hard for us",
    titleJa: "家族のために、がんばっています",
    image: "/cards/effort.png",
    gradientClass: "from-[#eef5f0] via-[#f6faf7] to-[#f5f0f8]",
  },
  {
    id: "5",
    category: "family_birthday",
    titleEn: "Happy birthday, from far away",
    titleJa: "遠くから、お誕生日おめでとう",
    image: "/cards/birthday.png",
    gradientClass: "from-[#faf0f2] via-[#fdf8f6] to-[#f3eef8]",
  },
  {
    id: "6",
    category: "thank_you",
    titleEn: "Thank you for everything",
    titleJa: "いつもありがとう",
    image: "/cards/cat.png",
    gradientClass: "from-[#eef6f1] via-[#f8faf7] to-[#faf6f0]",
  },
  {
    id: "7",
    category: "homesick",
    titleEn: "Missing home today",
    titleJa: "ふるさとが恋しい日",
    image: "/cards/matcha.png",
    gradientClass: "from-[#eef3f8] via-[#f6f8fc] to-[#f2eef8]",
  },
  {
    id: "8",
    category: "new_beginning",
    titleEn: "A new step forward",
    titleJa: "新しい一歩を踏み出した日",
    image: "/cards/sakura.png",
    gradientClass: "from-[#faf4ee] via-[#fdf9f5] to-[#f4eef8]",
  },
  {
    id: "9",
    category: "doing_well",
    titleEn: "I'm doing well in Japan",
    titleJa: "日本で元気にしています",
    image: "/cards/effort.png",
    gradientClass: "from-[#eef6f3] via-[#f8fcfa] to-[#faf2f6]",
  },
  {
    id: "10",
    category: "miss_you",
    titleEn: "I wish you were here",
    titleJa: "会いたい、そばにいてほしい",
    image: "/cards/japan_couple_window.png",
    gradientClass: "from-[#f4eef8] via-[#faf8fc] to-[#faf6f0]",
  },
  {
    id: "11",
    category: "parent",
    titleEn: "To Mom and Dad",
    titleJa: "お母さん・お父さんへ",
    image: "/cards/japan_fuji_lake.png",
    gradientClass: "from-[#eef4fa] via-[#f8fafc] to-[#f2eef6]",
  },
  {
    id: "12",
    category: "seasonal_japan",
    titleEn: "A quiet moment in Japan",
    titleJa: "日本の静かなひととき",
    image: "/cards/japan_kimono_woman.png",
    gradientClass: "from-[#faf0f4] via-[#fdf8fa] to-[#f0eef8]",
  },
  {
    id: "13",
    category: "seasonal_japan",
    titleEn: "Winter lights in Niigata",
    titleJa: "新潟の冬の灯り",
    image: "/cards/japan_snow_village.png",
    gradientClass: "from-[#eef6f4] via-[#f8fcfa] to-[#faf4f8]",
  },
  {
    id: "14",
    category: "seasonal_japan",
    titleEn: "On my way home from work",
    titleJa: "仕事帰りの道のり",
    image: "/cards/japan_street.png",
    gradientClass: "from-[#faf4ee] via-[#fdf9f6] to-[#f2eef8]",
  },
  {
    id: "15",
    category: "seasonal_japan",
    titleEn: "Peace by the shrine",
    titleJa: "神社のほとりのやすらぎ",
    image: "/cards/japan_torii_water.png",
    gradientClass: "from-[#eef6f0] via-[#f8faf7] to-[#faf6f0]",
  },
  {
    id: "16",
    category: "child",
    titleEn: "To my child, with love",
    titleJa: "子どもへ、愛を込めて",
    image: "/cards/japan_tram_sakura.png",
    gradientClass: "from-[#faf2f6] via-[#fdf8fa] to-[#f0eef8]",
  },
  {
    id: "17",
    category: "seasonal_japan",
    titleEn: "Sakura season for you",
    titleJa: "あなたに贈る桜の季節",
    image: "/cards/japan_window_sakura_castle.png",
    gradientClass: "from-[#faf0f4] via-[#fdf8f6] to-[#faf4ee]",
  },
];

export function getMockCardById(id: string): MockCard | undefined {
  return mockCards.find((c) => c.id === id);
}

/** Category metadata for tiles and filters. */
export const categoryMeta: Record<
  CardCategory,
  { labelKey: keyof (typeof import("@/lib/i18n/ui").ui)["en"] }
> = {
  family_birthday: { labelKey: "categoryFamilyBirthday" },
  parent: { labelKey: "categoryParent" },
  child: { labelKey: "categoryChild" },
  miss_you: { labelKey: "categoryMissYou" },
  doing_well: { labelKey: "categoryDoingWell" },
  thank_you: { labelKey: "categoryThankYou" },
  salary_day: { labelKey: "categorySalaryDay" },
  new_beginning: { labelKey: "categoryNewBeginning" },
  homesick: { labelKey: "categoryHomesick" },
  seasonal_japan: { labelKey: "categorySeasonalJapan" },
};
