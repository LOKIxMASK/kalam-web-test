"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useProgress } from "@/lib/useProgress";
import { useIsMobile, useReduced } from "@/lib/hooks";
import { EASE } from "@/lib/motion";
import { RevealLines } from "../ui/Reveal";
import { FrameSequence } from "../FrameSequence";

/**
 * Scroll chapters, timed to the frame sequence:
 *   frames   1-50  KalamSpark standing        -> intro
 *   frames  55-100 jacket opens          -> 01
 *   frames 105-145 sparks, face lifts    -> 02
 *   frames 150-220 eyes, servos, boards  -> 03 (+ callouts)
 *   frames 225-260 reassembles           -> 04
 *   frames 265-300 KalamSpark again           -> 05
 */
const CHAPTERS = [
  {
    n: "01",
    tag: "Look closer",
    title: ["A companion,", "not a gadget."],
    body: "Behind the familiar face is a humanoid robot by Acubotz, built to sit beside you and study every day.",
    range: [0.17, 0.33] as const,
    side: "left" as const,
  },
  {
    n: "02",
    tag: "Voice first",
    title: ["Ask anything.", "Out loud."],
    body: "Say “Hey KalamSpark” and talk naturally. Every answer comes with an explanation, not just a result.",
    range: [0.35, 0.49] as const,
    side: "right" as const,
  },
  {
    n: "03",
    tag: "Gestures & expression",
    title: ["Eyes that react.", "Hands that point."],
    body: "KalamSpark looks at you, reacts and gestures while he explains. Natural conversations, complete with gestures.",
    range: [0.51, 0.71] as const,
    side: "left" as const,
  },
  {
    n: "04",
    tag: "Always ready",
    title: ["Plans your day.", "Remembers what matters."],
    body: "Homework help step by step, reminders on time, and a soft voice for focus after dark.",
    range: [0.73, 0.86] as const,
    side: "right" as const,
  },
  {
    n: "05",
    tag: "Everywhere you study",
    title: ["The robot at your desk.", "KalamSpark in your pocket."],
    body: "The same KalamSpark, the same voice and your progress, on the robot and the KalamSpark app for Android.",
    range: [0.88, 1.0] as const,
    side: "left" as const,
  },
];

// callouts over the exposed internals (positions as % of the frame box)
const CALLOUTS = [
  { label: "Expressive eyes", x: 31, y: 43, dx: -1 },
  { label: "Gesture servos", x: 73, y: 50, dx: 1 },
  { label: "Controller board", x: 82, y: 25, dx: 1 },
];

function Chapter({ p, c }: { p: MotionValue<number>; c: (typeof CHAPTERS)[number] }) {
  const [a, b] = c.range;
  const inA = a + 0.035;
  const outB = b - 0.035;
  const last = b >= 1;
  const opacity = useTransform(p, [a, inA, outB, b], [0, 1, 1, last ? 1 : 0]);
  const y = useTransform(p, [a, inA, outB, b], [60, 0, 0, last ? 0 : -60]);
  // second title line trails the block slightly for a staggered feel
  const l2 = useTransform(p, [a, inA + 0.02], [40, 0]);
  const rule = useTransform(p, [a, inA + 0.03], [0, 1]);
  return (
    <motion.div
      style={{ opacity, y }}
      className={`layer pointer-events-none absolute inset-x-5 bottom-[7svh] md:inset-x-auto md:bottom-auto md:top-1/2 md:w-[min(34vw,480px)] md:-translate-y-1/2 ${
        c.side === "left" ? "md:left-[6vw]" : "md:right-[6vw]"
      }`}
    >
      <div className="flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] uppercase">
        <span className="text-gold tabular-nums">{c.n}</span>
        <motion.span className="h-px w-10 origin-left bg-gold/60" style={{ scaleX: rule }} />
        <span className="text-ink-2">{c.tag}</span>
      </div>
      <h2 className="mt-4 text-[clamp(1.9rem,3.6vw,3.9rem)] font-bold leading-[1.02] tracking-[-0.04em] text-ink md:mt-6">
        <span className="block">{c.title[0]}</span>
        <motion.span className="block text-gold-gradient" style={{ y: l2 }}>
          {c.title[1]}
        </motion.span>
      </h2>
      <p className="mt-3 max-w-[26rem] text-[0.95rem] leading-relaxed text-ink-2 md:mt-5 md:text-[1.05rem]">{c.body}</p>
    </motion.div>
  );
}

function Callouts({ p }: { p: MotionValue<number> }) {
  const opacity = useTransform(p, [0.54, 0.58, 0.67, 0.7], [0, 1, 1, 0]);
  const draw = useTransform(p, [0.54, 0.6], [0, 1]);
  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 max-md:hidden" aria-hidden>
      {CALLOUTS.map((c) => (
        <div key={c.label} className="absolute" style={{ left: `${c.x}%`, top: `${c.y}%` }}>
          <span className="absolute -left-[5px] -top-[5px] h-[10px] w-[10px] rounded-full border border-gold bg-gold/30 shadow-[0_0_14px_2px_rgba(245,194,66,0.6)]" />
          <motion.span
            className={`absolute top-0 h-px w-[90px] bg-gradient-to-r ${c.dx > 0 ? "left-[6px] origin-left from-gold to-gold/20" : "right-[6px] origin-right from-gold/20 to-gold"}`}
            style={{ scaleX: draw }}
          />
          <span
            className={`glass absolute -top-[15px] whitespace-nowrap rounded-full px-3 py-1 text-[0.72rem] font-semibold tracking-[0.06em] text-ink ${
              c.dx > 0 ? "left-[100px]" : "right-[100px]"
            }`}
          >
            {c.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const mobile = useIsMobile();
  const p = useProgress(ref, ["start start", "end end"]);
  const seq = useTransform(p, [0.02, 0.98], [0, 1]);

  // intro exits as the sequence begins
  const introOpacity = useTransform(p, [0, 0.1], [1, 0]);
  const introY = useTransform(p, [0, 0.12], [0, -80]);
  const introScale = useTransform(p, [0, 0.12], [1, 0.94]);
  const cueOpacity = useTransform(p, [0, 0.03], [1, 0]);

  // robot stage: gentle push-in, pointer parallax, glow that shifts with the story
  const stageScale = useTransform(p, [0, 0.5, 1], [mobile ? 0.92 : 0.95, 1.04, 1]);
  const glowOpacity = useTransform(p, [0, 0.35, 0.55, 0.75, 1], [0.7, 0.9, 1, 0.8, 0.9]);
  // warm and cool glows crossfade (opacity only, no per-frame repaint)
  const coolOpacity = useTransform(p, [0, 0.3, 0.42, 0.62, 0.8, 1], [0, 0, 1, 0.9, 0.1, 0]);
  // the robot glides to the side opposite the active text
  const stageX = useTransform(
    p,
    [0, 0.3, 0.36, 0.48, 0.53, 0.7, 0.75, 0.85, 0.9, 1],
    mobile ? ["0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw", "0vw"] : ["15vw", "13vw", "-13vw", "-13vw", "15vw", "15vw", "-13vw", "-13vw", "13vw", "13vw"]
  );
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 40, damping: 18 });
  const py = useSpring(my, { stiffness: 40, damping: 18 });
  useEffect(() => {
    if (reduce || mobile) return;
    const on = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth - 0.5) * 18);
      my.set((e.clientY / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, [mx, my, reduce, mobile]);

  const [chapter, setChapter] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const i = CHAPTERS.findIndex((c) => v >= c.range[0] && v < c.range[1]);
    setChapter(i < 0 ? (v >= 0.999 ? CHAPTERS.length : 0) : i + 1);
  });
  const rail = useTransform(p, [0, 1], [0, 1]);

  return (
    <section id="top" ref={ref} className="relative h-[520vh] md:h-[640vh]" aria-label="Meet KalamSpark">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* robot stage */}
        <motion.div
          className="absolute inset-x-0 bottom-[30svh] top-[10svh] md:bottom-[2svh] md:left-[18vw] md:right-[18vw] md:top-[9svh]"
          initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 2.4, ease: EASE, delay: 1.4 }}
        >
          <motion.div className="layer relative h-full w-full" style={{ x: stageX }}>
          <motion.div className="relative h-full w-full" style={{ scale: stageScale, x: px, y: py, transformOrigin: "50% 100%" }}>
            <motion.div aria-hidden className="absolute left-1/2 top-[8%] aspect-square h-[88%] -translate-x-1/2" style={{ opacity: glowOpacity }}>
              <div className="absolute inset-0" style={{ background: "radial-gradient(closest-side, rgba(245,194,66,0.28), rgba(232,165,49,0.08) 50%, transparent 72%)" }} />
              <motion.div className="absolute inset-0" style={{ opacity: coolOpacity, background: "radial-gradient(closest-side, rgba(111,214,232,0.24), rgba(43,120,180,0.08) 50%, transparent 72%)" }} />
            </motion.div>
            {/* floor light */}
            <div
              aria-hidden
              className="absolute bottom-[3%] left-1/2 h-[7%] w-[46%] -translate-x-1/2 rounded-[50%]"
              style={{ background: "radial-gradient(closest-side, rgba(245,194,66,0.28), rgba(245,194,66,0.06) 60%, transparent)" }}
            />
            <div className="relative mx-auto h-full max-w-full" style={{ aspectRatio: "760 / 783" }}>
              <FrameSequence progress={seq} />
              <Callouts p={p} />
            </div>
          </motion.div>
          </motion.div>
        </motion.div>

        {/* legibility wash behind text on small screens */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[45svh] bg-gradient-to-t from-[#050812] via-[#050812]/80 to-transparent md:hidden" />

        {/* intro: the page-load headline (no buttons in the hero) */}
        <motion.div
          style={reduce ? { opacity: introOpacity } : { opacity: introOpacity, y: introY, scale: introScale }}
          className="layer pointer-events-none absolute inset-x-5 bottom-[6svh] origin-left md:inset-x-auto md:bottom-auto md:left-[6vw] md:top-1/2 md:w-[min(46vw,720px)] md:-translate-y-1/2"
        >
          <motion.p
            className="eyebrow mb-5 md:mb-7"
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.3, ease: EASE, delay: 1.5 }}
          >
            World&rsquo;s first smallest animatronic study companion
          </motion.p>
          <RevealLines
            as="h1"
            immediate
            delay={1.85}
            stagger={0.17}
            className="text-[clamp(2.6rem,5.6vw,7.4rem)] font-bold leading-[0.96] tracking-[-0.045em] text-ink"
            lines={[<>Meet <span className="text-gold-gradient">KalamSpark</span>,</>, "the study", "companion."]}
          />
          <motion.p
            className="mt-5 text-[clamp(1.05rem,1.5vw,1.5rem)] font-semibold tracking-[-0.01em] text-gold md:mt-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE, delay: 2.6 }}
          >
            Igniting curiosity, inspiring innovation.
          </motion.p>
          <motion.p
            className="lede mt-5 max-w-[30rem] max-md:text-[0.95rem] md:mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: EASE, delay: 2.9 }}
          >
            Curiosity has a new companion.
          </motion.p>
          <motion.p
            className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/[0.07] px-4 py-2 text-[0.72rem] font-semibold tracking-[0.18em] text-ink-2 uppercase backdrop-blur-md md:mt-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: EASE, delay: 3.2 }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_10px_rgba(245,194,66,0.9)]" aria-hidden />
            Powered by <span className="font-bold text-ink">Acubotz<span className="text-gold">OS</span></span>
          </motion.p>
        </motion.div>

        {/* feature chapters, driven by scroll */}
        {CHAPTERS.map((c) => (
          <Chapter key={c.n} p={p} c={c} />
        ))}

        {/* chapter rail */}
        <div className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-3 md:right-8 lg:flex" aria-hidden>
          {CHAPTERS.map((c, i) => (
            <span
              key={c.n}
              className={`flex items-center gap-3 text-[0.66rem] font-semibold tracking-[0.2em] tabular-nums transition-colors duration-500 ${chapter === i + 1 ? "text-gold" : "text-ink-3/60"}`}
            >
              <span className={`h-px transition-all duration-500 ${chapter === i + 1 ? "w-8 bg-gold" : "w-3 bg-white/20"}`} />
              {c.n}
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-white/5 md:inset-x-8" aria-hidden>
          <motion.div className="h-full origin-left bg-gold/60" style={{ scaleX: rail }} />
        </div>

        {/* scroll cue */}
        <motion.div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex" style={{ opacity: cueOpacity }} aria-hidden>
          <motion.span
            className="text-[0.62rem] font-semibold tracking-[0.4em] text-ink-3 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.6, duration: 1.2 }}
          >
            Scroll
          </motion.span>
          <motion.span
            className="relative block h-12 w-px overflow-hidden bg-white/10"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 3.7, duration: 1.2, ease: EASE }}
          >
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-gold" style={{ animation: "scroll-cue 2.2s cubic-bezier(0.65,0,0.35,1) infinite" }} />
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}
