import type { SVGProps } from "react";

export function CatExploreIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden {...props}>
      <circle cx="31" cy="32" r="18" fill="#FFFCF7" stroke="#CFC3CF" strokeWidth="2.1" />
      <path
        d="m21.5 25 3.5-10 6 6.2 6-6.2 3.5 10"
        fill="#FFFCF7"
        stroke="#CFC3CF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
      <circle cx="26.5" cy="31" r="2.5" fill="#50505C" />
      <circle cx="34.5" cy="31" r="2.5" fill="#50505C" />
      <circle cx="25.7" cy="30.2" r="0.8" fill="white" />
      <circle cx="33.7" cy="30.2" r="0.8" fill="white" />
      <circle cx="23" cy="36" r="2" fill="#F7D7DC" opacity="0.75" />
      <circle cx="38" cy="36" r="2" fill="#F7D7DC" opacity="0.75" />
      <path d="M30.5 34v1.4M27.6 38c1.8 1.4 4 1.4 5.8 0" stroke="#57505B" strokeLinecap="round" strokeWidth="1.5" />
      <path
        d="M39.5 36.5 52 49"
        stroke="#CFC3CF"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path d="M45 12l1.6 3.4L50 17l-3.4 1.6L45 22l-1.6-3.4L40 17l3.4-1.6L45 12Z" fill="#F3AFC1" />
      <path d="M17 44l1.2 2.5 2.6 1.2-2.6 1.2L17 51.5l-1.2-2.6-2.6-1.2 2.6-1.2L17 44Z" fill="#BFE5D0" />
      <circle cx="50" cy="28" r="2.2" fill="#B8D9F5" />
    </svg>
  );
}
