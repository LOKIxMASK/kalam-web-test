"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders children at a fixed design size and scales them to fit the parent box.
 * Keeps intricate device mockups pixel-consistent across breakpoints.
 */
export function Fit({
  w,
  h,
  children,
  className = "",
  max = 1.25,
}: {
  w: number;
  h: number;
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      // layout size, unaffected by ancestor transforms (rotate/scale)
      const cw = el.clientWidth;
      const ch = el.clientHeight;
      if (!cw || !ch) return;
      setS(Math.min(max, cw / w, ch / h));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w, h, max]);
  return (
    <div ref={ref} className={`relative h-full w-full ${className}`}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: w,
          height: h,
          transform: `translate(-50%, -50%) scale(${s || 1})`,
          opacity: s ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
