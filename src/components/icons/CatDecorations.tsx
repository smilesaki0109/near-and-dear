import type { SVGProps } from "react";

export function CatPawIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <circle cx="15" cy="17" r="4" fill="#F2BEB4" />
      <circle cx="24" cy="13" r="4.5" fill="#F2BEB4" />
      <circle cx="33" cy="17" r="4" fill="#F2BEB4" />
      <path
        d="M14 31c0-6 4.5-10 10-10s10 4 10 10c0 4.5-4 7-10 7s-10-2.5-10-7Z"
        fill="#FFF6EE"
        stroke="#7D62B0"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CatHeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <path
        d="M24 38S10 29.5 10 18.8C10 13 16.5 10.5 24 17c7.5-6.5 14-4 14 1.8C38 29.5 24 38 24 38Z"
        fill="#F2BEB4"
        stroke="#7D62B0"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path d="M19 20.5c1.2 1.2 2.5 1.2 3.7 0M26 20.5c1.2 1.2 2.5 1.2 3.7 0" stroke="#7D62B0" strokeLinecap="round" strokeWidth="1.6" />
    </svg>
  );
}

export function CatFlowerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden {...props}>
      <circle cx="24" cy="24" r="4.5" fill="#FFF6EE" stroke="#7D62B0" strokeWidth="1.8" />
      <circle cx="24" cy="13" r="6" fill="#F2BEB4" />
      <circle cx="35" cy="24" r="6" fill="#F2BEB4" />
      <circle cx="24" cy="35" r="6" fill="#F2BEB4" />
      <circle cx="13" cy="24" r="6" fill="#F2BEB4" />
      <path d="M18 39c-1 4-4 5-7 5" stroke="#BFE5D0" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export function CatCloudIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 48" fill="none" aria-hidden {...props}>
      <path
        d="M15 35h34c5.5 0 9-3.6 9-8.2 0-4.2-3.2-7.6-7.5-7.9C48.8 12.2 43.2 8 36.5 8c-6.1 0-11 3.7-13 9-1.2-.5-2.5-.8-4-.8-5.5 0-10 4.3-10 9.6C9.5 31 11.8 35 15 35Z"
        fill="#FFFFFF"
        stroke="#B8D9F5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
      <path d="m26 18 3-4 3 4 3-4 3 4" stroke="#7D62B0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      <circle cx="30" cy="24" r="1.1" fill="#362F3D" />
      <circle cx="38" cy="24" r="1.1" fill="#362F3D" />
    </svg>
  );
}
