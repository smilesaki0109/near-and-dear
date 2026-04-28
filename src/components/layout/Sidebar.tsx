"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CatCardsIcon } from "@/components/icons/CatCardsIcon";
import { CatCloudIcon, CatHeartIcon, CatPawIcon } from "@/components/icons/CatDecorations";
import { CatExploreIcon } from "@/components/icons/CatExploreIcon";
import { CatHomeIcon } from "@/components/icons/CatHomeIcon";
import { CatMapIcon } from "@/components/icons/CatMapIcon";
import { NearDearMascot } from "@/components/icons/NearDearMascot";
import { ui, type Locale } from "@/lib/i18n/ui";

type Props = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

/**
 * Left navigation: brand, primary link, gentle hint that create is coming later.
 */
export function Sidebar({ locale, onLocaleChange }: Props) {
  const t = ui[locale];
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isMap = pathname === "/map";
  const isCreate = pathname.startsWith("/create");
  const navItems = [
    {
      href: "/",
      label: t.navHome,
      icon: <CatHomeIcon className="h-10 w-10" />,
      color: "from-[#fff4f0] to-[#ffe6dd]",
      active: isHome,
    },
    {
      href: "/map",
      label: t.navMap,
      icon: <CatMapIcon className="h-10 w-10" />,
      color: "from-[#eef7ff] to-[#dff0ff]",
      active: isMap,
    },
    {
      href: "/#cards",
      label: locale === "ja" ? "カード" : "Cards",
      icon: <CatCardsIcon className="h-10 w-10" />,
      color: "from-[#f6f0ff] to-[#ebe3f7]",
      active: isCreate,
    },
    {
      href: "/#cards",
      label: locale === "ja" ? "さがす" : "Explore",
      icon: <CatExploreIcon className="h-10 w-10" />,
      color: "from-[#f0fbf5] to-[#ddf4e8]",
      active: false,
    },
  ];

  return (
    <aside
      className="relative hidden w-full shrink-0 overflow-hidden border-b border-[var(--line)] bg-[linear-gradient(180deg,#f6efff_0%,#fff7f0_55%,#effaf4_100%)] px-5 py-6 md:flex md:h-auto md:w-[260px] md:flex-col md:border-b-0 md:border-r md:py-8"
      aria-label="Main navigation"
    >
      <span className="pointer-events-none absolute right-4 top-24 opacity-70" aria-hidden>
        <CatCloudIcon className="h-11 w-14" />
      </span>
      <span className="pointer-events-none absolute bottom-36 left-4 opacity-70" aria-hidden>
        <CatPawIcon className="h-8 w-8" />
      </span>
      <span className="pointer-events-none absolute bottom-52 right-8 opacity-60" aria-hidden>
        <CatHeartIcon className="h-8 w-8" />
      </span>

      <div className="relative mb-8 md:mb-10">
        <div className="flex flex-col items-center text-center">
          <div
            className="near-dear-mascot-glow flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-white/55 shadow-[0_16px_42px_rgba(149,120,198,0.16)] ring-1 ring-white/90"
            aria-hidden
          >
            <NearDearMascot className="h-24 w-24" />
          </div>
          <div>
            <p className="mt-3 text-base font-extrabold tracking-tight text-[var(--text)]">
              {t.brand}
            </p>
            <p className="mt-1 text-xs font-semibold leading-snug text-[var(--text-muted)]">
              {locale === "ja"
                ? "心に寄り添うカード"
                : locale === "tl"
                  ? "Cards na kumakalinga"
                  : "Emotional support cards"}
            </p>
          </div>
        </div>
      </div>

      <nav className="relative flex flex-col gap-3">
        {navItems.map((item) => (
          <SidebarButton
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            color={item.color}
            active={item.active}
          />
        ))}
      </nav>

      <div className="relative mt-6 rounded-[1.35rem] border border-white/70 bg-white/45 p-4 text-center shadow-[var(--shadow-soft)] ring-1 ring-white/75">
        <p className="text-xs font-semibold leading-relaxed text-[var(--primary-deep)]">
          {t.navCreateHint}
        </p>
        <p className="mt-2 flex justify-center gap-1.5" aria-hidden>
          <CatCardsIcon className="h-7 w-7" />
          <CatHeartIcon className="h-7 w-7" />
        </p>
      </div>

      <div className="relative mt-6 space-y-2 border-t border-white/65 pt-6 md:mt-auto">
        <p className="text-center text-xs font-semibold text-[var(--text-muted)]">
          {locale === "ja" ? "言語" : locale === "tl" ? "Wika" : "Language"}
        </p>
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => onLocaleChange("en")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              locale === "en"
                ? "bg-[var(--primary-soft)] text-[var(--text)]"
                : "bg-white/60 text-[var(--text-muted)] hover:bg-white"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => onLocaleChange("ja")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              locale === "ja"
                ? "bg-[var(--primary-soft)] text-[var(--text)]"
                : "bg-white/60 text-[var(--text-muted)] hover:bg-white"
            }`}
          >
            日本語
          </button>
          <button
            type="button"
            onClick={() => onLocaleChange("tl")}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              locale === "tl"
                ? "bg-[var(--primary-soft)] text-[var(--text)]"
                : "bg-white/60 text-[var(--text-muted)] hover:bg-white"
            }`}
          >
            Tagalog
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarButton({
  href,
  icon,
  label,
  color,
  active,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  color: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-[1.35rem] border px-4 py-3 text-sm font-extrabold transition duration-200 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.98] ${
        active
          ? "border-white/90 bg-gradient-to-br from-[var(--primary-soft)] to-white text-[var(--primary-deep)] shadow-[inset_0_2px_8px_rgba(125,98,176,0.12),var(--shadow-soft)]"
          : `border-white/75 bg-gradient-to-br ${color} text-[var(--text)] shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)]`
      }`}
      aria-current={active ? "page" : undefined}
    >
      <span
        className="pointer-events-none absolute right-3 top-2 text-white/70 opacity-0 transition group-hover:opacity-100"
        aria-hidden
      >
        ✦
      </span>
      <span className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm ring-1 ring-white/80 transition duration-200 group-hover:rotate-[-4deg] group-hover:scale-110"
          aria-hidden
        >
          {icon}
        </span>
        <span className="leading-tight">{label}</span>
      </span>
    </Link>
  );
}
