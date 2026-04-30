export function getAnonymousUserKey() {
  const storageKey = "near_dear_user_key";
  const saved = window.localStorage.getItem(storageKey);
  if (saved) return saved;

  const generated =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem(storageKey, generated);
  return generated;
}
