"use client";
import { useReduced } from "@/lib/hooks";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/** Lenis smooth scrolling. Disabled entirely for reduced-motion users. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReduced();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
