import type { SVGProps } from "react";

export function CatCardsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden {...props}>
      <rect
        x="11"
        y="25"
        width="42"
        height="26"
        rx="7"
        fill="#FFF6EE"
        stroke="#CFC3CF"
        strokeWidth="2"
      />
      <path
        d="m13.5 31 18.5 12 18.5-12"
        stroke="#F3AFC1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
      />
      <path
        d="M20 27c0-8.5 5.4-14.5 12-14.5s12 6 12 14.5v8H20v-8Z"
        fill="#FFFCF7"
        stroke="#CFC3CF"
        strokeWidth="2.1"
      />
      <path
        d="m22.5 20.5 3-9 6.2 6.4 6.3-6.4 3.5 9"
        fill="#FFFCF7"
        stroke="#CFC3CF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
      <circle cx="27.7" cy="27" r="2.8" fill="#50505C" />
      <circle cx="36.3" cy="27" r="2.8" fill="#50505C" />
      <circle cx="26.8" cy="26.1" r="0.9" fill="white" />
      <circle cx="35.4" cy="26.1" r="0.9" fill="white" />
      <circle cx="24" cy="31.5" r="2.1" fill="#F7D7DC" opacity="0.8" />
      <circle cx="40" cy="31.5" r="2.1" fill="#F7D7DC" opacity="0.8" />
      <path d="M32 30.2v1.5M28.6 34c2 1.8 4.8 1.8 6.8 0" stroke="#57505B" strokeLinecap="round" strokeWidth="1.6" />
      <path
        d="M47 14.5c2.3-1.7 4.9.1 4.5 2.5-.3 1.6-2 2.8-4.5 4.3-2.5-1.5-4.2-2.7-4.5-4.3-.4-2.4 2.2-4.2 4.5-2.5Z"
        fill="#F3AFC1"
      />
      <circle cx="18" cy="13" r="2" fill="#BFE5D0" />
      <circle cx="22.5" cy="10.5" r="1.3" fill="#BFE5D0" />
    </svg>
  );
}
