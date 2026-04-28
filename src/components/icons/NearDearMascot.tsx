import type { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement> & {
  title?: string;
};

export function NearDearMascot({ title = "Near & Dear mascot", ...props }: Props) {
  return (
    <svg viewBox="0 0 160 160" fill="none" role="img" aria-label={title} {...props}>
      <defs>
        <radialGradient id="mascotGlow" cx="50%" cy="48%" r="56%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
          <stop offset="42%" stopColor="#FFE7F0" stopOpacity="0.78" />
          <stop offset="68%" stopColor="#E9E0FF" stopOpacity="0.54" />
          <stop offset="100%" stopColor="#DFF4FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mascotHalo" x1="34" y1="24" x2="128" y2="138">
          <stop stopColor="#FFE4EF" />
          <stop offset="0.48" stopColor="#F5EDFF" />
          <stop offset="1" stopColor="#DDF4FF" />
        </linearGradient>
        <linearGradient id="mascotHeart" x1="62" y1="92" x2="101" y2="128">
          <stop stopColor="#F8B8C8" />
          <stop offset="1" stopColor="#E88EA8" />
        </linearGradient>
      </defs>

      <circle cx="80" cy="80" r="70" fill="url(#mascotGlow)" />
      <circle cx="80" cy="83" r="52" fill="url(#mascotHalo)" opacity="0.26" />
      <path
        d="M43 122c10 8 66 9 78 0"
        stroke="#D8CFE4"
        strokeLinecap="round"
        strokeWidth="7"
        opacity="0.34"
      />

      <path
        d="M45 72c0-25 15-43 35-43s35 18 35 43v31c0 21-14 32-35 32s-35-11-35-32V72Z"
        fill="#FFFCF8"
        stroke="#CFC3CF"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="m49 52 8-27 22 22 22-22 10 27"
        fill="#FFFCF8"
        stroke="#CFC3CF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
      />
      <path
        d="m61 43 6-11 8 9M99 43l-6-11-8 9"
        fill="#F8C9D5"
        stroke="#F8C9D5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />

      <circle cx="66" cy="72" r="7" fill="#3F3E49" />
      <circle cx="94" cy="72" r="7" fill="#3F3E49" />
      <circle cx="63.7" cy="69.6" r="2.1" fill="white" />
      <circle cx="91.7" cy="69.6" r="2.1" fill="white" />
      <circle cx="56" cy="84" r="6" fill="#F8D8DE" opacity="0.86" />
      <circle cx="104" cy="84" r="6" fill="#F8D8DE" opacity="0.86" />

      <path
        d="M80 79v4M67 91c7 6 19 6 26 0"
        stroke="#57505B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3.2"
      />
      <path
        d="M50 96c-9-3-15 1-17 8M110 96c9-3 15 1 17 8"
        stroke="#CFC3CF"
        strokeLinecap="round"
        strokeWidth="4"
      />

      <path
        d="M80 123s-24-14-24-29.6c0-8.2 9.8-12.8 24-3.4 14.2-9.4 24-4.8 24 3.4C104 109 80 123 80 123Z"
        fill="url(#mascotHeart)"
        stroke="#D88EA4"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d="M121 45c5-4 11 0 10 5-.5 3.5-4 6-10 9.5-6-3.5-9.5-6-10-9.5-1-5 5-9 10-5Z"
        fill="#F6C2D0"
        opacity="0.9"
      />
      <circle cx="39" cy="48" r="4" fill="#BFE5D0" opacity="0.78" />
      <circle cx="124" cy="104" r="5" fill="#B8D9F5" opacity="0.72" />
      <path d="M35 74l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6Z" fill="#F7DFA0" opacity="0.85" />
    </svg>
  );
}
