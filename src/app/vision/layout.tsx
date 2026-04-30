import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Vision — Near & Dear",
  description:
    "Connections begin from the places we love. That small starting point helps ease loneliness, deepen understanding and appreciation for Japan, and grow into relationships where people work and live together.",
};

export default function VisionLayout({ children }: { children: ReactNode }) {
  return children;
}
