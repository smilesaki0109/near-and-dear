"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import type { JapanMapCategory, JapanMapPost } from "@/types/map";

type Props = {
  posts: JapanMapPost[];
  selectedPoint: { x: number; y: number } | null;
  onPickPoint: (point: { x: number; y: number }) => void;
};

const categoryLabels: Record<JapanMapCategory, string> = {
  food: "Food",
  place: "Place",
  culture: "Culture",
  daily_life: "Daily Life",
};

const categoryEmoji: Record<JapanMapCategory, string> = {
  food: "🍜",
  place: "🗻",
  culture: "🎎",
  daily_life: "🌿",
};

function postEmoji(post: Pick<JapanMapPost, "category" | "title">): string {
  const title = post.title.toLowerCase();
  if (title.includes("onigiri") || title.includes("rice")) return "🍙";
  if (title.includes("takoyaki")) return "🐙";
  if (title.includes("okinawa") || title.includes("ocean")) return "🌊";
  if (title.includes("kyoto") || title.includes("temple")) return "🏯";
  return categoryEmoji[post.category];
}

const categoryPinClass: Record<JapanMapCategory, string> = {
  food: "bg-[#fff0f4] text-[#d45f7e] ring-[#f4b4c7]/50",
  place: "bg-[#eef7ff] text-[#4d8fd8] ring-[#b8d9f5]/60",
  culture: "bg-[var(--primary-soft)] text-[var(--primary-deep)] ring-[var(--primary)]/20",
  daily_life: "bg-[#effaf4] text-[#4f956a] ring-[var(--accent-mint)]/60",
};

export function IllustratedJapanMap({
  posts,
  selectedPoint,
  onPickPoint,
}: Props) {
  const [activePost, setActivePost] = useState<JapanMapPost | null>(null);

  function pick(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest("button,a")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onPickPoint({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
    setActivePost(null);
  }

  return (
    <div className="overflow-hidden rounded-[24px] bg-[#f8f5f2] shadow-[var(--shadow-hover)] ring-1 ring-white/80">
      <div className="hidden p-5 md:block md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary-deep)]/80">
          Japan Map
        </p>
        <h2 className="mt-3 text-2xl font-semibold leading-tight text-[var(--text)] sm:text-3xl">
          What people love in Japan
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          Tap a pin to see someone’s tiny joy, or click the map to add yours.
        </p>
      </div>

      <div
        onClick={pick}
        className="relative mx-auto w-full max-w-4xl cursor-pointer overflow-hidden"
        aria-label="Japan map image. Click to choose a post position."
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- local map asset used as an interactive coordinate plane */}
        <img
          src="/images/japan-map.png"
          alt="Illustrated Japan map"
          className="block w-full select-none rounded-b-[24px] shadow-sm"
          draggable={false}
        />

        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
          <MapBubble
            className="left-[4%] top-[5%] hidden max-w-[168px] px-4 py-2.5 text-sm leading-relaxed sm:max-w-[230px] sm:px-5 sm:py-3 sm:text-base md:left-[7%] md:top-[8%] md:block"
            delay="0s"
          >
            <span className="block font-bold text-[var(--primary-deep)]">
              ✨ Discover Japan!
            </span>
            <span className="mt-1 hidden text-xs font-semibold text-[var(--text-muted)] sm:block">
              Tiny stories are hiding everywhere.
            </span>
          </MapBubble>
          <MapBubble
            className="right-[4%] top-[15%] hidden px-4 py-2 text-sm md:block"
            delay="0.8s"
          >
            🍡 Tiny joys everywhere
          </MapBubble>
          <MapBubble
            className="left-[7%] bottom-[11%] hidden px-3.5 py-2 text-xs sm:text-sm md:left-[12%] md:bottom-[17%] md:block"
            delay="1.4s"
          >
            🌸 What do you love here?
          </MapBubble>
          <MapBubble
            className="right-[7%] bottom-[9%] hidden px-4 py-2 text-sm lg:block"
            delay="2s"
          >
            💌 Tap to share your moment
          </MapBubble>
          <FloatingDecoration className="left-[30%] top-[12%] text-sm sm:text-base" delay="0.2s">
            ♡
          </FloatingDecoration>
          <FloatingDecoration className="right-[27%] top-[31%] text-sm sm:text-lg" delay="0.9s">
            ✨
          </FloatingDecoration>
          <FloatingDecoration className="left-[42%] bottom-[20%] hidden text-lg sm:block" delay="1.4s">
            🌸
          </FloatingDecoration>
          <FloatingDecoration className="right-[18%] bottom-[31%] hidden text-base sm:block" delay="2s">
            ♡
          </FloatingDecoration>
          <FloatingDecoration className="right-[36%] top-[9%] hidden text-sm md:block" delay="2.8s">
            ✨
          </FloatingDecoration>
          <MapBalloon className="left-[18%] top-[24%] bg-[#f6c7d3]" delay="0.3s" />
          <MapBalloon className="right-[13%] top-[40%] hidden bg-[#d8cff7] sm:block" delay="1.2s" />
          <MapBalloon className="left-[35%] bottom-[9%] hidden bg-[#f8de83] md:block" delay="2.1s" />
        </div>

        {posts.map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActivePost((prev) => (prev?.id === post.id ? null : post));
            }}
            className={`near-dear-map-pin-pulse absolute z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-base shadow-[var(--shadow-hover)] ring-2 transition duration-200 hover:scale-125 sm:h-10 sm:w-10 sm:text-lg ${categoryPinClass[post.category]}`}
            style={{ left: `${post.x}%`, top: `${post.y}%` }}
            aria-label={post.title}
          >
            {postEmoji(post)}
          </button>
        ))}

      {selectedPoint ? (
        <div
          className="pointer-events-none absolute z-10 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-sm text-[var(--primary-deep)] shadow-[var(--shadow-hover)] ring-2 ring-[var(--primary)]/30 sm:h-9 sm:w-9 sm:text-base"
          style={{ left: `${selectedPoint.x}%`, top: `${selectedPoint.y}%` }}
          aria-hidden
        >
          ＋
        </div>
      ) : null}

      {activePost ? (
        <div
          className="absolute z-30 w-[min(260px,calc(100%-2rem))] animate-card-rise overflow-hidden rounded-2xl bg-white/95 shadow-[var(--shadow-hover)] ring-1 ring-white/90 backdrop-blur-md"
          style={{
            left: `${Math.min(78, Math.max(4, activePost.x + 3))}%`,
            top: `${Math.min(72, Math.max(12, activePost.y - 8))}%`,
          }}
        >
          {activePost.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-provided remote image URL
            <img
              src={activePost.imageUrl}
              alt=""
              className="h-28 w-full object-cover"
            />
          ) : null}
          <div className="p-4">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${categoryPinClass[activePost.category]}`}>
              {postEmoji(activePost)} {categoryLabels[activePost.category]}
            </span>
            <h3 className="mt-3 text-base font-semibold leading-snug text-[var(--text)]">
              {activePost.title}
            </h3>
            {activePost.description ? (
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
                {activePost.description}
              </p>
            ) : null}
            <Link
              href="/create/1"
              className="mt-3 inline-flex rounded-full bg-[var(--primary-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--primary-deep)]"
            >
              Make a card from this
            </Link>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}

function MapBubble({
  className,
  delay,
  children,
}: {
  className: string;
  delay: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`near-dear-map-float absolute rounded-[2rem_1.5rem_2.2rem_1.6rem] bg-gradient-to-br from-white/90 via-white/82 to-[#f7edf7]/82 font-semibold text-[var(--text)] shadow-[0_14px_42px_rgba(54,47,61,0.14)] ring-1 ring-white/80 backdrop-blur-md transition-transform duration-300 ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function MapBalloon({
  className,
  delay,
}: {
  className: string;
  delay: string;
}) {
  return (
    <span
      className={`near-dear-map-balloon absolute h-5 w-4 rounded-full opacity-55 shadow-[0_8px_18px_rgba(54,47,61,0.12)] ${className}`}
      style={{ animationDelay: delay }}
    >
      <span className="absolute left-1/2 top-full h-4 w-px -translate-x-1/2 bg-white/70" />
    </span>
  );
}

function FloatingDecoration({
  className,
  delay,
  children,
}: {
  className: string;
  delay: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`near-dear-map-sparkle absolute drop-shadow-sm ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </span>
  );
}
