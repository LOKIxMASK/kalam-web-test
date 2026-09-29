"use client";
import { useReduced } from "@/lib/hooks";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { EASE } from "@/lib/motion";
import { Mic, Moon } from "lucide-react";
import { experienceStages } from "@/lib/content";

const N = experienceStages.length;
const HOLD_MS = 3500; // time on each stage before sliding to the next

function Motif({ k }: { k: string }) {
  if (k === "ask")
    return (
      <div className="relative grid h-56 w-56 place-items-center md:h-72 md:w-72">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-gold/30"
            animate={{ scale: [0.4, 1], opacity: [0.8, 0] }}
            transition={{ duration: 3.2, repeat: Infinity, delay: i * 1.05, ease: "easeOut" }}
          />
        ))}
        <span className="grid h-20 w-20 place-items-center rounded-full bg-gold text-[#1a1406] shadow-[0_0_60px_-6px_rgba(245,194,66,0.8)]">
          <Mic size={28} />
        </span>
      </div>
    );
  if (k === "understand")
    return (
      <svg viewBox="0 0 300 220" className="h-56 w-72 md:h-72 md:w-96" fill="none">
        <circle cx="40" cy="40" r="18" fill="#F5C242" />
        <circle cx="40" cy="40" r="34" fill="rgba(245,194,66,0.12)" />
        <path d="M58 52 L150 110" stroke="#F4F1E8" strokeOpacity="0.8" strokeWidth="2" />
        {[
          [150, 110, 250, 40],
          [150, 110, 280, 120],
          [150, 110, 230, 200],
          [150, 110, 110, 205],
          [150, 110, 90, 150],
        ].map(([a, b, c, d], i) => (
          <motion.path
            key={i}
            d={`M${a} ${b} L${c} ${d}`}
            stroke="#6FA8FF"
            strokeWidth="1.6"
            strokeDasharray="3 5"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ duration: 1.4, delay: 0.1 * i }}
          />
        ))}
        <circle cx="150" cy="110" r="5" fill="#6FA8FF" />
        <text x="150" y="85" fill="#AAB3C5" fontSize="11" textAnchor="middle" letterSpacing="2">RAYLEIGH SCATTERING</text>
      </svg>
    );
  if (k === "practice")
    return (
      <div className="flex items-end gap-3">
        {["3x = 15", "x = 15 ÷ 3", "x = 5"].map((t, i) => (
          <div
            key={t}
            className={`rounded-[14px] border px-4 py-3 text-[0.95rem] font-semibold md:text-[1.1rem] ${i === 2 ? "border-gold/40 bg-gold/10 text-gold" : "border-white/10 bg-white/[0.04] text-ink"}`}
            style={{ marginBottom: i * 36 }}
          >
            <span className="mb-1 block text-[0.62rem] tracking-[0.2em] text-ink-3">STEP {i + 1}</span>
            {t}
          </div>
        ))}
      </div>
    );
  if (k === "plan")
    return (
      <div className="relative pl-8">
        <span className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" />
        {[
          ["9:00 AM", "Mathematics"],
          ["11:00 AM", "Science"],
          ["4:00 PM", "Homework"],
        ].map(([t, s], i) => (
          <div key={t} className="relative mb-6 last:mb-0">
            <span className={`absolute -left-8 top-1.5 h-[15px] w-[15px] rounded-full border-2 ${i === 0 ? "border-gold bg-gold" : "border-gold/60 bg-space-1"}`} />
            <p className="text-[0.75rem] font-semibold tracking-[0.12em] text-gold">{t}</p>
            <p className="text-[1.3rem] font-bold text-ink md:text-[1.6rem]">{s}</p>
          </div>
        ))}
      </div>
    );
  return (
    <div className="relative grid h-56 w-56 place-items-center md:h-72 md:w-72">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(244,241,232,0.08)" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="#F5C242" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="289" strokeDashoffset="90" />
      </svg>
      <div className="text-center">
        <Moon size={18} className="mx-auto text-gold" />
        <p className="mt-1 text-[2.6rem] font-bold tracking-[-0.04em] text-ink md:text-[3.2rem]">18:00</p>
      </div>
    </div>
  );
}

function Panel({ i, p }: { i: number; p: MotionValue<number> }) {
  const reduce = useReduced();
  const s = experienceStages[i];
  // local progress: -1 (arriving) .. 0 (centred) .. 1 (leaving)
  const local = useTransform(p, (v) => v * (N - 1) - i);
  const wordX = useTransform(local, [-1, 1], reduce ? ["0vw", "0vw"] : ["18vw", "-18vw"]);
  const contentY = useTransform(local, [-1, 0, 1], [60, 0, -40]);
  const contentOpacity = useTransform(local, [-0.8, -0.2, 0.3, 0.9], [0, 1, 1, 0]);
  const motifScale = useTransform(local, [-1, 0, 1], [0.8, 1, 0.9]);
  return (
    <div className="relative flex h-full w-screen shrink-0 items-center">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-[4vw] top-[16%] select-none font-bold leading-none tracking-[-0.06em] text-transparent md:top-[10%]"
        style={{ x: wordX, fontSize: "clamp(6rem, 24vw, 26rem)", WebkitTextStroke: "1px rgba(244,241,232,0.13)" }}
      >
        {s.word}
      </motion.span>
      <div className="relative mx-auto grid w-full max-w-[1320px] items-center gap-10 px-5 md:grid-cols-2 md:px-8">
        <motion.div style={{ y: contentY, opacity: contentOpacity }}>
          <p className="text-[0.72rem] font-semibold tracking-[0.3em] text-gold">
            {String(i + 1).padStart(2, "0")} &nbsp;/&nbsp; {s.word.toUpperCase()}
          </p>
          <h3 className="display-md mt-5 max-w-[12ch] text-ink">{s.line}</h3>
          <p className="lede mt-5 max-w-[26rem]">{s.detail}</p>
        </motion.div>
        <motion.div className="flex justify-center md:justify-end md:pr-[6vw]" style={{ opacity: contentOpacity, scale: motifScale }} aria-hidden>
          <Motif k={s.key} />
        </motion.div>
      </div>
    </div>
  );
}

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const inView = useInView(ref, { amount: 0.4 });
  // time-driven progress (0..1) across the stages instead of scroll
  const p = useMotionValue(0);
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % N), HOLD_MS);
    return () => clearTimeout(t);
  }, [step, inView]);
  useEffect(() => {
    const back = step === 0 && p.get() > 0.5; // loop: glide back to the first stage
    const ctl = animate(p, step / (N - 1), { duration: reduce ? 0 : back ? 1.8 : 1.2, ease: EASE });
    return () => ctl.stop();
  }, [step, p, reduce]);

  // gold line runs continuously: fills toward the next dot while each stage is shown
  const line = useMotionValue(0);
  useEffect(() => {
    const here = step / (N - 1);
    const next = Math.min(1, (step + 1) / (N - 1));
    if (!inView || reduce) {
      line.set(here);
      return;
    }
    let ctl: ReturnType<typeof animate> | undefined;
    const run = () => {
      ctl = animate(line, next, { duration: HOLD_MS / 1000, ease: "linear" });
    };
    if (line.get() > here + 0.001) {
      // looping back to the start: sweep the line back first
      ctl = animate(line, here, { duration: 1.8, ease: EASE, onComplete: run });
    } else {
      line.set(Math.max(line.get(), here));
      run();
    }
    return () => ctl?.stop();
  }, [step, inView, reduce, line]);
  const x = useTransform(p, [0, 1], ["0vw", `-${(N - 1) * 100}vw`]);
  const fill = useTransform(line, (v) => Math.max(0.02, v));
  const [idx, setIdx] = useState(0);
  useMotionValueEvent(p, "change", (v) => setIdx(Math.round(v * (N - 1))));

  return (
    <section id="experience" ref={ref} className="relative" aria-label="The KalamSpark experience">
      <div className="relative h-[100svh] min-h-[680px] overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-10 mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-5 pt-[12vh] md:px-8 md:pt-[13vh]">
          <p className="eyebrow">The KalamSpark experience</p>
          <ol className="hidden items-center gap-2 text-[0.78rem] font-semibold md:flex" aria-label="Stages">
            {experienceStages.map((s, i) => (
              <li key={s.key} className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className={`transition-colors duration-500 hover:text-ink ${i === idx ? "text-ink" : i < idx ? "text-gold/70" : "text-ink-3"}`}
                >
                  {s.word}
                </button>
                {i < N - 1 && <span className="text-ink-3/60">&rarr;</span>}
              </li>
            ))}
          </ol>
        </div>

        <motion.div className="flex h-full" style={{ x, width: `${N * 100}vw` }}>
          {experienceStages.map((s, i) => (
            <Panel key={s.key} i={i} p={p} />
          ))}
        </motion.div>

        {/* golden connecting line, fixed to the viewport, filling with progress */}
        <div className="absolute inset-x-5 bottom-[9vh] md:inset-x-8" aria-hidden>
          <div className="relative mx-auto h-px max-w-[1320px] bg-white/[0.08]">
            <motion.div className="absolute inset-0 origin-left bg-gradient-to-r from-gold/30 via-gold to-gold" style={{ scaleX: fill }} />
            <div className="absolute inset-0 overflow-hidden">
              <span className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent 0%, #FFE7A8 8%, transparent 16%)", animation: "travel 4.2s linear infinite" }} />
            </div>
            {experienceStages.map((s, i) => (
              <span
                key={s.key}
                className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-500 ${
                  i <= idx ? "border-gold bg-gold shadow-[0_0_14px_2px_rgba(245,194,66,0.6)]" : "border-white/25 bg-space-0"
                }`}
                style={{ left: `${(i / (N - 1)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
