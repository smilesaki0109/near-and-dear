"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CatCardsIcon } from "@/components/icons/CatCardsIcon";
import { CatHeartIcon, CatPawIcon } from "@/components/icons/CatDecorations";
import { NearDearMascot } from "@/components/icons/NearDearMascot";
import { useLanguage } from "@/contexts/LanguageContext";
import { getAnonymousUserKey } from "@/lib/anonymous-user-key";
import { sampleCompanyEvents, sampleCompanySpots } from "@/lib/company-sample-data";
import type { CompanyEvent, CompanySpot, CompanySpotCategory } from "@/types/company";

type Props = {
  initialSpots: CompanySpot[];
  initialEvents: CompanyEvent[];
};

type SpotForm = {
  name: string;
  category: CompanySpotCategory;
  comment: string;
  imageUrl: string;
};

const EVENT_THRESHOLD = 5;

const categories: CompanySpotCategory[] = [
  "food",
  "place",
  "culture",
  "nature",
  "comfort",
];

const categoryEmoji: Record<CompanySpotCategory, string> = {
  food: "🍜",
  place: "📍",
  culture: "🏮",
  nature: "🌿",
  comfort: "🏡",
};

const copy = {
  en: {
    feature: "Company Spots",
    title: "Find small places to share together",
    subtitle:
      "Share foods, places, and experiences you want to enjoy with coworkers.",
    addSpot: "Add Spot",
    addTitle: "Share a place you want to try",
    addHint: "A short note is enough. This is not a formal report.",
    name: "Spot name",
    category: "Category",
    comment: "Short comment",
    image: "Optional image URL",
    post: "Post this spot",
    mapHint: "Tap the map to choose a soft location for your spot.",
    want: "I want to go",
    wanted: "people want to go",
    ranking: "Most wanted spots",
    candidates: "Event Candidate",
    events: "Upcoming events",
    join: "Join",
    joined: "people joined",
    admin: "Company admin dashboard",
    mobileHeroTitle: "Spots",
    mobileHeroSubtitle: "Find places to go together",
    trending: "🔥 Trending",
    almostEvent: "Almost event — 1 more to go!",
    requestEvent: "Request Event",
    eventRequestSent: "Event request sent",
    mapArea: "Map",
  },
  ja: {
    feature: "みんなの行きたい場所",
    title: "一緒に行きたい場所を見つけよう",
    subtitle: "同僚と楽しみたい食べ物、場所、体験を気軽に共有できます。",
    addSpot: "場所を追加",
    addTitle: "行ってみたい場所を共有する",
    addHint: "短い一言で大丈夫。正式なレポートではありません。",
    name: "場所の名前",
    category: "カテゴリ",
    comment: "短いコメント",
    image: "画像URL（任意）",
    post: "この場所を投稿する",
    mapHint: "地図をタップして、場所の目安を選べます。",
    want: "行きたい",
    wanted: "人が行きたい",
    ranking: "人気の行きたい場所",
    candidates: "イベント候補",
    events: "予定されているイベント",
    join: "参加する",
    joined: "人が参加",
    admin: "会社向けダッシュボード",
    mobileHeroTitle: "Spots",
    mobileHeroSubtitle: "一緒に行ける場所を見つけよう",
    trending: "🔥 トレンド",
    almostEvent: "あと1人でイベント",
    requestEvent: "イベントをリクエスト",
    eventRequestSent: "イベントのリクエストを送りました",
    mapArea: "地図",
  },
  tl: {
    feature: "Mga Lugar na Gustong Puntahan",
    title: "Maghanap ng lugar na puwedeng puntahan nang sama-sama",
    subtitle:
      "Mag-share ng food, places, at experiences na gusto mong ma-enjoy kasama ang coworkers.",
    addSpot: "Add Spot",
    addTitle: "I-share ang lugar na gusto mong puntahan",
    addHint: "Maikling note lang ay okay. Hindi ito formal report.",
    name: "Pangalan ng lugar",
    category: "Category",
    comment: "Maikling comment",
    image: "Optional image URL",
    post: "I-post ang lugar na ito",
    mapHint: "I-tap ang map para pumili ng soft location.",
    want: "I want to go",
    wanted: "ang gustong pumunta",
    ranking: "Most wanted spots",
    candidates: "Event Candidate",
    events: "Upcoming events",
    join: "Join",
    joined: "people joined",
    admin: "Company admin dashboard",
    mobileHeroTitle: "Spots",
    mobileHeroSubtitle: "Find places to go together",
    trending: "🔥 Trending",
    almostEvent: "Almost event — 1 more to go!",
    requestEvent: "Request Event",
    eventRequestSent: "Event request sent",
    mapArea: "Mapa",
  },
} as const;

type CompanySpotsCopy = (typeof copy)[keyof typeof copy];

const categoryLabels: Record<
  "en" | "ja" | "tl",
  Record<CompanySpotCategory, string>
> = {
  en: {
    food: "Food",
    place: "Place",
    culture: "Culture",
    nature: "Nature",
    comfort: "Comfort",
  },
  ja: {
    food: "食べ物",
    place: "場所",
    culture: "文化",
    nature: "自然",
    comfort: "安心",
  },
  tl: {
    food: "Food",
    place: "Place",
    culture: "Culture",
    nature: "Nature",
    comfort: "Comfort",
  },
};

function cleanForm(): SpotForm {
  return {
    name: "",
    category: "food",
    comment: "",
    imageUrl: "",
  };
}

export function CompanySpotsPage({ initialSpots, initialEvents }: Props) {
  const { locale, setLocale } = useLanguage();
  const t = copy[locale];
  const labels = categoryLabels[locale];
  const [spots, setSpots] = useState<CompanySpot[]>(
    initialSpots.length ? initialSpots : sampleCompanySpots,
  );
  const [events, setEvents] = useState<CompanyEvent[]>(
    initialEvents.length ? initialEvents : sampleCompanyEvents,
  );
  const [selectedPoint, setSelectedPoint] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<SpotForm>(() => cleanForm());
  const [message, setMessage] = useState<string | null>(null);
  const [sheetSpot, setSheetSpot] = useState<CompanySpot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (sheetSpot) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetSpot]);

  useEffect(() => {
    if (!toastMessage) return;
    const id = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(id);
  }, [toastMessage]);

  const rankedSpots = useMemo(
    () => [...spots].sort((a, b) => b.interestCount - a.interestCount).slice(0, 5),
    [spots],
  );
  const candidates = useMemo(
    () => spots.filter((spot) => spot.interestCount >= EVENT_THRESHOLD),
    [spots],
  );

  async function addInterest(spot: CompanySpot) {
    setSpots((prev) =>
      prev.map((item) =>
        item.id === spot.id
          ? { ...item, interestCount: item.interestCount + 1 }
          : item,
      ),
    );

    if (spot.id.startsWith("sample-")) return;

    await fetch("/api/company-spots/interest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spot_id: spot.id,
        user_key: getAnonymousUserKey(),
      }),
    });
  }

  function requestEventAction() {
    setToastMessage(t.eventRequestSent);
    setSheetSpot(null);
  }

  async function joinEvent(event: CompanyEvent) {
    setEvents((prev) =>
      prev.map((item) =>
        item.id === event.id
          ? { ...item, participantCount: item.participantCount + 1 }
          : item,
      ),
    );

    if (event.id.startsWith("sample-")) return;

    await fetch("/api/company-events/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_id: event.id,
        user_key: getAnonymousUserKey(),
      }),
    });
  }

  async function submitSpot(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const optimisticSpot: CompanySpot = {
      id: `local-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      comment: form.comment.trim() || null,
      imageUrl: form.imageUrl.trim() || null,
      mapX: selectedPoint?.x ?? 50,
      mapY: selectedPoint?.y ?? 50,
      lat: null,
      lng: null,
      language: locale,
      createdBy: getAnonymousUserKey(),
      createdAt: new Date().toISOString(),
      interestCount: 1,
    };

    setSpots((prev) => [optimisticSpot, ...prev]);
    setForm(cleanForm());
    setShowForm(false);

    const res = await fetch("/api/company-spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: optimisticSpot.name,
        category: optimisticSpot.category,
        comment: optimisticSpot.comment,
        imageUrl: optimisticSpot.imageUrl,
        mapX: optimisticSpot.mapX,
        mapY: optimisticSpot.mapY,
        language: locale,
        createdBy: optimisticSpot.createdBy,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      spot?: CompanySpot;
      error?: string;
    };

    if (data.spot) {
      setSpots((prev) =>
        prev.map((spot) =>
          spot.id === optimisticSpot.id ? { ...data.spot!, interestCount: 1 } : spot,
        ),
      );
      await addInterest(data.spot);
      return;
    }

    if (!res.ok) {
      setMessage(data.error ?? "Could not save spot. Please try again.");
    }
  }

  return (
    <AppShell locale={locale} onLocaleChange={setLocale}>
      <div className="mx-auto max-w-6xl pb-16">
        <header className="relative mb-6 hidden overflow-hidden rounded-[2rem] border border-white/75 bg-gradient-to-br from-white/88 via-[#fff7fb]/80 to-[#eef8ff]/82 p-5 shadow-[0_18px_42px_rgba(54,47,61,0.08)] ring-1 ring-white/80 backdrop-blur-md md:p-8 lg:block">
          <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#f7ddff]/45 blur-2xl" aria-hidden />
          <div className="relative grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
            <div className="flex gap-4">
              <div className="near-dear-mascot-glow flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] bg-white/58 shadow-[var(--shadow-soft)] ring-1 ring-white/85">
                <NearDearMascot className="h-20 w-20" />
              </div>
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--primary-deep)]/70">
                  {t.feature}
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[var(--text)] md:text-4xl">
                  {t.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                  {t.subtitle}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[#b58ad6] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(149,120,198,0.26)] transition active:scale-95"
              >
                {t.addSpot}
              </button>
              <Link
                href="/company"
                className="rounded-full bg-white/78 px-5 py-3 text-sm font-bold text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-white/85 transition active:scale-95"
              >
                {t.admin}
              </Link>
            </div>
          </div>
        </header>

        {/* Mobile: minimal hero + leaderboard-first flow (< lg) */}
        <header className="mb-5 lg:hidden">
          <div className="rounded-[1.35rem] border border-white/75 bg-gradient-to-br from-white/90 via-[#fff8fc]/88 to-[#eef6ff]/85 px-4 py-4 shadow-[var(--shadow-soft)] ring-1 ring-white/80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--text)]">
                  {t.mobileHeroTitle}
                </h1>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{t.mobileHeroSubtitle}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="rounded-full bg-gradient-to-r from-[var(--primary)] to-[#b58ad6] px-3 py-2 text-xs font-bold text-white shadow-md transition active:scale-95"
                >
                  {t.addSpot}
                </button>
                <Link
                  href="/company"
                  className="rounded-full bg-white/78 px-3 py-2 text-center text-xs font-bold text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-white/85 transition active:scale-95"
                >
                  {t.admin}
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-5 lg:hidden">
          <MobileMostWantedSection
            rankedSpots={rankedSpots}
            t={t}
            eventThreshold={EVENT_THRESHOLD}
            onOpenSpot={setSheetSpot}
          />
          <section className="space-y-2">
            <h2 className="px-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--primary-deep)]/65">
              {t.mapArea}
            </h2>
            <CompanyMap
              spots={spots}
              labels={labels}
              selectedPoint={selectedPoint}
              onPickPoint={setSelectedPoint}
              onWant={addInterest}
              wantLabel={t.want}
              compact
            />
          </section>
          <SpotList
            spots={spots}
            labels={labels}
            onWant={addInterest}
            t={t}
            variant="mobileMuted"
          />

          <Panel title={t.candidates} icon={<CatCardsIcon className="h-7 w-7" />}>
            <div className="space-y-3">
              {candidates.map((spot) => (
                <CandidateMiniCard key={spot.id} spot={spot} labels={labels} t={t} />
              ))}
            </div>
          </Panel>

          <Panel title={t.events} icon={<CatHeartIcon className="h-7 w-7" />}>
            <div className="space-y-3">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  joinLabel={t.join}
                  joinedLabel={t.joined}
                  onJoin={joinEvent}
                />
              ))}
            </div>
          </Panel>
        </div>

        {/* Desktop: unchanged map + list | sidebar */}
        <div className="hidden gap-6 lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <section className="space-y-5">
            <CompanyMap
              spots={spots}
              labels={labels}
              selectedPoint={selectedPoint}
              onPickPoint={setSelectedPoint}
              onWant={addInterest}
              wantLabel={t.want}
            />
            <SpotList
              spots={spots}
              labels={labels}
              onWant={addInterest}
              t={t}
              variant="default"
            />
          </section>

          <aside className="space-y-5">
            <Panel title={t.ranking} icon={<CatPawIcon className="h-7 w-7" />}>
              <div className="space-y-3">
                {rankedSpots.map((spot, index) => (
                  <div
                    key={spot.id}
                    className="flex items-start gap-3 rounded-2xl bg-white/58 p-3 ring-1 ring-white/70"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-deep)]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--text)]">{spot.name}</p>
                      <p className="mt-1 text-xs font-semibold text-[var(--text-muted)]">
                        {spot.interestCount} {t.wanted}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title={t.candidates} icon={<CatCardsIcon className="h-7 w-7" />}>
              <div className="space-y-3">
                {candidates.map((spot) => (
                  <CandidateMiniCard key={spot.id} spot={spot} labels={labels} t={t} />
                ))}
              </div>
            </Panel>

            <Panel title={t.events} icon={<CatHeartIcon className="h-7 w-7" />}>
              <div className="space-y-3">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    joinLabel={t.join}
                    joinedLabel={t.joined}
                    onJoin={joinEvent}
                  />
                ))}
              </div>
            </Panel>
          </aside>
        </div>

        <SpotMobileSheet
          spot={sheetSpot}
          labels={labels}
          t={t}
          onClose={() => setSheetSpot(null)}
          onWant={async (spot) => {
            await addInterest(spot);
            setSheetSpot(null);
          }}
          onRequestEvent={requestEventAction}
        />

        {toastMessage ? (
          <div
            className="fixed bottom-6 left-1/2 z-[102] max-w-[min(92vw,20rem)] -translate-x-1/2 rounded-2xl bg-[var(--text)]/92 px-5 py-3 text-center text-sm font-bold text-white shadow-[0_16px_40px_rgba(54,47,61,0.35)]"
            role="status"
          >
            {toastMessage}
          </div>
        ) : null}

        {message ? (
          <p className="mt-5 rounded-2xl bg-[#fff0f4] px-4 py-3 text-center text-sm font-semibold text-[#87483f]">
            {message}
          </p>
        ) : null}

        {showForm ? (
          <div className="fixed inset-0 z-[101] overflow-y-auto bg-[rgba(54,47,61,0.28)] px-4 py-6 backdrop-blur-sm">
            <div className="mx-auto max-w-lg rounded-[2rem] border border-white/80 bg-white/92 p-5 shadow-[0_24px_70px_rgba(54,47,61,0.2)] ring-1 ring-white/80 md:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--primary-deep)]/70">
                    {t.addSpot}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">
                    {t.addTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                    {t.addHint}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full bg-[var(--primary-soft)] px-3 py-1.5 text-sm font-bold text-[var(--primary-deep)]"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => void submitSpot(e)}>
                <Field label={t.name}>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-white/85 bg-white/82 px-4 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70"
                    placeholder="Ramen near the station"
                  />
                </Field>
                <Field label={t.category}>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value as CompanySpotCategory,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-white/85 bg-white/82 px-4 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {categoryEmoji[category]} {labels[category]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label={t.comment}>
                  <textarea
                    rows={3}
                    value={form.comment}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, comment: e.target.value }))
                    }
                    className="w-full rounded-2xl border border-white/85 bg-white/82 px-4 py-3 text-sm leading-relaxed shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70"
                    placeholder="I want to try this with coworkers."
                  />
                </Field>
                <Field label={t.image}>
                  <input
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                    }
                    className="h-12 w-full rounded-2xl border border-white/85 bg-white/82 px-4 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70"
                    placeholder="https://..."
                  />
                </Field>
                <p className="rounded-2xl bg-[var(--primary-soft)]/45 px-4 py-3 text-xs font-semibold leading-relaxed text-[var(--primary-deep)]">
                  {t.mapHint}
                </p>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[#b58ad6] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(149,120,198,0.26)] transition active:scale-95"
                >
                  {t.post}
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function CompanyMap({
  spots,
  labels,
  selectedPoint,
  onPickPoint,
  onWant,
  wantLabel,
  compact,
}: {
  spots: CompanySpot[];
  labels: Record<CompanySpotCategory, string>;
  selectedPoint: { x: number; y: number } | null;
  onPickPoint: (point: { x: number; y: number }) => void;
  onWant: (spot: CompanySpot) => void;
  wantLabel: string;
  compact?: boolean;
}) {
  const [activeSpot, setActiveSpot] = useState<CompanySpot | null>(null);

  function pick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button,a")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onPickPoint({
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    });
  }

  const outerRound = compact ? "rounded-[1.65rem]" : "rounded-[2rem]";
  const innerClamp = compact
    ? "relative mx-auto max-h-[min(260px,44vh)] w-[150%] max-w-4xl -translate-x-[16.5%] cursor-pointer overflow-hidden md:w-full md:translate-x-0"
    : "relative mx-auto w-[150%] max-w-4xl -translate-x-[16.5%] cursor-pointer overflow-hidden md:w-full md:translate-x-0";

  return (
    <div
      className={`overflow-hidden border border-white/75 bg-[#f8f5f2] shadow-[var(--shadow-hover)] ring-1 ring-white/80 ${outerRound}`}
    >
      <div className={innerClamp} onClick={pick}>
        {/* eslint-disable-next-line @next/next/no-img-element -- local map asset used as an interactive coordinate plane */}
        <img
          src="/images/japan-map.png"
          alt="Illustrated Japan map"
          className="block w-full select-none"
          draggable={false}
        />

        {spots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveSpot((prev) => (prev?.id === spot.id ? null : spot));
            }}
            className="near-dear-map-pin-pulse absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-lg shadow-[var(--shadow-hover)] ring-2 ring-[var(--primary-soft)] transition hover:scale-125"
            style={{ left: `${spot.mapX ?? 50}%`, top: `${spot.mapY ?? 50}%` }}
            aria-label={spot.name}
          >
            {categoryEmoji[spot.category]}
          </button>
        ))}

        {selectedPoint ? (
          <div
            className="pointer-events-none absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-sm font-bold text-[var(--primary-deep)] shadow-[var(--shadow-hover)] ring-2 ring-[var(--primary)]/30"
            style={{ left: `${selectedPoint.x}%`, top: `${selectedPoint.y}%` }}
            aria-hidden
          >
            ＋
          </div>
        ) : null}

        {activeSpot ? (
          <div
            className="absolute z-30 w-[min(270px,calc(100%-2rem))] animate-card-rise rounded-2xl bg-white/96 p-4 shadow-[var(--shadow-hover)] ring-1 ring-white/90 backdrop-blur-md"
            style={{
              left: `${Math.min(76, Math.max(4, (activeSpot.mapX ?? 50) + 3))}%`,
              top: `${Math.min(72, Math.max(12, (activeSpot.mapY ?? 50) - 8))}%`,
            }}
          >
            <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-bold text-[var(--primary-deep)]">
              {categoryEmoji[activeSpot.category]} {labels[activeSpot.category]}
            </span>
            <h3 className="mt-3 text-base font-semibold text-[var(--text)]">
              {activeSpot.name}
            </h3>
            {activeSpot.comment ? (
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {activeSpot.comment}
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => onWant(activeSpot)}
              className="mt-3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[#b58ad6] px-4 py-2 text-xs font-bold text-white shadow-sm"
            >
              {wantLabel}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SpotList({
  spots,
  labels,
  onWant,
  t,
  variant = "default",
}: {
  spots: CompanySpot[];
  labels: Record<CompanySpotCategory, string>;
  onWant: (spot: CompanySpot) => void;
  t: CompanySpotsCopy;
  variant?: "default" | "mobileMuted";
}) {
  const gridClass =
    variant === "mobileMuted"
      ? "grid gap-3"
      : "grid gap-4 md:grid-cols-2";

  return (
    <div className={gridClass}>
      {spots.map((spot) => (
        <SpotCard
          key={spot.id}
          spot={spot}
          labels={labels}
          onWant={onWant}
          t={t}
          variant={variant}
        />
      ))}
    </div>
  );
}

function SpotCard({
  spot,
  labels,
  onWant,
  t,
  variant = "default",
}: {
  spot: CompanySpot;
  labels: Record<CompanySpotCategory, string>;
  onWant: (spot: CompanySpot) => void;
  t: CompanySpotsCopy;
  variant?: "default" | "mobileMuted";
}) {
  const isCandidate = spot.interestCount >= EVENT_THRESHOLD;
  const muted = variant === "mobileMuted";

  return (
    <article
      className={
        muted
          ? "overflow-hidden rounded-[1.35rem] border border-white/65 bg-white/52 shadow-[0_8px_22px_rgba(54,47,61,0.05)] ring-1 ring-white/60 backdrop-blur-sm"
          : "overflow-hidden rounded-[1.7rem] border border-white/75 bg-white/76 shadow-[0_14px_34px_rgba(54,47,61,0.08)] ring-1 ring-white/75 backdrop-blur-md"
      }
    >
      {spot.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- user-provided remote image URL
        <img
          src={spot.imageUrl}
          alt=""
          className={muted ? "h-28 w-full object-cover" : "h-36 w-full object-cover"}
        />
      ) : null}
      <div className={muted ? "p-4" : "p-5"}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-bold text-[var(--primary-deep)]">
            {categoryEmoji[spot.category]} {labels[spot.category]}
          </span>
          {isCandidate ? (
            <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b95786]">
              {t.candidates}
            </span>
          ) : null}
        </div>
        <h3
          className={
            muted
              ? "mt-2 text-base font-semibold leading-snug text-[var(--text)]"
              : "mt-3 text-lg font-semibold leading-snug text-[var(--text)]"
          }
        >
          {spot.name}
        </h3>
        {spot.comment ? (
          <p
            className={
              muted
                ? "mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]"
                : "mt-2 text-sm leading-relaxed text-[var(--text-muted)]"
            }
          >
            “{spot.comment}”
          </p>
        ) : null}
        <p
          className={
            muted ? "mt-3 text-xs font-bold text-[var(--primary-deep)]" : "mt-4 text-sm font-bold text-[var(--primary-deep)]"
          }
        >
          {spot.interestCount} {t.wanted}
        </p>
        <button
          type="button"
          onClick={() => onWant(spot)}
          className={
            muted
              ? "mt-3 w-full rounded-xl bg-white/75 px-3 py-2.5 text-xs font-bold text-[var(--primary-deep)] shadow-sm ring-1 ring-white/80 transition active:scale-95"
              : "mt-4 w-full rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-white/85 transition active:scale-95"
          }
        >
          {t.want}
        </button>
      </div>
    </article>
  );
}

function CandidateMiniCard({
  spot,
  labels,
  t,
}: {
  spot: CompanySpot;
  labels: Record<CompanySpotCategory, string>;
  t: CompanySpotsCopy;
}) {
  return (
    <div className="rounded-2xl bg-white/58 p-4 ring-1 ring-white/70">
      <p className="text-xs font-bold text-[var(--primary-deep)]">
        {categoryEmoji[spot.category]} {labels[spot.category]}
      </p>
      <h3 className="mt-2 font-semibold leading-snug text-[var(--text)]">
        {spot.name}
      </h3>
      <p className="mt-2 text-xs font-semibold text-[var(--text-muted)]">
        {spot.interestCount} {t.wanted}
      </p>
    </div>
  );
}

function EventCard({
  event,
  joinLabel,
  joinedLabel,
  onJoin,
}: {
  event: CompanyEvent;
  joinLabel: string;
  joinedLabel: string;
  onJoin: (event: CompanyEvent) => void;
}) {
  return (
    <article className="rounded-2xl bg-white/58 p-4 ring-1 ring-white/70">
      <h3 className="font-semibold leading-snug text-[var(--text)]">{event.title}</h3>
      <p className="mt-2 text-xs font-semibold text-[var(--text-muted)]">
        {[event.eventDate, event.eventTime].filter(Boolean).join(" / ") || "Date TBD"}
      </p>
      <p className="mt-2 text-sm font-bold text-[var(--primary-deep)]">
        {event.participantCount} {joinedLabel}
      </p>
      <button
        type="button"
        onClick={() => onJoin(event)}
        className="mt-3 rounded-full bg-[var(--primary-soft)] px-4 py-2 text-xs font-bold text-[var(--primary-deep)]"
      >
        {joinLabel}
      </button>
    </article>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[1.8rem] border border-white/75 bg-white/72 p-5 shadow-[0_14px_34px_rgba(54,47,61,0.08)] ring-1 ring-white/75 backdrop-blur-md">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 shadow-sm ring-1 ring-white/80">
          {icon}
        </div>
        <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--primary-deep)]/75">
        {label}
      </span>
      {children}
    </label>
  );
}

function MobileMostWantedSection({
  rankedSpots,
  t,
  eventThreshold,
  onOpenSpot,
}: {
  rankedSpots: CompanySpot[];
  t: CompanySpotsCopy;
  eventThreshold: number;
  onOpenSpot: (spot: CompanySpot) => void;
}) {
  return (
    <section className="animate-ranking-section rounded-[1.65rem] border border-white/78 bg-gradient-to-br from-[#fff9fd]/96 via-[#fffbfc]/92 to-[#eef6ff]/88 p-4 shadow-[0_18px_42px_rgba(149,120,198,0.13)] ring-1 ring-white/80">
      <div className="mb-3 flex items-center gap-2 px-0.5">
        <span className="text-lg" aria-hidden>
          🏆
        </span>
        <h2 className="text-base font-bold tracking-[-0.02em] text-[var(--text)]">{t.ranking}</h2>
      </div>
      {rankedSpots.length === 0 ? (
        <p className="rounded-2xl bg-white/50 px-4 py-6 text-center text-sm text-[var(--text-muted)]">
          {t.addHint}
        </p>
      ) : (
        <ul className="space-y-2.5">
          {rankedSpots.map((spot, index) => {
            const rank = index + 1;
            const isFirst = rank === 1;
            const almostThere = spot.interestCount === eventThreshold - 1;
            return (
              <li key={spot.id}>
                <button
                  type="button"
                  onClick={() => onOpenSpot(spot)}
                  style={{ "--rank-stagger": `${index * 75}ms` } as React.CSSProperties}
                  className={`animate-rank-row flex w-full items-center gap-3 rounded-2xl border border-white/80 bg-gradient-to-r from-white/88 to-[#f6f0ff]/55 px-3.5 py-3 text-left shadow-[0_10px_28px_rgba(54,47,61,0.08)] ring-1 ring-white/75 transition-transform duration-150 ease-out active:scale-[0.96] ${
                    isFirst ? "rank-first-glow" : ""
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                      isFirst
                        ? "bg-gradient-to-br from-amber-100/95 to-[#f3e8ff] text-[var(--primary-deep)] ring-2 ring-amber-200/60"
                        : "bg-[var(--primary-soft)]/90 text-[var(--primary-deep)]"
                    }`}
                  >
                    {rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {isFirst ? (
                        <span className="rounded-full bg-gradient-to-r from-amber-100/90 to-rose-100/80 px-2 py-0.5 text-[0.65rem] font-bold text-amber-900/90">
                          {t.trending}
                        </span>
                      ) : null}
                      {almostThere ? (
                        <span className="rounded-full bg-[#e8f5ef]/90 px-2 py-0.5 text-[0.65rem] font-bold text-[#2d6a4f]">
                          {t.almostEvent}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate font-semibold text-[var(--text)]">{spot.name}</p>
                    <p className="mt-0.5 text-xs font-semibold text-[var(--text-muted)]">
                      {spot.interestCount} {t.wanted}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function SpotMobileSheet({
  spot,
  labels,
  t,
  onClose,
  onWant,
  onRequestEvent,
}: {
  spot: CompanySpot | null;
  labels: Record<CompanySpotCategory, string>;
  t: CompanySpotsCopy;
  onClose: () => void;
  onWant: (spot: CompanySpot) => void | Promise<void>;
  onRequestEvent: () => void;
}) {
  if (!spot) return null;

  return (
    <div className="fixed inset-0 z-[95] flex flex-col justify-end lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(54,47,61,0.32)] backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 max-h-[min(86vh,640px)] w-full overflow-y-auto rounded-t-[1.75rem] border border-white/85 bg-white/95 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_48px_rgba(54,47,61,0.18)] ring-1 ring-white/90">
        <div className="mx-auto mb-4 h-1.5 w-12 shrink-0 rounded-full bg-[var(--text-muted)]/25" aria-hidden />
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-bold text-[var(--primary-deep)]">
            {categoryEmoji[spot.category]} {labels[spot.category]}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-sm font-bold text-[var(--primary-deep)]"
          >
            ×
          </button>
        </div>
        <h3 className="mt-3 text-xl font-bold leading-snug text-[var(--text)]">{spot.name}</h3>
        {spot.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={spot.imageUrl}
            alt=""
            className="mt-4 max-h-48 w-full rounded-2xl object-cover shadow-inner ring-1 ring-white/80"
          />
        ) : null}
        {spot.comment ? (
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">“{spot.comment}”</p>
        ) : null}
        <p className="mt-4 text-sm font-bold text-[var(--primary-deep)]">
          {spot.interestCount} {t.wanted}
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => void onWant(spot)}
            className="w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[#b58ad6] px-4 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(149,120,198,0.28)] transition active:scale-[0.98]"
          >
            {t.want}
          </button>
          <button
            type="button"
            onClick={() => onRequestEvent()}
            className="w-full rounded-2xl border border-[var(--primary-soft)] bg-white/85 px-4 py-3.5 text-sm font-bold text-[var(--primary-deep)] shadow-sm ring-1 ring-white/85 transition active:scale-[0.98]"
          >
            {t.requestEvent}
          </button>
        </div>
      </div>
    </div>
  );
}
