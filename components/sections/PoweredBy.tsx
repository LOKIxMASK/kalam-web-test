"use client";
import { motion } from "framer-motion";
import { Cpu, Layers, Waves } from "lucide-react";
import { EASE } from "@/lib/motion";
import { useReduced } from "@/lib/hooks";
import { FadeUp, RevealLines } from "../ui/Reveal";

const PILLARS = [
  { icon: Layers, title: "One OS, robot and app", body: "The same Kalam on your desk and in your pocket, always in sync." },
  { icon: Waves, title: "Voice, gestures, expressions", body: "Every word, nod and smile is orchestrated in real time." },
  { icon: Cpu, title: "Built by Acubotz", body: "Designed from the ground up for a small robot with a big mind." },
];

export function PoweredBy() {
  const reduce = useReduced();
  return (
    <section id="acubotzos" className="relative overflow-hidden px-5 py-[16vh] md:px-8 md:py-[20vh]" aria-label="Powered by AcubotzOS">
      {/* core glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[38%] h-[90vh] w-[90vh] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(closest-side, rgba(245,194,66,0.16), rgba(111,214,232,0.05) 55%, transparent 75%)" }}
      />
      {/* orbit rings */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
        {[340, 520, 720].map((d, i) => (
          <motion.span
            key={d}
            className="absolute left-1/2 top-1/2 rounded-full border border-white/[0.06]"
            style={{ width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2 }}
            animate={reduce ? undefined : { rotate: i % 2 ? -360 : 360 }}
            transition={{ duration: 40 + i * 20, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_12px_rgba(245,194,66,0.9)]" />
          </motion.span>
        ))}
      </div>

      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center text-center">
        <FadeUp y={14} className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" aria-hidden />
          <span>Powered by</span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold" aria-hidden />
        </FadeUp>
        <RevealLines
          className="mt-6 text-[clamp(3.2rem,11vw,10rem)] font-bold leading-[0.9] tracking-[-0.055em]"
          lines={[<><span className="text-ink">Acubotz</span><span className="text-gold-gradient">OS</span></>]}
        />
        <FadeUp className="lede mt-8 max-w-[36rem]" delay={0.25}>
          Kalam runs on AcubotzOS, the operating system that brings the robot to life and keeps him in step with the app.
        </FadeUp>

        <ul className="mt-16 grid w-full gap-4 text-left md:mt-20 md:grid-cols-3 md:gap-6">
          {PILLARS.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1, ease: EASE, delay: 0.1 + i * 0.12 }}
              className="glass rounded-[24px] p-6 md:p-7"
            >
              <span className="grid h-11 w-11 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <p.icon size={18} />
              </span>
              <h3 className="mt-5 text-[1.1rem] font-bold tracking-[-0.02em] text-ink">{p.title}</h3>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-2">{p.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
