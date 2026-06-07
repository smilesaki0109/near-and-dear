"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const BUBBLE_AT = 1800; // 吹き出し表示（ms）
const NAVIGATE_AT = 11000; // デモへ自動遷移（ms）

// 読み上げる文（絵文字は含めない）
const SPEAK_TEXT =
  "Sakiさん、おはようございます。今日も一緒に頑張りましょう。私はいつでもあなたの味方です。";

// ページ背景（キャラクター画像の背景色 ≒ rgb(237,240,247) に合わせる）
const PAGE_BG =
  "radial-gradient(75% 60% at 50% 44%, rgb(246,248,253) 0%, rgb(238,241,248) 70%)";

export default function Opening() {
  const router = useRouter();
  const [showBubble, setShowBubble] = useState(false);
  const [muted, setMuted] = useState(false);
  const navigated = useRef(false);
  const playedRef = useRef(false);
  const mutedRef = useRef(false);
  const showBubbleRef = useRef(false);

  const goDemo = () => {
    if (navigated.current) return;
    navigated.current = true;
    window.speechSynthesis?.cancel();
    router.push("/demo");
  };

  const playChime = useCallback(() => {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      ctx.resume?.();
      const now = ctx.currentTime;
      [659.25, 880].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        const t = now + i * 0.12;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.1, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.45);
      });
      window.setTimeout(() => ctx.close(), 1300);
    } catch {
      /* noop */
    }
  }, []);

  const speak = useCallback(() => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;
      const u = new SpeechSynthesisUtterance(SPEAK_TEXT);
      u.lang = "ja-JP";
      u.pitch = 1.5; // 高めの可愛い声
      u.rate = 1.04;
      u.volume = 1;
      const ja = synth.getVoices().filter((v) => v.lang?.toLowerCase().startsWith("ja"));
      const fav =
        ja.find((v) => /kyoko|mizuki|haruka|sayaka|o-ren|google|female|woman/i.test(v.name)) ||
        ja[0];
      if (fav) u.voice = fav;
      synth.cancel();
      synth.speak(u);
    } catch {
      /* noop */
    }
  }, []);

  // 吹き出しの内容を再生（効果音＋音声）。多重再生はガード。
  const playGreeting = useCallback(() => {
    if (playedRef.current || mutedRef.current) return;
    playedRef.current = true;
    playChime();
    window.setTimeout(speak, 350);
  }, [playChime, speak]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    router.prefetch("/demo");
    // 音声リストを事前ロード
    try {
      window.speechSynthesis?.getVoices();
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    } catch {
      /* noop */
    }

    const t1 = window.setTimeout(() => {
      setShowBubble(true);
      playGreeting(); // 自動再生（ブラウザが許可していれば鳴る）
    }, BUBBLE_AT);
    const t2 = window.setTimeout(goDemo, NAVIGATE_AT);

    // 自動再生がブロックされた場合に備え、最初の操作で確実に再生
    const onGesture = () => {
      if (showBubbleRef.current) playGreeting();
    };
    window.addEventListener("pointerdown", onGesture, { once: false });
    window.addEventListener("keydown", onGesture, { once: false });

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("pointerdown", onGesture);
      window.removeEventListener("keydown", onGesture);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    showBubbleRef.current = showBubble;
  }, [showBubble]);

  return (
    <main
      className="relative flex h-dvh w-full flex-col items-center overflow-hidden"
      style={{ background: PAGE_BG }}
    >
      {/* Sound toggle (top-right) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          const next = !muted;
          setMuted(next);
          mutedRef.current = next;
          if (!next && showBubbleRef.current) {
            playedRef.current = false;
            playGreeting();
          } else if (next) {
            window.speechSynthesis?.cancel();
          }
        }}
        className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-base backdrop-blur hover:bg-white"
        aria-label={muted ? "音声をオンにする" : "音声をオフにする"}
        title={muted ? "音声オフ" : "音声オン"}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Logo (top center) */}
      <div className="animate-okme-fade-in pt-9 sm:pt-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/okme-logo.png"
          alt="OKme!"
          className="h-9 w-auto select-none sm:h-11"
          draggable={false}
        />
      </div>

      {/* Center: character + bubble */}
      <div className="flex flex-1 items-center justify-center px-6">
        <div className="relative">
          {/* Speech bubble (appears ~1.8s) */}
          {showBubble && (
            <div className="animate-okme-bubble-in absolute -top-2 left-1/2 z-10 w-[min(21rem,82vw)] -translate-x-1/2 sm:left-auto sm:right-[-2rem] sm:top-4 sm:translate-x-full">
              <div className="relative rounded-2xl rounded-bl-sm border border-line bg-white px-5 py-4 shadow-[0_10px_30px_-14px_rgba(11,31,58,0.28)]">
                <p className="text-sm font-semibold text-[#0b5cad]">Sakiさん 👋</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-[#111827]">
                  おはようございます ☀️
                  <br />
                  今日も一緒に頑張りましょう 💪✨
                  <br />
                  私はいつでもあなたの味方です 😊💙
                </p>
                <span className="absolute -bottom-1.5 left-7 h-3 w-3 rotate-45 border-b border-r border-line bg-white sm:-left-1.5 sm:bottom-auto sm:top-7 sm:border-b-0 sm:border-l sm:border-r-0 sm:border-t" />
              </div>
            </div>
          )}

          {/* Character (lively floating). 背景は画像のまま → ページ背景と同色でなじむ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/okme-character-hero.png"
            alt="OKme! キャラクター"
            className="animate-okme-float h-auto w-[min(34rem,86vw)] max-h-[54svh] select-none object-contain"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom area */}
      <div className="animate-okme-fade-in flex w-full max-w-sm flex-col items-center px-6 pb-9">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#9aa3b2]">
          AR Glasses Experience Demo
        </p>

        {/* KDDI × ORACLE credit */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/okme-credit.png"
          alt="KDDI × ORACLE"
          className="mt-3 h-7 w-auto select-none sm:h-8"
          draggable={false}
        />
        <p className="mt-1.5 text-xs tracking-wide text-[#6b7280]">C Team Demo</p>

        {/* progress */}
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-[#e2e8f2]">
          <div
            className="h-full rounded-full bg-[#0b5cad]"
            style={{ animation: `okme-progress ${NAVIGATE_AT}ms linear forwards` }}
          />
        </div>

        {/* skip */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            goDemo();
          }}
          className="mt-3 text-xs text-[#6b7280] underline-offset-4 hover:text-[#0b1f3a] hover:underline"
        >
          スキップしてデモへ進む
        </button>
      </div>
    </main>
  );
}
