export type JapanMapCategory = "food" | "place" | "culture" | "daily_life";

export type JapanMapPost = {
  id: string;
  category: JapanMapCategory;
  title: string;
  description: string | null;
  x: number;
  y: number;
  imageUrl: string | null;
  createdAt: string;
};
