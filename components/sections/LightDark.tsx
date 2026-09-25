"use client";
import { useProgress } from "@/lib/useProgress";
import { useRef } from "react";
import { motion, useMotionTemplate, useTransform } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Fit } from "../ui/Fit";
import { RevealLines } from "../ui/Reveal";
import { LearnScreen, PhoneFrame, PHONE_H, PHONE_W } from "../mockups/Phone";

export function LightDark() {
  const ref = useRef<HTMLElement>(null);
  const p = useProgress(ref, ["start start", "end end"]);

  // dark -> cream -> dusk back to dark, all scroll-linked
  const K = [0.14, 0.56, 0.82, 0.98];
  const bg = useTransform(p, K, ["rgba(8,13,27,0)", "rgba(244,234,211,1)", "rgba(244,234,211,1)", "rgba(8,13,27,0)"]);
  const ink = useTransform(p, K, ["#F4F1E8", "#151B2B", "#151B2B", "#F4F1E8"]);
  const sub = useTransform(p, K, ["#AAB3C5", "#5E6474", "#5E6474", "#AAB3C5"]);
  const eyebrow = useTransform(p, K, ["#F5C242", "#B07D0B", "#B07D0B", "#F5C242"]);
  const warmth = useTransform(p, K, [0, 1, 1, 0]);
  const wipe = useTransform(p, [0.2, 0.56, 0.82, 0.96], [0, 100, 100, 0]);
  const inv = useTransform(wipe, (w) => 100 - w);
  const clip = useMotionTemplate`inset(0 ${inv}% 0 0 round 54px)`;
  const lineLeft = useMotionTemplate`${wipe}%`;
  const lineOpacity = useTransform(wipe, [0, 3, 97, 100], [0, 1, 1, 0]);
  const sunOpacity = useTransform(warmth, [0.3, 1], [0.25, 1]);
  const moonOpacity = useTransform(warmth, [0, 0.7], [1, 0.25]);
  const phoneY = useTransform(p, [0, 0.2], [80, 0]);
  const phoneRot = useTransform(p, [0, 0.5, 1], [8, 0, -6]);

  return (
    <motion.section ref={ref} style={{ backgroundColor: bg }} className="relative h-[380vh] md:h-[420vh]" aria-label="Light or dark">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* cream atmosphere from the PDF: peach low-left, lilac right */}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity: warmth }}>
          <div className="absolute -left-[10%] bottom-[-20%] h-[80vh] w-[60vw]" style={{ background: "radial-gradient(closest-side, rgba(245,190,150,0.55), transparent)" }} />
          <div className="absolute -right-[10%] bottom-[0%] h-[70vh] w-[50vw]" style={{ background: "radial-gradient(closest-side, rgba(200,200,235,0.55), transparent)" }} />
          <div className="absolute left-1/2 top-[-20%] h-[70vh] w-[70vw] -translate-x-1/2" style={{ background: "radial-gradient(closest-side, rgba(255,226,150,0.55), transparent)" }} />
        </motion.div>

        <div className="relative mx-auto flex h-full max-w-[1320px] flex-col items-center px-5 pt-[12vh] text-center md:px-8 md:pt-[13vh]">
          <motion.p className="eyebrow" style={{ color: eyebrow }}>Light or dark</motion.p>
          <motion.div style={{ color: ink }}>
            <RevealLines className="display-md mt-4" lines={["Light or dark.", "Your call."]} />
          </motion.div>
          <motion.p style={{ color: sub }} className="mt-4 text-[0.98rem] md:text-[1.12rem]">
            Seven subjects, one companion, two looks.
          </motion.p>

          <div className="relative mt-6 w-full flex-1 md:mt-10" aria-hidden>
            <motion.div className="h-full w-full" style={{ y: phoneY, rotate: phoneRot }}>
              <Fit w={PHONE_W + 80} h={PHONE_H + 40} max={0.95}>
                <div className="relative mx-auto" style={{ width: PHONE_W, height: PHONE_H }}>
                  <div className="absolute inset-0">
                    <PhoneFrame>
                      <LearnScreen />
                    </PhoneFrame>
                  </div>
                  <motion.div className="absolute inset-0" style={{ clipPath: clip, WebkitClipPath: clip }}>
                    <PhoneFrame light glow={false}>
                      <LearnScreen light />
                    </PhoneFrame>
                  </motion.div>
                  {/* the reveal edge */}
                  <motion.div className="absolute -bottom-6 -top-6 w-px" style={{ left: lineLeft, opacity: lineOpacity }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold to-transparent shadow-[0_0_18px_2px_rgba(245,194,66,0.7)]" />
                    <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-[#10172a] shadow-[0_0_40px_-4px_rgba(245,194,66,0.7)]">
                      <Sun size={16} className="text-gold" />
                    </div>
                  </motion.div>
                </div>
              </Fit>
            </motion.div>
          </div>
        </div>

        {/* mode labels */}
        <div className="pointer-events-none absolute inset-x-6 bottom-8 flex justify-between text-[0.7rem] font-semibold tracking-[0.3em] uppercase md:inset-x-14 md:top-1/2 md:bottom-auto" aria-hidden>
          <motion.span className="flex items-center gap-2" style={{ opacity: moonOpacity, color: ink }}>
            <Moon size={14} /> Dark
          </motion.span>
          <motion.span className="flex items-center gap-2" style={{ opacity: sunOpacity, color: ink }}>
            Light <Sun size={14} />
          </motion.span>
        </div>
      </div>
    </motion.section>
  );
}
