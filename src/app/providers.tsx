"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import type { ReactNode } from "react";

/** Wraps client-side providers used across the app (language toggle, future auth, etc.). */
export function Providers({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
