"use client";

import { useEffect, useRef, useState } from "react";
import { OkmeImage } from "@/components/brand";
import {
  getLifeSceneAt,
  lifeTimelineScenes,
  type LifeCard,
  type LifeScene,
  type LifeSceneId,
} from "@/lib/timeline";
import type { PartnerMode } from "@/components/demo/OfficeTimelineOverlay";

/** タイムラインが終わってカード類を隠す秒数（動画はそのまま）。 */
const HIDE_AT = 34;

/** カードが順番に出てくるときのスタッガー間隔（秒）。 */
const CARD_STAGGER = 0.55;
const CARD_FIRST = 0.5;

/** シーン切り替え時のビープ／バナー秒数（morning=0 は初回マウントで処理）。 */
const SCENE_STARTS = lifeTimelineScenes
  .filter((s) => s.start > 0)
  .map((s) => ({ at: s.start, text: s.mode }));

/** 各カードが表示される瞬間の「ポップ音」秒数。 */
const POP_CUES: number[] = lifeTimelineScenes.flatMap((s) =>
  s.cards.map((_, i) => s.start + CARD_FIRST + i * CARD_STAGGER),
);

/* ---------- shared bits (Office と同じトーン) ---------- */

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

function Bar({ value, color }: { value: number; color: string }) {
  return (
    <div className="mt-2">
      <div className="mb-1.5 flex items-center justify-end text-[13px]">
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
    <div className="animate-ar-flash pointer-events-none absolute left-1/2 top-[30%] z-20 -translate-x-1/2 -translate-y-1/2">
      <span className="whitespace-nowrap rounded-xl border border-sky-300/40 bg-black/55 px-6 py-3 text-base font-semibold tracking-wide text-sky-200 shadow-lg backdrop-blur sm:text-lg">
        {text}
      </span>
    </div>
  );
}

/** 生活カード1枚の表示。 */
function LifeCardView({ card }: { card: LifeCard }) {
  return (
    <Card glow={card.glow} className="animate-ar-pop p-5">
      <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-sky-200">
        {card.title}
        {card.pulse && (
          <span className="flex items-center gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-300"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </span>
        )}
      </p>
      {card.value && (
        <p className="mt-2 text-2xl font-bold leading-none text-white">
          {card.value}
        </p>
      )}
      {card.bar && <Bar value={card.bar.value} color={card.bar.color} />}
      {card.lines && card.lines.length > 0 && (
        <ul className="mt-2.5 space-y-1 text-[14px] leading-relaxed text-white/85">
          {card.lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
    </Card>
  );
}

/* ---------- main overlay ---------- */

export function LifeTimelineOverlay({
  currentTime,
  onSceneChange,
  volume = 70,
  partnerMode = "character",
  hudOnly = false,
}: {
  currentTime: number;
  onSceneChange?: (id: LifeSceneId) => void;
  /** 効果音の音量（0〜100） */
  volume?: number;
  /** パートナー表示モード */
  partnerMode?: PartnerMode;
  /** true の場合、上部HUDのみ表示し、カード・吹き出しは表示しない */
  hudOnly?: boolean;
}) {
  const t = currentTime;
  const scene: LifeScene = getLifeSceneAt(t);
  const lt = t - scene.start;

  const prevTimeRef = useRef(0);
  const firedBeeps = useRef<Set<number>>(new Set());
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

  // 短いやわらかな通知ビープ。
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
    osc.frequency.setValueAtTime(720, now);
    osc.frequency.exponentialRampToValueAtTime(1080, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.2 * v, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.28);
  };

  // カード表示音（やさしいポップ）。
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
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(820, now + 0.05);
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

  // 初回マウント：AudioContext を解放 ＋ 最初のシーンのバナー。
  useEffect(() => {
    const resume = () => ensureCtx()?.resume?.().catch(() => {});
    window.addEventListener("pointerdown", resume);
    window.addEventListener("keydown", resume);
    showBanner(lifeTimelineScenes[0].mode);
    firedBanners.current.add(0);
    return () => {
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
      if (bannerTimer.current) window.clearTimeout(bannerTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // currentTime が各キューを超えた瞬間に1回だけ発火。ループで戻ったらリセット。
  useEffect(() => {
    const prev = prevTimeRef.current;
    prevTimeRef.current = currentTime;

    if (currentTime < prev - 1) {
      firedBeeps.current.clear();
      firedPops.current.clear();
      firedBanners.current.clear();
      showBanner(lifeTimelineScenes[0].mode);
      firedBanners.current.add(0);
      return;
    }

    for (const s of SCENE_STARTS) {
      if (!firedBeeps.current.has(s.at) && prev < s.at && currentTime >= s.at) {
        firedBeeps.current.add(s.at);
        playBeep();
      }
      if (!firedBanners.current.has(s.at) && prev < s.at && currentTime >= s.at) {
        firedBanners.current.add(s.at);
        showBanner(s.text);
      }
    }
    if (!hudOnly) {
      for (const c of POP_CUES) {
        if (!firedPops.current.has(c) && prev < c && currentTime >= c) {
          firedPops.current.add(c);
          playPop();
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTime]);

  // 36秒以降はカード類を非表示（動画はそのまま）。
  if (t >= HIDE_AT) return null;

  const showHeadline = lt >= 0.4 && lt <= 2.4;
  const bubbleLate = !!scene.okmeMessageLate && lt >= 3.5;
  const bubbleText = bubbleLate ? scene.okmeMessageLate! : scene.okmeMessage;

  return (
    <div className="pointer-events-none relative h-full w-full select-none">
      {/* top-left: AR status + current mode */}
      <div className="absolute left-3.5 top-3.5 flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 rounded-full border border-sky-300/30 bg-black/45 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-200 backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-300" />
          </span>
          AR View Active
          <span className="text-white/25">·</span>
          <span className="text-white/90">{scene.mode}</span>
        </div>
      </div>

      {/* bottom-center: live status */}
      <div className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2">
        <StatusTag text={scene.status} />
      </div>

      {/* scene-change banner */}
      {banner && (
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

      {/* center headline flash */}
      {!hudOnly && showHeadline && <CenterFlash text={scene.headline} />}

      {/* scene cards: 左側に縦スタックで順番に表示 */}
      {!hudOnly && (
        <div className="absolute left-4 top-1/2 flex w-80 -translate-y-1/2 flex-col gap-3">
          {scene.cards.map((card, i) =>
            lt >= CARD_FIRST + i * CARD_STAGGER ? (
              <LifeCardView key={`${scene.id}-${i}`} card={card} />
            ) : null,
          )}
        </div>
      )}

      {/* bottom: OKme! character + speech bubble */}
      {!hudOnly && (
        <div
          className={`absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-end gap-3 ${
            partnerMode === "mini" ? "w-[82%] max-w-sm" : "w-[92%] max-w-2xl"
          }`}
        >
          <Card
            key={`${scene.id}-${bubbleLate ? "late" : "main"}`}
            className={`animate-okme-fade-in flex-1 rounded-br-sm px-4 py-3 leading-relaxed text-white/90 ${
              partnerMode === "mini" ? "text-[13px]" : "text-[15px]"
            }`}
          >
            <span className="mb-1 block text-[12px] font-medium text-orange">
              OKme!
            </span>
            {bubbleText}
          </Card>
          {partnerMode !== "bubble" && (
            <div
              className={
                scene.id === "walk" || scene.id === "night"
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
