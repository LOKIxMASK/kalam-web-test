"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Bell, Check, ChevronRight, Mic, Moon, Pencil, Sparkles } from "lucide-react";
import { Eyebrow, FadeUp, RevealLines } from "../ui/Reveal";
import { Fit } from "../ui/Fit";
import { RobotStatusCard, Tile, schedule } from "../mockups/Phone";
import { EASE } from "@/lib/motion";
import { useIsMobile, useReduced } from "@/lib/hooks";

const STEPS = [
  { key: "robot", label: "Robot status", title: "Ready when you are.", body: "Battery, Home Wi-Fi and gestures, all at a glance. Say “Hey KalamSpark” and the robot starts talking.", meta: "82% · Home Wi-Fi · Gestures on" },
  { key: "homework", label: "Homework Helper", title: "Homework Helper", body: "Step-by-step solutions. Scan a problem and KalamSpark walks you through every step.", meta: "Quick action" },
  { key: "study", label: "Study Assistant", title: "Study Assistant", body: "Explain any concept, from photosynthesis to fractions, in words that make sense.", meta: "Quick action" },
  { key: "night", label: "Night Study", title: "Night Study", body: "Soft voice and focus mode. After 9 PM KalamSpark dims his lights and keeps distractions away.", meta: "Quick action" },
  { key: "reminders", label: "Reminders", title: "Reminders", body: "KalamSpark listens, plans your day and reminds you what matters. Two are due today.", meta: "2 due today" },
  { key: "schedule", label: "Today’s schedule", title: "Today’s schedule", body: "Mathematics at nine, Science at eleven, your essay at four. Always know what comes next.", meta: "3 sessions today" },
] as const;

function Panel({ active }: { active: number }) {
  const k = STEPS[active]?.key;
  const on = (key: string) => k === key;
  const dim = (key: string) => k !== key;
  return (
    <div
      className="relative h-[620px] w-[980px] rounded-[36px] p-8"
      style={{
        background: "radial-gradient(90% 70% at 100% 0%, rgba(44,78,160,0.28), transparent 60%), radial-gradient(70% 60% at 0% 100%, rgba(30,120,120,0.22), transparent 70%), linear-gradient(180deg, rgba(16,23,42,0.92), rgba(9,14,28,0.92))",
        border: "1px solid rgba(244,241,232,0.09)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07), -40px -30px 120px -60px rgba(245,194,66,0.45), 50px 60px 140px -60px rgba(111,214,232,0.3), 0 80px 160px -60px rgba(0,0,0,0.95)",
      }}
    >
      <div className="grid h-full grid-cols-[400px_1fr] gap-7">
        <div className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[14px] text-ink-2">Good morning,</p>
              <p className="text-[30px] font-bold tracking-[-0.02em] text-ink">Aarav</p>
            </div>
            <div className="flex gap-2">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink"><Bell size={17} /></span>
              <span className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[15px] font-bold text-gold">A</span>
            </div>
          </div>
          <div className="mt-5">
            <RobotStatusCard active={on("robot")} dim={dim("robot")} />
          </div>
          <div className={`mt-6 flex flex-1 flex-col rounded-[22px] border p-4 transition-all duration-700 ${on("schedule") ? "border-gold/50 bg-gold/[0.06] shadow-[0_0_44px_-8px_rgba(245,194,66,0.45)]" : "border-transparent"} ${dim("schedule") ? "opacity-40" : ""}`}>
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-bold text-ink">Today&rsquo;s schedule</p>
              <p className="text-[12.5px] font-semibold text-gold">See all</p>
            </div>
            <div className="mt-3 space-y-2">
              {schedule.map((s) => (
                <div key={s.time} className="flex items-center gap-3 rounded-[14px] border border-white/[0.07] bg-white/[0.03] px-4 py-2.5">
                  <span className={`w-[64px] text-[12px] font-semibold ${s.done ? "text-ink-3" : "text-gold"}`}>{s.time}</span>
                  <span className="flex-1">
                    <span className="block text-[14px] font-bold text-ink">{s.subject}</span>
                    <span className="block text-[11.5px] text-ink-2">{s.detail}</span>
                  </span>
                  {s.done ? <Check size={16} className="text-[#4fd49b]" /> : <ChevronRight size={16} className="text-ink-3" />}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <p className="mt-2 text-[16px] font-bold text-ink">Quick actions</p>
          <div className="mt-3 grid flex-1 grid-cols-2 gap-3.5">
            <Tile icon={Pencil} title="Homework Helper" sub="Step-by-step solutions" active={on("homework")} dim={dim("homework")} className="p-5" />
            <Tile icon={Sparkles} title="Study Assistant" sub="Explain any concept" active={on("study")} dim={dim("study")} className="p-5" />
            <Tile icon={Moon} title="Night Study" sub="Soft voice, focus mode" active={on("night")} dim={dim("night")} className="p-5" />
            <Tile icon={Bell} title="Reminders" sub="2 due today" active={on("reminders")} dim={dim("reminders")} className="p-5" />
          </div>
          <div className="mt-5 flex items-center gap-4 rounded-[20px] border border-white/[0.08] bg-white/[0.03] p-3 pr-5 opacity-60">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold text-[#1a1406]"><Mic size={19} /></span>
            <span className="text-[13px] text-ink-2">Say &ldquo;Hey KalamSpark&rdquo; to start talking</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const STEP_MS = 3200; // how long each feature stays highlighted

export function AlwaysReady() {
  const ref = useRef<HTMLElement>(null);
  const mobile = useIsMobile();
  const reduce = useReduced();
  const inView = useInView(ref, { amount: 0.35 });
  const [active, setActive] = useState(0);

  // auto-advance through the features while the section is on screen
  useEffect(() => {
    if (!inView) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), STEP_MS);
    return () => clearTimeout(id);
  }, [active, inView]);

  return (
    <section id="features" ref={ref} className="relative" aria-label="Always ready">
      <div className="h-[100svh] min-h-[640px] overflow-hidden px-5 lg:px-8">
        <div className="ar-grid mx-auto grid h-full max-w-[1320px] gap-4 pb-6 pt-[12vh] lg:gap-x-14 lg:gap-y-8 lg:pb-[7vh] lg:pt-[13vh]">
          <div style={{ gridArea: "h" }}>
            <Eyebrow>Always ready</Eyebrow>
            <RevealLines className="mt-5 text-[clamp(2rem,3vw,3.2rem)] font-bold leading-[1.02] tracking-[-0.035em] text-ink" lines={["Your study companion,", "always ready."]} />
            <FadeUp className="mt-5 text-[1rem] leading-relaxed text-ink-2 max-lg:hidden" delay={0.2}>
              KalamSpark listens, plans your day and reminds you what matters.
            </FadeUp>
          </div>

          <div className="relative min-h-0" style={{ gridArea: "p", perspective: 1600 }} aria-hidden>
            <motion.div
              className="h-full w-full"
              style={{ transformOrigin: "50% 100%" }}
              initial={reduce ? { opacity: 0 } : { opacity: 0, rotateX: 28, y: 160, scale: 0.86 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 1.4, ease: EASE }}
            >
              {mobile ? (
                <Fit w={520} h={760} max={1}>
                  <MobilePanel active={active} />
                </Fit>
              ) : (
                <Fit w={980} h={620} max={1.15}>
                  <Panel active={active} />
                </Fit>
              )}
            </motion.div>
          </div>

          <div className="relative flex flex-col lg:justify-end lg:pb-4" style={{ gridArea: "d" }}>
            <div className="flex items-center gap-4 text-[0.72rem] font-semibold tracking-[0.2em] tabular-nums">
              <span className="text-gold">{String(active + 1).padStart(2, "0")}</span>
              <span className="relative h-px w-24 bg-white/10">
                <motion.span
                  key={`${active}-${inView}`}
                  className="absolute inset-0 origin-left bg-gold"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: inView ? 1 : 0 }}
                  transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                />
              </span>
              <span className="text-ink-3">06</span>
            </div>
            <div className="relative mt-4 min-h-[128px] lg:mt-7 lg:min-h-[200px]" aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-ink-3 uppercase">{STEPS[active].meta}</p>
                  <h3 className="mt-2 text-[1.5rem] font-bold leading-[1.1] tracking-[-0.03em] text-ink lg:mt-3 lg:text-[2.2rem]">{STEPS[active].title}</h3>
                  <p className="mt-2 text-[0.93rem] leading-relaxed text-ink-2 lg:mt-4 lg:text-[1.05rem]">{STEPS[active].body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <ul className="mt-6 hidden space-y-2.5 lg:block">
              {STEPS.map((s, i) => (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    className={`flex items-center gap-3 text-[0.82rem] transition-colors duration-500 hover:text-ink ${i === active ? "text-ink" : "text-ink-3"}`}
                  >
                    <span className={`h-px transition-all duration-500 ${i === active ? "w-8 bg-gold" : "w-3 bg-white/20"}`} />
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobilePanel({ active }: { active: number }) {
  const k = STEPS[active]?.key;
  const on = (key: string) => k === key;
  const dim = (key: string) => k !== key;
  return (
    <div
      className="h-[760px] w-[520px] rounded-[40px] p-6"
      style={{
        background: "radial-gradient(90% 60% at 100% 0%, rgba(44,78,160,0.3), transparent 60%), linear-gradient(180deg, rgba(16,23,42,0.94), rgba(9,14,28,0.94))",
        border: "1px solid rgba(244,241,232,0.09)",
        boxShadow: "-30px -20px 100px -50px rgba(245,194,66,0.5), 0 60px 120px -50px rgba(0,0,0,0.95)",
      }}
    >
      <p className="text-[15px] text-ink-2">Good morning,</p>
      <p className="text-[30px] font-bold tracking-[-0.02em] text-ink">Aarav</p>
      <div className="mt-4"><RobotStatusCard active={on("robot")} dim={dim("robot")} /></div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Tile icon={Pencil} title="Homework Helper" sub="Step-by-step solutions" active={on("homework")} dim={dim("homework")} />
        <Tile icon={Sparkles} title="Study Assistant" sub="Explain any concept" active={on("study")} dim={dim("study")} />
        <Tile icon={Moon} title="Night Study" sub="Soft voice, focus mode" active={on("night")} dim={dim("night")} />
        <Tile icon={Bell} title="Reminders" sub="2 due today" active={on("reminders")} dim={dim("reminders")} />
      </div>
      <div className={`mt-4 rounded-[20px] border p-3 transition-all duration-700 ${on("schedule") ? "border-gold/50 bg-gold/[0.06] shadow-[0_0_40px_-8px_rgba(245,194,66,0.45)]" : "border-transparent"} ${dim("schedule") ? "opacity-40" : ""}`}>
        <p className="text-[15px] font-bold text-ink">Today&rsquo;s schedule</p>
        <div className="mt-2 space-y-2">
          {schedule.map((s) => (
            <div key={s.time} className="flex items-center gap-3 rounded-[14px] border border-white/[0.07] bg-white/[0.03] px-3.5 py-2">
              <span className={`w-[60px] text-[11.5px] font-semibold ${s.done ? "text-ink-3" : "text-gold"}`}>{s.time}</span>
              <span className="flex-1 text-[13.5px] font-bold text-ink">{s.subject}</span>
              {s.done ? <Check size={15} className="text-[#4fd49b]" /> : <ChevronRight size={15} className="text-ink-3" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
