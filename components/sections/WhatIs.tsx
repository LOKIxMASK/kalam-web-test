"use client";
import { useProgress } from "@/lib/useProgress";
import { useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Eyebrow, FadeUp, RevealLines } from "../ui/Reveal";
import { Fit } from "../ui/Fit";
import { KalamBot } from "../mockups/KalamBot";
import { DashboardScreen, PhoneFrame } from "../mockups/Phone";
import { useIsMobile, useReduced } from "@/lib/hooks";

const DESKTOP = {
  w: 1200,
  h: 740,
  bot: { left: 110, top: 30, scale: 1 },
  phone: { left: 790, top: 20, scale: 0.9 },
  paths: [
    "M 400 170 C 560 150, 660 170, 820 220",
    "M 450 440 C 600 430, 690 400, 820 380",
    "M 420 590 C 580 650, 700 610, 820 540",
  ],
  labels: [
    { x: 612, y: 160, t: "Voice" },
    { x: 640, y: 424, t: "Gestures" },
    { x: 628, y: 630, t: "Your plan" },
  ],
  from: { bot: -220, phone: 220 },
};
const MOBILE = {
  w: 620,
  h: 1040,
  bot: { left: 0, top: 0, scale: 0.78 },
  phone: { left: 300, top: 400, scale: 0.8 },
  paths: [
    "M 200 110 C 360 140, 440 300, 400 470",
    "M 250 330 C 330 370, 380 420, 360 520",
    "M 150 540 C 180 600, 260 660, 330 700",
  ],
  labels: [
    { x: 430, y: 260, t: "Voice" },
    { x: 360, y: 400, t: "Gestures" },
    { x: 200, y: 640, t: "Your plan" },
  ],
  from: { bot: -120, phone: 120 },
};

export function WhatIs() {
  const mobile = useIsMobile();
  const reduce = useReduced();
  const L = mobile ? MOBILE : DESKTOP;
  const visRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useProgress(visRef, ["start end", "center 55%"]);
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.0005 });
  const botX = useTransform(p, [0, 1], [reduce ? 0 : L.from.bot, 0]);
  const phoneX = useTransform(p, [0, 1], [reduce ? 0 : L.from.phone, 0]);
  const phoneRot = useTransform(p, [0, 1], [reduce ? -6 : 14, -6]);
  const botRot = useTransform(p, [0, 1], [reduce ? 0 : -8, 0]);
  const visOpacity = useTransform(p, [0, 0.45], [0, 1]);
  const draw = useTransform(p, [0.55, 1], [0, 1]);
  const labelsOpacity = useTransform(p, [0.85, 1], [0, 1]);

  return (
    <section id="kalamspark" className="relative px-5 pb-[16vh] pt-[22vh] md:px-8 md:pt-[30vh]">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-8">
            <Eyebrow>More than an app</Eyebrow>
            <RevealLines
              className="display-lg mt-8 text-ink"
              lines={["Intelligence that", "follows you from the", <span key="r"><span className="text-gold-gradient">robot</span> to your pocket.</span>]}
            />
          </div>
          <div className="flex flex-col justify-end md:col-span-4 md:pb-3">
            <FadeUp className="lede" delay={0.2}>
              KalamSpark pairs an AI study companion with the KalamSpark humanoid robot by Acubotz. Ask the robot at your desk or the app anywhere else. It is the same Kalam, with the same voice, your progress and your plan.
            </FadeUp>
            <FadeUp delay={0.35} className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.78rem] font-semibold tracking-[0.08em] text-ink-3 uppercase">
              <span>Voice</span>
              <span className="text-gold/60">/</span>
              <span>Gestures</span>
              <span className="text-gold/60">/</span>
              <span>Home Wi-Fi sync</span>
            </FadeUp>
          </div>
        </div>

        <motion.div ref={visRef} style={{ opacity: visOpacity }} className="relative mt-[10vh] h-[92vh] md:mt-[14vh] md:h-[86vh]" aria-hidden>
          <div className="absolute inset-0" style={{ background: "radial-gradient(50% 45% at 50% 55%, rgba(111,214,232,0.08), transparent 70%)" }} />
          <Fit w={L.w} h={L.h} max={1.15}>
            <div className="relative h-full w-full">
              <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${L.w} ${L.h}`} fill="none">
                <defs>
                  <linearGradient id="link" x1="0" x2="1">
                    <stop offset="0" stopColor="#F5C242" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#6FD6E8" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {L.paths.map((d, i) => (
                  <g key={i}>
                    <motion.path d={d} stroke="url(#link)" strokeWidth="7" strokeLinecap="round" opacity={0.12} style={{ pathLength: draw }} />
                    <motion.path d={d} stroke="url(#link)" strokeWidth="1.2" strokeLinecap="round" style={{ pathLength: draw }} />
                    <path id={`lp${i}`} d={d} stroke="none" />
                    {!reduce && (
                      <motion.circle r="3.2" fill="#FFE7A8" style={{ opacity: labelsOpacity }}>
                        <animateMotion dur={`${2.6 + i * 0.5}s`} repeatCount="indefinite" keyPoints={i % 2 ? "1;0" : "0;1"} keyTimes="0;1" calcMode="linear">
                          <mpath href={`#lp${i}`} />
                        </animateMotion>
                      </motion.circle>
                    )}
                  </g>
                ))}
              </svg>
              <motion.div className="layer absolute origin-top-left" style={{ left: L.bot.left, top: L.bot.top, x: botX, rotate: botRot, scale: L.bot.scale }}>
                <KalamBot />
              </motion.div>
              <motion.div className="layer absolute origin-top-left" style={{ left: L.phone.left, top: L.phone.top, x: phoneX, rotate: phoneRot, scale: L.phone.scale }}>
                <PhoneFrame>
                  <DashboardScreen />
                </PhoneFrame>
              </motion.div>
              {L.labels.map((l) => (
                <motion.span
                  key={l.t}
                  className="glass absolute -translate-x-1/2 -translate-y-1/2 rounded-full px-3.5 py-1.5 text-[13px] font-semibold tracking-[0.04em] text-ink"
                  style={{ left: l.x, top: l.y, opacity: labelsOpacity }}
                >
                  {l.t}
                </motion.span>
              ))}
            </div>
          </Fit>
        </motion.div>
      </div>
    </section>
  );
}
