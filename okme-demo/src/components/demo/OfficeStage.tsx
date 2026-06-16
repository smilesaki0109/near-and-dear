"use client";

import { useEffect, useRef, useState } from "react";

/** 歩行シーン（一人称視点・AI生成）。順番に廊下→執務室→会議室前へ。 */
const OFFICE_WALK_SCENES = [
  { src: "/images/office/office-walk-1.png", anim: "animate-office-scene-a" },
  { src: "/images/office/office-walk-2.png", anim: "animate-office-scene-b" },
  { src: "/images/office/office-walk-3.png", anim: "animate-office-scene-c" },
];

/**
 * オフィスデモモードの中央ステージ。
 * AI生成のオフィス画像3シーン（廊下→執務室→会議室前）を
 * ゆっくりズーム（Ken Burns）＋クロスフェードで切り替え、
 * 「ARメガネで歩いている視点」を再現する。
 * もし /videos/office-walk-demo.mp4 を配置すれば、それを優先再生する。
 */
export function OfficeStage({
  children,
  volume = 70,
  videoSrc = "/videos/download (2).mp4",
  timelineLength = 55,
  holdMs = 3500,
  label = "オフィスデモ映像",
  showWalkFallback = true,
}: {
  /** 現在の再生秒数を受け取ってオーバーレイを描画する render-prop */
  children: (currentTime: number) => React.ReactNode;
  /** 動画音声の音量（0〜100） */
  volume?: number;
  /** 再生する動画ファイルのパス */
  videoSrc?: string;
  /** 再生して静止に入るまでの長さ（秒） */
  timelineLength?: number;
  /** 終端で静止して待機する時間（ミリ秒）。経過後に先頭から再開 */
  holdMs?: number;
  /** 右下に出すモードラベル */
  label?: string;
  /** AI生成オフィス画像のフォールバックを表示するか（life等では非表示） */
  showWalkFallback?: boolean;
}) {
  const TIMELINE_LENGTH = timelineLength;
  const HOLD_MS = holdMs;
  const [playable, setPlayable] = useState(false);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 音量をvideo要素へ反映
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = Math.max(0, Math.min(1, volume / 100));
  }, [volume, playable]);

  // 「デモを再生」ボタンで開始。ここがユーザー操作なので音声/自動再生も許可される。
  const beginDemo = () => {
    setStarted(true);
    const v = videoRef.current;
    if (v) {
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
      v.play().catch(() => {});
    }
  };

  // video.currentTime を監視してオーバーレイへ渡す。
  // 動画が無い／再生できない場合は合成タイマーで 0〜50 秒をループさせる。
  // started が true になるまではタイムラインを進めない（0秒で待機）。
  useEffect(() => {
    if (!started) {
      setCurrentTime(0);
      return;
    }
    let raf = 0;
    let last = performance.now();
    let synthetic = 0;
    let holdUntil = 0; // >0 の間は50秒フレームで静止して待機
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const v = videoRef.current;

      // 50秒で静止 → HOLD_MS 待機 → 先頭(0秒)から再開
      if (holdUntil > 0) {
        if (now >= holdUntil) {
          holdUntil = 0;
          synthetic = 0;
          if (v) {
            try {
              v.currentTime = 0;
              if (playable) v.play().catch(() => {});
            } catch {
              /* ignore */
            }
          }
          setCurrentTime(0);
        } else {
          setCurrentTime((prev) =>
            prev !== TIMELINE_LENGTH ? TIMELINE_LENGTH : prev,
          );
        }
        raf = requestAnimationFrame(tick);
        return;
      }

      let t: number;
      if (v && playable && !v.ended && v.currentTime > 0) {
        t = v.currentTime;
        synthetic = t;
      } else {
        synthetic = synthetic + dt;
        t = synthetic;
      }

      // 50秒到達：動画を一時停止して静止待機に入る
      if (t >= TIMELINE_LENGTH) {
        t = TIMELINE_LENGTH;
        if (v && !v.paused) v.pause();
        holdUntil = now + HOLD_MS;
      }

      setCurrentTime((prev) => (Math.abs(prev - t) >= 0.05 ? t : prev));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playable, started, TIMELINE_LENGTH, HOLD_MS]);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    const next = !muted;
    v.muted = next;
    if (!next) {
      // 音を出すタイミングで再生を確実にする（ユーザー操作なので許可される）
      v.play().catch(() => {});
    }
    setMuted(next);
  };

  return (
    <div className="relative aspect-video max-h-[86vh] w-full overflow-hidden rounded-xl bg-black ring-1 ring-sky-300/20 shadow-[0_0_0_1px_rgba(125,211,252,0.12),0_0_60px_-8px_rgba(56,130,246,0.55)]">
      {/* CSS fallback (deepest layer, only seen if images fail) */}
      <OfficeFallback />

      {/* AI生成オフィス画像の歩行スライドショー（officeのフォールバックのみ） */}
      {showWalkFallback && (
        <div className="absolute inset-0">
          {OFFICE_WALK_SCENES.map((scene) => (
            <div
              key={scene.src}
              className={`absolute inset-0 ${scene.anim}`}
              style={{ willChange: "opacity" }}
            >
              <div
                className="absolute inset-0 animate-office-zoom bg-cover bg-center"
                style={{ backgroundImage: `url('${scene.src}')`, willChange: "transform" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* 実写動画を最優先で再生（再生開始はボタン押下後） */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted={muted}
        playsInline
        preload="auto"
        onCanPlay={() => setPlayable(true)}
        onError={() => setPlayable(false)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          playable ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* lens vignette + slight darken for AR readability */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(125%_125%_at_50%_50%,transparent_52%,rgba(0,0,0,0.6)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/35" />
      {/* faint sky tint to feel like an AR lens */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(56,130,246,0.10),transparent_60%)]" />

      {/* AR HUD frame */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <CornerBrackets />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/50 to-transparent animate-scan" />
        <div className="absolute inset-x-10 bottom-9 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Overlays (time-synced) — 再生開始後のみ表示 */}
      {started && <div className="absolute inset-0 z-30">{children(currentTime)}</div>}

      {/* 開始前：再生ボタンのオーバーレイ */}
      {!started && (
        <button
          type="button"
          onClick={beginDemo}
          className="group absolute inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-black/55 backdrop-blur-[2px] transition"
          aria-label="デモを再生"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/40 shadow-[0_0_40px_-6px_rgba(125,211,252,0.6)] transition group-hover:scale-105 group-hover:bg-white/15">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="white" className="ml-1">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="text-lg font-semibold tracking-wide text-white">
            デモを再生
          </span>
          <span className="text-[12px] tracking-[0.2em] text-white/55">
            TAP TO START AR DEMO
          </span>
        </button>
      )}

      {/* sound toggle (再生中・動画があるときだけ表示) */}
      {started && playable && (
        <button
          type="button"
          onClick={toggleSound}
          className="absolute bottom-3 left-3 z-40 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur transition hover:bg-black/60"
          aria-label={muted ? "音声をオンにする" : "音声をオフにする"}
        >
          {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          {muted ? "音声オン" : "音声オフ"}
        </button>
      )}

      {/* mode label */}
      {started && (
        <div className="absolute bottom-3 right-3 z-40 rounded-full bg-black/40 px-3 py-1 text-[10px] text-white/80 backdrop-blur">
          {playable
            ? label
            : showWalkFallback
              ? "オフィスウォーク（AI生成・3シーン）"
              : label}
        </div>
      )}
    </div>
  );
}

/** オフィスの一人称視点を模したフォールバック背景（CSSのみ）。 */
function OfficeFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ceiling → floor */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#dfe6ee] via-[#c4ccd8] to-[#9aa3b2]" />
      {/* far wall / vanishing light */}
      <div className="absolute left-1/2 top-1/2 h-40 w-56 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#eef2f7] blur-md" />
      {/* ceiling band */}
      <div className="absolute inset-x-0 top-0 h-[26%] bg-gradient-to-b from-[#eef2f7] to-transparent" />
      {/* floor with perspective drift */}
      <div className="absolute inset-x-0 bottom-0 h-[42%] overflow-hidden bg-gradient-to-t from-[#6c7686] to-transparent">
        <div
          className="absolute inset-x-[-20%] bottom-0 h-full animate-office-pan opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 2px, transparent 2px 64px)",
          }}
        />
      </div>
      {/* side desks / monitors (silhouettes) */}
      <div className="absolute bottom-[22%] left-[6%] h-16 w-24 -skew-y-6 rounded bg-[#3c4658]/70" />
      <div className="absolute bottom-[28%] left-[10%] h-10 w-14 -skew-y-6 rounded bg-[#1f2838]/80" />
      <div className="absolute bottom-[22%] right-[6%] h-16 w-24 skew-y-6 rounded bg-[#3c4658]/70" />
      <div className="absolute bottom-[28%] right-[10%] h-10 w-14 skew-y-6 rounded bg-[#1f2838]/80" />
      {/* whiteboard on far wall */}
      <div className="absolute left-1/2 top-[34%] h-14 w-24 -translate-x-1/2 rounded border border-white/60 bg-white/70" />
      {/* soft walking sway */}
      <div className="absolute inset-0 animate-office-sway bg-[radial-gradient(60%_50%_at_50%_45%,rgba(255,255,255,0.18),transparent_70%)]" />
    </div>
  );
}

function SoundOnIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function CornerBrackets() {
  const corner = "absolute h-9 w-9 border-sky-300/55";
  return (
    <>
      <div className={`${corner} left-3 top-3 border-l-2 border-t-2 rounded-tl-md`} />
      <div className={`${corner} right-3 top-3 border-r-2 border-t-2 rounded-tr-md`} />
      <div className={`${corner} bottom-3 left-3 border-b-2 border-l-2 rounded-bl-md`} />
      <div className={`${corner} bottom-3 right-3 border-b-2 border-r-2 rounded-br-md`} />
    </>
  );
}
