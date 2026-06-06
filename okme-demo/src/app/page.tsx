import Link from "next/link";
import { OkmeImage, OkmeLogo } from "@/components/brand";
import { FeatureSection } from "@/components/FeatureSection";
import { CalendarIcon, PulseIcon, PinIcon } from "@/components/icons";

export default function Home() {
  return (
    <main className="min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-line bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <OkmeLogo />
            <nav className="hidden items-center gap-6 text-sm text-sub md:flex">
              <a href="#features" className="hover:text-ink">
                機能
              </a>
              <Link href="/demo" className="hover:text-ink">
                デモ
              </Link>
            </nav>
          </div>
          <Link
            href="/demo"
            className="rounded-full bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-strong"
          >
            デモを開始
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-[1200px] px-6 py-14 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-sub">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" />
              オフィス向け AI Companion
            </span>

            <h1 className="mt-5 text-[2rem] font-bold leading-[1.3] tracking-tight text-navy sm:text-[2.5rem] sm:leading-[1.25]">
              オフィスの毎日に、そっと寄り添う
              <br className="hidden sm:block" />
              AI Companion
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-sub">
              OKme! は、予定・コンディション・タスクをカメラ映像に重ねて表示し、
              ARメガネの未来体験を Web 上で再現するデモアプリです。
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-strong"
              >
                デモを開始
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-navy hover:border-navy/30"
              >
                機能を見る
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-sub">
              <span>カメラ映像は端末内のみで処理</span>
              <span className="hidden h-3 w-px bg-line sm:block" />
              <span>インストール不要・ブラウザで完結</span>
            </div>
          </div>

          {/* Product card */}
          <div className="animate-fade-up lg:justify-self-end">
            <div className="card w-full max-w-md rounded-2xl p-5">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <div className="flex items-center gap-2">
                  <OkmeImage
                    src="/images/okme-character.png"
                    fallback="character"
                    alt="OKme!"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <span className="text-sm font-semibold text-navy">OKme!</span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs text-sub">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  ライブビュー
                </span>
              </div>

              <div className="mt-4 flex items-start gap-4">
                <OkmeImage
                  src="/images/okme-character.png"
                  fallback="character"
                  alt="OKme! キャラクター"
                  className="w-20 shrink-0"
                />
                <div className="flex-1 space-y-2.5">
                  <InfoRow
                    icon={<CalendarIcon className="h-4 w-4 text-brand-blue" />}
                    label="次の予定"
                    value="13:00 1on1"
                  />
                  <InfoRow
                    icon={<PinIcon className="h-4 w-4 text-brand-blue" />}
                    label="場所"
                    value="会議室 A-12"
                  />
                </div>
              </div>

              {/* condition */}
              <div className="mt-4 rounded-xl bg-bluegrey/60 p-3">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-sub">
                    <PulseIcon className="h-3.5 w-3.5 text-orange" />
                    疲労度
                  </span>
                  <span className="font-semibold text-navy">72%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-orange" style={{ width: "72%" }} />
                </div>
              </div>

              {/* bubble */}
              <div className="mt-4 rounded-xl rounded-tl-sm bg-navy px-3.5 py-2.5 text-[13px] leading-relaxed text-white/90">
                Sakiさん、おはようございます。今日は会議が多めです。合間に休憩をはさみましょう。
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AR main visual */}
      <section className="mx-auto w-full max-w-[1200px] px-6 pb-6">
        <div className="grid items-center gap-8 rounded-2xl border border-line bg-navy px-6 py-10 sm:px-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-white/55">
              AR Glasses Experience
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-snug text-white">
              ARメガネの中の世界を、
              <br />
              ブラウザでのぞいてみる。
            </h2>
            <p className="mt-3 max-w-md text-sm leading-7 text-white/70">
              視界に予定・コンディション・タスクをそっと重ねる。
              OKme! が支える、これからの働き方の一場面です。
            </p>
            <Link
              href="/demo"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-strong"
            >
              デモで体験する
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end">
            <OkmeImage
              src="/images/okme-hero.png"
              fallback="character"
              alt="OKme! ARメガネ メインビジュアル"
              className="w-full max-w-md"
            />
          </div>
        </div>
      </section>

      <div id="features" />
      <FeatureSection />

      <footer className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <OkmeLogo className="h-6" />
          <p className="text-xs text-sub">© 2026 OKme! — Office AI Companion (Web Demo)</p>
        </div>
      </footer>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
      <span className="flex items-center gap-2 text-xs text-sub">
        {icon}
        {label}
      </span>
      <span className="text-sm font-semibold text-navy">{value}</span>
    </div>
  );
}
