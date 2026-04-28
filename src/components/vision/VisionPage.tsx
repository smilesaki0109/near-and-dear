"use client";

import { AppShell } from "@/components/layout/AppShell";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ReactNode } from "react";

const problemJa = [
  "現在、技能実習生向けの感情サポートサービスを開発しています。",
  "きっかけは、約50名のフィリピン人技能実習生へのヒアリングでした。\n彼女たちから繰り返し出てきたのは、「困っているのに言葉にできない」「本当は誰かとつながりたい」という声です。",
  "日本で生活しているにもかかわらず、日本人や文化と十分に関われていない。\nこれは「支援が足りない」というよりも、助けを求める“きっかけと言葉”がない構造的な問題だと感じました。",
  "さらに深刻なのが孤独です。\n多くの実習生は、家族や子どもを母国に残して来日しています。\n誕生日や記念日といった大切な瞬間に、「そばにいられない」という体験が積み重なっています。\n実際に、ヒアリングでは85%以上が孤独を感じていると回答しました。",
];

const problemEn = [
  "We are developing an emotional support service for technical intern trainees in Japan.",
  "This idea originated from interviews with around 50 Filipino trainees.\nA recurring theme in their voices was:\n“I don’t know how to express that I’m struggling”\n“I actually want to connect with others”",
  "Despite living in Japan, many are not fully engaging with Japanese people or culture.\nWe realized that the issue is not the lack of support,\nbut the lack of “language and opportunities to ask for help.”",
  "Another critical issue is loneliness.\nMany trainees come to Japan leaving behind their families and even children.\nThey repeatedly experience moments where they cannot be present for important occasions like birthdays or celebrations.",
  "In fact, over 85% reported feeling lonely.",
];

const solutionIntroJa = "この課題に対して、現在2つのサービスを検証しています。";
const solutionIntroEn = "To address this, we are currently validating two services.";

const onlineCardJa = [
  "日本の年賀状のように、気持ちを“形”にして届けるデジタルカードサービスです。\n写真やメッセージを添えて、大切な日に家族へ想いを伝えられる。",
  "単なるメッセージではなく、「ちゃんと伝えた」という実感を生む設計にしています。\nSNSでのシェアを前提に、自然な拡散も狙います。",
];

const onlineCardEn = [
  "A digital card service inspired by Japanese New Year cards,\nallowing users to send heartfelt messages with photos on special occasions.",
  "It is designed not just to send messages,\nbut to create a feeling of “I truly expressed my feelings.”",
  "We also aim for organic growth through social sharing.",
];

const mapJa = [
  "日本人が思う「日本の魅力」と、実習生が実際に感じる魅力にはズレがあります。\nそこで、彼ら自身の視点で「好き」を集めたマップを作ります。",
  "将来的には、\n・人気ランキングをもとにした交流イベント\n・企業や地域との連携\n・コミュニティ形成\n\nへと発展させていきます。",
];

const mapEn = [
  "There is a gap between what Japanese people think is attractive about Japan,\nand what trainees actually enjoy.",
  "We aim to collect and visualize “what they truly like” from their perspective.",
  "In the future, this can expand into:\n- Ranking-based events\n- Collaboration with companies and local communities\n- Community building",
];

const businessJa = [
  "両サービスに共通して、以下のマネタイズを想定しています。",
  "デジタルギフト／オンライン送金（母国へのプレゼント需要）\n企業向けデータ提供（外国人視点の日本評価データ）\nイベント／コミュニティ連携によるBtoB収益",
];

const businessEn = [
  "We plan to monetize through:\n- Digital gifts / cross-border gifting\n- Data insights for companies (foreign perspective on Japan)\n- B2B revenue through events and partnerships",
];

const whyNowJa = [
  "2027年、技能実習制度は大きく変わります。\n今後、日本はより多くの外国人材を受け入れていく流れになります。",
  "その中で問われるのは、「受け入れる数」ではなく、\n“一緒に暮らしていける関係をつくれるか”です。",
  "彼らが日本を好きになり、安心して過ごせること。\nそして日本側も、彼らの価値観や魅力を理解すること。",
  "この相互理解をつくることが、これからの日本にとって不可欠だと考えています。",
];

const whyNowEn = [
  "In 2027, Japan’s technical intern system will undergo major changes.",
  "Japan will increasingly rely on foreign workers.\nThe key question is not how many people to accept,\nbut whether we can build a society where we can live together.",
  "Helping them feel comfortable, connected, and positive about Japan,\nwhile also helping Japanese society understand them better,\nis essential for the future.",
];

export function VisionPage() {
  const { locale, setLocale } = useLanguage();
  const isJapanese = locale === "ja";

  return (
    <AppShell locale={locale} onLocaleChange={setLocale}>
      <div className="mx-auto max-w-5xl pb-16">
        <header className="mb-7 overflow-hidden rounded-[var(--radius-xl)] border border-white/75 bg-gradient-to-br from-white/82 via-[#fff7fb]/72 to-[#f2f8ff]/78 p-6 shadow-[var(--shadow-soft)] ring-1 ring-white/80 backdrop-blur-md md:mb-9 md:p-8">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--primary-deep)]/70">
            Near & Dear
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-0.035em] text-[var(--text)] md:text-4xl">
            {isJapanese ? "ビジョン" : "Vision"}
          </h1>
        </header>

        <div className="space-y-6 md:space-y-8">
          <VisionSection title={isJapanese ? "課題" : "Problem"}>
            <ContentBlock paragraphs={isJapanese ? problemJa : problemEn} />
          </VisionSection>

          <VisionSection title={isJapanese ? "解決策" : "Solution"}>
            <ContentBlock paragraphs={[isJapanese ? solutionIntroJa : solutionIntroEn]} />
            <SolutionCard
              title={
                isJapanese
                  ? "① 想いを届ける「オンラインカード」"
                  : "1. “Online Card” to express emotions"
              }
              paragraphs={isJapanese ? onlineCardJa : onlineCardEn}
            />
            <SolutionCard
              title={
                isJapanese
                  ? "② 実習生目線の「食・体験マップ」"
                  : "2. “Food & Experience Map” from trainees’ perspective"
              }
              paragraphs={isJapanese ? mapJa : mapEn}
            />
          </VisionSection>

          <VisionSection title={isJapanese ? "収益モデル" : "Business Model"}>
            <ContentBlock paragraphs={isJapanese ? businessJa : businessEn} />
          </VisionSection>

          <VisionSection title={isJapanese ? "なぜ今やるのか" : "Why Now"}>
            <ContentBlock paragraphs={isJapanese ? whyNowJa : whyNowEn} />
          </VisionSection>
        </div>
      </div>
    </AppShell>
  );
}

function VisionSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-xl)] border border-white/75 bg-white/74 p-5 shadow-[var(--shadow-soft)] ring-1 ring-white/75 backdrop-blur-md md:p-7">
      <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--text)] md:text-2xl">
        {title}
      </h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function ContentBlock({
  paragraphs,
}: {
  paragraphs: string[];
}) {
  return (
    <div className="space-y-4 text-[0.95rem] leading-[1.85] text-[var(--text)] md:text-base">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function SolutionCard({
  title,
  paragraphs,
}: {
  title: string;
  paragraphs: string[];
}) {
  return (
    <div className="rounded-[1.45rem] border border-[var(--primary-soft)]/80 bg-gradient-to-br from-white/80 to-[var(--primary-soft)]/24 p-5 shadow-[0_12px_28px_rgba(149,120,198,0.08)] md:p-6">
      <h3 className="text-base font-semibold leading-snug text-[var(--primary-deep)] md:text-lg">
        {title}
      </h3>
      <div className="mt-4">
        <ContentBlock paragraphs={paragraphs} />
      </div>
    </div>
  );
}
