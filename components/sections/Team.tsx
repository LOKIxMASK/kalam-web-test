"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import { team, teamLead } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { Eyebrow, RevealLines } from "../ui/Reveal";

// names: gold with a soft champagne highlight, and a slight glow
const NAME_STYLE = {
  backgroundImage: "linear-gradient(100deg, #ffe6a3 0%, #f7cb55 40%, #f5c242 70%, #eab140 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
  filter: "drop-shadow(0 0 8px rgba(245,194,66,0.4)) drop-shadow(0 0 20px rgba(245,194,66,0.15))",
} as const;

export function Team() {
  return (
    <section id="team" className="relative px-5 py-[16vh] md:px-8" aria-label="The minds behind Kalam">
      <div className="mx-auto max-w-[1320px]">
        <Eyebrow>The team</Eyebrow>
        <RevealLines
          className="mt-5 text-[clamp(2rem,3.6vw,3.8rem)] font-bold leading-[1] tracking-[-0.04em] text-ink"
          lines={["The minds", <>behind <span className="text-gold-gradient">Kalam</span>.</>]}
        />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="group mt-12 grid items-center gap-8 md:mt-16 md:grid-cols-[minmax(0,380px)_1fr] md:gap-16"
        >
          <div className="relative">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-[18%] -z-10"
              style={{ background: "radial-gradient(closest-side, rgba(245,194,66,0.22), rgba(232,165,49,0.06) 55%, transparent 75%)" }}
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/[0.09] md:rounded-[32px]">
              {teamLead.photo && (
                <Image
                  src={teamLead.photo}
                  alt={`${teamLead.name}, ${teamLead.role}`}
                  fill
                  sizes="(min-width: 768px) 380px, 100vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050812] via-[#050812]/10 to-transparent" />
              <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(255,231,168,0.14)]" />
            </div>
          </div>
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold" aria-hidden />
              <span>Leading the mission</span>
            </p>
            <h3 className="mt-5 text-[clamp(2.2rem,4.4vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.045em] text-ink">
              The Mission <span className="text-gold-gradient">Head</span>
            </h3>
            <p className="mt-6">
              <span
                className="text-[1.35rem] font-extrabold tracking-[0.1em] uppercase md:text-[1.8rem]"
                style={NAME_STYLE}
              >
                {teamLead.name}
              </span>
            </p>
            <p className="mt-3 text-[1rem] leading-relaxed text-ink-2 md:text-[1.2rem]">{teamLead.role}</p>
          </div>
        </motion.div>

        <ul className="mt-14 grid grid-cols-2 gap-4 md:mt-20 md:gap-6 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.li
              key={m.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1, ease: EASE, delay: i * 0.12 }}
              className="group"
            >
              <div
                className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-white/[0.09] md:rounded-[28px]"
                style={{
                  background:
                    "radial-gradient(90% 70% at 50% 0%, rgba(245,194,66,0.12), transparent 60%), linear-gradient(160deg, rgb(22,30,50), rgb(9,13,26))",
                }}
              >
                {m.photo ? (
                  <Image
                    src={m.photo}
                    alt={`${m.name}, ${m.role}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink-3" aria-hidden>
                    <span className="grid h-14 w-14 place-items-center rounded-full border border-dashed border-white/20">
                      <Camera size={20} />
                    </span>
                    <span className="text-[0.66rem] font-semibold tracking-[0.2em] uppercase">Photo coming soon</span>
                  </div>
                )}
              </div>
              <h3 className="mt-4 text-[1.05rem] font-bold leading-tight tracking-[-0.02em] text-ink md:mt-5 md:text-[1.35rem]">{m.title}</h3>
              <p className="mt-3">
                <span
                  className="text-[0.9rem] font-extrabold leading-snug tracking-[0.08em] uppercase md:text-[1.05rem]"
                  style={NAME_STYLE}
                >
                  {m.name}
                </span>
              </p>
              <p className="mt-1.5 text-[0.8rem] text-ink-2 md:text-[0.9rem]">{m.role}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
