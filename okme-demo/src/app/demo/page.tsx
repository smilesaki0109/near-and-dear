"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OkmeLogo } from "@/components/brand";
import { FeatureSection } from "@/components/FeatureSection";
import { CameraStage } from "@/components/demo/CameraStage";
import { AROverlay } from "@/components/demo/AROverlay";
import { OfficeStage } from "@/components/demo/OfficeStage";
import {
  OfficeTimelineOverlay,
  type PartnerMode,
} from "@/components/demo/OfficeTimelineOverlay";
import { LifeTimelineOverlay } from "@/components/demo/LifeTimelineOverlay";
import { ChatPanel } from "@/components/demo/ChatPanel";
import {
  DemoSetup,
  type Mood,
  type CameraMode,
} from "@/components/demo/DemoSetup";

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

  // --- セットアップ用 state ---
  const [isDemoStarted, setIsDemoStarted] = useState(false);
  const [starting, setStarting] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [partnerMode, setPartnerMode] = useState<PartnerMode>("character");
  const [volume, setVolume] = useState(70);
  const [cameraMode, setCameraMode] = useState<CameraMode>("office");

  // --- デモ用 state ---
  const [chatSceneId, setChatSceneId] = useState<string | null>(null);
  const [fatigue, setFatigue] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);

  // 映像（タイムライン）モードか、端末カメラモードか
  const isVideoMode = cameraMode === "office" || cameraMode === "life";
  const isLifeMode = cameraMode === "life";

  // カメラモードのAR表示用ダミー値（クライアントで生成しハイドレーション不一致を回避）
  useEffect(() => {
    if (!isDemoStarted || isVideoMode) return;
    const roll = () => {
      setFatigue(rand(50, 90));
      setStress(rand(30, 80));
    };
    roll();
    const id = window.setInterval(roll, 6000);
    return () => window.clearInterval(id);
  }, [isDemoStarted, isVideoMode]);

  const handleStart = () => {
    if (starting) return;
    // 「デモを開始」クリック＝ユーザー操作。ここで一拍ローディングを挟んでから開始。
    setStarting(true);
    window.setTimeout(() => {
      setChatSceneId(null);
      setIsDemoStarted(true);
      setStarting(false);
    }, 800);
  };

  const handleBackToSetup = () => {
    setIsDemoStarted(false);
    setChatSceneId(null);
  };

  /* ============ デモ開始後：没入型ARレンズ体験 ============ */
  if (isDemoStarted) {
    return (
      <main className="flex h-dvh flex-col overflow-hidden bg-background text-navy">
        {/* 白基調のヘッダー */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-background/85 px-4 backdrop-blur">
          <Link href="/" className="flex items-center">
            <OkmeLogo className="h-6" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.25em] text-sub sm:inline">
              KDDI × ORACLE C Team Demo
            </span>
            <button
              onClick={handleBackToSetup}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-navy transition hover:border-navy/30"
            >
              設定
            </button>
            <Link
              href="/"
              className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-navy transition hover:border-navy/30"
            >
              終了
            </Link>
          </div>
        </header>

        {/* AR体験ステージ：大きな映像 + 半透明Companion Log */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:flex-row lg:gap-4 lg:p-4">
          <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center">
            {isLifeMode ? (
              <OfficeStage
                volume={volume}
                videoSrc="/videos/download (1).mp4"
                timelineLength={36}
                holdMs={45000}
                label="Life Demo / Future Vision"
                showWalkFallback={false}
              >
                {(currentTime) => (
                  // Life Demo はカード・吹き出しなし。上部HUD（時刻 / AR View Active / Privacy）のみ表示。
                  <LifeTimelineOverlay
                    currentTime={currentTime}
                    volume={volume}
                    hudOnly
                  />
                )}
              </OfficeStage>
            ) : cameraMode === "office" ? (
              <OfficeStage volume={volume}>
                {(currentTime) => (
                  <OfficeTimelineOverlay
                    currentTime={currentTime}
                    onSceneChange={setChatSceneId}
                    volume={volume}
                    partnerMode={partnerMode}
                  />
                )}
              </OfficeStage>
            ) : (
              <div className="w-full max-w-md">
                <CameraStage
                  facingMode={cameraMode === "front" ? "user" : "environment"}
                  autoStart
                >
                  <AROverlay time={time} fatigue={fatigue} stress={stress} />
                </CameraStage>
              </div>
            )}
          </div>

          {/* Companion Log（半透明ダークパネル） */}
          <aside className="h-[38vh] w-full shrink-0 lg:h-auto lg:w-[330px]">
            <ChatPanel
              injectedSceneId={isVideoMode ? chatSceneId : null}
              mode={isLifeMode ? "life" : "office"}
            />
          </aside>
        </div>
      </main>
    );
  }

  /* ============ デモ開始前：明るいセットアップ画面 ============ */
  return (
    <main className="min-h-dvh">
      <header className="sticky top-0 z-50 border-b border-line bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <OkmeLogo />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-sub sm:inline">
              KDDI × ORACLE C Team Demo
            </span>
            <Link
              href="/"
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-navy hover:border-navy/30"
            >
              トップへ戻る
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-[1200px] px-6 py-6">
        {starting ? (
          <StartupLoading />
        ) : (
          <DemoSetup
            selectedMood={selectedMood}
            onSelectMood={setSelectedMood}
            partnerMode={partnerMode}
            onPartnerMode={setPartnerMode}
            volume={volume}
            onVolume={setVolume}
            cameraMode={cameraMode}
            onCameraMode={setCameraMode}
            onStart={handleStart}
          />
        )}
      </section>

      <div className="border-t border-line">
        <FeatureSection title="この体験を支える機能" />
      </div>
    </main>
  );
}

function StartupLoading() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = window.setTimeout(() => setStep(1), 350);
    return () => window.clearTimeout(id);
  }, []);
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 rounded-3xl border border-line bg-white text-center shadow-sm">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-brand-blue" />
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-navy">ARグラスを起動しています...</p>
        <p
          className={`text-sm text-sub transition-opacity duration-500 ${
            step >= 1 ? "opacity-100" : "opacity-0"
          }`}
        >
          表示設定を同期しています...
        </p>
      </div>
    </div>
  );
}
