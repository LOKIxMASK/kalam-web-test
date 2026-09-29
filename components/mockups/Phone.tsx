import Image from "next/image";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  BatteryMedium,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Code,
  Cpu,
  FlaskConical,
  Globe,
  Hand,
  House,
  Lightbulb,
  MessageCircle,
  Mic,
  Moon,
  Pencil,
  Play,
  Bot,
  Sigma,
  SlidersHorizontal,
  Sparkles,
  Type,
  Wifi,
  Zap,
} from "lucide-react";
import { subjects, type SubjectKey } from "@/lib/content";

export const PHONE_W = 360;
export const PHONE_H = 760;

export const subjectIcons: Record<SubjectKey, typeof FlaskConical> = {
  science: FlaskConical,
  maths: Sigma,
  english: Type,
  social: Globe,
  gk: Lightbulb,
  coding: Code,
  ai: Cpu,
};

export function KalamAvatar({ size = 44, ring = true, online = true }: { size?: number; ring?: boolean; online?: boolean }) {
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <Image
        src="/kalam-face.png"
        alt=""
        width={size * 2}
        height={size * 2}
        className={`h-full w-full rounded-full object-cover ${ring ? "ring-1 ring-white/15" : ""}`}
      />
      {online && (
        <span
          className="absolute rounded-full border-[2.5px] border-[#10182c] bg-[#4fd49b]"
          style={{ width: size * 0.3, height: size * 0.3, right: -size * 0.02, bottom: -size * 0.02 }}
        />
      )}
    </span>
  );
}

/** Premium device shell with rim lighting and glass reflection. */
export function PhoneFrame({
  children,
  light = false,
  glow = true,
  className = "",
}: {
  children: ReactNode;
  light?: boolean;
  glow?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative rounded-[54px] p-[9px] ${className}`}
      style={{
        width: PHONE_W,
        height: PHONE_H,
        background: "linear-gradient(145deg, #2a3144 0%, #0b0f1a 38%, #151b29 70%, #3a4152 100%)",
        boxShadow: glow
          ? "0 0 0 1px rgba(255,255,255,0.07), inset 0 0 0 1px rgba(255,255,255,0.05), -30px -20px 80px -40px rgba(245,194,66,0.55), 40px 40px 90px -40px rgba(111,214,232,0.35), 0 80px 140px -40px rgba(0,0,0,0.95)"
          : "0 0 0 1px rgba(255,255,255,0.07), 0 60px 120px -40px rgba(0,0,0,0.9)",
      }}
    >
      {/* side button hints */}
      <span className="absolute -right-[2px] top-[150px] h-16 w-[3px] rounded-full bg-[#2c3344]" />
      <span className="absolute -left-[2px] top-[120px] h-10 w-[3px] rounded-full bg-[#2c3344]" />
      <div
        className="relative h-full w-full overflow-hidden rounded-[46px]"
        style={{
          background: light
            ? "linear-gradient(170deg, #fbf5e8 0%, #f4ead3 55%, #eee4d0 100%)"
            : "radial-gradient(120% 60% at 90% 30%, rgba(44,78,160,0.35), transparent 60%), radial-gradient(90% 50% at 0% 100%, rgba(30,120,120,0.35), transparent 70%), linear-gradient(180deg, #0e1528 0%, #0b1122 100%)",
        }}
      >
        {/* dynamic island */}
        <div className="absolute left-1/2 top-[11px] z-20 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
        <StatusBar light={light} />
        {children}
        {/* glass reflection */}
        <div
          className="pointer-events-none absolute inset-0 z-30"
          style={{ background: "linear-gradient(118deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 28%, transparent 42%)" }}
        />
      </div>
    </div>
  );
}

function StatusBar({ light }: { light?: boolean }) {
  return (
    <div className={`relative z-10 flex h-[48px] items-center justify-between px-8 pt-1 text-[13px] font-semibold ${light ? "text-[#151b2b]" : "text-ink"}`}>
      <span>9:41</span>
      <span className="flex items-center gap-1.5 opacity-90">
        <Wifi size={14} strokeWidth={2.4} />
        <BatteryMedium size={18} strokeWidth={2} />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function Tile({
  icon: Icon,
  title,
  sub,
  active = false,
  dim = false,
  className = "",
}: {
  icon: typeof Pencil;
  title: string;
  sub: string;
  active?: boolean;
  dim?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[18px] border p-3.5 transition-all duration-700 ${
        active
          ? "border-gold/50 bg-gold/[0.08] shadow-[0_0_40px_-8px_rgba(245,194,66,0.45)]"
          : "border-white/[0.08] bg-white/[0.035]"
      } ${dim ? "opacity-40" : "opacity-100"} ${className}`}
    >
      <span className="grid h-9 w-9 place-items-center rounded-[11px] bg-gold/10 text-gold">
        <Icon size={17} />
      </span>
      <p className="mt-3 text-[14px] font-bold text-ink">{title}</p>
      <p className="mt-0.5 text-[11.5px] text-ink-2">{sub}</p>
    </div>
  );
}

export function RobotStatusCard({ active = false, dim = false }: { active?: boolean; dim?: boolean }) {
  return (
    <div
      className={`rounded-[20px] border p-4 transition-all duration-700 ${
        active ? "border-gold/50 bg-gold/[0.07] shadow-[0_0_44px_-8px_rgba(245,194,66,0.45)]" : "border-white/[0.09] bg-white/[0.04]"
      } ${dim ? "opacity-40" : ""}`}
    >
      <div className="flex items-center gap-3">
        <KalamAvatar size={46} />
        <div className="min-w-0 flex-1">
          <p className="text-[14.5px] font-bold text-ink">KalamSpark is ready</p>
          <p className="mt-0.5 text-[11.5px] text-ink-2">Say &ldquo;Hey KalamSpark&rdquo; to start talking</p>
        </div>
        <ChevronRight size={16} className="text-ink-3" />
      </div>
      <div className="mt-3.5 flex items-center justify-between border-t border-white/[0.07] pt-3 text-[11.5px] text-ink-2">
        <span className="flex items-center gap-1.5"><BatteryMedium size={15} className="text-[#4fd49b]" /> 82%</span>
        <span className="flex items-center gap-1.5"><Wifi size={14} /> Home Wi-Fi</span>
        <span className="flex items-center gap-1.5"><Hand size={14} /> Gestures on</span>
      </div>
    </div>
  );
}

export const schedule = [
  { time: "9:00 AM", subject: "Mathematics", detail: "Fractions · practice set 2", done: true },
  { time: "11:00 AM", subject: "Science", detail: "Chapter 3 · Photosynthesis" },
  { time: "4:00 PM", subject: "Homework", detail: "English essay draft" },
];

function TabBar({ active = "Home", light = false }: { active?: string; light?: boolean }) {
  const tabs = [
    { l: "Home", i: House },
    { l: "Learn", i: BookOpen },
    { l: "Talk", i: MessageCircle },
    { l: "Planner", i: CalendarDays },
    { l: "Robot", i: Bot },
  ];
  return (
    <div
      className={`absolute inset-x-0 bottom-0 z-10 flex justify-around border-t px-3 pb-6 pt-2.5 ${
        light ? "border-black/[0.06] bg-[#f7efdd]/95" : "border-white/[0.06] bg-[#0b1122]/95"
      }`}
    >
      {tabs.map(({ l, i: I }) => (
        <span key={l} className={`flex flex-col items-center gap-1 text-[10px] font-semibold ${l === active ? (light ? "text-[#b8860b]" : "text-gold") : light ? "text-[#8a8f9c]" : "text-ink-3"}`}>
          <I size={18} />
          {l}
        </span>
      ))}
    </div>
  );
}

export function DashboardScreen() {
  return (
    <div className="relative h-[calc(100%-48px)] px-5">
      <div className="mt-2 flex items-start justify-between">
        <div>
          <p className="text-[12.5px] text-ink-2">Good morning,</p>
          <p className="text-[24px] font-bold tracking-[-0.02em] text-ink">Aarav</p>
        </div>
        <div className="flex gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-ink"><Bell size={16} /></span>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-[14px] font-bold text-gold">A</span>
        </div>
      </div>
      <div className="mt-4"><RobotStatusCard /></div>
      <p className="mt-5 text-[15px] font-bold text-ink">Quick actions</p>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <Tile icon={Pencil} title="Homework Helper" sub="Step-by-step solutions" />
        <Tile icon={Sparkles} title="Study Assistant" sub="Explain any concept" />
        <Tile icon={Moon} title="Night Study" sub="Soft voice, focus mode" />
        <Tile icon={Bell} title="Reminders" sub="2 due today" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <p className="text-[15px] font-bold text-ink">Today&rsquo;s schedule</p>
        <p className="text-[12px] font-semibold text-gold">See all</p>
      </div>
      <div className="mt-2.5 space-y-2">
        {schedule.slice(0, 2).map((s) => (
          <div key={s.time} className="flex items-center gap-3 rounded-[14px] border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5">
            <span className={`w-[58px] text-[11px] font-semibold ${s.done ? "text-ink-3" : "text-gold"}`}>{s.time}</span>
            <span className="flex-1">
              <span className="block text-[13px] font-bold text-ink">{s.subject}</span>
              <span className="block text-[11px] text-ink-2">{s.detail}</span>
            </span>
            {s.done ? <Check size={15} className="text-[#4fd49b]" /> : <ChevronRight size={15} className="text-ink-3" />}
          </div>
        ))}
      </div>
      <TabBar />
    </div>
  );
}

export function ChatScreen() {
  return (
    <div className="relative h-[calc(100%-48px)] px-5">
      <div className="mt-2 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink"><ArrowLeft size={16} /></span>
        <KalamAvatar size={40} online={false} />
        <div className="flex-1">
          <p className="text-[16px] font-bold text-ink">KalamSpark</p>
          <p className="flex items-center gap-1.5 text-[11px] text-[#4fd49b]"><span className="h-1.5 w-1.5 rounded-full bg-[#4fd49b]" /> Listening</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-ink"><SlidersHorizontal size={15} /></span>
      </div>
      <div className="mt-5 w-[78%] rounded-[16px] rounded-tl-[6px] border border-white/10 bg-white/[0.05] p-3 text-[12.5px] leading-snug text-ink">
        Hello Aarav! What shall we explore today?
      </div>
      <div className="ml-auto mt-3 w-fit rounded-[16px] rounded-tr-[6px] bg-gold px-3.5 py-2.5 text-[12.5px] font-semibold text-[#1a1406]">
        KalamSpark, why is the sky blue?
      </div>
      <div className="mt-3 w-[88%] rounded-[16px] rounded-tl-[6px] border border-white/10 bg-white/[0.05] p-3 text-[12.5px] leading-[1.55] text-ink">
        Sunlight is a mix of all colours. When it passes through the air, tiny gas molecules scatter blue light much more than red. Scientists call this Rayleigh scattering.
      </div>
      <div className="mt-3 space-y-2">
        {["Explain simpler", "Give an example", "Quiz me"].map((c) => (
          <div key={c} className="rounded-full border border-white/10 bg-white/[0.03] py-2 text-center text-[12px] font-semibold text-ink">{c}</div>
        ))}
      </div>
      <div className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1.5 text-[11px] font-semibold text-gold">
        <Hand size={12} /> KalamSpark is pointing at the sky
      </div>
      <div className="absolute inset-x-0 bottom-7 flex flex-col items-center">
        <div className="flex h-8 items-center gap-[3px]">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className="w-[3px] rounded-full bg-gold" style={{ height: Math.round(6 + Math.abs(Math.sin(i * 1.7)) * 22), opacity: Math.round((0.5 + Math.abs(Math.sin(i)) * 0.5) * 100) / 100 }} />
          ))}
        </div>
        <span className="mt-3 grid h-14 w-14 place-items-center rounded-full bg-gold text-[#1a1406] shadow-[0_0_40px_-4px_rgba(245,194,66,0.7)]"><Mic size={22} /></span>
        <p className="mt-2 text-[10.5px] text-ink-3">Tap to speak, or say &ldquo;Hey KalamSpark&rdquo;</p>
      </div>
    </div>
  );
}

export function LearnScreen({ light = false }: { light?: boolean }) {
  const ink = light ? "text-[#151b2b]" : "text-ink";
  const sub = light ? "text-[#6b6f7b]" : "text-ink-2";
  const card = light ? "border-black/[0.06] bg-white/60 shadow-[0_10px_30px_-18px_rgba(80,60,20,0.35)]" : "border-white/[0.08] bg-white/[0.04]";
  const accent = light ? "#c28f12" : "#F5C242";
  return (
    <div className="relative h-[calc(100%-48px)] px-5">
      <div className="mt-2 flex items-center justify-between">
        <p className={`text-[24px] font-bold tracking-[-0.02em] ${ink}`}>Learn</p>
        <span className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-semibold ${card} ${ink}`}>
          <ChevronDown size={13} /> Class 7
        </span>
      </div>
      <div className={`mt-4 rounded-[20px] border p-4 ${card}`}>
        <p className="text-[10px] font-bold tracking-[0.18em]" style={{ color: accent }}>CONTINUE</p>
        <div className="flex items-center justify-between">
          <div>
            <p className={`mt-1 text-[18px] font-bold ${ink}`}>Photosynthesis</p>
            <p className={`text-[11.5px] ${sub}`}>Science &middot; Chapter 3 &middot; 12 min left</p>
          </div>
          <span className="grid h-11 w-11 place-items-center rounded-full bg-gold text-[#1a1406]"><Play size={16} fill="currentColor" /></span>
        </div>
        <div className={`mt-3 h-1.5 rounded-full ${light ? "bg-black/[0.08]" : "bg-white/10"}`}>
          <div className="h-full w-[62%] rounded-full" style={{ background: accent }} />
        </div>
      </div>
      <p className={`mt-5 text-[15px] font-bold ${ink}`}>Subjects</p>
      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {subjects.slice(0, 6).map((s) => {
          const I = subjectIcons[s.key];
          return (
            <div key={s.key} className={`rounded-[16px] border p-3 ${card}`}>
              <span className="grid h-8 w-8 place-items-center rounded-[10px]" style={{ background: light ? "rgba(194,143,18,0.12)" : "rgba(245,194,66,0.1)", color: accent }}>
                <I size={15} />
              </span>
              <p className={`mt-2.5 text-[13px] font-bold ${ink}`}>{s.name}</p>
              <p className={`text-[10.5px] ${sub}`}>{s.progress}</p>
              <div className={`mt-2 h-1 rounded-full ${light ? "bg-black/[0.08]" : "bg-white/10"}`}>
                <div className="h-full rounded-full" style={{ width: `${s.ratio * 100}%`, background: accent }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className={`mt-2.5 flex items-center gap-3 rounded-[16px] border p-3 ${card}`}>
        <span className="grid h-8 w-8 place-items-center rounded-[10px]" style={{ background: light ? "rgba(194,143,18,0.12)" : "rgba(245,194,66,0.1)", color: accent }}>
          <Cpu size={15} />
        </span>
        <span className="flex-1">
          <span className={`block text-[13px] font-bold ${ink}`}>Artificial Intelligence</span>
          <span className={`block text-[10.5px] ${sub}`}>Start with &ldquo;What is AI?&rdquo;</span>
        </span>
        <span className="rounded-full px-2 py-0.5 text-[9.5px] font-bold" style={{ background: light ? "rgba(194,143,18,0.15)" : "rgba(245,194,66,0.15)", color: accent }}>NEW</span>
      </div>
      <TabBar active="Learn" light={light} />
    </div>
  );
}

export function WelcomeScreen() {
  return (
    <div className="relative flex h-[calc(100%-48px)] flex-col px-6">
      <div className="mt-3 flex items-center gap-2.5">
        <span className="flex flex-col leading-none">
          <span className="text-[13px] font-bold text-ink"><span className="text-gold">A</span>cubotz</span>
          <span className="mt-1 text-[8.5px] text-ink-2">Igniting Curiosity, Inspiring Innovation</span>
        </span>
      </div>
      <div className="relative mx-auto mt-14">
        <div className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(245,194,66,0.35),transparent)]" />
        <KalamAvatar size={120} online={false} />
      </div>
      <div className="mt-auto pb-10">
        <p className="text-[9.5px] font-bold tracking-[0.22em] text-gold">INDIA&rsquo;S FIRST HUMANOID STUDY COMPANION</p>
        <p className="mt-2 text-[34px] font-bold tracking-[-0.03em] text-ink">KalamSpark</p>
        <p className="mt-1 text-[10px] font-semibold tracking-[0.35em] text-ink-2">LEARN. BUILD. INSPIRE.</p>
        <p className="mt-4 text-[12.5px] leading-relaxed text-ink-2">
          An AI companion for homework, doubts and daily study, inspired by Dr. A.P.J. Abdul Kalam.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 rounded-[14px] bg-gold py-3 text-[13px] font-bold text-[#1a1406]">
          <Zap size={14} /> Get started
        </div>
        <div className="mt-2.5 rounded-[14px] border border-white/10 bg-white/[0.04] py-3 text-center text-[13px] font-semibold text-ink">
          I already have a robot
        </div>
      </div>
    </div>
  );
}
