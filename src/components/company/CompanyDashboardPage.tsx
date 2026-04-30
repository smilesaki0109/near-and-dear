"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CatCardsIcon } from "@/components/icons/CatCardsIcon";
import { CatCloudIcon, CatHeartIcon, CatPawIcon } from "@/components/icons/CatDecorations";
import { CatExploreIcon } from "@/components/icons/CatExploreIcon";
import { NearDearMascot } from "@/components/icons/NearDearMascot";
import { useLanguage } from "@/contexts/LanguageContext";
import { sampleCompanyEvents, sampleCompanySpots } from "@/lib/company-sample-data";
import type { CompanyEvent, CompanySpot, CompanySpotCategory } from "@/types/company";

type Props = {
  initialSpots: CompanySpot[];
  initialEvents: CompanyEvent[];
};

type EventForm = {
  title: string;
  date: string;
  time: string;
  capacity: string;
  description: string;
};

const EVENT_THRESHOLD = 5;

const categoryEmoji: Record<CompanySpotCategory, string> = {
  food: "🍜",
  place: "📍",
  culture: "🏮",
  nature: "🌿",
  comfort: "🏡",
};

const copy = {
  en: {
    eyebrow: "Company Admin",
    title: "Turn shared interests into gentle company events",
    subtitle:
      "See what employees actually want to try, then create small cultural exchange events from real interest.",
    totalSpots: "Total spots",
    totalInterests: "Total interests",
    candidates: "Event candidates",
    createdEvents: "Created events",
    create: "Create Event",
    formTitle: "Create event",
    eventTitle: "Event title",
    date: "Date",
    time: "Time",
    capacity: "Capacity",
    description: "Description",
    save: "Create Event",
    events: "Upcoming events",
    joined: "people joined",
  },
  ja: {
    eyebrow: "会社向け",
    title: "みんなの興味から、やさしい交流イベントへ",
    subtitle:
      "社員が本当に行きたい場所を見て、小さな文化交流イベントを作れます。",
    totalSpots: "投稿スポット",
    totalInterests: "行きたい数",
    candidates: "イベント候補",
    createdEvents: "作成イベント",
    create: "イベント作成",
    formTitle: "イベントを作成",
    eventTitle: "イベント名",
    date: "日付",
    time: "時間",
    capacity: "定員",
    description: "説明",
    save: "イベントを作成",
    events: "予定されているイベント",
    joined: "人が参加",
  },
  tl: {
    eyebrow: "Company Admin",
    title: "Gawing gentle company events ang shared interests",
    subtitle:
      "Tingnan kung ano ang gustong subukan ng employees, tapos gumawa ng small exchange events.",
    totalSpots: "Total spots",
    totalInterests: "Total interests",
    candidates: "Event candidates",
    createdEvents: "Created events",
    create: "Create Event",
    formTitle: "Create event",
    eventTitle: "Event title",
    date: "Date",
    time: "Time",
    capacity: "Capacity",
    description: "Description",
    save: "Create Event",
    events: "Upcoming events",
    joined: "people joined",
  },
} as const;

export function CompanyDashboardPage({ initialSpots, initialEvents }: Props) {
  const { locale, setLocale } = useLanguage();
  const t = copy[locale];
  const [spots] = useState<CompanySpot[]>(
    initialSpots.length ? initialSpots : sampleCompanySpots,
  );
  const [events, setEvents] = useState<CompanyEvent[]>(
    initialEvents.length ? initialEvents : sampleCompanyEvents,
  );
  const [selectedSpot, setSelectedSpot] = useState<CompanySpot | null>(null);
  const [form, setForm] = useState<EventForm>({
    title: "",
    date: "",
    time: "",
    capacity: "12",
    description: "",
  });

  const candidates = useMemo(
    () => spots.filter((spot) => spot.interestCount >= EVENT_THRESHOLD),
    [spots],
  );
  const totalInterests = spots.reduce((sum, spot) => sum + spot.interestCount, 0);

  function openForm(spot: CompanySpot) {
    setSelectedSpot(spot);
    setForm({
      title: `Ramen lunch at ${spot.name}`,
      date: "",
      time: "12:00",
      capacity: "12",
      description: spot.comment ?? "",
    });
  }

  async function createEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedSpot) return;

    const optimisticEvent: CompanyEvent = {
      id: `local-event-${Date.now()}`,
      spotId: selectedSpot.id,
      title: form.title,
      description: form.description.trim() || null,
      eventDate: form.date || null,
      eventTime: form.time || null,
      capacity: Number(form.capacity) || null,
      createdAt: new Date().toISOString(),
      participantCount: 0,
      spot: selectedSpot,
    };

    setEvents((prev) => [optimisticEvent, ...prev]);
    setSelectedSpot(null);

    if (selectedSpot.id.startsWith("sample-")) return;

    const res = await fetch("/api/company-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spotId: selectedSpot.id,
        title: optimisticEvent.title,
        description: optimisticEvent.description,
        eventDate: optimisticEvent.eventDate,
        eventTime: optimisticEvent.eventTime,
        capacity: optimisticEvent.capacity,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      event?: CompanyEvent;
    };
    if (data.event) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === optimisticEvent.id ? data.event! : event,
        ),
      );
    }
  }

  return (
    <AppShell locale={locale} onLocaleChange={setLocale}>
      <div className="mx-auto max-w-6xl pb-16">
        <header className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/75 bg-gradient-to-br from-white/88 via-[#fff7fb]/80 to-[#eef8ff]/82 p-5 shadow-[0_18px_42px_rgba(54,47,61,0.08)] ring-1 ring-white/80 backdrop-blur-md md:p-8">
          <span className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#f7ddff]/45 blur-2xl" aria-hidden />
          <div className="relative flex gap-4">
            <div className="near-dear-mascot-glow flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.6rem] bg-white/58 shadow-[var(--shadow-soft)] ring-1 ring-white/85">
              <NearDearMascot className="h-20 w-20" />
            </div>
            <div>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--primary-deep)]/70">
                {t.eyebrow}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[var(--text)] max-md:text-xl max-md:leading-tight md:text-4xl">
                {t.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)] max-md:max-w-md max-md:leading-7 md:text-base">
                {t.subtitle}
              </p>
            </div>
          </div>
        </header>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label={t.totalSpots} value={spots.length} icon={<CatPawIcon className="h-7 w-7" />} />
          <Metric label={t.totalInterests} value={totalInterests} icon={<CatHeartIcon className="h-7 w-7" />} />
          <Metric label={t.candidates} value={candidates.length} icon={<CatCardsIcon className="h-7 w-7" />} />
          <Metric label={t.createdEvents} value={events.length} icon={<CatCloudIcon className="h-7 w-9" />} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
          <section className="rounded-[2rem] border border-white/75 bg-white/74 p-5 shadow-[0_14px_34px_rgba(54,47,61,0.08)] ring-1 ring-white/75 backdrop-blur-md md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <CatExploreIcon className="h-9 w-9" />
              <h2 className="text-xl font-semibold text-[var(--text)]">
                {t.candidates}
              </h2>
            </div>
            <div className="space-y-4">
              {candidates.map((spot) => (
                <article
                  key={spot.id}
                  className="rounded-[1.5rem] bg-white/58 p-4 ring-1 ring-white/70"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-bold text-[var(--primary-deep)]">
                      {categoryEmoji[spot.category]} {spot.category}
                    </span>
                    <span className="rounded-full bg-[#fff0f7] px-3 py-1 text-xs font-bold text-[#b95786]">
                      {spot.interestCount} interested
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-[var(--text)]">
                    {spot.name}
                  </h3>
                  {spot.comment ? (
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                      “{spot.comment}”
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => openForm(spot)}
                    className="mt-4 rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[#b58ad6] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_30px_rgba(149,120,198,0.24)] transition active:scale-95"
                  >
                    {t.create}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/75 bg-white/74 p-5 shadow-[0_14px_34px_rgba(54,47,61,0.08)] ring-1 ring-white/75 backdrop-blur-md md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <CatHeartIcon className="h-9 w-9" />
              <h2 className="text-xl font-semibold text-[var(--text)]">
                {t.events}
              </h2>
            </div>
            <div className="space-y-4">
              {events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-[1.5rem] bg-white/58 p-4 ring-1 ring-white/70"
                >
                  <h3 className="font-semibold leading-snug text-[var(--text)]">
                    {event.title}
                  </h3>
                  <p className="mt-2 text-xs font-semibold text-[var(--text-muted)]">
                    {[event.eventDate, event.eventTime].filter(Boolean).join(" / ") ||
                      "Date TBD"}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--primary-deep)]">
                    {event.participantCount} {t.joined}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        {selectedSpot ? (
          <div className="fixed inset-0 z-[90] overflow-y-auto bg-[rgba(54,47,61,0.28)] px-4 py-6 backdrop-blur-sm">
            <div className="mx-auto max-w-lg rounded-[2rem] border border-white/80 bg-white/92 p-5 shadow-[0_24px_70px_rgba(54,47,61,0.2)] ring-1 ring-white/80 md:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--primary-deep)]/70">
                    {selectedSpot.name}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-[var(--text)]">
                    {t.formTitle}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSpot(null)}
                  className="rounded-full bg-[var(--primary-soft)] px-3 py-1.5 text-sm font-bold text-[var(--primary-deep)]"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => void createEvent(e)}>
                <Field label={t.eventTitle}>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-white/85 bg-white/82 px-4 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70"
                  />
                </Field>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label={t.date}>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                      className="h-12 w-full rounded-2xl border border-white/85 bg-white/82 px-4 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70"
                    />
                  </Field>
                  <Field label={t.time}>
                    <input
                      value={form.time}
                      onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
                      className="h-12 w-full rounded-2xl border border-white/85 bg-white/82 px-4 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70"
                    />
                  </Field>
                </div>
                <Field label={t.capacity}>
                  <input
                    type="number"
                    min="1"
                    value={form.capacity}
                    onChange={(e) => setForm((prev) => ({ ...prev, capacity: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-white/85 bg-white/82 px-4 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70"
                  />
                </Field>
                <Field label={t.description}>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full rounded-2xl border border-white/85 bg-white/82 px-4 py-3 text-sm leading-relaxed shadow-sm focus:outline-none focus:ring-4 focus:ring-[var(--primary-soft)]/70"
                  />
                </Field>
                <button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-[var(--primary)] to-[#b58ad6] px-5 py-3.5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(149,120,198,0.26)] transition active:scale-95"
                >
                  {t.save}
                </button>
              </form>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/75 bg-white/74 p-4 shadow-[var(--shadow-soft)] ring-1 ring-white/75">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 ring-1 ring-white/80">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--text)]">{value}</p>
          <p className="text-xs font-semibold text-[var(--text-muted)]">{label}</p>
        </div>
      </div>
    </div>
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
