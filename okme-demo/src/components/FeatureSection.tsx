import {
  CameraIcon,
  PinIcon,
  PulseIcon,
  CalendarIcon,
  MicIcon,
} from "./icons";
import type { JSX } from "react";

type Feature = {
  title: string;
  desc: string;
  icon: (props: { className?: string }) => JSX.Element;
};

const FEATURES: Feature[] = [
  {
    title: "リアルタイムカメラ",
    desc: "カメラ映像をベースに、AR表示の体験ができます。",
    icon: CameraIcon,
  },
  {
    title: "環境・位置情報",
    desc: "現在地・天気・周辺情報をその場で表示します。",
    icon: PinIcon,
  },
  {
    title: "コンディション分析",
    desc: "疲労度・ストレス度をデモ表示し、働き方をサポート。",
    icon: PulseIcon,
  },
  {
    title: "スケジュール管理",
    desc: "予定や会議情報を、見やすくまとめて表示します。",
    icon: CalendarIcon,
  },
  {
    title: "AIチャット・音声",
    desc: "自然な会話で相談やリマインドが可能です。",
    icon: MicIcon,
  },
];

export function FeatureSection({ title = "OKme! の主な機能" }: { title?: string }) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-6 py-16">
      <div className="mb-9 max-w-xl">
        <h2 className="text-2xl font-bold tracking-tight text-navy">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-sub">
          毎日の業務に必要な情報を、視界の中に自然にまとめます。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <article
            key={f.title}
            className="card rounded-2xl p-5 transition-colors hover:border-navy/20"
          >
            <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-bluegrey text-navy">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="mb-1 text-[15px] font-semibold text-ink">{f.title}</h3>
            <p className="text-[13px] leading-6 text-sub">{f.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
