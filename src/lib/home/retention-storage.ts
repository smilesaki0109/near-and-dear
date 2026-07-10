/**
 * Local-only retention data (important dates, monthly prompt).
 * Replace with Supabase when accounts ship.
 */

export type ImportantDate = {
  id: string;
  label: string;
  date: string; // YYYY-MM-DD
  relationship?: string;
};

const DATES_KEY = "near_dear_important_dates";
const MONTHLY_KEY = "near_dear_monthly_prompt_seen";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadImportantDates(): ImportantDate[] {
  if (typeof window === "undefined") return [];
  return safeParse<ImportantDate[]>(
    window.localStorage.getItem(DATES_KEY),
    [],
  );
}

export function saveImportantDates(dates: ImportantDate[]): void {
  window.localStorage.setItem(DATES_KEY, JSON.stringify(dates));
}

export function addImportantDate(
  entry: Omit<ImportantDate, "id">,
): ImportantDate[] {
  const next: ImportantDate = {
    ...entry,
    id: crypto.randomUUID(),
  };
  const dates = [...loadImportantDates(), next];
  saveImportantDates(dates);
  return dates;
}

export function removeImportantDate(id: string): ImportantDate[] {
  const dates = loadImportantDates().filter((d) => d.id !== id);
  saveImportantDates(dates);
  return dates;
}

/** Suggested monthly one-liner — rotates by calendar month. */
export function monthlyFamilyPrompt(locale: "en" | "ja" | "tl"): string {
  const month = new Date().getMonth();
  const prompts = {
    en: [
      "I'm doing okay here. The weather changed, and I thought of you.",
      "Work was busy, but I saved a little smile for you today.",
      "I tried something new in Japan this month — wish you could see it.",
      "Some days are hard, but your photo on my phone helps.",
      "Thank you for waiting for me. I'm still on my way.",
      "The cherry blossoms / autumn leaves reminded me of home.",
      "I cooked a little taste of home in my kitchen here.",
      "I got paid today and thought of what I want to send you.",
      "I miss our ordinary days together.",
      "I'm learning, growing, and thinking of you.",
      "Winter is coming — stay warm over there.",
      "Another month passed. I'm proud we keep going.",
    ],
    ja: [
      "元気にしているよ。季節が変わって、あなたのことを思い出した。",
      "仕事は忙しかったけど、今日はあなたのことを想って過ごした。",
      "今月、日本で新しいことを体験した。見せてあげたいな。",
      "つらい日もあるけど、あなたの写真を見ると力が出る。",
      "待っていてくれてありがとう。まだまだ頑張るね。",
      "桜／紅葉を見て、ふるさとを思い出した。",
      "日本のキッチンで、少し故郷の味を作ってみた。",
      "お給料日。あなたに届けたいものを考えた。",
      "いつもの日々が恋しい。",
      "学んで、成長して、あなたのことを想っている。",
      "寒くなってきた。向こうも体調に気をつけて。",
      "また一ヶ月。一緒にがんばろうね。",
    ],
    tl: [
      "Okay lang ako dito. Nagbago ang panahon, naalala kita.",
      "Busy ang work, pero naisip kita today.",
      "May bago akong natry sa Japan ngayong buwan — sana makita mo.",
      "May mahirap na araw, pero nakakatulong ang photo mo.",
      "Salamat sa paghihintay. Patuloy pa rin ako.",
      "Naalala kita nang makakita ng sakura / dahon.",
      "Nagluto ako ng konting lasa ng tahanan dito.",
      "Sahod day — naisip kita agad.",
      "Miss ko ang ordinary days natin.",
      "Natututo ako, lumalago, at iniisip kita.",
      "Malamig na — ingat ka diyan.",
      "Isa na namang buwan. Tuloy lang tayo.",
    ],
  };
  return prompts[locale][month % prompts[locale].length];
}

export function markMonthlyPromptSeen(): void {
  const key = `${MONTHLY_KEY}_${new Date().getFullYear()}_${new Date().getMonth()}`;
  window.localStorage.setItem(key, "1");
}

export function hasSeenMonthlyPromptThisMonth(): boolean {
  const key = `${MONTHLY_KEY}_${new Date().getFullYear()}_${new Date().getMonth()}`;
  return window.localStorage.getItem(key) === "1";
}
