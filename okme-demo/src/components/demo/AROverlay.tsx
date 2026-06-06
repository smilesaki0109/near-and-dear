"use client";

import { OkmeImage } from "@/components/brand";
import { WeatherIcon, CalendarIcon, PinIcon } from "@/components/icons";

const TODAY = [
  { time: "11:00", title: "チーム会議" },
  { time: "13:00", title: "1on1" },
  { time: "15:30", title: "資料レビュー" },
];

function Meter({
  label,
  value,
  color,
}: {
  label: string;
  value: number | null;
  color: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] text-white/80">
        <span>{label}</span>
        <span className="font-medium text-white">{value !== null ? `${value}%` : "--"}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value ?? 0}%`, background: color }}
        />
      </div>
    </div>
  );
}

export function AROverlay({
  time,
  fatigue,
  stress,
}: {
  time: string;
  fatigue: number | null;
  stress: number | null;
}) {
  return (
    <div className="relative h-full w-full">
      {/* Top-left: time + weather */}
      <div className="glass-ar absolute left-3.5 top-3.5 rounded-xl px-3 py-2 text-white">
        <p className="text-lg font-semibold leading-none tabular-nums sm:text-xl">{time}</p>
        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-white/75">
          <WeatherIcon className="h-3.5 w-3.5" />
          晴れ 23℃
        </p>
      </div>

      {/* Top-right: today's schedule */}
      <div className="glass-ar absolute right-3.5 top-3.5 w-36 rounded-xl p-2.5 text-white sm:w-40">
        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] text-white/65">
          <CalendarIcon className="h-3.5 w-3.5" />
          今日の予定
        </p>
        <ul className="space-y-1">
          {TODAY.map((e) => (
            <li key={e.time} className="flex items-center gap-2 text-[11px]">
              <span className="tabular-nums text-white/60">{e.time}</span>
              <span className="truncate text-white/90">{e.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mid-left: next event */}
      <div className="glass-ar absolute left-3.5 top-1/2 w-40 -translate-y-1/2 rounded-xl p-2.5 text-white sm:w-44">
        <p className="text-[10px] font-medium uppercase tracking-wide text-orange">Next</p>
        <p className="mt-0.5 text-sm font-semibold">13:00 1on1</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-white/75">
          <PinIcon className="h-3.5 w-3.5" />
          会議室 A-12
        </p>
        <p className="text-[11px] text-white/60">参加者：田中さん</p>
      </div>

      {/* Mid-right: condition */}
      <div className="glass-ar absolute right-3.5 top-1/2 w-40 -translate-y-1/2 space-y-2.5 rounded-xl p-2.5 text-white sm:w-44">
        <p className="text-[10px] text-white/65">コンディション</p>
        <Meter label="疲労度" value={fatigue} color="#f97316" />
        <Meter label="ストレス度" value={stress} color="#60a5fa" />
      </div>

      {/* Bottom: character + speech bubble */}
      <div className="absolute bottom-16 left-1/2 flex w-[90%] max-w-sm -translate-x-1/2 items-end gap-2">
        <div className="glass-ar flex-1 rounded-xl rounded-br-sm px-3 py-2 text-[12px] leading-relaxed text-white/90">
          <span className="mb-0.5 block text-[10px] font-medium text-orange">OKme!</span>
          Sakiさん、おはようございます。今日は会議が多めです。合間に休憩をはさみましょう。
        </div>
        <OkmeImage
          src="/images/okme-character.png"
          fallback="character"
          alt="OKme! キャラクター"
          className="w-14 shrink-0 drop-shadow"
        />
      </div>
    </div>
  );
}
