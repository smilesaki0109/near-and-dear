"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CatPawIcon } from "@/components/icons/CatDecorations";
import { CatMapIcon } from "@/components/icons/CatMapIcon";
import { IllustratedJapanMap } from "@/components/map/IllustratedJapanMap";
import { useLanguage } from "@/contexts/LanguageContext";
import type { JapanMapCategory, JapanMapPost } from "@/types/map";

type Props = {
  initialPosts: JapanMapPost[];
};

type FormState = {
  category: JapanMapCategory;
  title: string;
  description: string;
  x: string;
  y: string;
  imageUrl: string;
};

const categories: JapanMapCategory[] = [
  "food",
  "place",
  "culture",
  "daily_life",
];

const categoryLabels: Record<JapanMapCategory, string> = {
  food: "Food",
  place: "Place",
  culture: "Culture",
  daily_life: "Daily Life",
};

const categoryEmoji: Record<JapanMapCategory, string> = {
  food: "🍜",
  place: "🗻",
  culture: "🎎",
  daily_life: "🌿",
};

function postEmoji(post: Pick<JapanMapPost, "category" | "title">): string {
  const title = post.title.toLowerCase();
  if (title.includes("onigiri") || title.includes("rice")) return "🍙";
  if (title.includes("takoyaki")) return "🐙";
  if (title.includes("okinawa") || title.includes("ocean")) return "🌊";
  if (title.includes("kyoto") || title.includes("temple")) return "🏯";
  return categoryEmoji[post.category];
}

const categoryStyle: Record<JapanMapCategory, string> = {
  food: "bg-[#fff0f4] text-[#d45f7e]",
  place: "bg-[#eef7ff] text-[#4d8fd8]",
  culture: "bg-[var(--primary-soft)] text-[var(--primary-deep)]",
  daily_life: "bg-[#effaf4] text-[#4f956a]",
};

const samplePosts: JapanMapPost[] = [
  {
    id: "sample-sapporo-seafood",
    category: "food",
    title: "Seafood in Sapporo",
    description: "The seafood here is amazing!",
    x: 72,
    y: 16,
    imageUrl: null,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "sample-niigata-onigiri",
    category: "food",
    title: "Onigiri in Niigata",
    description: "Rice tastes extra comforting here.",
    x: 56,
    y: 38,
    imageUrl: null,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "sample-tokyo-ramen",
    category: "food",
    title: "Ramen shops in Tokyo",
    description: "Warm bowls after work make me happy.",
    x: 66,
    y: 55,
    imageUrl: null,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "sample-kyoto-temples",
    category: "culture",
    title: "Kyoto temples",
    description: "Beautiful temples and gardens.",
    x: 48,
    y: 71,
    imageUrl: null,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "sample-osaka-takoyaki",
    category: "food",
    title: "Takoyaki in Osaka",
    description: "My comfort food with friends.",
    x: 38,
    y: 83,
    imageUrl: null,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "sample-fuji-sky",
    category: "place",
    title: "Mt. Fuji sky",
    description: "A view that makes the day feel special.",
    x: 61,
    y: 64,
    imageUrl: null,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "sample-setouchi-islands",
    category: "place",
    title: "Setouchi islands",
    description: "Quiet blue views between small islands.",
    x: 28,
    y: 69,
    imageUrl: null,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "sample-nagano-mountains",
    category: "place",
    title: "Nagano mountains",
    description: "Fresh air and peaceful weekends.",
    x: 55,
    y: 50,
    imageUrl: null,
    createdAt: new Date(0).toISOString(),
  },
  {
    id: "sample-okinawa-ocean",
    category: "place",
    title: "Okinawa ocean",
    description: "The water feels so clear and gentle.",
    x: 16,
    y: 88,
    imageUrl: null,
    createdAt: new Date(0).toISOString(),
  },
];

const copy = {
  en: {
    eyebrow: "Japan Map",
    title: "What foreigners actually love in Japan",
    subtitle:
      "A playful map for the foods, places, culture, and daily joys people discover while living here.",
    mapHint: "Click anywhere on the illustrated map to choose a spot.",
    selectedPoint: "Selected spot",
    formTitle: "Share what YOU love about Japan!",
    formBody: "Add a place, food, culture, or anything that makes you happy.",
    titleLabel: "Title",
    category: "Category",
    description: "Tell us more!",
    x: "Map X",
    y: "Map Y",
    imageUrl: "Image URL (optional)",
    submit: "Post",
    saving: "Saving...",
    emptyNote: "Sample pins are shown until the first real post arrives.",
    recent: "Map posts",
    success: "Added to Japan Map.",
    error: "We couldn’t save that. Please try again.",
  },
  ja: {
    eyebrow: "Japan Map",
    title: "外国人が日本で本当に好きになったもの",
    subtitle:
      "日本で見つけた食べ物、場所、文化、日常の小さな好きにピンを立てる、楽しいマップです。",
    mapHint: "イラスト地図をクリックすると投稿位置を選べます。",
    selectedPoint: "選択中の位置",
    formTitle: "あなたの好きな日本を投稿しよう！",
    formBody: "場所、食べ物、文化、うれしかった体験を気軽に共有してください。",
    titleLabel: "タイトル",
    category: "カテゴリ",
    description: "コメント",
    x: "Map X",
    y: "Map Y",
    imageUrl: "画像URL（任意）",
    submit: "Post",
    saving: "保存中...",
    emptyNote: "まだ投稿がないため、サンプルピンを表示しています。",
    recent: "マップ投稿",
    success: "Japan Mapに追加しました。",
    error: "保存できませんでした。もう一度お試しください。",
  },
  tl: {
    eyebrow: "Japan Map",
    title: "Mga totoong paborito ng foreigners sa Japan",
    subtitle:
      "Isang playful map para sa pagkain, lugar, culture, at maliliit na saya habang naninirahan dito.",
    mapHint: "I-tap ang illustrated map para pumili ng spot.",
    selectedPoint: "Napiling spot",
    formTitle: "I-share ang gusto mo sa Japan!",
    formBody: "Magdagdag ng place, food, culture, o kahit anong nagpapasaya sa iyo.",
    titleLabel: "Title",
    category: "Category",
    description: "Kuwento pa",
    x: "Map X",
    y: "Map Y",
    imageUrl: "Image URL (optional)",
    submit: "Post",
    saving: "Saving...",
    emptyNote: "Sample pins muna ang makikita hanggang may unang real post.",
    recent: "Map posts",
    success: "Naidagdag sa Japan Map.",
    error: "Hindi namin ma-save. Subukan ulit.",
  },
} as const;

function cleanForm(): FormState {
  return {
    category: "food",
    title: "",
    description: "",
    x: "",
    y: "",
    imageUrl: "",
  };
}

function areaName(x: string, y: string): string {
  const px = Number(x);
  const py = Number(y);
  if (!Number.isFinite(px) || !Number.isFinite(py)) return "";
  if (py < 30 && px > 52) return "Hokkaido area";
  if (px > 56 && py > 46 && py < 68) return "Tokyo area";
  if (px > 38 && px < 54 && py > 52 && py < 76) return "Kansai area";
  if (px < 34 && py > 58) return "Kyushu area";
  return "Japan area";
}

export function JapanMapPage({ initialPosts }: Props) {
  const { locale, setLocale } = useLanguage();
  const t = copy[locale];
  const mobileTitle =
    locale === "ja"
      ? "小さな好きで見る日本"
      : locale === "tl"
        ? "Japan sa maliliit na paborito"
        : "Japan, through tiny loves";
  const mobileSubtitle =
    locale === "ja"
      ? "地図をタップして、好きな瞬間をひとつだけ。"
      : locale === "tl"
        ? "I-tap ang map at mag-share ng isang paborito."
        : "Tap the map and share one thing you love.";
  const mobileFormTitle =
    locale === "ja"
      ? "好きな瞬間を追加"
      : locale === "tl"
        ? "Idagdag ang moment mo"
        : "Add your moment";

  const [posts, setPosts] = useState<JapanMapPost[]>(initialPosts);
  const [form, setForm] = useState<FormState>(() => cleanForm());
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const visiblePosts = useMemo(
    () => (posts.length > 0 ? posts : samplePosts),
    [posts],
  );
  const showingSamples = posts.length === 0;
  const selectedPoint =
    form.x && form.y ? { x: Number(form.x), y: Number(form.y) } : null;

  function setPoint(point: { x: number; y: number }) {
    setForm((prev) => ({
      ...prev,
      x: point.x.toFixed(2),
      y: point.y.toFixed(2),
    }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setIsSaving(true);

    try {
      const res = await fetch("/api/map-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: form.category,
          title: form.title,
          description: form.description,
          x: form.x,
          y: form.y,
          imageUrl: form.imageUrl,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        post?: JapanMapPost;
        error?: string;
      };

      if (!res.ok || !data.post) {
        setIsError(true);
        setMessage(data.error || t.error);
        return;
      }

      setPosts((prev) => [data.post as JapanMapPost, ...prev]);
      setForm(cleanForm());
      setMessage(t.success);
    } catch (err) {
      setIsError(true);
      setMessage(err instanceof Error ? err.message : t.error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell locale={locale} onLocaleChange={setLocale}>
      <div className="mx-auto max-w-6xl pb-16">
        <div className="space-y-5 md:hidden">
          <section className="relative -mx-2 overflow-hidden rounded-3xl border border-white/80 bg-white/72 p-4 shadow-[0_16px_38px_rgba(54,47,61,0.10)] ring-1 ring-white/80 backdrop-blur-md">
            <div
              className="pointer-events-none absolute -right-16 top-12 h-64 w-64 rotate-6 bg-contain bg-center bg-no-repeat opacity-[0.06] blur-[1px]"
              style={{ backgroundImage: "url('/images/japan-map.png')" }}
              aria-hidden
            />
            <CatPawIcon className="pointer-events-none absolute right-4 top-4 h-9 w-9 rotate-12 opacity-70" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/72 ring-1 ring-white/80">
                <CatMapIcon className="h-12 w-12" />
              </div>
              <div className="min-w-0 space-y-2">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--primary-deep)]/70">
                  {t.eyebrow}
                </p>
                <h1 className="text-[1.55rem] font-semibold leading-[1.12] tracking-[-0.03em] text-[var(--text)]">
                  {mobileTitle}
                </h1>
                <p className="max-w-[15rem] text-sm leading-relaxed text-[var(--text-muted)]">
                  {mobileSubtitle}
                </p>
              </div>
            </div>
            <div className="relative mt-4">
              <a
                href="#japan-map-form"
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[#b58ad6] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(149,120,198,0.24)] transition active:scale-95"
              >
                {mobileFormTitle}
              </a>
            </div>
            <div className="relative -mx-4 mt-5 overflow-hidden rounded-[32px] bg-[#f8f5f2] shadow-[0_18px_42px_rgba(54,47,61,0.12)] ring-1 ring-white/80">
              <IllustratedJapanMap
                posts={visiblePosts}
                selectedPoint={selectedPoint}
                onPickPoint={setPoint}
              />
            </div>
            <p className="relative mt-3 rounded-2xl bg-[var(--primary-soft)]/65 px-4 py-2.5 text-xs font-semibold leading-relaxed text-[var(--primary-deep)]">
              {selectedPoint
                ? `${t.selectedPoint}: ${areaName(form.x, form.y)}`
                : t.mapHint}
            </p>
          </section>

          <form
            id="japan-map-form"
            className="space-y-5 rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_14px_34px_rgba(54,47,61,0.09)] ring-1 ring-white/80 backdrop-blur-md"
            onSubmit={(e) => void submit(e)}
          >
            <div className="space-y-2">
              <h2 className="text-xl font-semibold leading-tight text-[var(--text)]">
                {mobileFormTitle}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--text-muted)]">
                {locale === "en"
                  ? "A short title is enough."
                  : locale === "tl"
                    ? "Kahit maikling title lang, okay na."
                    : "短いタイトルだけでも大丈夫です。"}
              </p>
            </div>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]/75">
                {t.titleLabel}
              </span>
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                className="h-13 w-full rounded-2xl border border-white/85 bg-white/82 px-4 text-sm shadow-sm placeholder:text-[var(--text-muted)]/45 focus:border-[var(--primary)]/45 focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70 focus:shadow-[0_10px_24px_rgba(149,120,198,0.12)]"
                placeholder="Best ramen in Tokyo"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]/75">
                {t.category}
              </span>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    category: e.target.value as JapanMapCategory,
                  }))
                }
                className="h-13 w-full rounded-2xl border border-white/85 bg-white/82 px-4 text-sm shadow-sm focus:border-[var(--primary)]/45 focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70 focus:shadow-[0_10px_24px_rgba(149,120,198,0.12)]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {categoryEmoji[category]} {categoryLabels[category]}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]/75">
                {t.description}
              </span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full resize-y rounded-2xl border border-white/85 bg-white/82 px-4 py-3 text-sm leading-relaxed shadow-sm placeholder:text-[var(--text-muted)]/45 focus:border-[var(--primary)]/45 focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70 focus:shadow-[0_10px_24px_rgba(149,120,198,0.12)]"
                placeholder={t.formBody}
              />
            </label>

            <input type="hidden" value={form.x} readOnly />
            <input type="hidden" value={form.y} readOnly />
            <input type="hidden" value={form.imageUrl} readOnly />

            <button
              type="submit"
              disabled={isSaving}
              className="w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[#b58ad6] px-6 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(149,120,198,0.26)] ring-1 ring-white/30 transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSaving
                ? t.saving
                : mobileFormTitle}
            </button>

            {message ? (
              <p
                className={`rounded-2xl px-4 py-3 text-center text-sm ${
                  isError
                    ? "bg-[var(--accent-peach)]/25 text-[#87483f]"
                    : "bg-[var(--accent-mint)]/35 text-[#4d755d]"
                }`}
                role={isError ? "alert" : "status"}
              >
                {message}
              </p>
            ) : null}
          </form>
        </div>

        <section className="hidden overflow-hidden rounded-[var(--radius-xl)] border border-white/80 bg-[#f8f5f2] p-3 shadow-[var(--shadow-hover)] ring-1 ring-white/80 md:block">
          <IllustratedJapanMap
            posts={visiblePosts}
            selectedPoint={selectedPoint}
            onPickPoint={setPoint}
          />
        </section>

        <div className="mt-6 hidden rounded-[var(--radius-xl)] border border-white/70 bg-white/70 p-6 shadow-[var(--shadow-soft)] backdrop-blur-md md:block md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-start">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[var(--primary-deep)]/85">
                {t.eyebrow}
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] text-[var(--text)] md:text-5xl">
                {t.title}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                {t.subtitle}
              </p>
              <p className="mt-4 rounded-full bg-[var(--primary-soft)] px-4 py-2 text-xs font-semibold text-[var(--primary-deep)]">
                {selectedPoint
                  ? `${t.selectedPoint}: ${areaName(form.x, form.y)} (${form.x}, ${form.y})`
                  : t.mapHint}
              </p>
            </div>

            <form className="space-y-4" onSubmit={(e) => void submit(e)}>
              <div>
                <h2 className="text-xl font-semibold text-[var(--text)]">
                  {t.formTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  {t.formBody}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {t.titleLabel}
                  </span>
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="mt-2 w-full rounded-[var(--radius-md)] border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[var(--shadow-soft)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
                    placeholder="Best ramen in Tokyo"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-[var(--text)]">
                    {t.category}
                  </span>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value as JapanMapCategory,
                      }))
                    }
                    className="mt-2 w-full rounded-[var(--radius-md)] border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[var(--shadow-soft)] focus:border-[var(--primary)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {categoryEmoji[category]} {categoryLabels[category]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <textarea
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full resize-y rounded-[var(--radius-md)] border border-white/80 bg-white/75 px-4 py-3 text-sm leading-relaxed shadow-[var(--shadow-soft)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
                placeholder={t.description}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                <input
                  required
                  inputMode="decimal"
                  value={form.x}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, x: e.target.value }))
                  }
                  className="rounded-[var(--radius-md)] border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[var(--shadow-soft)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
                  placeholder={t.x}
                />
                <input
                  required
                  inputMode="decimal"
                  value={form.y}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, y: e.target.value }))
                  }
                  className="rounded-[var(--radius-md)] border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[var(--shadow-soft)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)]"
                  placeholder={t.y}
                />
                <input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  className="rounded-[var(--radius-md)] border border-white/80 bg-white/75 px-4 py-3 text-sm shadow-[var(--shadow-soft)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)]/35 focus:outline-none focus:ring-2 focus:ring-[var(--primary-soft)] sm:col-span-3"
                  placeholder={t.imageUrl}
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-hover)] ring-1 ring-white/30 transition hover:brightness-[1.03] active:scale-95 disabled:cursor-not-allowed disabled:opacity-65"
              >
                🛫 {isSaving ? t.saving : t.submit}
              </button>

              {message ? (
                <p
                  className={`rounded-[var(--radius-md)] px-4 py-3 text-center text-sm ${
                    isError
                      ? "bg-[var(--accent-peach)]/25 text-[#87483f]"
                      : "bg-[var(--accent-mint)]/35 text-[#4d755d]"
                  }`}
                  role={isError ? "alert" : "status"}
                >
                  {message}
                </p>
              ) : null}
            </form>
          </div>
        </div>

        <section className="mt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text)]">
                {t.recent}
              </h2>
              {showingSamples ? (
                <p className="mt-2 text-sm text-[var(--text-muted)]">
                  {t.emptyNote}
                </p>
              ) : null}
            </div>
            <p className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-white/80">
              {visiblePosts.length} pins
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {visiblePosts.map((post) => (
              <article
                key={post.id}
                className="overflow-hidden rounded-[var(--radius-xl)] border border-white/70 bg-white/65 shadow-[var(--shadow-soft)] ring-1 ring-white/80 backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]"
              >
                <div className="grid sm:grid-cols-[130px_1fr]">
                  <div
                    className="min-h-28 bg-gradient-to-br from-[var(--primary-soft)] via-white to-[var(--accent-cream)] sm:min-h-full"
                    style={
                      post.imageUrl
                        ? {
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.1)), url(${post.imageUrl})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                          }
                        : undefined
                    }
                    aria-hidden
                  >
                    {!post.imageUrl ? (
                      <div className="flex h-full min-h-28 items-center justify-center text-4xl">
                        {postEmoji(post)}
                      </div>
                    ) : null}
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryStyle[post.category]}`}>
                        {postEmoji(post)} {categoryLabels[post.category]}
                      </span>
                      <span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-[var(--primary-deep)] ring-1 ring-white/90">
                        {areaName(String(post.x), String(post.y))}
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-semibold leading-snug text-[var(--text)]">
                      {post.title}
                    </h3>
                    {post.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                        {post.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
