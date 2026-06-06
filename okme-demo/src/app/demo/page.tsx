"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OkmeLogo } from "@/components/brand";
import { FeatureSection } from "@/components/FeatureSection";
import { SensorPanel } from "@/components/demo/SensorPanel";
import { CameraStage } from "@/components/demo/CameraStage";
import { AROverlay } from "@/components/demo/AROverlay";
import { ChatPanel } from "@/components/demo/ChatPanel";

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
  const [fatigue, setFatigue] = useState<number | null>(null);
  const [stress, setStress] = useState<number | null>(null);
  const [steps, setSteps] = useState<number | null>(null);
  const [bpm, setBpm] = useState<number | null>(null);

  // ランダムなデモ用データはクライアントで生成（ハイドレーション不一致を回避）
  useEffect(() => {
    const roll = () => {
      setFatigue(rand(50, 90));
      setStress(rand(30, 80));
      setSteps(rand(1800, 6400));
      setBpm(rand(64, 88));
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
        <div className="mb-6 max-w-xl">
          <h1 className="text-2xl font-bold tracking-tight text-navy">ARメガネ体験デモ</h1>
          <p className="mt-2 text-sm leading-7 text-sub">
            カメラ映像の上に、OKme! が予定・コンディション・提案を重ねて表示します。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[240px_minmax(0,1fr)_340px]">
          {/* Left: sensors */}
          <div className="order-2 lg:order-1">
            <SensorPanel steps={steps} bpm={bpm} />
          </div>

          {/* Center: camera + AR */}
          <div className="order-1 lg:order-2">
            <CameraStage>
              <AROverlay time={time} fatigue={fatigue} stress={stress} />
            </CameraStage>
          </div>

          {/* Right: chat */}
          <div className="order-3 h-[540px] lg:h-auto">
            <ChatPanel />
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-sub/80">
          ※ 疲労度・ストレス度・歩数・心拍数はデモ用のランダム値です。実際の測定は行っていません。
        </p>
      </section>

      <div className="border-t border-line">
        <FeatureSection title="この体験を支える機能" />
      </div>
    </main>
  );
}
