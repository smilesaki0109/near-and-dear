import type { SVGProps } from "react";

export function CatMapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden {...props}>
      <path
        d="M9 48 21 23l11 20 8-13 15 18H9Z"
        fill="#EAF4FF"
        stroke="#CFC3CF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
      <path d="M21 23 26 33l-6-2M40 30l4 5" stroke="#B8D9F5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      <path
        d="M33 35c0-7.5 5.2-12.6 11.6-12.6S56 27.5 56 35c0 5.7-3.8 10.2-9.1 12l-2.3 5.5-2.4-5.5C36.8 45.2 33 40.7 33 35Z"
        fill="#FFFCF7"
        stroke="#CFC3CF"
        strokeWidth="2.1"
      />
      <path
        d="m37 29.5 2.4-5 4.9 4.8 4.8-4.8 2.5 5"
        stroke="#CFC3CF"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.9"
      />
      <circle cx="41" cy="35" r="2.3" fill="#50505C" />
      <circle cx="48.4" cy="35" r="2.3" fill="#50505C" />
      <circle cx="40.3" cy="34.3" r="0.8" fill="white" />
      <circle cx="47.7" cy="34.3" r="0.8" fill="white" />
      <circle cx="38.5" cy="39" r="1.8" fill="#F7D7DC" opacity="0.75" />
      <circle cx="50.8" cy="39" r="1.8" fill="#F7D7DC" opacity="0.75" />
      <path d="M44.6 38v1.4M41.8 41.5c1.8 1.4 3.8 1.4 5.6 0" stroke="#57505B" strokeLinecap="round" strokeWidth="1.4" />
      <path d="M12 53c8 2.4 29 2.7 41 0" stroke="#BFE5D0" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}
