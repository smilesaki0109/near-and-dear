/**
 * Share payload used by the read-only /c/[token] UI.
 */
export type ShareRecord = {
  cardId: string;
  message: string;
  locale: "en" | "ja" | "tl";
  photoUrl: string | null;
};
