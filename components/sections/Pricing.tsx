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
import { ArrowUpRight, Check } from "lucide-react";
import { packages, type Package } from "@/lib/content";
import { Eyebrow, FadeUp, RevealLines } from "../ui/Reveal";

const COUNT = packages.length;

function PackageCard({ pkg, i, t, front }: { pkg: Package; i: number; t: MotionValue<number>; front: boolean }) {
  const reduce = useReduced();
  const d = useTransform(t, (v) => v - i); // <0 upcoming, 0 in focus, >0 receding
  const y = useTransform(d, (v) => (v < 0 ? `${Math.min(1, -v) * (reduce ? 20 : 55)}vh` : `${-Math.min(v, 2) * 6}vh`));
  const scale = useTransform(d, (v) => (v < 0 ? 1 + Math.min(1, -v) * (reduce ? 0 : 0.22) : 1 - Math.min(v, 2) * 0.1));
  const opacity = useTransform(d, (v) => (v < 0 ? 1 - Math.min(1, -v * 1.4) : 1 - Math.min(v, 2) * 0.42));
  const rotateX = useTransform(d, (v) => (reduce ? 0 : v < 0 ? Math.min(1, -v) * -12 : Math.min(v, 2) * 6));
  const filter = useTransform(d, (v) => {
    if (reduce) return "none";
    const b = v < 0 ? Math.min(1, -v) * 6 : 0;
    const br = v > 0 ? 1 - Math.min(v, 2) * 0.22 : 1;
    return `blur(${b.toFixed(2)}px) brightness(${br.toFixed(2)})`;
  });

  return (
    <motion.article
      className="layer absolute inset-x-0 top-1/2 mx-auto w-full max-w-[1040px] -translate-y-1/2 origin-top"
      style={{ y, scale, opacity, rotateX, filter, zIndex: 10 + i, pointerEvents: front ? "auto" : "none" }}
      aria-hidden={!front}
      aria-label={`${pkg.name} package`}
    >
      {pkg.highlight && (
        <div aria-hidden className="pointer-events-none absolute -inset-[12%] -z-10" style={{ background: "radial-gradient(closest-side, rgba(245,194,66,0.26), rgba(232,165,49,0.08) 50%, transparent 75%)" }} />
      )}
      <div
        className={`relative overflow-hidden rounded-[30px] border p-6 md:rounded-[36px] md:p-12 ${pkg.highlight ? "border-gold/35" : "border-white/[0.09]"}`}
        style={{
          background: pkg.highlight
            ? "radial-gradient(90% 80% at 0% 0%, rgba(245,194,66,0.14), transparent 55%), linear-gradient(160deg, rgb(30,34,48), rgb(11,15,28))"
            : "radial-gradient(90% 80% at 100% 0%, rgba(52,86,170,0.18), transparent 55%), linear-gradient(160deg, rgb(22,30,50), rgb(9,13,26))",
          boxShadow: pkg.highlight
            ? "inset 0 1px 0 rgba(255,231,168,0.18), 0 80px 160px -60px rgba(0,0,0,0.95), 0 0 120px -40px rgba(245,194,66,0.45)"
            : "inset 0 1px 0 rgba(255,255,255,0.06), 0 80px 160px -60px rgba(0,0,0,0.95)",
        }}
      >
        <div className="grid gap-7 md:grid-cols-[1.1fr_1fr] md:gap-14">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <span className="text-[0.75rem] font-semibold tracking-[0.3em] text-gold tabular-nums">
                {pkg.number} <span className="text-ink-3">/ {String(COUNT).padStart(2, "0")}</span>
              </span>
              {pkg.highlightLabel && (
                <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.66rem] font-bold tracking-[0.16em] text-gold uppercase">{pkg.highlightLabel}</span>
              )}
            </div>
            <h3 className="mt-4 text-[clamp(1.9rem,3.6vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.04em] text-ink md:mt-6">{pkg.name}</h3>
            <p className="mt-3 max-w-[26rem] text-[0.95rem] leading-relaxed text-ink-2 md:mt-4 md:text-[1.05rem]">{pkg.summary}</p>
            <div className="mt-6 md:mt-auto md:pt-10">
              <p className={`text-[1.3rem] font-bold tracking-[-0.01em] md:text-[1.6rem] ${pkg.highlight ? "text-gold" : "text-ink"}`}>{pkg.price}</p>
              <p className="mt-1 text-[0.8rem] text-ink-3">{pkg.priceNote}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-5 md:mt-8">
              <a
                href={pkg.primaryCta.href}
                tabIndex={front ? 0 : -1}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.86rem] font-semibold transition-all duration-500 ${
                  pkg.highlight
                    ? "bg-gold text-[#1a1406] shadow-[0_10px_40px_-10px_rgba(245,194,66,0.8)] hover:bg-gold-soft"
                    : "border border-white/15 bg-white/[0.04] text-ink hover:border-gold/50 hover:text-gold"
                }`}
              >
                {pkg.primaryCta.label}
              </a>
              <a
                href={pkg.secondaryCta.href}
                tabIndex={front ? 0 : -1}
                className="group inline-flex items-center gap-1.5 text-[0.86rem] font-semibold text-ink-2 transition-colors hover:text-ink"
              >
                {pkg.secondaryCta.label}
                <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 self-start border-t border-white/[0.07] pt-6 md:grid-cols-1 md:gap-y-4 md:border-l md:border-t-0 md:pl-12 md:pt-2">
            {pkg.features.map((f, fi) => (
              <li key={`${fi}-${f}`} className="flex items-start gap-2.5 text-[0.82rem] text-ink md:gap-3 md:text-[1rem]">
                <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                <span className={f.startsWith("[") ? "text-ink-3" : ""}>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

export function Pricing() {
  const ref = useRef<HTMLElement>(null);
  const p = useProgress(ref, ["start start", "end end"]);
  const t = useTransform(p, [0.1, 0.35, 0.5, 0.75, 0.9], [0, 1, 1, 2, 2].map((v) => Math.min(v, COUNT - 1)));
  const [front, setFront] = useState(0);
  useMotionValueEvent(t, "change", (v) => setFront(Math.round(v)));

  return (
    <section id="plans" ref={ref} className="relative h-[400vh] md:h-[440vh]" aria-label="Plans and packages">
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-5 pt-[11vh] md:px-8 md:pt-[13vh]">
        <div className="mx-auto flex w-full max-w-[1320px] items-end justify-between gap-6">
          <div>
            <Eyebrow>Plans &amp; packages</Eyebrow>
            <RevealLines className="mt-5 text-[clamp(2rem,3.6vw,3.8rem)] font-bold leading-[1] tracking-[-0.04em] text-ink" lines={["Choose how Kalam", "joins you."]} />
          </div>
          <FadeUp className="hidden max-w-[18rem] text-right text-[0.85rem] leading-relaxed text-ink-3 md:block" delay={0.2}>
            Official package pricing will be announced soon.
          </FadeUp>
        </div>

        <div className="relative mx-auto w-full max-w-[1320px] flex-1" style={{ perspective: 1800 }}>
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} i={i} t={t} front={front === i} />
          ))}
          {/* index rail */}
          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 flex-col gap-4 lg:flex" aria-hidden>
            {packages.map((pkg, i) => (
              <span key={pkg.id} className={`text-[0.72rem] font-semibold tracking-[0.2em] tabular-nums transition-colors duration-500 ${i === front ? "text-gold" : "text-ink-3/60"}`}>
                {pkg.number}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
