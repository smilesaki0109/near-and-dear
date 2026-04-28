"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { CardGrid } from "@/components/cards/CardGrid";
import { CardTile } from "@/components/cards/CardTile";
import { CategoryChips, type CategoryFilter } from "@/components/home/CategoryChips";
import { Hero } from "@/components/home/Hero";
import { SearchBar } from "@/components/home/SearchBar";
import { CatCardsIcon } from "@/components/icons/CatCardsIcon";
import { CatExploreIcon } from "@/components/icons/CatExploreIcon";
import { CatHomeIcon } from "@/components/icons/CatHomeIcon";
import { CatMapIcon } from "@/components/icons/CatMapIcon";
import { mockCards } from "@/data/mockCards";
import { useLanguage } from "@/contexts/LanguageContext";
import { ui } from "@/lib/i18n/ui";

/**
 * Home = browse: search + category chips + grid.
 * Wired to mock data until Supabase templates are loaded in a later phase.
 */
export function HomeBrowse() {
  const { locale, setLocale } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  const t = ui[locale];
  const home = homeStoryCopy[locale];
  const quickActions = [
    {
      href: "/map",
      label: locale === "ja" ? "Mapを見る" : "Map",
      icon: <CatMapIcon className="h-10 w-10" />,
      card: "from-[#f6fbff] to-white",
    },
    {
      href: "#cards",
      label: locale === "ja" ? "カード" : "Cards",
      icon: <CatCardsIcon className="h-10 w-10" />,
      card: "from-[#fff9f5] to-white",
    },
    {
      href: "/create/1",
      label: locale === "ja" ? "書く" : locale === "tl" ? "Sulatan" : "Write",
      icon: <CatHomeIcon className="h-10 w-10" />,
      card: "from-[#fbf7ff] to-white",
    },
  ];
  const whySymbols = ["✉️", "🌸", "💛"];
  const stepSymbols = ["🎴", "💌", "🚀"];
  const mobileStepCards = [
    {
      art: <CatCardsIcon className="h-20 w-20" />,
      accent: "bg-[#fff1ee] text-[#b65f66]",
      card: "from-[#fff9f5] via-[#fff1ee] to-white",
    },
    {
      art: <CatExploreIcon className="h-20 w-20" />,
      accent: "bg-[#f6efff] text-[#8060b5]",
      card: "from-[#fbf7ff] via-[#f2ebff] to-white",
    },
    {
      art: <CatHomeIcon className="h-20 w-20" />,
      accent: "bg-[#fff0f7] text-[#b95786]",
      card: "from-[#fff7fb] via-[#ffeef6] to-white",
    },
  ];
  const japanVibes = ["🇯🇵", "🍜", "🍵", "🌸", "🏮", "🗻", "🍙", "🎴"];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mockCards.filter((card) => {
      const matchCategory =
        category === "all" ? true : card.category === category;
      if (!matchCategory) return false;
      if (!q) return true;
      const en = card.titleEn.toLowerCase();
      const ja = card.titleJa.toLowerCase();
      return en.includes(q) || ja.includes(q);
    });
  }, [query, category]);

  const japanCards = useMemo(
    () => mockCards.filter((card) => card.category === "japan").slice(0, 6),
    [],
  );

  return (
    <AppShell locale={locale} onLocaleChange={setLocale}>
      <div className="mx-auto max-w-6xl">
        <Hero locale={locale} />
        <section className="-mx-4 mb-6 md:hidden" aria-label="Quick actions">
          <div className="mb-3 px-4">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[var(--primary-deep)]/70">
                {locale === "ja" ? "クイック選択" : "Quick pick"}
              </p>
              <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--text)]">
                {locale === "ja"
                  ? "何から始める？"
                  : locale === "tl"
                    ? "Ano ang gusto mong gawin?"
                    : "What do you want to do?"}
              </h2>
            </div>
          </div>
          <div className="grid snap-x snap-mandatory grid-flow-col gap-3 overflow-x-auto px-4 pb-2 [grid-auto-columns:34%] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {quickActions.map((action, index) => (
              <Link
                key={action.label}
                href={action.href}
                className={`animate-card-rise snap-start rounded-3xl border border-white/80 bg-gradient-to-br p-3 shadow-[0_10px_24px_rgba(54,47,61,0.08)] ring-1 ring-white/80 transition active:scale-95 ${action.card}`}
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70">
                  {action.icon}
                </div>
                <p className="mt-2 text-sm font-bold text-[var(--text)]">{action.label}</p>
              </Link>
            ))}
          </div>
        </section>
        <WavyDivider className="-mt-2 mb-8 md:-mt-4 md:mb-12" />

        <section className="relative overflow-hidden rounded-3xl border border-white/75 bg-white/68 p-6 shadow-[0_14px_34px_rgba(54,47,61,0.08)] backdrop-blur-md md:rounded-[var(--radius-xl)] md:bg-white/55 md:p-8 md:shadow-[var(--shadow-soft)]">
          <DecorativeBubble className="-right-8 -top-8 h-24 w-24 bg-[var(--accent-peach)]/35" />
          <DecorativeBubble className="bottom-5 right-20 h-12 w-12 bg-[var(--accent-mint)]/45" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary-deep)]/80">
            {home.whyKicker}
          </p>
          <div className="mt-4 grid gap-6 md:grid-cols-[1fr_0.8fr] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-4xl">
                {home.whyTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-[1.8] text-[var(--text-muted)] md:text-base md:leading-relaxed">
                {home.whyBody}
              </p>
            </div>
            <div className="hidden grid-cols-3 gap-3 text-center md:grid">
              {whySymbols.map((symbol, index) => (
                <div
                  key={symbol}
                  className={`p-3 text-4xl drop-shadow-sm transition duration-300 hover:-translate-y-1 hover:rotate-3 hover:scale-105 ${
                    index === 1 ? "translate-y-4" : ""
                  }`}
                  aria-hidden
                >
                  {symbol}
                </div>
              ))}
            </div>
          </div>
        </section>

        <WavyDivider className="my-8 rotate-180 md:my-12" />

        <section className="relative">
          <div className="mb-6 text-center md:mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary-deep)]/80">
              {home.howKicker}
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-4xl">
              {home.howTitle}
            </h2>
          </div>
          <div
            className="-mx-5 grid grid-flow-col snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-5 pb-3 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ gridAutoColumns: "84%" }}
          >
            {home.steps.map((step, index) => (
              <article
                key={step.title}
                className={`relative min-h-[250px] snap-start overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br p-5 shadow-[0_14px_34px_rgba(54,47,61,0.08)] ring-1 ring-white/80 ${mobileStepCards[index].card}`}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/65 blur-xl"
                  aria-hidden
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] shadow-sm ${mobileStepCards[index].accent}`}
                    >
                      Step {index + 1}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold leading-tight tracking-[-0.02em] text-[var(--text)]">
                      {step.title}
                    </h3>
                  </div>
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.35rem] bg-white/68 ring-1 ring-white/80">
                    {mobileStepCards[index].art}
                  </div>
                </div>
                <p className="relative mt-5 text-sm leading-relaxed text-[var(--text-muted)]">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
          <div className="hidden gap-4 md:grid md:grid-cols-3">
            {home.steps.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[var(--radius-xl)] border border-white/70 bg-gradient-to-br from-white/80 to-[var(--accent-cream)]/70 p-6 shadow-[var(--shadow-soft)] ring-1 ring-white/80 transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-hover)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-soft)] text-lg font-semibold text-[var(--primary-deep)] shadow-[var(--shadow-soft)]">
                  {stepSymbols[index]}
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary-deep)]/65">
                  Step {index + 1}
                </p>
                <h3 className="mt-5 text-lg font-semibold text-[var(--text)]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                  {step.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <WavyDivider className="my-8 md:my-12" />

        <section id="cards" aria-labelledby="cards-heading" className="scroll-mt-28">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2
                id="cards-heading"
                className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-4xl"
              >
                {t.cardsHeading}
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-[1.8] text-[var(--text-muted)] md:leading-relaxed">
                {home.cardsBody}
              </p>
              <div
                className="mt-3 h-px w-12 rounded-full bg-gradient-to-r from-[var(--primary)] to-transparent opacity-70"
                aria-hidden
              />
            </div>
          </div>

          <div className="relative mb-6 overflow-hidden rounded-3xl border border-white/70 bg-white/64 p-4 shadow-[0_12px_30px_rgba(54,47,61,0.08)] backdrop-blur-md md:mb-8 md:rounded-[var(--radius-xl)] md:bg-white/45 md:p-8 md:shadow-[var(--shadow-soft)]">
            <PopSticker className="right-4 top-3 rotate-6 hidden lg:flex">🔎</PopSticker>
            <PopSticker className="bottom-3 right-6 -rotate-3 hidden lg:flex">✨</PopSticker>
            <SearchBar locale={locale} value={query} onChange={setQuery} />
            <CategoryChips locale={locale} active={category} onChange={setCategory} />
          </div>

          <CardGrid cards={filtered} locale={locale} />
        </section>

        <WavyDivider className="my-8 rotate-180 md:my-12" />

        <section className="relative overflow-hidden rounded-3xl border border-white/75 bg-gradient-to-br from-[#fffaf6] via-white to-[#f4f9ff] p-6 shadow-[0_14px_34px_rgba(54,47,61,0.08)] md:rounded-[var(--radius-xl)] md:p-8 md:shadow-[var(--shadow-soft)]">
          <DecorativeBubble className="-right-10 top-10 h-28 w-28 bg-[var(--accent-sky)]/35" />
          <DecorativeBubble className="bottom-12 left-10 h-20 w-20 bg-[var(--accent-peach)]/30" />
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary-deep)]/80">
                Japan
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-4xl">
                {home.japanTitle}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-[1.8] text-[var(--text-muted)] md:leading-relaxed">
                {home.japanBody}
              </p>
              <div className="mt-4 flex flex-nowrap gap-2 overflow-hidden md:flex-wrap">
                {japanVibes.map((symbol, index) => (
                  <span
                    key={symbol}
                    className={`h-9 w-9 items-center justify-center text-2xl drop-shadow-sm ${
                      index > 4 ? "hidden md:flex" : "flex"
                    }`}
                    aria-hidden
                  >
                    {symbol}
                  </span>
                ))}
              </div>
            </div>
            <Link
              href="/map"
              className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-hover)] transition duration-200 hover:scale-[1.02] hover:brightness-[1.03] active:scale-95"
            >
              {home.mapButton}
            </Link>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-3 snap-x snap-mandatory">
            {japanCards.map((card) => (
              <Link
                key={card.id}
                href={`/create/${card.id}`}
                className="block w-[250px] shrink-0 snap-start rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
              >
                <CardTile card={card} locale={locale} />
              </Link>
            ))}
          </div>
        </section>

        <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/75 bg-white/68 p-6 shadow-[0_14px_34px_rgba(54,47,61,0.08)] md:mt-12 md:rounded-[var(--radius-xl)] md:bg-white/60 md:p-8 md:shadow-[var(--shadow-soft)]">
          <DecorativeBubble className="left-10 top-8 h-16 w-16 bg-[var(--accent-sky)]/35" />
          <PopSticker className="right-6 top-5 rotate-6 hidden lg:flex">🗻</PopSticker>
          <PopSticker className="bottom-5 right-16 -rotate-6 hidden lg:flex">🍜</PopSticker>
          <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-4xl">
                {home.mapTitle}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-[1.8] text-[var(--text-muted)] md:text-base md:leading-relaxed">
                {home.mapBody}
              </p>
            </div>
            <Link
              href="/map"
              className="inline-flex items-center justify-center rounded-full bg-white/85 px-6 py-3 text-sm font-semibold text-[var(--primary-deep)] shadow-[var(--shadow-soft)] ring-1 ring-white/90 transition duration-200 hover:scale-[1.02] hover:bg-white hover:shadow-[var(--shadow-hover)] active:scale-95"
            >
              {home.exploreMap}
            </Link>
          </div>
        </section>

        <section className="relative mt-8 overflow-hidden rounded-3xl border border-white/75 bg-gradient-to-br from-[var(--primary-soft)]/80 via-white to-[var(--accent-peach)]/25 p-7 text-center shadow-[0_16px_38px_rgba(54,47,61,0.10)] md:mt-12 md:rounded-[var(--radius-xl)] md:p-12 md:shadow-[var(--shadow-hover)]">
          <PopSticker className="left-6 top-6 -rotate-6 hidden md:flex">💌</PopSticker>
          <PopSticker className="right-6 top-6 rotate-6 hidden md:flex">🇯🇵</PopSticker>
          <PopSticker className="bottom-6 left-10 rotate-3 hidden lg:flex">❤️</PopSticker>
          <PopSticker className="bottom-6 right-10 -rotate-3 hidden lg:flex">🌸</PopSticker>
          <p className="text-4xl" aria-hidden>
            ✨
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-[var(--text)] md:text-4xl">
            {home.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-[1.8] text-[var(--text-muted)] md:text-base md:leading-relaxed">
            {home.ctaBody}
          </p>
          <Link
            href="/create/1"
            className="mt-7 inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-8 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-hover)] transition duration-200 hover:scale-[1.02] hover:brightness-[1.03] active:scale-95"
          >
            {home.createButton}
          </Link>
        </section>

        <footer className="mt-12 border-t border-[var(--line)]/80 pt-8 text-center text-sm leading-relaxed text-[var(--text-muted)] md:mt-20 md:pt-10">
          {t.footerNote}
        </footer>
      </div>
    </AppShell>
  );
}

function WavyDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none text-[var(--primary-soft)] ${className}`} aria-hidden>
      <svg viewBox="0 0 1200 80" className="h-10 w-full" preserveAspectRatio="none">
        <path
          d="M0 34 C160 82 320 -12 480 34 C640 80 800 -10 960 34 C1060 62 1130 58 1200 34 V80 H0 Z"
          fill="currentColor"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}

function DecorativeBubble({ className }: { className: string }) {
  return (
    <span
      className={`pointer-events-none absolute rounded-full blur-xl ${className}`}
      aria-hidden
    />
  );
}

function PopSticker({
  className,
  children,
}: {
  className: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`pointer-events-none absolute z-10 flex h-11 w-11 items-center justify-center text-3xl drop-shadow-sm ${className}`}
      aria-hidden
    >
      {children}
    </span>
  );
}

const homeStoryCopy = {
  en: {
    whyKicker: "Why it matters",
    whyTitle: "Send a feeling, not just a message.",
    whyBody:
      "Near & Dear helps you turn a small thought into something warm, visual, and easy to share when words feel hard.",
    howKicker: "How it works",
    howTitle: "Three soft steps",
    steps: [
      {
        title: "Choose a card",
        body: "Pick a mood, color, or tiny scene that feels like the person you’re thinking of.",
      },
      {
        title: "Write your message",
        body: "Add simple words, a photo, or one quiet sentence that says enough.",
      },
      {
        title: "Share with someone you care about",
        body: "Create a link and send it through LINE, X, Instagram, or any message app.",
      },
    ],
    cardsBody:
      "Browse warm cards for birthdays, homesick days, encouragement, gratitude, and small new beginnings.",
    japanTitle: "What people love in Japan 🇯🇵",
    japanBody:
      "Pop, peaceful, nostalgic cards inspired by small moments people notice while living in Japan.",
    mapButton: "View map",
    mapTitle: "Discover Japan through others",
    mapBody:
      "Japan Map collects food, places, culture, and daily-life favorites from people building a life here.",
    exploreMap: "Explore the map",
    ctaTitle: "Send a little warmth today",
    ctaBody:
      "Choose one card, write one honest line, and let someone know they are remembered.",
    createButton: "Create a card",
  },
  ja: {
    whyKicker: "たいせつな理由",
    whyTitle: "メッセージではなく、気持ちを届ける。",
    whyBody:
      "Near & Dearは、言葉にしにくい小さな想いを、あたたかく見える形にして届けるための場所です。",
    howKicker: "使い方",
    howTitle: "やさしい3ステップ",
    steps: [
      {
        title: "カードを選ぶ",
        body: "相手を思い浮かべながら、色や雰囲気に合うカードを選びます。",
      },
      {
        title: "ことばを添える",
        body: "短い一文でも、写真でも、今の気持ちが少し伝われば大丈夫です。",
      },
      {
        title: "大切な人へ送る",
        body: "リンクを作って、LINEやSNS、メッセージアプリで共有できます。",
      },
    ],
    cardsBody:
      "誕生日、ふるさとが恋しい日、応援、ありがとう、新しい一歩に寄り添うカードを選べます。",
    japanTitle: "みんなが好きな日本 🇯🇵",
    japanBody:
      "日本で暮らす中で見つけた、ポップで穏やかで少し懐かしい瞬間のカードです。",
    mapButton: "Mapを見る",
    mapTitle: "誰かの好きから、日本を見つける",
    mapBody:
      "Japan Mapでは、日本で暮らす人が好きになった食べ物、場所、文化、日常を集めています。",
    exploreMap: "Explore the map",
    ctaTitle: "今日、小さなぬくもりを送る",
    ctaBody:
      "カードをひとつ選んで、正直な一文を添えるだけで、想いはちゃんと届きます。",
    createButton: "Create a card",
  },
  tl: {
    whyKicker: "Bakit mahalaga",
    whyTitle: "Magpadala ng feeling, hindi lang message.",
    whyBody:
      "Tinutulungan ka ng Near & Dear gawing warm, visual, at madaling i-share ang maliit na thought kapag mahirap ang words.",
    howKicker: "Paano gamitin",
    howTitle: "Three soft steps",
    steps: [
      {
        title: "Pumili ng card",
        body: "Pumili ng mood, kulay, o maliit na scene na bagay sa taong iniisip mo.",
      },
      {
        title: "Isulat ang message",
        body: "Magdagdag ng simpleng words, photo, o isang quiet sentence na sapat na.",
      },
      {
        title: "I-share sa mahalaga sa iyo",
        body: "Gumawa ng link at ipadala sa LINE, X, Instagram, o message app.",
      },
    ],
    cardsBody:
      "Mag-browse ng warm cards para sa birthdays, homesick days, encouragement, gratitude, at new beginnings.",
    japanTitle: "Mga paborito ng tao sa Japan 🇯🇵",
    japanBody:
      "Pop, peaceful, nostalgic cards na inspired ng maliliit na moments sa Japan.",
    mapButton: "View map",
    mapTitle: "Discover Japan through others",
    mapBody:
      "Kinokolekta ng Japan Map ang food, places, culture, at daily-life favorites ng mga taong gumagawa ng buhay dito.",
    exploreMap: "Explore the map",
    ctaTitle: "Magpadala ng munting warmth today",
    ctaBody:
      "Pumili ng isang card, magsulat ng isang honest line, at ipaalam na naaalala mo sila.",
    createButton: "Create a card",
  },
} as const;
