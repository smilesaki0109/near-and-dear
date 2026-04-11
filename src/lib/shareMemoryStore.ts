/**
 * Temporary in-memory store for shared cards (Phase 3 mock).
 * Survives for the lifetime of one Node process — enough for local dev and demos.
 * Replace with Supabase (or similar) for production; serverless instances do not share RAM.
 */

export type ShareRecord = {
  cardId: string;
  message: string;
  imageBase64: string | null;
  imageMimeType: string | null;
  locale: "en" | "ja";
  createdAt: number;
};

const store = new Map<string, ShareRecord>();

export function createShare(
  payload: Omit<ShareRecord, "createdAt">,
): string {
  const token = crypto.randomUUID();
  store.set(token, { ...payload, createdAt: Date.now() });
  return token;
}

export function getShareByToken(token: string): ShareRecord | undefined {
  return store.get(token);
}
