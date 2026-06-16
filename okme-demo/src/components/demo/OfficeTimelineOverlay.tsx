"use client";

import { useEffect, useRef, useState } from "react";
import { OkmeImage, OkmeLogo } from "@/components/brand";
import { CalendarIcon, PinIcon } from "@/components/icons";
import { getSceneAt, type TimelineScene } from "@/lib/timeline";

/** 効果音（通知音）を鳴らす秒数 = 大きいカード／吹き出しが登場するタイミング。 */
const SCENE_CUES = [4.4, 8.4, 14.4, 22.4, 24.6, 30.4, 36.4, 42.4, 46.4, 50.4];

/** 自動選択（決定）の効果音を鳴らす秒数。提案Aの自動選択 / 修正パッチ確定。 */
const SELECT_CUES = [27.0, 34.0];

/** 小さなカード／リスト項目が表示される瞬間の軽い「表示音（ポップ）」。 */
const POP_CUES = [
  1.0, // Arrival 検知フラッシュ
  4.8, 5.2, 5.6, // Desk rows
  8.8, 9.3, 9.8, // Meeting Prep items
  15.4, 16.0, 16.6, // Meeting action items
  22.8, 23.2, 23.6, 24.0, // Slide points
  32.4, 32.8, 33.2, // Patch analysis items
  36.8, 37.3, // Wellness
  42.8, 43.2, 43.6, 44.0, // Daily Summary stats
  46.8, // Ending
];

/** 小さく控えめに出すラベルの秒数（シーンの切り替わり）。 */
const MODE_BANNERS: { at: number; text: string }[] = [
  { at: 4, text: "Desk Detection" },
  { at: 8, text: "Meeting Prep" },
  { at: 14, text: "Meeting Assist" },
  { at: 22, text: "Slide Review" },
  { at: 30, text: "Code Assist" },
  { at: 36, text: "Wellness" },
  { at: 42, text: "Daily Summary" },
  { at: 46, text: "Ending" },
];

const SCHEDULE = [
  { time: "11:00", title: "チーム会議" },
  { time: "13:00", title: "1on1" },
  { time: "15:30", title: "資料レビュー" },
];

const FIX_CODE = `async function fetchUserData(id: string) {
  const res = await api.get(\`/users/\${id}\`);
  // APIレスポンスのnullチェック
  if (!res?.data) return fallbackUserData;
  return validateUser(res.data) ? res.data : fallbackUserData;
}`;

/** コードのタイピング開始(lt)と1文字あたりの秒数（フル演出用）。 */
const CODE_TYPE_START = 2.3;
const CODE_TYPE_RATE = 0.012;

/** 下半分の修正案コード（後半2秒で速く打ち込む）の開始(lt)と1文字あたりの秒数。 */
const CODE_LOWER_START = 4.0;
const CODE_LOWER_RATE = 0.006;

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
      <div className="mb-1.5 flex items-center justify-between text-[13px] text-white/80">
        <span>{label}</span>
        <span className="font-medium text-white">{value}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/15">
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
    <div className="animate-ar-flash absolute left-1/2 top-[32%] z-20 -translate-x-1/2 -translate-y-1/2">
      <span className="whitespace-nowrap rounded-xl border border-sky-300/40 bg-black/55 px-6 py-3 text-base font-semibold tracking-wide text-sky-200 shadow-lg backdrop-blur sm:text-lg">
        {text}
      </span>
    </div>
  );
}

/** 現在シーンのHUDモード名（常時表示用）。 */
function modeName(id: TimelineScene["id"]): string {
  switch (id) {
    case "arrival":
      return "Arrival";
    case "desk":
      return "Desk Detection";
    case "meetingPrep":
      return "Meeting Prep";
    case "meeting":
      return "Meeting Assist";
    case "slides":
      return "Slide Review";
    case "code":
      return "Code Assist";
    case "wellness":
      return "Wellness";
    case "summary":
      return "Daily Summary";
    case "ending":
      return "Ending";
    case "logo":
      return "OKme!";
    default:
      return "Standby";
  }
}

function statusText(id: TimelineScene["id"], lt: number): string {
  switch (id) {
    case "arrival":
      return "環境を認識中…";
    case "desk":
      return "デスクを認識中…";
    case "meetingPrep":
      return "会議の準備をしています…";
    case "meeting":
      return lt < 1.4 ? "会議を記録中…" : "要点を整理しました ✓";
    case "slides":
      return lt < 2.5 ? "資料を分析中…" : "改善案を生成しました ✓";
    case "code":
      return lt < 2.0 ? "コードを解析中…" : "修正案を表示しました ✓";
    case "wellness":
      return "コンディションを推定中…";
    case "summary":
      return "本日の活動を集計中…";
    case "ending":
      return "本日の記録を保存しました ✓";
    case "logo":
      return "Session Complete";
    default:
      return "認識中…";
  }
}

/* ---------- scene contents ---------- */

function ArrivalScene({ t }: { t: number }) {
  const showFlash = t >= 1.0 && t <= 3.0;
  return <>{showFlash && <CenterFlash text="Office Arrival Detected" />}</>;
}

function DeskScene({ lt }: { lt: number }) {
  const flash = lt >= 0.3 && lt <= 1.6;
  return (
    <>
      {flash && <CenterFlash text="Desk Found" />}
      <Card
        key="deskcard"
        glow="orange"
        className="animate-ar-pop absolute left-4 top-1/2 w-80 -translate-y-1/2 p-5"
      >
        <p className="text-[13px] font-semibold uppercase tracking-wide text-sky-200">
          Desk Detected
        </p>
        <div className="mt-3 space-y-2 text-[15px] text-white/90">
          <Row label="Workspace" value="C Team Desk" />
          <Row label="Today's Schedule" value="3 events" />
          <Row
            label="Next Meeting"
            value={<span className="font-semibold text-orange">11:00</span>}
          />
        </div>
      </Card>
    </>
  );
}

function MeetingPrepScene({ lt }: { lt: number }) {
  const items = ["Previous Notes", "Discussion Points", "会議室 A-12"];
  return (
    <Card
      key="prep"
      className="animate-ar-pop absolute left-4 top-1/2 w-80 -translate-y-1/2 p-5"
    >
      <p className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-sky-200">
        <CalendarIcon className="h-4 w-4" />
        Meeting in 10 min
      </p>
      <p className="mt-1.5 text-lg font-semibold">11:00 チーム会議</p>
      <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white/75">
        <PinIcon className="h-4 w-4" />
        プロジェクト進捗確認
      </p>
      <p className="mt-3 text-[12px] text-white/55">準備しておくこと</p>
      <ul className="mt-1.5 space-y-1.5 text-[15px] text-white/90">
        {items.map(
          (it, i) =>
            lt > 0.6 + i * 0.5 && (
              <li key={it} className="animate-ar-pop flex items-center gap-2">
                <span className="text-sky-300">›</span>
                {it}
              </li>
            ),
        )}
      </ul>
    </Card>
  );
}

function MeetingScene({ lt }: { lt: number }) {
  const actions = [
    "課題リストを次回までに更新",
    "遅延タスクの担当を再確認",
    "リリース日を関係者へ共有",
  ];
  return (
    <div
      key="meeting"
      className={`animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[88%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-black/55 p-7 backdrop-blur-md transition-all duration-500 ${
        lt < 3 ? "animate-ar-glow-blue border-sky-300/70" : "border-white/20"
      }`}
    >
      <p className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.3em] text-sky-200">
        <span className="h-2.5 w-2.5 animate-ar-pulse rounded-full bg-sky-300" />
        Meeting Summary
      </p>

      <div className="space-y-2 text-base text-white">
        <Row label="トピック" value="プロジェクト進捗確認" />
        <Row label="結論" value="スケジュールは概ね順調" />
      </div>

      <p className="mt-4 text-[13px] text-white/65">Action Items</p>
      <ul className="mt-2 space-y-2 text-base text-white">
        {actions.map(
          (it, i) =>
            lt > 1.2 + i * 0.6 && (
              <li key={it} className="animate-ar-pop flex items-center gap-2">
                <span className="text-emerald-300">✓</span>
                {it}
              </li>
            ),
        )}
      </ul>

      {lt > 3.4 && (
        <p className="mt-4 animate-okme-fade-in text-[13px] text-sky-200">
          Next Steps：次回までに各タスクの進捗を共有
        </p>
      )}
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
          className="animate-ar-pop absolute left-4 top-1/2 w-80 -translate-y-1/2 p-5"
        >
          <p className="text-[13px] font-semibold uppercase tracking-wide text-sky-200">
            Slide Review Assist
          </p>
          <p className="mt-2.5 text-[15px] text-white/90">
            <span className="text-orange">分析結果：</span>
            売上目標の根拠説明が不足しています
          </p>
          <p className="mt-3 text-[12px] text-white/55">改善ポイント</p>
          <ul className="mt-1.5 space-y-1.5 text-[15px] text-white/90">
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

      {showProps && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[1px]" />
      )}

      {showProps && (
        <div
          key="props"
          className="animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[92%] max-w-3xl -translate-x-1/2 -translate-y-1/2"
        >
          <p className="mb-4 flex items-center justify-center gap-2 text-[13px] font-semibold uppercase tracking-[0.3em] text-sky-200">
            <span className="h-2.5 w-2.5 animate-ar-pulse rounded-full bg-sky-300" />
            AI Slide Proposal
          </p>

          <div className="flex items-stretch gap-4 sm:gap-5">
            {/* 提案A */}
            <div
              className={`animate-ar-slide-l relative flex-1 rounded-2xl border bg-black/75 p-5 backdrop-blur transition-all duration-500 sm:p-6 ${
                selectedA
                  ? "animate-ar-glow-blue border-sky-300/80 shadow-[0_0_40px_rgba(96,165,250,0.45)]"
                  : "border-white/15"
              }`}
            >
              {selectedA && (
                <span className="absolute -top-2.5 right-3 animate-ar-pop rounded-full bg-brand-blue px-3.5 py-1 text-[11px] font-bold tracking-wide text-white shadow">
                  ✓ SELECTED
                </span>
              )}
              <p className="text-lg font-bold text-sky-100 sm:text-xl">
                提案A：成長ストーリー型
              </p>
              <ul className="mt-3 space-y-1.5 text-[15px] text-white/85">
                <li>現状課題</li>
                <li>OKme!導入</li>
                <li>生産性向上</li>
                <li>売上5倍の道筋</li>
              </ul>
            </div>

            {/* 提案B */}
            <div
              className={`animate-ar-slide-r flex-1 rounded-2xl border border-white/15 bg-black/75 p-5 backdrop-blur transition-all duration-500 sm:p-6 ${
                selectedA ? "opacity-40" : ""
              }`}
            >
              <p className="text-lg font-bold text-orange sm:text-xl">
                提案B：数値根拠型
              </p>
              <ul className="mt-3 space-y-1.5 text-[15px] text-white/85">
                <li>現在売上</li>
                <li>目標売上</li>
                <li>必要施策</li>
                <li>効果試算</li>
              </ul>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <span
              className={`rounded-xl px-7 py-3 text-base font-bold tracking-wide transition-all ${
                selectedA
                  ? "animate-ar-pulse bg-brand-blue text-white shadow-[0_0_24px_rgba(96,165,250,0.6)]"
                  : "border border-white/30 text-white/80"
              }`}
            >
              案Aで作成
            </span>
            <span className="rounded-xl border border-white/25 px-7 py-3 text-base font-semibold text-white/60">
              案Bで作成
            </span>
            <span className="rounded-xl border border-white/25 px-7 py-3 text-base font-semibold text-white/60">
              比較する
            </span>
          </div>

          {selectedA && (
            <p className="mt-4 animate-okme-fade-in text-center text-sm font-medium tracking-wide text-sky-200">
              案A「成長ストーリー型」で作成します
            </p>
          )}
          {showProps && !selectedA && (
            <p className="mt-4 text-center text-[11px] tracking-widest text-sky-200/80">
              ▸ AUTO-SELECTING “案A”…
            </p>
          )}
        </div>
      )}
    </>
  );
}

/**
 * 資料作成シーン後半に、画面下半分へ出すゲーム式の提案カード（A/B）。
 * ARメガネ（上部）に被らないよう下半分に配置し、半透明で前面に表示。Aを自動選択。
 */
function SlideProposalLower({ lt }: { lt: number }) {
  const selectedA = lt >= 5.0;
  return (
    <div className="animate-ar-pop absolute left-1/2 top-[62%] z-30 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2">
      <p className="mb-3 flex items-center justify-center gap-2 text-[12px] font-semibold uppercase tracking-[0.3em] text-sky-200">
        <span className="h-2.5 w-2.5 animate-ar-pulse rounded-full bg-sky-300" />
        AI Slide Proposal
      </p>

      <div className="flex items-stretch gap-3 sm:gap-4">
        {/* 提案A */}
        <div
          className={`animate-ar-slide-l relative flex-1 rounded-2xl border bg-black/55 p-4 backdrop-blur-md transition-all duration-500 ${
            selectedA
              ? "animate-ar-glow-blue border-sky-300/80 shadow-[0_0_36px_rgba(96,165,250,0.45)]"
              : "border-white/15"
          }`}
        >
          {selectedA && (
            <span className="absolute -top-2.5 right-3 animate-ar-pop rounded-full bg-brand-blue px-3 py-0.5 text-[10px] font-bold tracking-wide text-white shadow">
              ✓ SELECTED
            </span>
          )}
          <p className="text-base font-bold text-sky-100 sm:text-lg">
            提案A：成長ストーリー型
          </p>
          <ul className="mt-2 space-y-1 text-[13px] text-white/85">
            <li>現状課題</li>
            <li>OKme!導入</li>
            <li>生産性向上</li>
            <li>売上5倍の道筋</li>
          </ul>
        </div>

        {/* 提案B */}
        <div
          className={`animate-ar-slide-r flex-1 rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur-md transition-all duration-500 ${
            selectedA ? "opacity-40" : ""
          }`}
        >
          <p className="text-base font-bold text-orange sm:text-lg">
            提案B：数値根拠型
          </p>
          <ul className="mt-2 space-y-1 text-[13px] text-white/85">
            <li>現在売上</li>
            <li>目標売上</li>
            <li>必要施策</li>
            <li>効果試算</li>
          </ul>
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-center gap-2.5">
        <span
          className={`rounded-xl px-5 py-2 text-sm font-bold tracking-wide transition-all ${
            selectedA
              ? "animate-ar-pulse bg-brand-blue text-white shadow-[0_0_20px_rgba(96,165,250,0.6)]"
              : "border border-white/30 text-white/80"
          }`}
        >
          案Aで作成
        </span>
        <span className="rounded-xl border border-white/25 px-5 py-2 text-sm font-semibold text-white/60">
          案Bで作成
        </span>
        <span className="rounded-xl border border-white/25 px-5 py-2 text-sm font-semibold text-white/60">
          比較する
        </span>
      </div>

      {selectedA ? (
        <p className="mt-3 animate-okme-fade-in text-center text-[13px] font-medium tracking-wide text-sky-200">
          案A「成長ストーリー型」で作成します
        </p>
      ) : (
        <p className="mt-3 text-center text-[11px] tracking-widest text-sky-200/80">
          ▸ AUTO-SELECTING “案A”…
        </p>
      )}
    </div>
  );
}

/**
 * コード支援シーン後半に、画面下半分へ出す「修正案コード」。
 * ARメガネ（上部）に被らないよう下半分に配置し、半透明で前面に表示。コードを速くタイプ。
 */
function CodePatchLower({ lt }: { lt: number }) {
  const chars = Math.max(0, Math.floor((lt - CODE_LOWER_START) / CODE_LOWER_RATE));
  return (
    <div className="animate-ar-pop absolute left-1/2 top-[64%] z-30 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2">
      <div className="rounded-2xl border border-sky-300/40 bg-black/60 p-4 shadow-[0_0_36px_rgba(96,165,250,0.25)] backdrop-blur-md sm:p-5">
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-sky-200">
          <span className="text-emerald-300">✓</span>
          Code Assist · Fix Suggestion
        </p>
        <p className="mt-1.5 text-[13px] text-white/80">
          <span className="text-orange">修正案：</span>
          APIレスポンスのnullチェックと整形を追加
        </p>
        <pre className="mt-3 max-h-44 overflow-auto rounded-lg border border-white/10 bg-black/70 p-3.5 text-[12px] leading-relaxed text-emerald-300 sm:text-[13px]">
          <code>
            {FIX_CODE.slice(0, chars)}
            <span className="animate-ar-pulse">▍</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

function CodeScene({ lt }: { lt: number }) {
  const analysis = [
    "Analyzing files...",
    "3 files scanned",
    "2 issues found",
    "Patch suggestion ready",
  ];
  const showSide = lt < 2.0;
  const showPatch = lt >= 2.0;
  const showCode = lt >= CODE_TYPE_START;
  const codeChars = Math.max(0, Math.floor((lt - CODE_TYPE_START) / CODE_TYPE_RATE));

  return (
    <>
      {showSide && (
        <Card
          key="ca"
          glow="orange"
          className="animate-ar-pop absolute left-4 top-1/2 w-80 -translate-y-1/2 p-5"
        >
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-orange">
            ⚠ API Response Error
          </p>
          <div className="mt-2.5 space-y-1.5 text-[15px] text-white/90">
            <Row label="影響箇所" value={<code className="text-sky-200">fetchUserData()</code>} />
            <Row label="原因候補" value="response.data の型不一致" />
            <Row label="優先度" value={<span className="text-orange">High</span>} />
          </div>
        </Card>
      )}

      {showSide && (
        <Card key="fix" className="animate-ar-slide-r absolute right-4 top-1/2 w-60 -translate-y-1/2 p-4">
          <p className="text-[12px] text-white/65">Fix Suggestion</p>
          <ul className="mt-2 space-y-1.5 text-[14px] text-white/90">
            {["nullチェックを追加", "型定義を更新", "整形してから表示"].map((f, i) => (
              <li key={f} className="flex gap-1.5">
                <span className="text-white/45">{i + 1}.</span>
                {f}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {showPatch && (
        <div className="absolute inset-0 z-20 bg-black/50 backdrop-blur-[1px]" />
      )}

      {showPatch && (
        <div
          key="an"
          className="animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[90%] max-w-2xl -translate-x-1/2 -translate-y-1/2"
        >
          <div className="rounded-2xl border border-sky-300/40 bg-black/75 p-6 shadow-[0_0_50px_rgba(96,165,250,0.3)] backdrop-blur sm:p-7">
            <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.25em] text-sky-200">
              <span className="h-2.5 w-2.5 animate-ar-pulse rounded-full bg-sky-300" />
              Patch Analysis
            </p>
            <ul className="mt-3.5 space-y-2 text-base text-sky-100 sm:text-[17px]">
              {analysis.map(
                (a, i) =>
                  lt > 0.4 + i * 0.3 && (
                    <li key={a} className="animate-okme-fade-in flex items-center gap-2">
                      <span className="text-emerald-300">✓</span>
                      {a}
                    </li>
                  ),
              )}
            </ul>
            {showCode && (
              <pre className="mt-4 max-h-60 overflow-auto rounded-lg border border-white/10 bg-black/70 p-4 text-[13px] leading-relaxed text-emerald-300 sm:text-[14px]">
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
  const showFinal = lt >= 3.2;
  return (
    <div
      key="wellness"
      className="animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[88%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-black/55 p-7 backdrop-blur-md"
    >
      <p className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.3em] text-sky-200">
        <span className="h-2.5 w-2.5 animate-ar-pulse rounded-full bg-sky-300" />
        Wellness Check
      </p>

      <div className="space-y-4">
        <Bar label="ストレス度 (Stress Level)" value={68} color="#60a5fa" />
      </div>
      <div className="mt-4 space-y-1.5 text-base text-white">
        <Row label="集中時間 (Focus Time)" value="3h 40m" />
        <Row label="おすすめ (Refresh)" value="3分の深呼吸" />
      </div>

      <p className="mt-4 text-[12px] leading-relaxed text-white/55">
        ※ デモ用の推定値です。医療的な診断ではありません。
      </p>

      {showFinal && (
        <div className="mt-5 animate-okme-fade-in border-t border-white/15 pt-4 text-center">
          <p className="text-lg font-semibold text-white">
            少しリフレッシュしましょう
          </p>
        </div>
      )}
    </div>
  );
}

function SummaryScene({ lt }: { lt: number }) {
  const stats = [
    { label: "Meetings", value: "2" },
    { label: "Focus Time", value: "3h 40m" },
    { label: "Completed Tasks", value: "5" },
    { label: "Documents", value: "1" },
  ];
  return (
    <div
      key="summary"
      className="animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[88%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-black/55 p-7 backdrop-blur-md"
    >
      <p className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.3em] text-sky-200">
        <span className="h-2.5 w-2.5 animate-ar-pulse rounded-full bg-sky-300" />
        Daily Summary
      </p>
      <div className="grid grid-cols-2 gap-3">
        {stats.map(
          (s, i) =>
            lt > 0.6 + i * 0.4 && (
              <div
                key={s.label}
                className="animate-ar-pop rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-[12px] uppercase tracking-wide text-white/55">
                  {s.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-white">{s.value}</p>
              </div>
            ),
        )}
      </div>
      <p className="mt-4 text-[13px] text-sky-200">本日の活動をまとめました。</p>
    </div>
  );
}

/**
 * Arrival シーン冒頭(0〜2秒)で、右下（半分より下）に出す挨拶の吹き出しカード。
 * キャラクターに被らないよう右下に配置する。
 */
function ArrivalBubble() {
  return (
    <div className="animate-okme-float absolute bottom-[16%] right-6 z-30 sm:right-10">
      <div className="relative animate-okme-fade-in rounded-full border border-white/70 bg-white/85 px-4 py-2 shadow-[0_8px_24px_-6px_rgba(56,130,246,0.45)] backdrop-blur-sm">
        <p className="whitespace-nowrap text-[13px] font-semibold text-navy">
          おはよう☀️ 今日もいっしょにがんばろう！
        </p>
        {/* やわらかい吹き出しのしっぽ（丸ポチ2つ） */}
        <span className="absolute -bottom-1.5 right-6 h-2.5 w-2.5 rounded-full bg-white/85" />
        <span className="absolute -bottom-3.5 right-4 h-1.5 w-1.5 rounded-full bg-white/70" />
      </div>
    </div>
  );
}

/**
 * Desk Detection シーンで、机の場所に約1秒だけ出すPOPな「Your Desk!」ラベル。
 * 下向きのピンで机を指し、ポンと弾むように表示する。
 */
function DeskPopLabel() {
  return (
    <div className="animate-ar-pop absolute left-[52%] top-[58%] z-30 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center">
        <span className="animate-ar-bob rounded-full border-2 border-white/70 bg-gradient-to-b from-orange to-[#ff7a3c] px-5 py-2 text-base font-extrabold tracking-wide text-white shadow-[0_6px_20px_-4px_rgba(255,122,60,0.7)] sm:text-lg">
          Your Desk!
        </span>
        {/* ピン（下向き三角）→ 机を指す */}
        <span className="-mt-1 h-3 w-3 rotate-45 bg-[#ff7a3c] shadow-[0_4px_10px_-2px_rgba(255,122,60,0.7)]" />
        <span className="mt-1 h-2 w-2 animate-ar-pulse rounded-full bg-white/80" />
      </div>
    </div>
  );
}

/**
 * Wellness シーンで、キャラクターが「ふぅ…」と一息つくような、もくもく吹き出し＋抹茶🍵マーク。
 * ふわふわ浮きながら、上に湯気のもくもくが立ちのぼる。
 */
function RelaxBubble() {
  return (
    <div className="animate-okme-float absolute left-[46%] top-[40%] z-30 -translate-x-1/2 -translate-y-1/2">
      <div className="relative">
        {/* 立ちのぼる湯気のもくもく */}
        <span className="absolute -top-5 left-7 h-2.5 w-2.5 animate-ar-pulse rounded-full bg-white/70" />
        <span className="absolute -top-8 left-9 h-2 w-2 animate-ar-pulse rounded-full bg-white/55" style={{ animationDelay: "0.3s" }} />
        <span className="absolute -top-11 left-7 h-1.5 w-1.5 animate-ar-pulse rounded-full bg-white/40" style={{ animationDelay: "0.6s" }} />

        {/* もくもく吹き出し本体 */}
        <div className="flex items-center gap-2 rounded-[40px] border border-white/70 bg-white/90 px-5 py-3 shadow-[0_8px_24px_-6px_rgba(56,130,246,0.4)] backdrop-blur-sm">
          <span className="text-2xl leading-none">🍵</span>
          <span className="text-base font-bold text-navy">ふぅ…</span>
        </div>

        {/* もくもくのしっぽ（丸ポチ） */}
        <span className="absolute -bottom-2 left-10 h-3 w-3 rounded-full bg-white/90" />
        <span className="absolute -bottom-4 left-8 h-2 w-2 rounded-full bg-white/75" />
      </div>
    </div>
  );
}

/**
 * Code Assist シーン冒頭(0.5〜1秒)で、下半分・中央にPOPな「Error!」ラベル。
 * Your Desk! と同じオレンジPOPデザイン。メガネに被らないよう半分より下に配置。
 */
function ErrorPopLabel() {
  return (
    <div className="animate-ar-pop absolute left-1/2 top-[64%] z-30 -translate-x-1/2 -translate-y-1/2">
      <div className="flex flex-col items-center">
        <span className="animate-ar-bob rounded-full border-2 border-white/70 bg-gradient-to-b from-orange to-[#ff7a3c] px-6 py-2 text-lg font-extrabold tracking-wide text-white shadow-[0_6px_20px_-4px_rgba(255,122,60,0.7)] sm:text-xl">
          Error!
        </span>
        <span className="-mt-1 h-3 w-3 rotate-45 bg-[#ff7a3c] shadow-[0_4px_10px_-2px_rgba(255,122,60,0.7)]" />
        <span className="mt-1 h-2 w-2 animate-ar-pulse rounded-full bg-white/80" />
      </div>
    </div>
  );
}

/**
 * Meeting Assist シーンで、左のキャラクターの吹き出しから出ているように見せる「要点を整理」カード。
 * 動画内のOKme!キャラ（左中央あたり）の近くに配置し、左下に吹き出しの「しっぽ」を付ける。
 */
function MeetingBubble({ lt }: { lt: number }) {
  const points = [
    "決定：新キャンペーン方針を承認",
    "ToDo：見積りを金曜までに共有",
    "次回：来週、進捗をレビュー",
  ];
  return (
    <div className="animate-okme-fade-in absolute right-4 top-[42%] z-30 w-[270px] max-w-[44%] sm:right-6 sm:w-[300px]">
      <div className="relative rounded-2xl rounded-bl-sm border border-sky-300/40 bg-black/60 p-4 shadow-[0_0_34px_rgba(96,165,250,0.25)] backdrop-blur-md sm:p-5">
        <p className="mb-1 text-[12px] font-semibold text-orange">OKme!</p>
        <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.18em] text-sky-200">
          <span className="h-2 w-2 animate-ar-pulse rounded-full bg-sky-300" />
          要点を整理しました
        </p>
        <ul className="mt-3 space-y-2">
          {points.map(
            (p, i) =>
              lt >= 2.0 + i * 0.7 && (
                <li
                  key={p}
                  className="animate-ar-pop flex items-start gap-2 text-[13.5px] leading-relaxed text-white/90"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-300" />
                  {p}
                </li>
              ),
          )}
        </ul>
        {/* 吹き出しのしっぽ（左下→キャラクター方向） */}
        <div className="absolute -bottom-2 left-7 h-4 w-4 rotate-45 border-b border-r border-sky-300/40 bg-black/60 backdrop-blur-md" />
      </div>
    </div>
  );
}

/**
 * Daily Summary（オフィスの眺め）シーンで、右側にだけ約1秒出す「今日の記録」カード。
 * 左にいるキャラに被らないよう右寄せ。コンディション・達成率を簡潔に表示。
 */
function DailyRecordRight() {
  return (
    <div className="animate-ar-pop absolute right-5 top-1/2 z-30 w-[230px] max-w-[42%] -translate-y-1/2 rounded-2xl border border-sky-300/40 bg-black/55 p-4 shadow-[0_0_34px_rgba(96,165,250,0.22)] backdrop-blur-md sm:right-8 sm:w-[260px] sm:p-5">
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200">
        <span className="h-2 w-2 animate-ar-pulse rounded-full bg-sky-300" />
        Today&apos;s Record
      </p>
      <div className="mt-3 space-y-3">
        <div>
          <div className="flex items-center justify-between text-[12px] text-white/70">
            <span>達成率</span>
            <span className="font-semibold text-white">92%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/12">
            <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-300" style={{ width: "92%" }} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[12px] text-white/70">
            <span>コンディション</span>
            <span className="font-semibold text-emerald-300">良好</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/12">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-300" style={{ width: "84%" }} />
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-[12px]">
          <span className="text-white/60">集中時間</span>
          <span className="font-semibold text-white">3h 40m</span>
        </div>
      </div>
    </div>
  );
}

function EndingScene({ lt }: { lt: number }) {
  return (
    <div
      key="ending"
      className="animate-ar-pop absolute left-1/2 top-1/2 z-30 w-[80%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-black/55 p-9 text-center backdrop-blur-md"
    >
      <p className="text-3xl font-bold text-white drop-shadow">Good Work Today</p>
      {lt > 0.8 && (
        <p className="mt-2 animate-okme-fade-in text-[15px] text-sky-200">
          OKme! is always on your side
        </p>
      )}
    </div>
  );
}

function LogoScene() {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-[#05070e]/80 backdrop-blur-sm">
      <div className="animate-okme-fade-in flex flex-col items-center gap-5">
        <OkmeLogo className="h-12 sm:h-14" />
        <div className="h-px w-40 bg-gradient-to-r from-transparent via-sky-300/60 to-transparent" />
        <p className="text-lg font-semibold tracking-wide text-white sm:text-xl">
          Always by your side.
        </p>
      </div>
    </div>
  );
}

/* ---------- main overlay ---------- */

export type PartnerMode = "character" | "bubble" | "mini";

export function OfficeTimelineOverlay({
  currentTime,
  onSceneChange,
  volume = 70,
  partnerMode = "character",
}: {
  currentTime: number;
  onSceneChange?: (id: TimelineScene["id"]) => void;
  /** 効果音の音量（0〜100） */
  volume?: number;
  /** パートナー表示モード */
  partnerMode?: PartnerMode;
}) {
  const t = currentTime;
  const scene = getSceneAt(t);
  const lt = t - scene.start;

  // 一旦、右上スケジュール以外のARカード・吹き出し・コメント・効果音を非表示にする。
  // （戻したくなったら true にするだけで全て復活する）
  const showCards = false;

  const prevTimeRef = useRef(0);
  const firedCues = useRef<Set<number>>(new Set());
  const firedSelects = useRef<Set<number>>(new Set());
  const firedPops = useRef<Set<number>>(new Set());
  const firedBanners = useRef<Set<number>>(new Set());
  const audioCtxRef = useRef<AudioContext | null>(null);
  const bannerTimer = useRef<number | null>(null);
  const volumeRef = useRef(volume);
  const [banner, setBanner] = useState<{ text: string; key: number } | null>(null);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

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

  const vol = () => Math.max(0, Math.min(1, volumeRef.current / 100));

  const playBeep = () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    const v = vol();
    if (v <= 0) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.22 * v, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  };

  const playClick = () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    const v = vol();
    if (v <= 0) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(1400 + Math.random() * 1100, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.05 * v, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  };

  const playSelect = () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    const v = vol();
    if (v <= 0) return;
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
      gain.gain.exponentialRampToValueAtTime(0.18 * v, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.24);
    });
  };

  const playPop = () => {
    const ctx = ensureCtx();
    if (!ctx) return;
    const v = vol();
    if (v <= 0) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(760, now + 0.05);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.1 * v, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  };

  const showBanner = (text: string) => {
    setBanner({ text, key: Date.now() });
    if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    bannerTimer.current = window.setTimeout(() => setBanner(null), 1600);
  };

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

  useEffect(() => {
    const prev = prevTimeRef.current;
    prevTimeRef.current = currentTime;

    if (currentTime < prev - 1) {
      firedCues.current.clear();
      firedSelects.current.clear();
      firedPops.current.clear();
      firedBanners.current.clear();
      showBanner("Arrival");
      firedBanners.current.add(0);
      return;
    }

    for (const c of SCENE_CUES) {
      if (showCards && !firedCues.current.has(c) && prev < c && currentTime >= c) {
        firedCues.current.add(c);
        playBeep();
      }
    }
    for (const c of SELECT_CUES) {
      if (showCards && !firedSelects.current.has(c) && prev < c && currentTime >= c) {
        firedSelects.current.add(c);
        playSelect();
      }
    }
    for (const c of POP_CUES) {
      if (showCards && !firedPops.current.has(c) && prev < c && currentTime >= c) {
        firedPops.current.add(c);
        playPop();
      }
    }
    for (const b of MODE_BANNERS) {
      if (showCards && !firedBanners.current.has(b.at) && prev < b.at && currentTime >= b.at) {
        firedBanners.current.add(b.at);
        showBanner(b.text);
      }
    }

    // 資料提案（下半分のゲーム演出）の効果音は showCards に関係なく鳴らす
    if (!firedCues.current.has(-24.6) && prev < 24.6 && currentTime >= 24.6) {
      firedCues.current.add(-24.6); // 提案カード登場
      playBeep();
    }
    if (!firedSelects.current.has(-27) && prev < 27.0 && currentTime >= 27.0) {
      firedSelects.current.add(-27); // 案A 自動選択
      playSelect();
    }
    // 到着の挨拶吹き出しの登場音。arrival開始0s + 0.3 = 0.3s
    if (!firedCues.current.has(-0.3) && prev < 0.3 && currentTime >= 0.3) {
      firedCues.current.add(-0.3);
      playBeep();
    }
    // デスク発見「Your Desk!」の登場音。desk開始4s + 2.7 = 6.7s
    if (!firedCues.current.has(-6.7) && prev < 6.7 && currentTime >= 6.7) {
      firedCues.current.add(-6.7);
      playPop();
    }
    // 会議「要点を整理」吹き出しの登場音。meeting開始14s + 1.0 = 15.0s
    if (!firedCues.current.has(-15) && prev < 15.0 && currentTime >= 15.0) {
      firedCues.current.add(-15);
      playBeep();
    }
    // コード支援「Error!」の登場音。code開始30s + 0.8 = 30.8s
    if (!firedCues.current.has(-30.8) && prev < 30.8 && currentTime >= 30.8) {
      firedCues.current.add(-30.8);
      playPop();
    }
    // コード修正案（下半分）の登場音。code開始30s + CODE_LOWER_START(4.0) = 34.0s
    if (!firedCues.current.has(-34) && prev < 34.0 && currentTime >= 34.0) {
      firedCues.current.add(-34);
      playBeep();
    }
    // ウェルネス「ふぅ…🍵」の登場音。wellness開始36s + 4.4 = 40.4s
    if (!firedCues.current.has(-40.4) && prev < 40.4 && currentTime >= 40.4) {
      firedCues.current.add(-40.4);
      playPop();
    }
    // 今日の記録（右側）の登場音。summary開始42s + 1.0 = 43.0s
    if (!firedCues.current.has(-43) && prev < 43.0 && currentTime >= 43.0) {
      firedCues.current.add(-43);
      playBeep();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  // コード記述の場面でのみタイピング音を鳴らす。
  // フル演出(showCards)は CODE_TYPE_*、下半分版は CODE_LOWER_* のウィンドウ。
  const typingActive =
    scene.id === "code" &&
    (showCards
      ? lt >= CODE_TYPE_START && lt < CODE_TYPE_START + FIX_CODE.length * CODE_TYPE_RATE
      : lt >= CODE_LOWER_START && lt < CODE_LOWER_START + FIX_CODE.length * CODE_LOWER_RATE);

  useEffect(() => {
    if (!typingActive) return;
    const id = window.setInterval(() => playClick(), 110);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typingActive]);

  const isLogo = scene.id === "logo";
  // 右上スケジュールは「会議が始まるまで」（到着〜会議準備）のみ表示。
  // 会議開始(14s)以降はずっと非表示。
  const showSchedule =
    scene.id === "arrival" ||
    scene.id === "desk" ||
    scene.id === "meetingPrep";

  return (
    <div className="pointer-events-none relative h-full w-full select-none">
      {/* top-left: AR status + current mode + clock */}
      {!isLogo && (
        <div className="absolute left-3.5 top-3.5 flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 rounded-full border border-sky-300/30 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
            </span>
            AR View Active
            <span className="text-white/25">·</span>
            <span className="text-white/90">{modeName(scene.id)}</span>
          </div>
        </div>
      )}

      {/* bottom-center: live status（要点を整理しました 等） */}
      {!isLogo && (
        <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2">
          <StatusTag text={statusText(scene.id, lt)} />
        </div>
      )}

      {/* scene-change label : MODE SWITCH */}
      {showCards && banner && !isLogo && (
        <div
          key={banner.key}
          className="animate-ar-flash pointer-events-none absolute left-1/2 top-[14%] z-30 flex -translate-x-1/2 flex-col items-center gap-1"
        >
          <span className="text-[9px] font-semibold uppercase tracking-[0.4em] text-sky-300/80">
            Mode Switch
          </span>
          <span className="rounded-lg border border-sky-300/40 bg-black/55 px-5 py-1.5 text-sm font-bold tracking-wide text-white shadow-[0_0_24px_rgba(96,165,250,0.35)] backdrop-blur">
            {banner.text}
          </span>
        </div>
      )}

      {/* top-right: today's schedule (early scenes only) */}
      {showSchedule && (
        <Card className="absolute right-3.5 top-3.5 w-48 p-3.5 sm:w-56">
          <p className="mb-2 flex items-center gap-1.5 text-[12px] text-white/65">
            <CalendarIcon className="h-4 w-4" />
            今日の予定
          </p>
          <ul className="space-y-1.5">
            {SCHEDULE.map((e) => (
              <li key={e.time} className="flex items-center gap-2 text-[13px]">
                <span className="tabular-nums text-white/60">{e.time}</span>
                <span className="truncate text-white/90">{e.title}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* scene-specific HUD（一旦非表示） */}
      {showCards && scene.id === "arrival" && <ArrivalScene t={t} />}
      {showCards && scene.id === "desk" && <DeskScene lt={lt} />}
      {showCards && scene.id === "meetingPrep" && <MeetingPrepScene lt={lt} />}
      {showCards && scene.id === "meeting" && <MeetingScene lt={lt} />}
      {showCards && scene.id === "slides" && <SlidesScene lt={lt} />}
      {showCards && scene.id === "code" && <CodeScene lt={lt} />}
      {showCards && scene.id === "wellness" && <WellnessScene lt={lt} />}
      {showCards && scene.id === "summary" && <SummaryScene lt={lt} />}
      {showCards && scene.id === "ending" && <EndingScene lt={lt} />}
      {showCards && scene.id === "logo" && <LogoScene />}

      {/* 到着：右下に挨拶の吹き出し（0〜2秒・カード非表示中でも表示） */}
      {!showCards && scene.id === "arrival" && lt >= 0.3 && lt < 2.6 && (
        <ArrivalBubble />
      )}

      {/* デスク発見：机の場所にPOPな「Your Desk!」（約1秒・カード非表示中でも表示） */}
      {!showCards && scene.id === "desk" && lt >= 2.7 && lt < 3.9 && (
        <DeskPopLabel />
      )}

      {/* 会議中：左のキャラから吹き出しが出ているような「要点を整理」カード（カード非表示中でも表示） */}
      {!showCards && scene.id === "meeting" && lt >= 1.0 && (
        <MeetingBubble lt={lt} />
      )}

      {/* 資料作成・後半：下半分にゲーム式の提案A/Bカード（カード非表示中でも表示） */}
      {!showCards && scene.id === "slides" && lt >= 2.5 && (
        <SlideProposalLower lt={lt} />
      )}

      {/* コード支援・冒頭：下半分中央にPOPな「Error!」（0.8〜2秒・カード非表示中でも表示） */}
      {!showCards && scene.id === "code" && lt >= 0.8 && lt < 2.0 && (
        <ErrorPopLabel />
      )}

      {/* コード支援・後半：下半分に修正案コード（カード非表示中でも表示） */}
      {!showCards && scene.id === "code" && lt >= CODE_LOWER_START && (
        <CodePatchLower lt={lt} />
      )}

      {/* ウェルネス：キャラが一息つく「ふぅ…🍵」もくもく（後半4.4〜5.9秒・カード非表示中でも表示） */}
      {!showCards && scene.id === "wellness" && lt >= 4.4 && lt < 5.9 && (
        <RelaxBubble />
      )}

      {/* Daily Summary：右側に約2秒「今日の記録」（カード非表示中でも表示） */}
      {!showCards && scene.id === "summary" && lt >= 1.0 && lt < 3.0 && (
        <DailyRecordRight />
      )}

      {/* bottom: OKme! character + speech bubble（一旦非表示） */}
      {showCards && !isLogo && scene.okmeMessage && (
        <div
          className={`absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-end gap-3 ${
            partnerMode === "mini" ? "w-[82%] max-w-sm" : "w-[92%] max-w-2xl"
          }`}
        >
          <Card
            key={scene.id}
            className={`animate-okme-fade-in flex-1 rounded-br-sm px-4 py-3 leading-relaxed text-white/90 ${
              partnerMode === "mini" ? "text-[13px]" : "text-[15px]"
            }`}
          >
            <span className="mb-1 block text-[12px] font-medium text-orange">
              OKme!
            </span>
            {scene.okmeMessage}
          </Card>
          {partnerMode !== "bubble" && (
            <div
              className={
                scene.id === "wellness" || scene.id === "ending"
                  ? "animate-ar-wave"
                  : "animate-ar-bob"
              }
            >
              <OkmeImage
                src="/images/okme-character.png"
                fallback="character"
                alt="OKme! キャラクター"
                className={`shrink-0 drop-shadow ${
                  partnerMode === "mini" ? "w-12" : "w-20"
                }`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
