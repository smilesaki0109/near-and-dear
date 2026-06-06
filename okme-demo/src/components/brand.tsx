"use client";

import { useState } from "react";

/**
 * OKme! のロゴワードマーク。提供画像があればそれを、無ければSVGにフォールバック。
 */
export function OkmeLogo({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src="/images/okme-logo.png"
        alt="OKme!"
        onError={() => setFailed(true)}
        className={`h-7 w-auto ${className}`}
      />
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <OkmeMark className="h-8 w-8" />
      <span className="text-2xl font-extrabold tracking-tight text-navy">
        OK
        <span className="text-orange">me!</span>
      </span>
    </span>
  );
}

/**
 * 単体マーク（丸みのあるARグラス＋スマイル）。
 */
export function OkmeMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="okme-mark-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f6bff" />
          <stop offset="1" stopColor="#102146" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="60" height="60" rx="20" fill="url(#okme-mark-g)" />
      <rect x="11" y="24" width="18" height="14" rx="7" fill="#bfe0ff" />
      <rect x="35" y="24" width="18" height="14" rx="7" fill="#bfe0ff" />
      <rect x="28" y="29" width="8" height="3" rx="1.5" fill="#bfe0ff" />
      <circle cx="20" cy="31" r="3" fill="#102146" />
      <circle cx="44" cy="31" r="3" fill="#102146" />
      <path
        d="M22 46c3.5 4 16.5 4 20 0"
        stroke="#ff8a3d"
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * OKme! キャラクター（やさしいAIコンパニオン）。
 */
export function OkmeCharacter({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 260" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="char-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3eeff" />
        </linearGradient>
        <linearGradient id="char-visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2f6bff" />
          <stop offset="1" stopColor="#1c2f5c" />
        </linearGradient>
        <radialGradient id="char-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#bfe0ff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#bfe0ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="232" rx="74" ry="14" fill="#102146" opacity="0.12" />
      <circle cx="120" cy="120" r="118" fill="url(#char-glow)" opacity="0.5" />

      {/* antenna */}
      <line x1="120" y1="40" x2="120" y2="20" stroke="#102146" strokeWidth="5" strokeLinecap="round" />
      <circle cx="120" cy="15" r="8" fill="#ff8a3d" />

      {/* body */}
      <rect x="62" y="150" width="116" height="78" rx="34" fill="url(#char-body)" stroke="#cdddf7" strokeWidth="2" />
      <rect x="96" y="176" width="48" height="30" rx="12" fill="#eaf4ff" />
      <circle cx="120" cy="191" r="7" fill="#2f6bff" />

      {/* head */}
      <rect x="50" y="44" width="140" height="120" rx="48" fill="url(#char-body)" stroke="#cdddf7" strokeWidth="2" />

      {/* AR visor */}
      <rect x="62" y="78" width="116" height="50" rx="25" fill="url(#char-visor)" />
      <rect x="66" y="82" width="108" height="42" rx="21" fill="#0c1a38" opacity="0.55" />
      <circle cx="98" cy="103" r="9" fill="#bfe0ff" />
      <circle cx="142" cy="103" r="9" fill="#bfe0ff" />
      <circle cx="100" cy="100" r="3" fill="#ffffff" />
      <circle cx="144" cy="100" r="3" fill="#ffffff" />
      <rect x="116" y="100" width="8" height="6" rx="3" fill="#2f6bff" />

      {/* cheeks + smile */}
      <circle cx="74" cy="140" r="8" fill="#ffd9bd" />
      <circle cx="166" cy="140" r="8" fill="#ffd9bd" />
      <path d="M104 142c5 6 27 6 32 0" stroke="#ff8a3d" strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {/* arms */}
      <rect x="42" y="158" width="20" height="48" rx="10" fill="#e3eeff" stroke="#cdddf7" strokeWidth="2" />
      <rect x="178" y="150" width="20" height="44" rx="10" fill="#e3eeff" stroke="#cdddf7" strokeWidth="2" transform="rotate(18 188 172)" />
    </svg>
  );
}

/**
 * png 画像があればそれを表示し、無ければインラインSVGにフォールバック。
 * 仕様の /images/okme-*.png を尊重しつつ、未配置でも崩れないようにする。
 */
export function OkmeImage({
  src,
  fallback,
  alt,
  className = "",
}: {
  src: string;
  fallback: "character" | "logo";
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return fallback === "character" ? (
      <OkmeCharacter className={className} />
    ) : (
      <OkmeMark className={className} />
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
