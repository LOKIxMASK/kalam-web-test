"use client";
import { useProgress } from "@/lib/useProgress";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { subjects, type SubjectKey } from "@/lib/content";
import { Eyebrow, FadeUp, RevealLines } from "../ui/Reveal";
import { Fit } from "../ui/Fit";
import Image from "next/image";
import { subjectIcons } from "../mockups/Phone";
import { useIsMobile, useReduced } from "@/lib/hooks";
import { EASE } from "@/lib/motion";

type Layout = { w: number; h: number; inner: number; outer: number; nodeScale: number; ratio: [number, number]; compact?: boolean };
const DESKTOP: Layout = { w: 1240, h: 760, inner: 300, outer: 540, nodeScale: 1.2, ratio: [0.2, 0.4] };
const MOBILE: Layout = { w: 640, h: 900, inner: 150, outer: 250, nodeScale: 1.3, ratio: [0.7, 1.1], compact: true };

// three on the inner orbit, four on the outer
const ORBIT = subjects.map((s, i) => ({
  ...s,
  ring: i < 3 ? 0 : 1,
  phase: i < 3 ? (i / 3) * Math.PI * 2 + 0.4 : ((i - 3) / 4) * Math.PI * 2,
}));

function Node({
  s,
  angle,
  ratio,
  L,
  active,
  setActive,
}: {
  s: (typeof ORBIT)[number];
  angle: MotionValue<number>;
  ratio: MotionValue<number>;
  L: Layout;
  active: SubjectKey | null;
  setActive: (k: SubjectKey | null) => void;
}) {
  const rx = s.ring === 0 ? L.inner : L.outer;
  const dir = s.ring === 0 ? 1.35 : 1;
  const theta = useTransform(angle, (a) => a * dir + s.phase);
  const x = useTransform(theta, (t) => Math.cos(t) * rx);
  const y = useTransform([theta, ratio], ([t, r]: number[]) => Math.sin(t) * rx * r);
  const depth = useTransform(theta, (t) => Math.sin(t)); // -1 back, 1 front
  const scale = useTransform(depth, (d) => (0.8 + (d + 1) * 0.14) * L.nodeScale);
  const opacity = useTransform(depth, (d) => 0.5 + (d + 1) * 0.25);
  const zIndex = useTransform(depth, (d) => (d > 0 ? 20 : 2));
  const I = subjectIcons[s.key];
  const isActive = active === s.key;
  const dimmed = active !== null && !isActive;

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ x, y, zIndex: isActive ? 40 : zIndex }}
    >
      <motion.div style={{ scale, opacity: isActive ? 1 : opacity }}>
        <button
          type="button"
          className={`group relative -translate-x-1/2 -translate-y-1/2 flex items-center whitespace-nowrap border text-left transition-all duration-500 ${
            L.compact ? "w-[112px] flex-col gap-1.5 rounded-[18px] px-2 py-2.5 text-center" : "gap-3 rounded-full py-2 pl-2 pr-5"
          } ${
            isActive
              ? "border-gold/60 bg-[#18160f]/95 shadow-[0_0_50px_-6px_rgba(245,194,66,0.6)]"
              : "border-white/10 bg-[#0c1224]/90 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)]"
          } ${dimmed ? "opacity-40" : ""}`}
          onMouseEnter={() => setActive(s.key)}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive(s.key)}
          onBlur={() => setActive(null)}
          onClick={() => setActive(isActive ? null : s.key)}
          aria-pressed={isActive}
        >
          <span className={`grid h-10 w-10 place-items-center rounded-full transition-colors duration-500 ${isActive ? "bg-gold text-[#1a1406]" : "bg-gold/10 text-gold"}`}>
            <I size={17} />
          </span>
          <span className={`font-semibold text-ink ${L.compact ? "whitespace-normal text-[12.5px] leading-tight" : "text-[15px]"}`}>{s.name}</span>
          {s.isNew && !L.compact && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[9.5px] font-bold text-gold">NEW</span>}
          <AnimatePresence>
            {isActive && (
              <motion.span
                initial={{ opacity: 0, y: -6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.96 }}
                transition={{ duration: 0.35, ease: EASE }}
                className={`glass absolute top-[calc(100%+10px)] block w-[220px] whitespace-normal rounded-[16px] p-3.5 text-left ${L.compact ? "left-1/2 -translate-x-1/2" : "left-0"}`}
              >
                <span className="block text-[10.5px] font-bold tracking-[0.18em] text-gold uppercase">{s.progress}</span>
                <span className="mt-1.5 block text-[13px] leading-snug text-ink-2">{s.blurb}</span>
                {s.ratio > 0 && (
                  <span className="mt-2.5 block h-1 rounded-full bg-white/10">
                    <span className="block h-full rounded-full bg-gold" style={{ width: `${s.ratio * 100}%` }} />
                  </span>
                )}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.div>
    </motion.div>
  );
}

export function Universe() {
  const ref = useRef<HTMLElement>(null);
  const mobile = useIsMobile();
  const reduce = useReduced();
  const L = mobile ? MOBILE : DESKTOP;
  const [active, setActive] = useState<SubjectKey | null>(null);

  const p = useProgress(ref, ["start start", "end end"]);
  const enter = useProgress(ref, ["start end", "start start"]);
  const ratio = useTransform(p, [0, 1], L.ratio);
  const stageScale = useTransform(enter, [0, 1], [reduce ? 1 : 0.7, 1]);
  const camera = useTransform(p, [0, 1], [1, 1.12]);
  const tiltZ = useTransform(p, [0, 1], [-6, 3]);
  const stageOpacity = useTransform(enter, [0.2, 0.9], [0, 1]);
  const exit = useTransform(p, [0.86, 1], [1, 0.35]);

  // continuous orbit; slows almost to a stop while a subject is hovered
  const angle = useMotionValue(0);
  const speed = useSpring(1, { stiffness: 40, damping: 20 });
  useEffect(() => {
    speed.set(active ? 0.06 : 1);
  }, [active, speed]);
  useAnimationFrame((_, delta) => {
    if (reduce) return;
    angle.set(angle.get() + Math.min(delta, 50) * 0.000065 * speed.get());
  });
  const ryInner = useTransform(ratio, (r) => L.inner * r);
  const ryOuter = useTransform(ratio, (r) => L.outer * r);
  const ryHalo = useTransform(ratio, (r) => (L.outer + 90) * r);

  return (
    <section id="learning" ref={ref} className="relative h-[260vh]" aria-label="The learning universe">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="relative z-30 mx-auto max-w-[1320px] px-5 pt-[12vh] md:px-8 md:pt-[13vh]">
          <Eyebrow>The learning universe</Eyebrow>
          <RevealLines className="display-md mt-5 text-ink" lines={["One companion.", <span key="b" className="text-ink-2">A universe of knowledge.</span>]} />
          <FadeUp className="mt-4 text-[0.9rem] text-ink-3" delay={0.3}>
            {mobile ? "Tap a subject to look closer." : "Hover a subject to look closer."}
          </FadeUp>
        </div>

        <motion.div className="absolute inset-x-0 bottom-0 top-[32vh] md:top-[14vh]" style={{ scale: stageScale, opacity: stageOpacity }}>
          <motion.div className="h-full w-full" style={{ scale: camera, rotate: tiltZ, opacity: exit }}>
            <Fit w={L.w} h={L.h} max={1.2}>
              <div className="relative h-full w-full">
                <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`${-L.w / 2} ${-L.h / 2} ${L.w} ${L.h}`} aria-hidden>
                  <defs>
                    <linearGradient id="orbitg" x1="0" x2="1">
                      <stop offset="0" stopColor="#6FD6E8" stopOpacity="0.05" />
                      <stop offset="0.5" stopColor="#F5C242" stopOpacity="0.45" />
                      <stop offset="1" stopColor="#6FD6E8" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <motion.ellipse cx={0} cy={0} rx={L.inner} ry={ryInner} fill="none" stroke="url(#orbitg)" strokeWidth={1} />
                  <motion.ellipse cx={0} cy={0} rx={L.outer} ry={ryOuter} fill="none" stroke="url(#orbitg)" strokeWidth={1} strokeDasharray="2 6" />
                  <motion.ellipse cx={0} cy={0} rx={L.outer + 90} ry={ryHalo} fill="none" stroke="rgba(244,241,232,0.05)" strokeWidth={1} />
                </svg>

                {/* core */}
                <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" aria-hidden>
                  <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(245,194,66,0.32), rgba(245,194,66,0.08) 45%, transparent 70%)" }} />
                  <div className="anim-spin-slow absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-gold/25" />
                  <div className="absolute left-1/2 top-1/2 h-[190px] w-[190px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
                  {/* robot standing on a glowing platform at the centre of the system */}
                  <div className="relative" style={{ width: mobile ? 170 : 150, height: mobile ? 350 : 310 }}>
                    <div className="absolute bottom-[-10px] left-1/2 h-[34px] w-[190px] -translate-x-1/2 rounded-[50%] border border-gold/40" style={{ background: "radial-gradient(closest-side, rgba(245,194,66,0.45), rgba(245,194,66,0.08) 70%, transparent)", boxShadow: "0 0 50px -6px rgba(245,194,66,0.6)" }} />
                    <Image
                      src="/kalam-robot.png"
                      alt=""
                      width={318}
                      height={656}
                      sizes="170px"
                      className="absolute bottom-0 left-0 h-full w-full object-contain"
                      style={{ filter: "drop-shadow(-4px -3px 10px rgba(245,194,66,0.45)) drop-shadow(5px 4px 12px rgba(111,214,232,0.25))" }}
                      draggable={false}
                    />
                  </div>
                  <p className="absolute left-1/2 top-[calc(100%+18px)] -translate-x-1/2 whitespace-nowrap text-[12px] font-bold tracking-[0.3em] text-gold/80 uppercase">Kalam</p>
                </div>

                {ORBIT.map((s) => (
                  <Node key={s.key} s={s} angle={angle} ratio={ratio} L={L} active={active} setActive={setActive} />
                ))}
              </div>
            </Fit>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
