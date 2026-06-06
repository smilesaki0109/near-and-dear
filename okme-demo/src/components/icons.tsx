type IconProps = { className?: string };

const base = "currentColor";

export function CameraIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1l1-1.5h7L17.5 6h0A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-8Z"
        stroke={base}
        strokeWidth="1.7"
      />
      <circle cx="12" cy="12.5" r="3.3" stroke={base} strokeWidth="1.7" />
    </svg>
  );
}

export function PinIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z"
        stroke={base}
        strokeWidth="1.7"
      />
      <circle cx="12" cy="10" r="2.6" stroke={base} strokeWidth="1.7" />
    </svg>
  );
}

export function PulseIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 12h4l2-5 3 10 2.5-7 1.5 2H21"
        stroke={base}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="3" stroke={base} strokeWidth="1.7" />
      <path d="M4 9h16M8 3v4M16 3v4" stroke={base} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function ChatIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke={base}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StepsIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 5.5c1.6 0 2.6 1.3 2.6 3.4 0 1.7-.5 3-.5 4.4 0 1.3-.8 2-2.1 2-1.4 0-2.2-.8-2.2-2.2 0-1.2.2-2 .2-3.4C6 7.2 6.6 5.5 8 5.5Z"
        stroke={base}
        strokeWidth="1.6"
      />
      <path
        d="M16.5 9c1.3 0 2 1 2 2.7 0 1.4-.4 2.4-.4 3.6 0 1-.7 1.7-1.8 1.7-1.1 0-1.8-.7-1.8-1.8 0-1 .2-1.7.2-2.8 0-1.9.5-3.4 1.6-3.4Z"
        stroke={base}
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function WeatherIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke={base} strokeWidth="1.7" />
      <path
        d="M12 3v2M12 19v2M3 12h2M19 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M18.5 5.5l-1.4 1.4M6.9 17.1l-1.4 1.4"
        stroke={base}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SparkleIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15.5l-1.8-4.7L5.5 9l4.7-1.3L12 3Z"
        fill={base}
      />
      <path d="M18.5 14l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3Z" fill={base} />
    </svg>
  );
}

export function MicIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="9" y="3" width="6" height="11" rx="3" stroke={base} strokeWidth="1.7" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke={base} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function SendIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 12 20 4l-3.5 16-4.2-6.1L4 12Z"
        stroke={base}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRightIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke={base} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
