"use client";

import Link from "next/link";
import { useState } from "react";
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
  place: "🏠",
  culture: "🎎",
  daily_life: "🌿",
};

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
    <div
      onClick={pick}
      className="relative min-h-[440px] cursor-crosshair overflow-hidden rounded-[24px] bg-[#f8f5f2] shadow-[var(--shadow-hover)] ring-1 ring-white/80 sm:min-h-[520px]"
      aria-label="Illustrated Japan map. Click to choose a post position."
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_18%,rgba(255,255,255,0.9),transparent_14%),radial-gradient(circle_at_88%_20%,rgba(255,255,255,0.75),transparent_12%),radial-gradient(circle_at_45%_80%,rgba(255,236,220,0.55),transparent_18%)]" />
      <span className="absolute left-[8%] top-[22%] text-5xl" aria-hidden>☁️</span>
      <span className="absolute right-[7%] top-[26%] text-4xl" aria-hidden>☁️</span>
      <span className="absolute left-[18%] bottom-[20%] text-3xl" aria-hidden>🎈</span>
      <span className="absolute right-[11%] bottom-[18%] text-3xl" aria-hidden>✈️</span>
      <span className="absolute left-[44%] top-[14%] text-2xl text-[var(--accent-sky)]" aria-hidden>≋</span>
      <span className="absolute right-[24%] top-[35%] text-2xl text-[var(--accent-sky)]" aria-hidden>≋</span>

      <svg
        viewBox="0 0 760 460"
        className="absolute inset-x-0 top-6 mx-auto h-[82%] max-h-[470px] w-full max-w-[860px]"
        aria-hidden
      >
        <defs>
          <pattern id="dotPattern" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.5" fill="#f4d69c" opacity="0.55" />
          </pattern>
          <filter id="softMapShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="9" stdDeviation="9" floodColor="#8f744f" floodOpacity="0.16" />
          </filter>
        </defs>
        <rect x="0" y="0" width="760" height="460" fill="#bfe8ee" opacity="0.78" rx="34" />
        <text x="596" y="34" fontSize="12" fontWeight="700" fill="#7d62b0" opacity="0.55">
          HOKKAIDO
        </text>
        <path
          d="M568 48 C610 35 650 58 652 94 C654 129 621 151 585 139 C548 127 533 85 568 48Z"
          fill="#f9d86b"
          filter="url(#softMapShadow)"
        />
        <path
          d="M568 48 C610 35 650 58 652 94 C654 129 621 151 585 139 C548 127 533 85 568 48Z"
          fill="url(#dotPattern)"
        />
        <path
          d="M530 142 C561 168 568 198 543 219 C520 239 496 239 476 260 C449 288 427 315 384 326 C351 333 311 325 305 300 C299 279 331 266 355 249 C386 226 402 201 423 178 C456 142 500 116 530 142Z"
          fill="#f9d86b"
          filter="url(#softMapShadow)"
        />
        <path
          d="M530 142 C561 168 568 198 543 219 C520 239 496 239 476 260 C449 288 427 315 384 326 C351 333 311 325 305 300 C299 279 331 266 355 249 C386 226 402 201 423 178 C456 142 500 116 530 142Z"
          fill="url(#dotPattern)"
        />
        <path
          d="M289 296 C257 301 231 326 224 358 C249 383 289 376 306 346 C320 321 312 300 289 296Z"
          fill="#f7ca62"
          filter="url(#softMapShadow)"
        />
        <path
          d="M357 337 C392 321 428 327 448 347 C429 368 388 374 354 358 C346 350 348 342 357 337Z"
          fill="#f6c35f"
          filter="url(#softMapShadow)"
        />
        <path
          d="M252 371 C239 382 238 402 253 413 C271 409 281 393 274 376 C268 369 259 366 252 371Z"
          fill="#f6c35f"
          filter="url(#softMapShadow)"
        />
        <circle cx="568" cy="151" r="7" fill="#f7ca62" filter="url(#softMapShadow)" />
        <circle cx="220" cy="397" r="6" fill="#f6c35f" filter="url(#softMapShadow)" />
        <circle cx="192" cy="409" r="5" fill="#f6c35f" filter="url(#softMapShadow)" />
        <circle cx="160" cy="417" r="4" fill="#f6c35f" filter="url(#softMapShadow)" />
        <text x="456" y="247" fontSize="34">🗻</text>
        <text x="429" y="186" fontSize="24">🌸</text>
        <text x="355" y="286" fontSize="28">🏯</text>
        <text x="525" y="215" fontSize="27">🍜</text>
        <text x="395" y="358" fontSize="25">🐙</text>
        <text x="242" y="346" fontSize="22">😊</text>
      </svg>

      <div className="absolute left-7 top-7 max-w-sm rounded-[var(--radius-xl)] bg-white/65 p-5 shadow-[var(--shadow-soft)] ring-1 ring-white/80 backdrop-blur-md">
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

      {posts.map((post) => (
        <button
          key={post.id}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActivePost((prev) => (prev?.id === post.id ? null : post));
          }}
          className={`absolute z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-lg shadow-[var(--shadow-hover)] ring-2 transition duration-200 hover:scale-110 ${categoryPinClass[post.category]}`}
          style={{ left: `${post.x}%`, top: `${post.y}%` }}
          aria-label={post.title}
        >
          {categoryEmoji[post.category]}
        </button>
      ))}

      {selectedPoint ? (
        <div
          className="pointer-events-none absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-base text-[var(--primary-deep)] shadow-[var(--shadow-hover)] ring-2 ring-[var(--primary)]/30"
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
              {categoryEmoji[activePost.category]} {categoryLabels[activePost.category]}
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
  );
}
