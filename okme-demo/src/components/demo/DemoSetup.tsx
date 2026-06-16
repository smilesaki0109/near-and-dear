"use client";

import { useRef } from "react";
import { OkmeImage, OkmeLogo } from "@/components/brand";
import type { PartnerMode } from "@/components/demo/OfficeTimelineOverlay";

export type Mood = "energetic" | "tired" | "focus" | "anxious";
export type CameraMode = "office" | "front" | "back" | "life";

export type MoodVoice = {
  /** 声の種類ラベル（UI表示用） */
  label: string;
  /** 試聴で読み上げるサンプル文 */
  sample: string;
  /** 音声合成のピッチ（高さ） */
  pitch: number;
  /** 音声合成のスピード */
  rate: number;
};

export const MOODS: {
  id: Mood;
  label: string;
  emoji: string;
  image: string;
  message: string;
  voice: MoodVoice;
}[] = [
  {
    id: "energetic",
    label: "元気",
    emoji: "☀️",
    image: "/images/moods/mood-energetic.png",
    message: "いいですね。今日はテンポよく進めましょう。",
    voice: { label: "元気な声・少し高め", sample: "イェーイ！今日も頑張ろう！", pitch: 1.6, rate: 1.15 },
  },
  {
    id: "tired",
    label: "少し疲れた",
    emoji: "🍵",
    image: "/images/moods/mood-tired.png",
    message: "無理しすぎず、休憩のタイミングも一緒に見ていきます。",
    voice: { label: "少し暗めの声", sample: "ふぅ…ゆっくりいきましょう。", pitch: 0.85, rate: 0.9 },
  },
  {
    id: "focus",
    label: "集中したい",
    emoji: "🎯",
    image: "/images/moods/mood-focus.png",
    message: "集中を妨げないよう、必要な情報だけを表示します。",
    voice: { label: "ノーマルな声", sample: "集中していきましょう。", pitch: 1.0, rate: 1.0 },
  },
  {
    id: "anxious",
    label: "不安がある",
    emoji: "🌱",
    image: "/images/moods/mood-anxious.png",
    message: "大丈夫です。今日の予定と準備を一緒に整理しましょう。",
    voice: { label: "少し悲しい声", sample: "だいじょうぶ、そばにいますよ。", pitch: 0.9, rate: 0.92 },
  },
];

const PARTNER_OPTIONS: { id: PartnerMode; label: string; hint: string }[] = [
  { id: "character", label: "キャラクター表示 ON", hint: "キャラ＋吹き出し" },
  { id: "bubble", label: "吹き出しのみ", hint: "テキスト中心" },
  { id: "mini", label: "ミニ表示", hint: "省スペース" },
];

const CAMERA_OPTIONS: { id: CameraMode; label: string; hint: string }[] = [
  { id: "office", label: "オフィスデモ映像", hint: "推奨" },
  { id: "front", label: "インカメラ", hint: "前面" },
  { id: "back", label: "アウトカメラ", hint: "背面" },
  { id: "life", label: "Life Demo", hint: "将来の生活利用" },
];

export function DemoSetup({
  selectedMood,
  onSelectMood,
  partnerMode,
  onPartnerMode,
  volume,
  onVolume,
  cameraMode,
  onCameraMode,
  onStart,
  starting = false,
}: {
  selectedMood: Mood | null;
  onSelectMood: (m: Mood) => void;
  partnerMode: PartnerMode;
  onPartnerMode: (m: PartnerMode) => void;
  volume: number;
  onVolume: (v: number) => void;
  cameraMode: CameraMode;
  onCameraMode: (m: CameraMode) => void;
  onStart: () => void;
  starting?: boolean;
}) {
  const selectedMoodObj = MOODS.find((m) => m.id === selectedMood);
  const moodMessage = selectedMoodObj?.message;

  // 気分に応じた声を読み上げる（Web Speech API）。ピッチ/スピードで雰囲気を変える。
  const speakVoice = (m: (typeof MOODS)[number]) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const v = Math.max(0, Math.min(1, volume / 100));
    if (v <= 0) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(m.voice.sample);
      u.lang = "ja-JP";
      u.pitch = m.voice.pitch;
      u.rate = m.voice.rate;
      u.volume = v;
      const voices = window.speechSynthesis.getVoices();
      const ja = voices.find((vc) => vc.lang?.toLowerCase().startsWith("ja"));
      if (ja) u.voice = ja;
      window.speechSynthesis.speak(u);
    } catch {
      /* ignore */
    }
  };

  // --- 設定画面の効果音（Web Audio） ---
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastTickRef = useRef(0);

  const ensureCtx = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const Ctor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (Ctor) audioCtxRef.current = new Ctor();
    }
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  };

  const vol = () => Math.max(0, Math.min(1, volume / 100));

  const blip = (
    freq: number,
    opts: {
      type?: OscillatorType;
      dur?: number;
      peak?: number;
      slideTo?: number;
    } = {},
    startOffset = 0,
  ) => {
    const ctx = ensureCtx();
    if (!ctx) return;
    const v = vol();
    if (v <= 0) return;
    const { type = "sine", dur = 0.18, peak = 0.16, slideTo } = opts;
    const now = ctx.currentTime + startOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, now + dur * 0.8);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak * v, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  };

  // 気分選択：軽快な2音チャイム
  const playMood = () => {
    blip(660, { type: "triangle", dur: 0.16 });
    blip(990, { type: "triangle", dur: 0.2 }, 0.09);
  };
  // 設定選択：やわらかいポップ
  const playOption = () =>
    blip(520, { type: "sine", dur: 0.13, peak: 0.13, slideTo: 760 });
  // 音量スライダー：高さが音量に連動する小さなティック（連打しすぎないよう間引き）
  const playTick = () => {
    const nowMs = performance.now();
    if (nowMs - lastTickRef.current < 55) return;
    lastTickRef.current = nowMs;
    blip(1200 + volume * 7, { type: "square", dur: 0.03, peak: 0.045 });
  };
  // デモ開始：上昇するファンファーレ
  const playStart = () => {
    [523, 659, 784, 1046].forEach((f, i) =>
      blip(f, { type: "triangle", dur: 0.22, peak: 0.16 }, i * 0.08),
    );
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)]">
        {/* Left: character + status */}
        <div className="relative flex flex-col items-center justify-center gap-4 border-b border-line bg-gradient-to-b from-[#f5f8fd] to-[#eaf0fa] px-8 py-6 lg:border-b-0 lg:border-r">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1 text-[11px] font-medium text-navy">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-blue" />
            </span>
            ARグラス連携中
          </span>

          {/* 360°回転するARメガネ（ホログラム風） */}
          <div
            className="flex w-full flex-col items-center overflow-visible"
            style={{ perspective: "1600px" }}
          >
            {/* メガネ全体が必ず収まる高さの余白付きボックス（max-heightで上下とも見切れない） */}
            <div className="flex h-36 w-full items-center justify-center overflow-visible py-2">
              <div className="animate-glasses-spin flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/ar-glasses.png"
                  alt="ARグラス"
                  className="max-h-28 w-auto max-w-full object-contain rounded-2xl shadow-[0_12px_30px_-8px_rgba(11,31,58,0.35)] ring-1 ring-black/5"
                />
              </div>
            </div>
            {/* ホログラムの台座リング（メガネと重ならないよう間隔を確保） */}
            <div className="animate-holo-ring mt-2 h-5 w-40 rounded-[100%] bg-[radial-gradient(closest-side,rgba(37,99,235,0.45),rgba(37,99,235,0)_75%)] blur-[1px]" />
            <span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-blue/70">
              AR Glasses Linking
            </span>
          </div>

          <div className="animate-okme-float">
            <OkmeImage
              src="/images/okme-character.png"
              fallback="character"
              alt="OKme! キャラクター"
              className="w-32 drop-shadow-md"
            />
          </div>

          <div className="min-h-[3rem] w-full max-w-[15rem] text-center">
            {moodMessage ? (
              <div className="animate-okme-fade-in rounded-2xl rounded-bl-sm border border-line bg-white px-4 py-3 text-[13px] leading-relaxed text-navy shadow-sm">
                <span className="mb-0.5 block text-[10px] font-semibold text-orange">
                  OKme!
                </span>
                {moodMessage}
              </div>
            ) : (
              <p className="pt-2 text-xs text-sub">
                今日の気分を選ぶと、OKme! が一言お返しします。
              </p>
            )}
          </div>
        </div>

        {/* Right: settings */}
        <div className="px-7 py-6 sm:px-9">
          {/* Hero: OKme! 体験の入口 */}
          <div className="relative">
            {/* やわらかいブルーグロー */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-6 -top-9 h-32 w-56 rounded-full bg-brand-blue/10 blur-3xl"
            />
            <div className="relative">
              {/* ロゴ + ブランドタグ */}
              <div className="flex items-center gap-3">
                <OkmeLogo className="h-7" />
                <span className="hidden h-4 w-px bg-line sm:block" />
                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-blue/80">
                  <span>Companion</span>
                  <span className="text-line">·</span>
                  <span>Future</span>
                  <span className="text-line">·</span>
                  <span>Life</span>
                </div>
              </div>

              {/* キャッチコピー + サブコピー（同じ行） */}
              <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
                <h1 className="flex items-end gap-2 text-[30px] font-bold leading-[1.1] tracking-tight text-navy">
                  Always by your side.
                  <Sparkle className="mb-1 h-5 w-5 shrink-0 animate-pulse text-brand-blue/70" />
                </h1>
                <p className="mb-1 text-[14px] leading-6 text-sub">
                  今日のあなたに合わせて、OKme! がそっと寄り添います。
                </p>
              </div>

              {/* 細いグラデーションライン */}
              <div className="mt-4 h-px w-full bg-gradient-to-r from-brand-blue/45 via-line/70 to-transparent" />
            </div>
          </div>

          {/* Mood */}
          <Section label="今日はどんな気分ですか？">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    playMood();
                    onSelectMood(m.id);
                    speakVoice(m);
                  }}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 pb-2.5 pt-3 text-sm font-medium transition-colors ${
                    selectedMood === m.id
                      ? "border-[#2457C5] bg-[#EFF6FF] text-navy ring-1 ring-[#2457C5]/30"
                      : "border-line bg-white text-navy hover:border-navy/30"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.image}
                    alt={`OKme! ${m.label}`}
                    className="h-16 w-16 object-contain drop-shadow-[0_8px_16px_rgba(11,31,58,0.16)]"
                  />
                  {m.label}
                </button>
              ))}
            </div>

            {/* 選択した気分に応じた「声」の表示＋試聴 */}
            {selectedMoodObj && (
              <div className="animate-okme-fade-in mt-2.5 flex items-center justify-between gap-3 rounded-xl border border-[#2457C5]/25 bg-[#F5F9FF] px-3.5 py-2.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    <SoundWaveIcon />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-navy">
                      声：{selectedMoodObj.voice.label}
                    </p>
                    <p className="truncate text-[11px] text-sub">
                      「{selectedMoodObj.voice.sample}」
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => speakVoice(selectedMoodObj)}
                  className="shrink-0 rounded-full border border-brand-blue/40 bg-white px-3 py-1.5 text-[12px] font-semibold text-brand-blue transition-colors hover:bg-brand-blue/5"
                >
                  ▶ 声を再生
                </button>
              </div>
            )}
          </Section>

          {/* Partner display */}
          <Section label="パートナー表示設定">
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {PARTNER_OPTIONS.map((o) => (
                <OptionCard
                  key={o.id}
                  active={partnerMode === o.id}
                  label={o.label}
                  hint={o.hint}
                  onClick={() => {
                    playOption();
                    onPartnerMode(o.id);
                  }}
                />
              ))}
            </div>
          </Section>

          {/* Volume */}
          <Section label="音量調整">
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={(e) => {
                  onVolume(Number(e.target.value));
                  playTick();
                }}
                className="okme-range h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-line"
                style={{
                  background: `linear-gradient(to right, var(--blue) 0%, var(--blue) ${volume}%, var(--line) ${volume}%, var(--line) 100%)`,
                }}
              />
              <span className="w-16 shrink-0 text-right text-sm font-semibold tabular-nums text-navy">
                音量 {volume}%
              </span>
            </div>
          </Section>

          {/* Camera */}
          <Section label="カメラ設定">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {CAMERA_OPTIONS.map((o) => (
                <OptionCard
                  key={o.id}
                  active={cameraMode === o.id}
                  label={o.label}
                  hint={o.hint}
                  onClick={() => {
                    playOption();
                    onCameraMode(o.id);
                  }}
                />
              ))}
            </div>
            <p className="mt-2.5 text-[11px] leading-relaxed text-sub">
              オフィスデモは業務支援、Life Demo は朝・外出・散歩・翻訳・夜の振り返りなど
              生活に寄り添う未来像を再生します。カメラモードでは端末のカメラを使用できます。
            </p>
          </Section>

          {/* Start */}
          <button
            onClick={() => {
              playStart();
              onStart();
            }}
            disabled={starting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange px-6 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-orange-strong disabled:cursor-not-allowed disabled:opacity-70"
          >
            {starting ? "起動中…" : "デモを開始"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SoundWaveIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c.4 3.6 1.8 5 5.4 5.4-3.6.4-5 1.8-5.4 5.4-.4-3.6-1.8-5-5.4-5.4 3.6-.4 5-1.8 5.4-5.4Z" />
      <path d="M18.5 13c.2 1.8.9 2.5 2.7 2.7-1.8.2-2.5.9-2.7 2.7-.2-1.8-.9-2.5-2.7-2.7 1.8-.2 2.5-.9 2.7-2.7Z" opacity="0.7" />
    </svg>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h2 className="mb-2 text-sm font-semibold text-navy">{label}</h2>
      {children}
    </div>
  );
}

function OptionCard({
  active,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-0.5 rounded-xl border px-3.5 py-3 text-left transition-colors ${
        active
          ? "border-navy bg-navy/5 ring-1 ring-navy"
          : "border-line bg-white hover:border-navy/30"
      }`}
    >
      <span className="text-sm font-medium text-navy">{label}</span>
      <span className="text-[11px] text-sub">{hint}</span>
    </button>
  );
}
