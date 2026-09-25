"use client";
import { useReduced } from "@/lib/hooks";
import { useProgress } from "@/lib/useProgress";
import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";

const WORDS = [
  { w: "Learn.", from: 0.0, to: 0.36 },
  { w: "Build.", from: 0.32, to: 0.68 },
  { w: "Inspire.", from: 0.64, to: 1 },
];

function Word({ p, w, from, to, gold, index }: { p: MotionValue<number>; w: string; from: number; to: number; gold?: boolean; index: number }) {
  const reduce = useReduced();
  const span = to - from;
  const a = from;
  const b = from + span * 0.3;
  const c = from + span * 0.7;
  const d = to;
  const opacity = useTransform(p, [a, b, c, d], [0, 1, 1, gold ? 1 : 0]);
  const scale = useTransform(p, [a, b, c, d], reduce ? [1, 1, 1, 1] : [0.82, 1, 1.04, gold ? 1.06 : 1.22]);
  const y = useTransform(p, [a, b, c, d], reduce ? [0, 0, 0, 0] : [120, 0, -10, gold ? -20 : -140]);
  const blur = useTransform(p, [a, b, c, d], reduce ? [0, 0, 0, 0] : [16, 0, 0, gold ? 0 : 12]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  const color = useTransform(p, [b, c], gold ? ["#F4F1E8", "#F5C242"] : ["#F4F1E8", "#F4F1E8"]);
  const shadow = useTransform(p, [b, d], gold ? ["0 0 0px rgba(245,194,66,0)", "0 0 80px rgba(245,194,66,0.35)"] : ["none", "none"]);
  return (
    <motion.span
      aria-hidden={index > 0}
      className="absolute inset-0 flex items-center justify-center font-bold leading-none tracking-[-0.06em] will-change-[transform,opacity,filter]"
      style={{ opacity, scale, y, filter, color, textShadow: shadow, fontSize: "clamp(4.6rem, 19vw, 21rem)" }}
    >
      {w}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const p = useProgress(ref, ["start start", "end end"]);
  const light = useTransform(
    p,
    [0, 0.33, 0.66, 1],
    [
      "radial-gradient(60% 50% at 50% 55%, rgba(52,86,170,0.20), transparent 70%)",
      "radial-gradient(60% 50% at 50% 55%, rgba(43,181,176,0.18), transparent 70%)",
      "radial-gradient(60% 50% at 50% 55%, rgba(245,194,66,0.22), transparent 70%)",
      "radial-gradient(70% 60% at 50% 55%, rgba(245,194,66,0.30), transparent 72%)",
    ]
  );
  const lineScale = useTransform(p, [0, 1], [0, 1]);
  const labelIdx = useTransform(p, (v): string => (v < 0.33 ? "01" : v < 0.66 ? "02" : "03"));

  return (
    <section ref={ref} className="relative h-[300vh] md:h-[360vh]" aria-label="Learn. Build. Inspire.">
      <h2 className="sr-only">Learn. Build. Inspire.</h2>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ background: light }} aria-hidden />
        <div className="relative h-full">
          {WORDS.map((x, i) => (
            <Word key={x.w} p={p} index={i} gold={i === 2} {...x} />
          ))}
        </div>
        {/* chapter rail */}
        <div className="absolute inset-x-5 bottom-10 flex items-center gap-5 md:inset-x-12" aria-hidden>
          <motion.span className="w-7 text-[0.7rem] font-semibold tracking-[0.2em] text-gold tabular-nums">{labelIdx}</motion.span>
          <div className="relative h-px flex-1 bg-white/[0.08]">
            <motion.div className="absolute inset-0 origin-left bg-gradient-to-r from-gold/0 via-gold/70 to-gold" style={{ scaleX: lineScale }} />
          </div>
          <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-ink-3">03</span>
        </div>
      </div>
    </section>
  );
}
