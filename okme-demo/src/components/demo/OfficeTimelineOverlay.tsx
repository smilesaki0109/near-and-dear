"use client";

import { useEffect, useRef, useState } from "react";
import { OkmeImage } from "@/components/brand";
import { WeatherIcon, CalendarIcon, PinIcon } from "@/components/icons";
import { getSceneAt, type TimelineScene } from "@/lib/timeline";

/** 効果音（通知音）を鳴らす秒数 = 大きいカード／吹き出しが登場するタイミング。 */
const SCENE_CUES = [7.5, 12.6, 14.0, 23.5, 31.8, 43.0];

/** 自動選択（決定）の効果音を鳴らす秒数。提案Aの選択 / YESの選択。 */
const SELECT_CUES = [28.5, 35.8];

/** 小さく控えめに出すラベルの秒数（シーンの切り替わり）。 */
const MODE_BANNERS: { at: number; text: string }[] = [
  { at: 4.2, text: "Schedule Sync" },
  { at: 14.0, text: "Meeting Assist" },
  { at: 23.5, text: "Slide Review" },
  { at: 31.8, text: "Code Assist" },
  { at: 43.0, text: "Wellness" },
];

const SCHEDULE = [
  { time: "11:00", title: "チーム会議" },
  { time: "13:00", title: "1on1" },
  { time: "15:30", title: "資料レビュー" },
];

const FIX_CODE = `async function fetchUserData(userId: string): Promise<UserData> {
  try {
    const res = await api.get(\`/users/\${userId}\`);

    // APIレスポンスの形式が想定と異なるケースを防ぐ
    if (!res?.data || typeof res.data !== "object") {
      logger.warn("Unexpected API response shape", { userId });
      return fallbackUserData;
    }

    const user = normalizeUser(res.data);
    return validateUser(user) ? user : fallbackUserData;
  } catch (err) {
    logger.error("fetchUserData failed", err);
    return fallbackUserData;
  }
}`;

/* ---------- shared bits ---------- */

function Card({
  className = "",
  glow,
  children,
}: {
  className?: string;
  glow?: "orange" | "blue";
  children: React.ReactNode;
}) {
  const g =
    glow === "orange"
      ? "animate-ar-glow"
      : glow === "blue"
        ? "animate-ar-glow-blue"
        : "";
  return (
    <div className={`glass-ar rounded-xl text-white ${g} ${className}`}>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-white/55">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-white/80">
        <span>{label}</span>
        <span className="font-medium text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

function StatusTag({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-medium text-sky-200 backdrop-blur">
      <span className="h-1.5 w-1.5 animate-ar-pulse rounded-full bg-sky-300" />
      {text}
    </span>
  );
}

function CenterFlash({ text }: { text: string }) {
  return (
    <div className="animate-ar-flash absolute left-1/2 top-[34%] z-20 -translate-x-1/2 -translate-y-1/2">
      <span className="whitespace-nowrap rounded-lg border border-sky-300/40 bg-black/55 px-4 py-2 text-sm font-semibold tracking-wide text-sky-200 shadow-lg backdrop-blur">
        {text}
      </span>
    </div>
  );
}

function statusText(id: TimelineScene["id"], lt: number): string {
  switch (id) {
    case "arrival":
      return "環境を認識中…";
    case "desk":
      return "予定を同期中…";
    case "meeting":
      return lt < 1.2 ? "音声を解析中…" : "要約を生成しました ✓";
    case "slides":
      return lt < 2.5 ? "資料を分析中…" : "改善案を生成しました ✓";
    case "code":
      return lt < 6 ? "コードを解析中…" : "修正案を表示しました ✓";
    case "wellness":
      return "コンディションを推定中…";
    default:
      return "認識中…";
  }
}

/* ---------- scene contents ---------- */

function ArrivalScene({ t }: { t: number }) {
  const showFlash = t >= 1.0 && t <= 3.2;
  return <>{showFlash && <CenterFlash text="Office Arrival Detected" />}</>;
}

function DeskScene({ t }: { t: number }) {
  const deskFound = t >= 7.5 && t < 12.6;
  const flash = t >= 7.5 && t <= 9.2;
  const meeting = t >= 12.6;
  return (
    <>
      {flash && <CenterFlash text="Desk Found" />}

      {deskFound && (
        <Card
          key="deskcard"
          glow="orange"
          className="animate-ar-pop absolute left-3.5 top-1/2 w-60 -translate-y-1/2 p-3.5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-200">
            Your Desk Detected
          </p>
          <div className="mt-2 space-y-1.5 text-[12px] text-white/90">
            <Row label="本日の作業場所" value="C Team Desk" />
            <Row
              label="最初の予定まで"
              value={<span className="font-semibold text-orange">あと10分</span>}
            />
            <Row label="まず確認すること" value="今日の会議メモ" />
          </div>
        </Card>
      )}

      {meeting && (
        <Card
          key="meetcard"
          className="animate-ar-pop absolute left-3.5 top-1/2 w-64 -translate-y-1/2 p-3.5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-200">
            次の打ち合わせ
          </p>
          <p className="mt-1 text-sm font-semibold">11:00 チーム会議</p>
          <div className="mt-2 space-y-1 text-[11px] text-white/85">
            <p className="flex items-center gap-1.5">
              <PinIcon className="h-3.5 w-3.5" />
              会議室 A-12
            </p>
            <p>目的：プロジェクト進捗確認</p>
            <p>参加者：田中さん / 山本さん / Sakiさん</p>
          </div>
          <div className="mt-2 rounded-lg bg-white/10 p-2 text-[11px]">
            <span className="text-white/60">準備：</span>前回メモ・進捗・相談事項
          </div>
        </Card>
      )}
    </>
  );
}

function MeetingScene({ lt }: { lt: number }) {
  const items = ["現在の進捗", "遅延リスク", "次回までの担当タスク"];
  return (
    <div
      key="meeting"
      className={`animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[88%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-black/40 p-5 backdrop-blur-md transition-all duration-500 ${
        lt < 3 ? "animate-ar-glow-blue border-sky-300/70" : "border-white/20"
      }`}
    >
      <p className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-sky-200">
        <span className="h-2 w-2 animate-ar-pulse rounded-full bg-sky-300" />
        Meeting Assist
      </p>

      <div className="space-y-1.5 text-[13px] text-white">
        <Row label="今日のトピック" value="プロジェクト進捗確認" />
        <Row label="議論ポイント" value="今後の課題整理" />
      </div>

      <p className="mt-3 text-[11px] text-white/65">確認すべきこと</p>
      <ul className="mt-1.5 space-y-1.5 text-[13px] text-white">
        {items.map(
          (it, i) =>
            lt > 1 + i * 0.6 && (
              <li key={it} className="animate-ar-pop flex items-center gap-2">
                <span className="text-sky-300">{i + 1}.</span>
                {it}
              </li>
            ),
        )}
      </ul>
    </div>
  );
}

function SlidesScene({ lt }: { lt: number }) {
  const points = ["現状数値", "5倍成長の理由", "実現ステップ", "導入効果"];
  const showProps = lt >= 2.5;
  const selectedA = lt >= 5.0;
  const showAnalysis = !showProps;

  return (
    <>
      {showAnalysis && (
        <Card
          key="sr"
          className="animate-ar-pop absolute left-3.5 top-1/2 w-60 -translate-y-1/2 p-3.5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-200">
            Slide Review Assist
          </p>
          <p className="mt-2 text-[12px] text-white/90">
            <span className="text-orange">分析結果：</span>
            売上目標の根拠説明が不足しています
          </p>
          <p className="mt-2 text-[10px] text-white/55">改善ポイント</p>
          <ul className="mt-1 space-y-1 text-[12px] text-white/90">
            {points.map(
              (p, i) =>
                lt > 0.6 + i * 0.4 && (
                  <li key={p} className="animate-ar-pop flex items-center gap-2">
                    <span className="text-white/45">{i + 1}.</span>
                    {p}
                  </li>
                ),
            )}
          </ul>
        </Card>
      )}

      {/* dim backdrop to focus the central game-style panel */}
      {showProps && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[1px]" />
      )}

      {showProps && (
        <div
          key="props"
          className="animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2"
        >
          <p className="mb-3 flex items-center justify-center gap-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-sky-200">
            <span className="h-2 w-2 animate-ar-pulse rounded-full bg-sky-300" />
            AI Slide Proposal
          </p>

          <div className="flex items-stretch gap-3 sm:gap-4">
            {/* 提案A */}
            <div
              className={`animate-ar-slide-l relative flex-1 rounded-2xl border bg-black/75 p-4 backdrop-blur transition-all duration-500 sm:p-5 ${
                selectedA
                  ? "animate-ar-glow-blue border-sky-300/80 shadow-[0_0_40px_rgba(96,165,250,0.45)]"
                  : "border-white/15"
              }`}
            >
              {selectedA && (
                <span className="absolute -top-2 right-3 animate-ar-pop rounded-full bg-brand-blue px-3 py-0.5 text-[10px] font-bold tracking-wide text-white shadow">
                  ✓ SELECTED
                </span>
              )}
              <p className="text-sm font-bold text-sky-100 sm:text-base">
                提案A：成長ストーリー型
              </p>
              <ul className="mt-2 space-y-1 text-[12px] text-white/85 sm:text-[13px]">
                <li>現状課題</li>
                <li>OKme!導入</li>
                <li>生産性向上</li>
                <li>売上5倍の道筋</li>
              </ul>
            </div>

            {/* 提案B */}
            <div
              className={`animate-ar-slide-r flex-1 rounded-2xl border border-white/15 bg-black/75 p-4 backdrop-blur transition-all duration-500 sm:p-5 ${
                selectedA ? "opacity-40" : ""
              }`}
            >
              <p className="text-sm font-bold text-orange sm:text-base">
                提案B：数値根拠型
              </p>
              <ul className="mt-2 space-y-1 text-[12px] text-white/85 sm:text-[13px]">
                <li>現在売上</li>
                <li>目標売上</li>
                <li>必要施策</li>
                <li>効果試算</li>
              </ul>
            </div>
          </div>

          {/* buttons */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <span
              className={`rounded-xl px-6 py-2.5 text-sm font-bold tracking-wide transition-all ${
                selectedA
                  ? "animate-ar-pulse bg-brand-blue text-white shadow-[0_0_24px_rgba(96,165,250,0.6)]"
                  : "border border-white/30 text-white/80"
              }`}
            >
              案Aで作成
            </span>
            <span className="rounded-xl border border-white/25 px-6 py-2.5 text-sm font-semibold text-white/60">
              案Bで作成
            </span>
            <span className="rounded-xl border border-white/25 px-6 py-2.5 text-sm font-semibold text-white/60">
              比較する
            </span>
          </div>

          {selectedA && (
            <p className="mt-3 animate-okme-fade-in text-center text-[12px] font-medium tracking-wide text-sky-200">
              案A「成長ストーリー型」で作成します
            </p>
          )}
          {showProps && !selectedA && (
            <p className="mt-3 text-center text-[10px] tracking-widest text-sky-200/80">
              ▸ AUTO-SELECTING “案A”…
            </p>
          )}
        </div>
      )}
    </>
  );
}

function CodeScene({ lt }: { lt: number }) {
  const fixes = [
    "APIレスポンスのnullチェックを追加",
    "型定義を更新",
    "エラーハンドリングを追加",
    "表示前にデータ整形を実行",
  ];
  const analysis = [
    "Analyzing files...",
    "3 files scanned",
    "2 issues found",
    "Patch suggestion ready",
  ];
  const showConfirm = lt >= 2.0;
  const yesSelected = lt >= 4.0;
  const showCode = lt >= 5.4;
  const codeChars = Math.max(0, Math.floor((lt - 5.4) / 0.01));
  const showSide = !showConfirm && !yesSelected;

  return (
    <>
      {showSide && (
        <Card
          key="ca"
          glow="orange"
          className="animate-ar-pop absolute left-3.5 top-1/2 w-60 -translate-y-1/2 p-3.5"
        >
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-orange">
            ⚠ Code Assist
          </p>
          <div className="mt-2 space-y-1 text-[12px] text-white/90">
            <Row label="エラー検知" value={<span className="text-orange">API Response Error</span>} />
            <Row label="影響箇所" value={<code className="text-sky-200">fetchUserData()</code>} />
            <Row label="原因候補" value="response.data の型不一致" />
            <Row label="優先度" value={<span className="text-orange">High</span>} />
          </div>
        </Card>
      )}

      {showSide && (
        <Card key="fix" className="animate-ar-slide-r absolute right-3.5 top-1/2 w-48 -translate-y-1/2 p-2.5">
          <p className="text-[10px] text-white/65">Fix Suggestion</p>
          <ul className="mt-1.5 space-y-1 text-[11px] text-white/90">
            {fixes.map((f, i) => (
              <li key={f} className="flex gap-1.5">
                <span className="text-white/45">{i + 1}.</span>
                {f}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* dim backdrop to focus the central game-style panel */}
      {(showConfirm || yesSelected) && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[1px]" />
      )}

      {showConfirm && !yesSelected && (
        <div
          key="cf"
          className="animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[82%] max-w-md -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rounded-2xl border border-orange/60 bg-black/70 px-8 py-7 text-center shadow-[0_0_50px_rgba(249,115,22,0.35)] backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange">
              Code Assist
            </p>
            <p className="mt-3 text-xl font-bold text-white sm:text-2xl">
              修正箇所を表示しますか？
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <span className="animate-ar-pulse rounded-xl bg-brand-blue px-9 py-3 text-lg font-extrabold tracking-wide text-white shadow-[0_0_28px_rgba(96,165,250,0.65)]">
                YES
              </span>
              <span className="rounded-xl border border-white/30 px-9 py-3 text-lg font-semibold text-white/70">
                Later
              </span>
            </div>
            <p className="mt-4 text-[10px] tracking-widest text-sky-200/80">
              ▸ AUTO-SELECTING “YES”…
            </p>
          </div>
        </div>
      )}

      {yesSelected && (
        <div
          key="an"
          className="animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[88%] max-w-xl -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rounded-2xl border border-sky-300/40 bg-black/75 p-5 shadow-[0_0_50px_rgba(96,165,250,0.3)] backdrop-blur sm:p-6">
            <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.25em] text-sky-200">
              <span className="h-2 w-2 animate-ar-pulse rounded-full bg-sky-300" />
              Patch Analysis
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-sky-100 sm:text-[15px]">
              {analysis.map(
                (a, i) =>
                  lt > 4.2 + i * 0.3 && (
                    <li
                      key={a}
                      className="animate-okme-fade-in flex items-center gap-2"
                    >
                      <span className="text-emerald-300">✓</span>
                      {a}
                    </li>
                  ),
              )}
            </ul>
            {showCode && (
              <pre className="mt-4 max-h-52 overflow-auto rounded-lg border border-white/10 bg-black/70 p-4 text-[12px] leading-relaxed text-emerald-300 sm:text-[13px]">
                <code>
                  {FIX_CODE.slice(0, codeChars)}
                  <span className="animate-ar-pulse">▍</span>
                </code>
              </pre>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function WellnessScene({ lt }: { lt: number }) {
  const showFinal = lt >= 3.5;
  return (
    <>
      <div
        key="wellness"
        className="animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[88%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-black/40 p-5 backdrop-blur-md"
      >
        <p className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-sky-200">
          <span className="h-2 w-2 animate-ar-pulse rounded-full bg-sky-300" />
          Wellness Check
        </p>

        <div className="space-y-3">
          <Bar label="今日の疲労度" value={82} color="#f97316" />
          <Bar label="ストレス度" value={68} color="#60a5fa" />
        </div>
        <div className="mt-3 space-y-1 text-[13px] text-white">
          <Row label="集中時間" value="長め" />
          <Row label="推奨" value="3分リフレッシュ" />
        </div>

        <p className="mt-3 text-[10px] leading-relaxed text-white/55">
          ※ デモ用の推定値です。医療的な診断ではありません。
        </p>

        {showFinal && (
          <div className="mt-4 animate-okme-fade-in border-t border-white/15 pt-3 text-center">
            <p className="text-lg font-bold text-white drop-shadow">
              Good work today
            </p>
            <p className="mt-1 text-[13px] text-sky-200">
              OKme! is always on your side
            </p>
          </div>
        )}
      </div>

      {lt >= 5 && (
        <div className="animate-okme-fade-in pointer-events-none absolute inset-0 z-10 bg-white/10" />
      )}
    </>
  );
}

/* ---------- main overlay ---------- */

export function OfficeTimelineOverlay({
  currentTime,
  onSceneChange,
}: {
  currentTime: number;
  onSceneChange?: (id: TimelineScene["id"]) => void;
}) {
  const t = currentTime;
  const scene = getSceneAt(t);
  const lt = t - scene.start;

  const prevTimeRef = useRef(0);
  const firedCues = useRef<Set<number>>(new Set());
  const firedSelects = useRef<Set<number>>(new Set());
  const firedBanners = useRef<Set<number>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bannerTimer = useRef<number | null>(null);
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  useEffect(() => {
    onSceneChange?.(scene.id);
  }, [scene.id, onSceneChange]);

  const ensureCtx = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (Ctor) audioCtxRef.current = new Ctor();
    }
    return audioCtxRef.current;
  };

  // 短い未来的なUIビープ音を生成（音量は小さめ）。
  const playBeep = () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  };

  // タイピング音（短いカチッという音、控えめ・ランダムな高さ）。
  const playClick = () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1400 + Math.random() * 1100, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  };

  // 決定音（上がる2音の確定チャイム）。
  const playSelect = () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const notes = [660, 990];
    notes.forEach((freq, i) => {
      const t0 = now + i * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.18, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.24);
    });
  };

  const showBanner = (text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    bannerTimer.current = window.setTimeout(() => setBanner(null), 1600);
  };

  // 初回マウント：ユーザー操作で AudioContext を解放（自動再生制限の回避）＋Arrivalバナー
  useEffect(() => {
    const resume = () => ensureCtx()?.resume?.().catch(() => {});
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);
    showBanner("Arrival");
    firedBanners.current.add(0);
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // currentTime が各切り替え秒数を超えた瞬間に1回だけ効果音／バナーを発火。
  // 動画が最初に戻った（ループ）ら、鳴らした記録をリセット。
  useEffect(() => {
    const prev = prevTimeRef.current;
    prevTimeRef.current = currentTime;

    if (currentTime < prev - 1) {
      firedCues.current.clear();
      firedSelects.current.clear();
      firedBanners.current.clear();
      showBanner("Arrival");
      firedBanners.current.add(0);
      return;
    }

    for (const c of SCENE_CUES) {
      if (!firedCues.current.has(c) && prev < c && currentTime >= c) {
        firedCues.current.add(c);
        playBeep();
      }
    }
    for (const c of SELECT_CUES) {
      if (!firedSelects.current.has(c) && prev < c && currentTime >= c) {
        firedSelects.current.add(c);
        playSelect();
      }
    }
    for (const b of MODE_BANNERS) {
      if (!firedBanners.current.has(b.at) && prev < b.at && currentTime >= b.at) {
        firedBanners.current.add(b.at);
        showBanner(b.text);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  // コード記述の場面でのみタイピング音を鳴らす。
  const typingActive =
    scene.id === "code" && lt >= 5.4 && lt < 5.4 + FIX_CODE.length * 0.01;

  useEffect(() => {
    if (!typingActive) return;
    const id = window.setInterval(() => playClick(), 110);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingActive]);

  const showSchedule = scene.id === "arrival" || scene.id === "desk";

  // 48秒以降は全カード・オーバーレイを非表示（動画はそのまま）。
  if (t >= 48) return null;

  return (
    <div className="pointer-events-none relative h-full w-full select-none">
      {/* top-left: clock + weather */}
      <Card className="absolute left-3.5 top-3.5 px-3 py-2">
        <p className="text-lg font-semibold leading-none tabular-nums sm:text-xl">
          10:32
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/75">
          <WeatherIcon className="h-3.5 w-3.5" />
          晴れ 23℃
        </p>
      </Card>

      {/* top-center: privacy + live status */}
      <div className="absolute left-1/2 top-3 z-40 flex -translate-x-1/2 flex-col items-center gap-1.5">
        <span className="rounded-full bg-black/45 px-3 py-1 text-[10px] text-white/85 backdrop-blur">
          🔒 Privacy Mode ON ・ 顔認識/個人特定なし
        </span>
        <StatusTag text={statusText(scene.id, lt)} />
      </div>

      {/* scene-change label (small & subtle, ~1.5s) */}
      {banner && (
        <div
          key={banner.key}
          className="animate-ar-flash pointer-events-none absolute left-1/2 top-[13%] z-30 -translate-x-1/2"
        >
          <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-medium text-white/75 backdrop-blur">
            <span className="h-1 w-1 rounded-full bg-sky-300/80" />
            {banner.text}
          </span>
        </div>
      )}

      {/* top-right: today's schedule (early scenes only) */}
      {showSchedule && (
        <Card className="absolute right-3.5 top-3.5 w-36 p-2.5 sm:w-40">
          <p className="mb-1.5 flex items-center gap-1.5 text-[10px] text-white/65">
            <CalendarIcon className="h-3.5 w-3.5" />
            今日の予定
          </p>
          <ul className="space-y-1">
            {SCHEDULE.map((e) => (
              <li key={e.time} className="flex items-center gap-2 text-[11px]">
                <span className="tabular-nums text-white/60">{e.time}</span>
                <span className="truncate text-white/90">{e.title}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* scene-specific HUD */}
      {scene.id === "arrival" && <ArrivalScene t={t} />}
      {scene.id === "desk" && <DeskScene t={t} />}
      {scene.id === "meeting" && <MeetingScene lt={lt} />}
      {scene.id === "slides" && <SlidesScene lt={lt} />}
      {scene.id === "code" && <CodeScene lt={lt} />}
      {scene.id === "wellness" && <WellnessScene lt={lt} />}

      {/* bottom: OKme! character + speech bubble (always on top) */}
      <div className="absolute bottom-5 left-1/2 z-40 flex w-[92%] max-w-md -translate-x-1/2 items-end gap-2">
        <Card
          key={scene.id}
          className="animate-okme-fade-in flex-1 rounded-br-sm px-3 py-2 text-[12px] leading-relaxed text-white/90"
        >
          <span className="mb-0.5 block text-[10px] font-medium text-orange">
            OKme!
          </span>
          {scene.okmeMessage}
        </Card>
        <div className={scene.id === "wellness" ? "animate-ar-wave" : "animate-ar-bob"}>
          <OkmeImage
            src="/images/okme-character.png"
            fallback="character"
            alt="OKme! キャラクター"
            className="w-14 shrink-0 drop-shadow"
          />
        </div>
      </div>
    </div>
  );
}
