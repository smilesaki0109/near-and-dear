"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OkmeLogo } from "@/components/brand";
import { FeatureSection } from "@/components/FeatureSection";
import { CameraStage } from "@/components/demo/CameraStage";
import { AROverlay } from "@/components/demo/AROverlay";
import { OfficeStage } from "@/components/demo/OfficeStage";
import { OfficeTimelineOverlay } from "@/components/demo/OfficeTimelineOverlay";
import { ChatPanel } from "@/components/demo/ChatPanel";
import type { TimelineScene } from "@/lib/timeline";

type StageMode = "office" | "camera";

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function useClock() {
  const [time, setTime] = useState("--:--");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    tick();
    const id = window.setInterval(tick, 1000 * 15);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export default function DemoPage() {
  const time = useClock();
  const [mode, setMode] = useState<StageMode>("office");
  const [chatSceneId, setChatSceneId] = useState<TimelineScene["id"] | null>(null);
  const [fatigue, setFatigue] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);

  // カメラモードのAR表示用ダミー値（クライアントで生成しハイドレーション不一致を回避）
  useEffect(() => {
    const roll = () => {
      setFatigue(rand(50, 90));
      setStress(rand(30, 80));
    };
    roll();
    const id = window.setInterval(roll, 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className="min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-line bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <OkmeLogo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-sub sm:inline">ARメガネ体験デモ</span>
            <Link
              href="/"
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-navy hover:border-navy/30"
            >
              トップへ戻る
            </Link>
          </div>
        </div>
      </header>

      {/* Demo stage */}
      <section className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h1 className="text-2xl font-bold tracking-tight text-navy">ARメガネ体験デモ</h1>
            <p className="mt-2 text-sm leading-7 text-sub">
              {mode === "office"
                ? "オフィスを歩く一人称視点の映像に、OKme! が予定・会議室・相手情報・コンディション・次の行動を重ねて表示します。"
                : "PCカメラの映像の上に、OKme! が予定・コンディション・提案を重ねて表示します。"}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="inline-flex shrink-0 rounded-full border border-line bg-white p-1 text-sm">
            <button
              onClick={() => setMode("office")}
              className={`rounded-full px-4 py-2 font-medium transition-colors ${
                mode === "office"
                  ? "bg-navy text-white"
                  : "text-sub hover:text-navy"
              }`}
            >
              オフィスデモモード
            </button>
            <button
              onClick={() => setMode("camera")}
              className={`rounded-full px-4 py-2 font-medium transition-colors ${
                mode === "camera"
                  ? "bg-navy text-white"
                  : "text-sub hover:text-navy"
              }`}
            >
              カメラモード
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* Center: large landscape office demo (or camera) + AR */}
          <div className="order-1">
            {mode === "office" ? (
              <OfficeStage>
                {(currentTime) => (
                  <OfficeTimelineOverlay
                    currentTime={currentTime}
                    onSceneChange={setChatSceneId}
                  />
                )}
              </OfficeStage>
            ) : (
              <CameraStage>
                <AROverlay time={time} fatigue={fatigue} stress={stress} />
              </CameraStage>
            )}
          </div>

          {/* Right: chat (narrower, video is the star) */}
          <div className="order-2 h-[540px] lg:h-auto">
            <ChatPanel injectedSceneId={mode === "office" ? chatSceneId : null} />
          </div>
        </div>
      </section>

      <div className="border-t border-line">
        <FeatureSection title="この体験を支える機能" />
      </div>
    </main>
  );
}
