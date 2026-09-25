"use client";
import { useReduced } from "@/lib/hooks";
import { useProgress } from "@/lib/useProgress";
import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { Camera, Volume2 } from "lucide-react";
import { Eyebrow, FadeUp, RevealLines } from "../ui/Reveal";

const STEPS = [
  { n: 1, title: "Move 5 to the other side", math: <>3x = 20 &minus; 5 <span className="mx-2 text-ink-3">&rarr;</span> 3x = 15</>, at: 0.3 },
  { n: 2, title: "Divide both sides by 3", math: <>x = 15 &divide; 3</>, at: 0.5 },
  { n: 3, title: "Answer", math: <>x = 5</>, at: 0.7, answer: true },
];

function Step({ p, s }: { p: MotionValue<number>; s: (typeof STEPS)[number] }) {
  const reduce = useReduced();
  const opacity = useTransform(p, [s.at - 0.08, s.at], [0.12, 1]);
  const x = useTransform(p, [s.at - 0.08, s.at], [reduce ? 0 : 40, 0]);
  const blur = useTransform(p, [s.at - 0.08, s.at], [reduce ? 0 : 8, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const dotBg = useTransform(p, [s.at - 0.02, s.at], ["rgba(20,28,48,1)", "rgba(245,194,66,1)"]);
  const dotColor = useTransform(p, [s.at - 0.02, s.at], ["#6b7489", "#1a1406"]);
  const glow = useTransform(p, [s.at - 0.02, s.at + 0.04], ["0 0 0 0 rgba(245,194,66,0)", "0 0 30px 2px rgba(245,194,66,0.45)"]);
  return (
    <div className="relative grid grid-cols-[44px_1fr] gap-4 md:grid-cols-[56px_1fr] md:gap-6">
      <motion.span
        className="relative z-10 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-[0.9rem] font-bold md:h-11 md:w-11 md:text-[1rem]"
        style={{ background: dotBg, color: dotColor, boxShadow: glow }}
      >
        {s.n}
      </motion.span>
      <motion.div style={{ opacity, x, filter }}>
        <p className="text-[0.9rem] font-semibold text-ink md:text-[1.1rem]">{s.title}</p>
        <div
          className={`mt-2 w-fit rounded-[14px] border px-4 py-2.5 font-semibold md:rounded-[16px] tracking-[-0.01em] md:mt-3 md:px-6 md:py-4 ${
            s.answer
              ? "border-gold/40 bg-gold/[0.08] text-[clamp(1.9rem,4.6vw,4.4rem)] leading-none text-gold shadow-[0_0_60px_-10px_rgba(245,194,66,0.5)]"
              : "border-white/10 bg-white/[0.04] text-[1.05rem] text-ink md:text-[1.5rem]"
          }`}
        >
          {s.math}
        </div>
      </motion.div>
    </div>
  );
}

function Notebook({ p }: { p: MotionValue<number> }) {
  const reduce = useReduced();
  const rot = useTransform(p, [0, 0.2], reduce ? [-4, -4] : [-14, -4]);
  const rx = useTransform(p, [0, 0.2], reduce ? [0, 0] : [30, 12]);
  const y = useTransform(p, [0, 0.2], reduce ? [0, 0] : [80, 0]);
  const scanY = useTransform(p, [0.05, 0.22], ["0%", "100%"]);
  const scanOpacity = useTransform(p, [0.04, 0.07, 0.2, 0.24], [0, 1, 1, 0]);
  const tagOpacity = useTransform(p, [0.2, 0.26], [0, 1]);
  const boxOpacity = useTransform(p, [0.14, 0.22], [0, 1]);
  return (
    <div className="relative" style={{ perspective: 1200 }}>
      <motion.div style={{ rotate: rot, rotateX: rx, y }} className="relative mx-auto w-full max-w-[520px]">
        <div
          className="relative aspect-[1.45] overflow-hidden rounded-[10px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.9)]"
          style={{
            background:
              "linear-gradient(90deg, transparent 58px, rgba(220,90,90,0.35) 58px, rgba(220,90,90,0.35) 60px, transparent 60px), repeating-linear-gradient(180deg, #f6efdf 0 33px, rgba(80,120,190,0.25) 33px 34px), #f6efdf",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,rgba(255,255,255,0.35),transparent_60%)]" />
          <div className="absolute left-[80px] top-[18%] font-hand text-[clamp(1.2rem,2vw,1.8rem)] leading-[34px] text-[#23315a]">
            <p>Q4. Solve for x</p>
            <p className="relative mt-[34px] inline-block text-[clamp(1.8rem,3vw,2.7rem)]">
              3x + 5 = 20
              <motion.span className="absolute -inset-x-3 -inset-y-1 rounded-[6px] border-2 border-[#F5C242]" style={{ opacity: boxOpacity }} />
            </p>
            <p className="mt-2 text-[#23315a]/50">x = ?</p>
          </div>
          {/* scan line */}
          <motion.div className="absolute inset-x-0 top-0 h-full" style={{ opacity: scanOpacity }}>
            <motion.div className="absolute inset-x-0 h-[3px]" style={{ top: scanY, background: "linear-gradient(90deg, transparent, #F5C242, transparent)", boxShadow: "0 0 30px 8px rgba(245,194,66,0.45)" }} />
          </motion.div>
        </div>
        {/* viewfinder corners */}
        {["left-[-14px] top-[-14px] border-l-2 border-t-2", "right-[-14px] top-[-14px] border-r-2 border-t-2", "left-[-14px] bottom-[-14px] border-l-2 border-b-2", "right-[-14px] bottom-[-14px] border-r-2 border-b-2"].map((c) => (
          <span key={c} className={`absolute h-7 w-7 rounded-[4px] border-gold/80 ${c}`} />
        ))}
      </motion.div>
      <motion.div style={{ opacity: tagOpacity }} className="glass mx-auto mt-8 flex w-fit items-center gap-3 rounded-full px-4 py-2 text-[0.72rem] max-md:hidden md:mt-10">
        <Camera size={14} className="text-gold" />
        <span className="font-bold tracking-[0.16em] text-gold uppercase">Scanned problem &middot; Mathematics</span>
        <span className="text-ink-3 max-md:hidden">From your notebook &middot; just now</span>
      </motion.div>
    </div>
  );
}

export function Homework() {
  const ref = useRef<HTMLElement>(null);
  const p = useProgress(ref, ["start start", "end end"]);
  const line = useTransform(p, [0.26, 0.7], [0, 1]);
  const eqOpacity = useTransform(p, [0.2, 0.28], [0, 1]);
  const actions = useTransform(p, [0.76, 0.84], [0, 1]);

  return (
    <section ref={ref} className="relative h-[380vh] md:h-[420vh]" aria-label="Homework helper">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="pointer-events-none absolute left-[-10vw] top-[20vh] h-[70vh] w-[60vw]" style={{ background: "radial-gradient(closest-side, rgba(245,194,66,0.08), transparent)" }} aria-hidden />
        <div className="mx-auto grid h-full max-w-[1320px] content-center gap-6 px-5 md:grid-cols-12 md:gap-8 md:px-8">
          <div className="md:col-span-5">
            <Eyebrow>Homework helper</Eyebrow>
            <RevealLines className="display-md mt-5 text-ink" lines={["Homework,", "step by step."]} />
            <FadeUp className="lede mt-4 max-w-[26rem] max-md:hidden md:mt-6" delay={0.15}>
              Scan a problem from your notebook and follow every step.
            </FadeUp>
            <div className="mt-5 max-md:mx-auto max-md:w-[58%] md:mt-14" aria-hidden>
              <Notebook p={p} />
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7 md:pt-6">
            <motion.p style={{ opacity: eqOpacity }} className="text-[0.7rem] font-semibold tracking-[0.24em] text-ink-3 uppercase max-md:hidden">
              Solve for x
            </motion.p>
            <motion.p style={{ opacity: eqOpacity }} className="mb-8 mt-2 text-[clamp(2rem,4vw,3.8rem)] font-bold tracking-[-0.04em] text-ink max-md:hidden">
              3x + 5 = 20
            </motion.p>
            <div className="relative space-y-4 md:space-y-9">
              <div className="absolute bottom-10 left-[18px] top-5 w-px bg-white/10 md:left-[22px]" aria-hidden>
                <motion.div className="absolute inset-0 origin-top bg-gradient-to-b from-gold via-gold to-gold/40 shadow-[0_0_12px_rgba(245,194,66,0.7)]" style={{ scaleY: line }} />
              </div>
              {STEPS.map((s) => (
                <Step key={s.n} p={p} s={s} />
              ))}
            </div>
            <motion.div style={{ opacity: actions }} className="mt-7 hidden flex-wrap gap-2.5 pl-[60px] md:mt-10 md:flex md:pl-[80px]" aria-hidden>
              <span className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-[0.8rem] font-semibold text-gold"><Volume2 size={14} /> Hear Kalam explain</span>
              <span className="rounded-full border border-white/10 px-4 py-2 text-[0.8rem] font-semibold text-ink-2">Practice similar</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
