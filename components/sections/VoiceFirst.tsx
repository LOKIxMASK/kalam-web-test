"use client";
import { useReduced } from "@/lib/hooks";
import { useProgress } from "@/lib/useProgress";
import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Hand } from "lucide-react";
import { Eyebrow, FadeUp, RevealLines } from "../ui/Reveal";
import { KalamAvatar } from "../mockups/Phone";
import { EASE } from "@/lib/motion";

const QUESTION = "Kalam, why is the sky blue?";
const ANSWER =
  "Sunlight is a mix of all colours. When it passes through the air, tiny gas molecules scatter blue light much more than red. So blue reaches your eyes from every direction of the sky. Scientists call this Rayleigh scattering.";

function ScrollWord({ p, a, b, children, className }: { p: MotionValue<number>; a: number; b: number; children: string; className?: string }) {
  const opacity = useTransform(p, [a, b], [0.12, 1]);
  const y = useTransform(p, [a, b], [6, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${className ?? ""}`}>
      {children}&nbsp;
    </motion.span>
  );
}

function ScrollText({ text, p, start, end, highlight }: { text: string; p: MotionValue<number>; start: number; end: number; highlight?: string }) {
  const words = text.split(" ");
  const step = (end - start) / words.length;
  return (
    <>
      {words.map((w, i) => (
        <ScrollWord key={i} p={p} a={start + i * step} b={start + (i + 1.6) * step} className={highlight && w.includes(highlight) ? "text-gold" : undefined}>
          {w}
        </ScrollWord>
      ))}
    </>
  );
}

const BARS = 72;

function Waveform({ p }: { p: MotionValue<number> }) {
  const reduce = useReduced();
  // amplitude: user speaking, pause, Kalam speaking, settle
  const amp = useTransform(p, [0.05, 0.12, 0.28, 0.34, 0.4, 0.72, 0.8, 1], [0.18, 0.75, 0.75, 0.2, 0.9, 0.9, 0.3, 0.25]);
  const goldOpacity = useTransform(p, [0.3, 0.38], [0, 1]);
  const inkOpacity = useTransform(p, [0.3, 0.38], [1, 0]);
  const bars = (color: string) =>
    Array.from({ length: BARS }).map((_, i) => {
      const env = Math.sin((i / (BARS - 1)) * Math.PI);
      const h = Math.round(10 + env * (50 + ((i * 37) % 23) * 1.6));
      const op = Math.round((0.35 + env * 0.65) * 100) / 100;
      const dur = (0.9 + ((i * 13) % 7) * 0.12).toFixed(2);
      const delay = (-(i * 0.07)).toFixed(2);
      return (
        <span
          key={i}
          className="w-[3px] shrink-0 origin-center rounded-full md:w-[4px]"
          style={{
            height: h,
            backgroundImage: color.startsWith("linear") ? color : undefined,
            backgroundColor: color.startsWith("linear") ? undefined : color,
            opacity: op,
            animation: reduce ? undefined : `wave ${dur}s ease-in-out ${delay}s infinite`,
          }}
        />
      );
    });
  return (
    <motion.div className="relative flex h-[90px] items-center justify-center" style={{ scaleY: amp }} aria-hidden>
      <motion.div className="absolute inset-0 flex items-center justify-center gap-[5px] md:gap-[7px]" style={{ opacity: inkOpacity }}>
        {bars("#F4F1E8")}
      </motion.div>
      <motion.div className="absolute inset-0 flex items-center justify-center gap-[5px] md:gap-[7px]" style={{ opacity: goldOpacity }}>
        {bars("linear-gradient(180deg,#FFE39A,#F5C242 50%,#E8A531)")}
      </motion.div>
    </motion.div>
  );
}

export function VoiceFirst() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const p = useProgress(ref, ["start start", "end end"]);
  const [phase, setPhase] = useState(0);
  useMotionValueEvent(p, "change", (v) => setPhase(v < 0.3 ? 0 : v < 0.76 ? 1 : v < 0.86 ? 2 : 3));

  const qOpacity = useTransform(p, [0.04, 0.1], [0, 1]);
  const aOpacity = useTransform(p, [0.3, 0.37], [0, 1]);
  const aY = useTransform(p, [0.3, 0.4], [40, 0]);
  const pulseX = useTransform(p, [0, 1], ["-10%", "110%"]);

  return (
    <section id="voice" ref={ref} className="relative h-[420vh] md:h-[460vh]" aria-label="Voice first">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* travelling golden pulse, scroll-linked */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[17svh] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden>
          <motion.div className="absolute top-1/2 h-[3px] w-[220px] -translate-y-1/2" style={{ left: pulseX, background: "linear-gradient(90deg, transparent, #F5C242, transparent)", boxShadow: "0 0 24px 4px rgba(245,194,66,0.45)" }} />
        </div>

        <div className="relative mx-auto flex h-full max-w-[1320px] flex-col px-5 pt-[12vh] md:px-8 md:pt-[14vh]">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Voice first</Eyebrow>
              <RevealLines className="display-md mt-5 text-ink" lines={["Ask anything.", "Out loud."]} />
            </div>
            <FadeUp className="lede max-w-[22rem] max-md:text-[0.95rem] md:pb-2" delay={0.2}>
              Natural conversations with Kalam, complete with gestures.
            </FadeUp>
          </div>

          <div className="mt-[4vh] grid flex-1 gap-5 md:mt-[7vh] md:grid-cols-12 md:gap-10">
            {/* student */}
            <motion.div style={{ opacity: qOpacity }} className="md:col-span-5">
              <p className="flex items-center gap-2.5 text-[0.68rem] font-semibold tracking-[0.24em] text-ink-3 uppercase">
                <span className={`h-1.5 w-1.5 rounded-full ${phase === 0 ? "anim-pulse-dot bg-ink" : "bg-ink-3"}`} />
                Aarav &middot; {phase === 0 ? "speaking" : "asked"}
              </p>
              <p className="mt-3 text-[clamp(1.7rem,3.6vw,3.6rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink md:mt-5">
                <span className="text-gold">&ldquo;</span>
                <ScrollText text={QUESTION} p={p} start={0.06} end={0.26} />
                <span className="text-gold">&rdquo;</span>
              </p>
            </motion.div>

            {/* Kalam */}
            <motion.div style={{ opacity: aOpacity, y: aY }} className="md:col-span-6 md:col-start-7 md:pt-10">
              <div className="glass rounded-[26px] p-5 md:p-7">
                <div className="flex items-center gap-3">
                  <KalamAvatar size={38} />
                  <div>
                    <p className="text-[0.95rem] font-bold text-ink">Kalam</p>
                    <p className="flex items-center gap-1.5 text-[0.72rem] text-[#4fd49b]">
                      <span className="anim-pulse-dot h-1.5 w-1.5 rounded-full bg-[#4fd49b]" />
                      {phase >= 2 ? "Listening" : "Speaking"}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-[0.92rem] leading-[1.6] text-ink md:mt-5 md:text-[1.12rem]">
                  <ScrollText text={ANSWER} p={p} start={0.36} end={0.74} highlight="Rayleigh" />
                </p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 md:mt-4" aria-label="Follow-up options">
                {["Explain simpler", "Give an example", "Quiz me"].map((c, i) => (
                  <motion.span
                    key={c}
                    initial={false}
                    animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 16, scale: 0.96 }}
                    transition={{ duration: 0.7, ease: EASE, delay: phase >= 2 ? i * 0.08 : 0 }}
                    className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[0.8rem] font-semibold text-ink md:text-[0.86rem]"
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
              <motion.div
                initial={false}
                animate={phase >= 3 ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 0, x: reduce ? 0 : 30, filter: "blur(6px)" }}
                transition={{ duration: 0.8, ease: EASE }}
                className="mt-3 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-[0.8rem] font-semibold text-gold shadow-[0_0_40px_-10px_rgba(245,194,66,0.6)] md:mt-5"
              >
                <Hand size={15} />
                Kalam is pointing at the sky
                <span className="ml-1 text-[0.66rem] font-semibold tracking-[0.18em] text-gold/60 uppercase">Gesture</span>
              </motion.div>
            </motion.div>
          </div>

          <div className="pb-[9svh]">
            <Waveform p={p} />
            <p className="mt-2 text-center text-[0.68rem] tracking-[0.2em] text-ink-3 uppercase">Tap to speak, or say &ldquo;Hey Kalam&rdquo;</p>
          </div>
        </div>
      </div>
    </section>
  );
}
