"use client";

import { useEffect, useRef, useState } from "react";

/** 再生して静止に入るまでの長さ（秒）。 */
const TIMELINE_LENGTH = 50;

/** 50秒フレームで静止して待機する時間（ミリ秒）。経過後に先頭から再開。 */
const HOLD_MS = 10000;

/** 歩行シーン（一人称視点・AI生成）。順番に廊下→執務室→会議室前へ。 */
const WALK_SCENES = [
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
}: {
  /** 現在の再生秒数（0〜50）を受け取ってオーバーレイを描画する render-prop */
  children: (currentTime: number) => React.ReactNode;
}) {
  const [playable, setPlayable] = useState(false);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // video.currentTime を監視してオーバーレイへ渡す。
  // 動画が無い／再生できない場合は合成タイマーで 0〜50 秒をループさせる。
  useEffect(() => {
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
  }, [playable]);

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
    <div className="relative aspect-video max-h-[72vh] w-full overflow-hidden rounded-2xl border border-line bg-navy shadow-sm">
      {/* CSS fallback (deepest layer, only seen if images fail) */}
      <OfficeFallback />

      {/* AI生成オフィス画像の歩行スライドショー */}
      <div className="absolute inset-0">
        {WALK_SCENES.map((scene) => (
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

      {/* 任意: 実写動画を配置した場合は最優先で再生 */}
      <video
        ref={videoRef}
        src="/videos/office-walk-demo.mp4"
        autoPlay
        muted={muted}
        playsInline
        onCanPlay={() => setPlayable(true)}
        onError={() => setPlayable(false)}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          playable ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* slight darken for AR readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/40" />

      {/* AR HUD frame */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <CornerBrackets />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent animate-scan" />
      </div>

      {/* Overlays (time-synced) */}
      <div className="absolute inset-0 z-30">{children(currentTime)}</div>

      {/* sound toggle (動画があるときだけ表示) */}
      {playable && (
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
      <div className="absolute bottom-3 right-3 z-40 rounded-full bg-black/40 px-3 py-1 text-[10px] text-white/80 backdrop-blur">
        {playable ? "オフィスデモ映像" : "オフィスウォーク（AI生成・3シーン）"}
      </div>
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
  const corner = "absolute h-7 w-7 border-white/45";
  return (
    <>
      <div className={`${corner} left-3.5 top-3.5 border-l border-t rounded-tl`} />
      <div className={`${corner} right-3.5 top-3.5 border-r border-t rounded-tr`} />
      <div className={`${corner} bottom-3.5 left-3.5 border-b border-l rounded-bl`} />
      <div className={`${corner} bottom-3.5 right-3.5 border-b border-r rounded-br`} />
    </>
  );
}
