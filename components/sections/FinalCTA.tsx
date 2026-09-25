"use client";
import { useReduced } from "@/lib/hooks";
import { useProgress } from "@/lib/useProgress";
import { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { RevealLines, FadeUp } from "../ui/Reveal";
import { Fit } from "../ui/Fit";
import { KalamBot, BOT_H, BOT_W } from "../mockups/KalamBot";
import { brand } from "@/lib/content";
import { EASE } from "@/lib/motion";

export function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const p = useProgress(ref, ["start end", "end end"]);
  const sunY = useTransform(p, [0.1, 0.75], reduce ? ["0vh", "0vh"] : ["40vh", "0vh"]);
  const sunOpacity = useTransform(p, [0.1, 0.6], [0, 1]);
  const sunScale = useTransform(p, [0.1, 0.9], [0.7, 1.08]);
  const botY = useTransform(p, [0.2, 0.85], reduce ? ["0%", "0%"] : ["60%", "0%"]);
  const botOpacity = useTransform(p, [0.2, 0.5], [0, 1]);
  const horizonGlow = useTransform(p, [0.3, 0.9], [0.2, 1]);

  return (
    <section ref={ref} className="relative h-[230vh]" aria-label="The future of learning has a face">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* sunrise */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[45%] h-[120vh] w-[150vw] -translate-x-1/2 md:w-[110vw]"
          style={{ y: sunY, opacity: sunOpacity, scale: sunScale, background: "radial-gradient(50% 50% at 50% 60%, rgba(255,214,120,0.55) 0%, rgba(245,194,66,0.28) 25%, rgba(232,140,49,0.1) 50%, transparent 72%)" }}
        />
        {/* robot rising from behind the horizon */}
        <motion.div aria-hidden className="absolute bottom-[-14vh] left-1/2 h-[52vh] w-[90vw] -translate-x-1/2 md:bottom-[-18vh] md:h-[60vh]" style={{ y: botY, opacity: botOpacity }}>
          <Fit w={BOT_W} h={BOT_H} max={1.2}>
            <KalamBot glow={1.2} shadow={false} />
          </Fit>
        </motion.div>
        {/* planet horizon in front */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-[82%] h-[260vw] w-[260vw] -translate-x-1/2 rounded-full md:top-[83%] md:h-[200vw] md:w-[200vw]" style={{ background: "radial-gradient(closest-side, #04060d 97%, transparent 100%)" }}>
          <motion.div className="absolute inset-0 rounded-full" style={{ opacity: horizonGlow, boxShadow: "0 -2px 0 0 rgba(255,220,140,0.55), 0 -30px 120px -10px rgba(245,194,66,0.55), inset 0 30px 80px -40px rgba(245,194,66,0.35)" }} />
        </div>

        <div className="relative z-10 mx-auto flex h-full max-w-[1320px] flex-col items-center px-5 pt-[11vh] text-center md:px-8 md:pt-[10vh]">
          <FadeUp y={12}>
            <p className="eyebrow">Acubotz presents</p>
          </FadeUp>
          <RevealLines
            className="mt-5 text-[clamp(2.7rem,5.6vw,6.2rem)] font-bold leading-[0.92] tracking-[-0.05em] text-ink"
            lines={["Learn.", "Build.", <span key="i" className="text-gold-gradient">Inspire.</span>]}
            stagger={0.18}
          />
          <FadeUp className="mt-5 text-[1.05rem] text-ink-2 md:mt-6 md:text-[1.25rem]" delay={0.5}>
            The future of learning has a face.
          </FadeUp>
          <motion.div
            className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:gap-8 md:mt-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
          >
            <a
              href="#plans"
              className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-gold px-7 py-3.5 text-[0.95rem] font-bold text-[#1a1406] shadow-[0_18px_60px_-12px_rgba(245,194,66,0.8)] transition-transform duration-500 hover:scale-[1.03]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" aria-hidden />
              Experience KalamSpark
            </a>
            <a href={brand.site} className="group inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-ink-2 transition-colors hover:text-ink">
              Discover Acubotz
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
