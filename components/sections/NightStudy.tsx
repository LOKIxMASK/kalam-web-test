"use client";
import { useProgress } from "@/lib/useProgress";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { Bell, Moon, Zap } from "lucide-react";
import { Eyebrow, FadeUp, RevealLines } from "../ui/Reveal";
import { useAtmosphere } from "../Atmosphere";
import { EASE } from "@/lib/motion";
import { useReduced } from "@/lib/hooks";

const FEATURES = [
  { icon: Moon, title: "Late-night support", body: "KalamSpark stays awake with you", at: 0.1, pos: "md:left-0 md:top-[28%]" },
  { icon: Zap, title: "Focus mode", body: "Only study questions until the timer ends", at: 0.3, pos: "md:right-0 md:top-[22%]" },
  { icon: Bell, title: "Do not disturb", body: "Silence reminders and app alerts", at: 0.5, pos: "md:right-[4%] md:bottom-[14%]" },
];

const SESSION_S = 15; // demo focus session length in seconds
const HOLD_MS = 1600; // pause at 00:00 before the next session starts
const INTRO_S = 1.2; // the ring grows into place when the section appears

function Toggle({ on }: { on: boolean }) {
  return (
    <span className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-500 ${on ? "bg-gold" : "bg-white/12"}`}>
      <motion.span
        className={`absolute h-[18px] w-[18px] rounded-full ${on ? "bg-[#141a2a]" : "bg-ink-3"}`}
        animate={{ x: on ? 23 : 3 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      />
    </span>
  );
}

export function NightStudy() {
  const ref = useRef<HTMLElement>(null);
  const { dim } = useAtmosphere();
  const reduce = useReduced();
  const inView = useInView(ref, { amount: 0.4 });

  // intro timeline (0..1): plays once when the section first comes into view
  const p = useMotionValue(0);
  useEffect(() => {
    if (!inView || p.get() >= 1) return;
    const ctl = animate(p, 1, { duration: reduce ? 0 : INTRO_S * (1 - p.get()), ease: "linear" });
    return () => ctl.stop();
  }, [inView, reduce, p]);

  // 15-second focus session: one continuous linear run (0..1), holds at 00:00, then repeats
  const run = useMotionValue(0);
  const [left, setLeft] = useState(SESSION_S);
  const [elapsed, setElapsed] = useState(0);
  useMotionValueEvent(run, "change", (v) => {
    setLeft(Math.ceil(SESSION_S * (1 - v) - 1e-6));
    setElapsed(Math.floor(v * 100) / 100);
  });
  useEffect(() => {
    if (!inView) return;
    let ctl: ReturnType<typeof animate> | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      ctl = animate(run, 1, {
        duration: SESSION_S * (1 - run.get()),
        ease: "linear",
        onComplete: () => {
          timer = setTimeout(() => {
            run.set(0);
            go();
          }, HOLD_MS);
        },
      });
    };
    if (run.get() >= 1) {
      timer = setTimeout(() => {
        run.set(0);
        go();
      }, HOLD_MS);
    } else go();
    return () => {
      ctl?.stop();
      clearTimeout(timer);
    };
  }, [inView, run]);

  const pass = useProgress(ref, ["start end", "end start"]);
  useMotionValueEvent(pass, "change", (v) => {
    // ramp darkness in as the section arrives, out as it leaves
    const d = v < 0.12 ? 0 : v < 0.3 ? (v - 0.12) / 0.18 : v < 0.78 ? 1 : v < 0.92 ? 1 - (v - 0.78) / 0.14 : 0;
    dim.set(d);
  });

  // the modes switch on one by one as the session runs, and reset with it
  const on = FEATURES.map((f) => elapsed >= f.at);
  const status =
    left <= 0 ? "Session complete" : on[2] ? "Reminders silenced" : on[1] ? "Focus mode on" : on[0] ? "Late-night support on" : "Starting focus";

  const ring = useTransform(run, (v) => Math.max(0.02, v));
  const tipX = useTransform(run, (v) => 100 + 92 * Math.cos(v * 2 * Math.PI));
  const tipY = useTransform(run, (v) => 100 + 92 * Math.sin(v * 2 * Math.PI));
  const clock = `00:${String(left).padStart(2, "0")}`;
  const ringScale = useTransform(p, [0, 0.2], [0.82, 1]);
  const ringOpacity = useTransform(p, [0, 0.12], [0.2, 1]);
  const headDim = useTransform(p, [0.1, 0.5], [1, 0.55]);
  const moonGlow = useTransform(p, [0, 0.3, 0.9], [0.2, 0.9, 0.6]);

  return (
    <section ref={ref} className="relative" aria-label="Night study">
      <div className="relative h-[100svh] min-h-[680px] overflow-hidden">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[120vh] w-[120vh] -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: moonGlow, background: "radial-gradient(closest-side, rgba(120,150,230,0.14), rgba(60,80,160,0.05) 50%, transparent 72%)" }}
        />
        <div className="relative mx-auto flex h-full max-w-[1320px] flex-col px-5 pt-[12vh] md:px-8 md:pt-[14vh]">
          <motion.div style={{ opacity: headDim }} className="relative z-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <Eyebrow>Night study</Eyebrow>
              <RevealLines className="display-md mt-5 text-ink" lines={["Focus after dark."]} />
            </div>
            <FadeUp className="lede max-w-[25rem] max-md:text-[0.95rem] md:pb-2" delay={0.2}>
              Soft voice, low light and a timer that keeps you on track.
            </FadeUp>
          </motion.div>

          <div className="relative flex-1">
            {/* timer */}
            <motion.div
              className="absolute left-1/2 top-[46%] aspect-square w-[min(74vw,46vh)] -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:w-[min(52vh,520px)]"
              style={{ scale: ringScale, opacity: ringOpacity }}
            >
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
                <defs>
                  <linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#FFE39A" />
                    <stop offset="1" stopColor="#E8A531" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(244,241,232,0.07)" strokeWidth="3" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(244,241,232,0.04)" strokeWidth="0.6" strokeDasharray="0.6 3.6" />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="url(#ringg)"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  style={{ pathLength: ring, filter: "drop-shadow(0 0 6px rgba(245,194,66,0.55))" }}
                />
                {/* glowing tip that runs around with the ring */}
                <motion.circle cx={tipX} cy={tipY} r="4.5" fill="#FFE39A" style={{ filter: "drop-shadow(0 0 6px rgba(245,194,66,0.95))" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Moon size={20} className="text-gold/80" aria-hidden />
                <span className="mt-2 text-[clamp(3.4rem,9vh,6.6rem)] font-bold tracking-[-0.05em] text-ink tabular-nums" aria-label="Focus timer">
                  {clock}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={status}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="mt-1 text-[0.66rem] font-semibold tracking-[0.18em] text-gold/80 uppercase md:text-[0.72rem]"
                  >
                    {status}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>

            {/* modes orbiting the timer */}
            <div className="absolute inset-x-0 bottom-[3vh] grid grid-cols-3 gap-2 md:inset-0 md:block">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={false}
                  animate={on[i] ? { opacity: 1, y: 0 } : { opacity: 0.28, y: 12 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  className={`glass rounded-[18px] p-3 md:absolute md:w-[300px] md:rounded-[22px] md:p-5 ${f.pos}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-gold/10 text-gold md:h-10 md:w-10"><f.icon size={16} /></span>
                    <span className="max-md:hidden"><Toggle on={on[i]} /></span>
                  </div>
                  <p className="mt-2.5 text-[0.78rem] font-bold leading-tight text-ink md:mt-4 md:text-[1.02rem]">{f.title}</p>
                  <p className="mt-1 text-[0.82rem] text-ink-2 max-md:hidden">{f.body}</p>
                </motion.div>
              ))}
            </div>
            <p className="absolute bottom-[1vh] left-0 max-w-[20rem] text-[0.82rem] leading-relaxed text-ink-3 max-md:hidden">
              After 9 PM KalamSpark speaks softly, dims his lights and keeps distractions away.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
