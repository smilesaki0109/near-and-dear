import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Near & Dear — send feelings to family far away",
  description:
    "Warm cards for workers in Japan. Celebrate birthdays, say thank you, share your daily life—and send love to family back home.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${nunito.className} min-h-screen antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
