"use client";
import { useEffect, useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "framer-motion";

export const FRAME_COUNT = 150;
export const FRAME_W = 760;
export const FRAME_H = 783;
const src = (i: number) => `/sequence/f${String(i + 1).padStart(3, "0")}.webp`;

/**
 * Scroll-scrubbed image sequence drawn to a canvas.
 * Frames load progressively (coarse -> fine) so scrubbing works immediately
 * and sharpens as the rest arrive; the nearest loaded frame is always drawn.
 */
export function FrameSequence({ progress, className = "" }: { progress: MotionValue<number>; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frames = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
  const current = useRef(-1);
  const raf = useRef(0);

  const nearestLoaded = (i: number) => {
    const f = frames.current;
    for (let d = 0; d < FRAME_COUNT; d++) {
      if (f[i - d]) return f[i - d];
      if (f[i + d]) return f[i + d];
    }
    return null;
  };

  const draw = () => {
    raf.current = 0;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const img = nearestLoaded(Math.max(0, current.current));
    if (!img) return;
    const { width: W, height: H } = c;
    // contain, anchored to the bottom so the figure stands on the "floor"
    const s = Math.min(W / FRAME_W, H / FRAME_H);
    const w = FRAME_W * s;
    const h = FRAME_H * s;
    ctx.clearRect(0, 0, W, H);
    ctx.drawImage(img, (W - w) / 2, H - h, w, h);
  };

  const schedule = () => {
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  };

  const setFrame = (p: number) => {
    const i = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(p * (FRAME_COUNT - 1))));
    if (i !== current.current) {
      current.current = i;
      schedule();
    }
  };

  useMotionValueEvent(progress, "change", setFrame);

  // size the backing store to the element
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(c.clientWidth * dpr);
      c.height = Math.round(c.clientHeight * dpr);
      schedule();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    return () => {
      ro.disconnect();
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // progressive loading: every 16th, 8th, 4th, 2nd, then the rest
  useEffect(() => {
    let cancelled = false;
    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < FRAME_COUNT; i += step) {
        if (!seen.has(i)) {
          seen.add(i);
          order.push(i);
        }
      }
    }
    let next = 0;
    const load = () => {
      if (cancelled || next >= order.length) return;
      const i = order[next++];
      const img = new Image();
      img.decoding = "async";
      img.src = src(i);
      const done = () => {
        if (cancelled) return;
        frames.current[i] = img;
        if (current.current < 0) setFrame(progress.get());
        else schedule();
        load();
      };
      img.onload = () => {
        (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(done);
      };
      img.onerror = () => load();
    };
    // a few parallel lanes
    for (let k = 0; k < 6; k++) load();
    return () => {
      cancelled = true;
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden />;
}
