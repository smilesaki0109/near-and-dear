"use client";

import { PinIcon, StepsIcon, CalendarIcon, PulseIcon } from "@/components/icons";
import type { JSX } from "react";

type Sensor = {
  label: string;
  icon: (props: { className?: string }) => JSX.Element;
};

const SENSORS: Sensor[] = [
  { label: "位置情報", icon: PinIcon },
  { label: "歩数データ", icon: StepsIcon },
  { label: "カレンダー", icon: CalendarIcon },
  { label: "心拍数", icon: PulseIcon },
];

export function SensorPanel({ steps, bpm }: { steps: number | null; bpm: number | null }) {
  const detail: Record<string, string | null> = {
    位置情報: "東京・大手町",
    歩数データ: steps !== null ? `${steps.toLocaleString()} 歩` : null,
    カレンダー: "本日 3件",
    心拍数: bpm !== null ? `${bpm} bpm` : null,
  };

  return (
    <div className="card flex h-full flex-col rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-navy">センサー状態</h2>
        <span className="flex items-center gap-1.5 text-xs text-sub">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          接続中
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {SENSORS.map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bluegrey text-navy">
              <s.icon className="h-[18px] w-[18px]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-ink">{s.label}</p>
              <p className="truncate text-xs text-sub">{detail[s.label] ?? "計測中…"}</p>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">ON</span>
          </div>
        ))}
      </div>

      <p className="mt-auto pt-4 text-[11px] leading-relaxed text-sub/80">
        ※デモ用のランダムデータを表示しています
      </p>
    </div>
  );
}
