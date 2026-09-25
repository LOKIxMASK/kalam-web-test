"use client";
import { useReduced } from "@/lib/hooks";
import { useEffect, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { usePageProgress } from "@/lib/useProgress";
import { useAtmosphere } from "./Atmosphere";
import { EASE } from "@/lib/motion";

type Star = {
  x: number;
  y: number;
  d: number; // depth 0.15..1
  r: number;
  a: number;
  tw: number;
  ph: number;
  c: string;
};

const TINTS = ["255,250,240", "255,244,220", "220,232,255", "255,236,196", "236,244,255"];

function makeStars(n: number): Star[] {
  const out: Star[] = [];
  for (let i = 0; i < n; i++) {
    const layer = Math.random();
    const d = layer < 0.62 ? 0.15 + Math.random() * 0.2 : layer < 0.9 ? 0.4 + Math.random() * 0.25 : 0.75 + Math.random() * 0.25;
    out.push({
      x: Math.random(),
      y: Math.random(),
      d,
      r: 0.35 + d * 1.05 * Math.random() + (d > 0.75 ? 0.35 : 0),
      a: 0.25 + Math.random() * 0.6,
      tw: 0.3 + Math.random() * 1.4,
      ph: Math.random() * Math.PI * 2,
      c: `rgb(${TINTS[(Math.random() * TINTS.length) | 0]})`,
    });
  }
  return out;
}

function StarCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReduced();
  const { dim } = useAtmosphere();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let dpr = 1;
    let stars: Star[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;
    const start = performance.now();
    let meteor: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    let nextMeteor = start + 7000 + Math.random() * 8000;

    // pre-rendered glow sprite for bright stars
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,244,214,0.9)");
    g.addColorStop(0.18, "rgba(255,226,160,0.35)");
    g.addColorStop(1, "rgba(255,226,160,0)");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 64, 64);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = W < 768 ? 0.00022 : 0.00032;
      stars = makeStars(Math.round(Math.min(560, W * H * density)));
      if (reduce) draw(performance.now());
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / W - 0.5) * 2;
      mouse.ty = (e.clientY / H - 0.5) * 2;
    };

    const draw = (now: number) => {
      const t = (now - start) / 1000;
      const intro = reduce ? 1 : Math.min(1, Math.max(0, (t - 0.2) / 2.6));
      const introE = 1 - Math.pow(1 - intro, 3);
      const boost = 1 + dim.get() * 0.9;
      const sy = window.scrollY;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        let y = (s.y * H - sy * s.d * 0.05) % H;
        if (y < 0) y += H;
        const x = s.x * W - mouse.x * s.d * 16;
        const y2 = y - mouse.y * s.d * 10;
        const twinkle = reduce ? 0.85 : 0.6 + 0.4 * Math.sin(t * s.tw + s.ph);
        const alpha = Math.min(1, s.a * twinkle * introE * boost);
        if (s.d > 0.85 && s.r > 1.1) {
          ctx.globalAlpha = alpha * 0.55;
          const size = s.r * 9;
          ctx.drawImage(sprite, x - size / 2, y2 - size / 2, size, size);
        }
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s.c;
        if (s.r < 0.9) {
          // tiny stars: a square is indistinguishable and far cheaper than a path
          ctx.fillRect(x - s.r, y2 - s.r, s.r * 2, s.r * 2);
        } else {
          ctx.beginPath();
          ctx.arc(x, y2, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // rare, understated meteor
      if (!reduce) {
        if (!meteor && now > nextMeteor) {
          meteor = { x: W * (0.3 + Math.random() * 0.6), y: H * Math.random() * 0.35, vx: -(5 + Math.random() * 3), vy: 2 + Math.random() * 1.5, life: 1 };
          nextMeteor = now + 11000 + Math.random() * 14000;
        }
        if (meteor) {
          meteor.x += meteor.vx;
          meteor.y += meteor.vy;
          meteor.life -= 0.012;
          const tail = 16;
          const grad = ctx.createLinearGradient(meteor.x, meteor.y, meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail);
          grad.addColorStop(0, `rgba(255,236,190,${0.55 * meteor.life})`);
          grad.addColorStop(1, "rgba(255,236,190,0)");
          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail);
          ctx.stroke();
          if (meteor.life <= 0) meteor = null;
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (!document.hidden) draw(now);
      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(loop);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce, dim]);

  return <canvas ref={ref} className="absolute inset-0" aria-hidden />;
}

function Planet({
  size,
  className,
  rim = "gold",
}: {
  size: number;
  className?: string;
  rim?: "gold" | "cyan" | "emerald";
}) {
  const rimColor = rim === "gold" ? "245,194,66" : rim === "cyan" ? "111,214,232" : "64,190,150";
  return (
    <div
      className={`absolute rounded-full ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 28%, rgba(${rimColor},0.10), rgba(8,12,24,0.0) 38%), radial-gradient(circle at 50% 50%, #070b16 60%, #050812 100%)`,
        boxShadow: `inset 10px 8px 24px -6px rgba(${rimColor},0.35), inset 2px 1px 2px rgba(${rimColor},0.5), 0 0 80px -10px rgba(${rimColor},0.18)`,
      }}
    />
  );
}

export function SpaceBackground() {
  const { scrollY, progress: scrollYProgress } = usePageProgress();
  const { dim } = useAtmosphere();
  const reduce = useReduced();
  const farY = useTransform(scrollY, (v) => (reduce ? 0 : -v * 0.055));
  const dimOpacity = useTransform(dim, [0, 1], [0, 0.62]);
  // Nebula palette drifts through the journey: warm -> teal -> emerald -> warm
  const warm = useTransform(scrollYProgress, [0, 0.12, 0.3, 0.8, 1], [1, 0.7, 0.35, 0.45, 1]);
  const teal = useTransform(scrollYProgress, [0, 0.2, 0.45, 0.7, 1], [0.35, 0.8, 0.9, 0.5, 0.3]);
  const emerald = useTransform(scrollYProgress, [0, 0.35, 0.6, 0.85, 1], [0.2, 0.3, 0.85, 0.6, 0.25]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-space-0" aria-hidden>
      {/* base atmospheric illumination */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% -10%, #0f1a33 0%, #080d1b 45%, #050812 100%)",
        }}
      />
      {/* nebulas: large soft gradients, no filters */}
      <motion.div style={{ opacity: warm }} className="absolute inset-0">
        <div
          className="absolute -left-[20%] -top-[25%] h-[90vh] w-[90vw]"
          style={{ background: "radial-gradient(closest-side, rgba(245,194,66,0.10), rgba(232,165,49,0.04) 45%, transparent 75%)" }}
        />
      </motion.div>
      <motion.div style={{ opacity: teal }} className="absolute inset-0">
        <div
          className="absolute -bottom-[30%] -left-[15%] h-[100vh] w-[80vw]"
          style={{ background: "radial-gradient(closest-side, rgba(43,181,176,0.13), rgba(20,90,110,0.06) 50%, transparent 78%)" }}
        />
        <div
          className="absolute -right-[25%] top-[10%] h-[90vh] w-[70vw]"
          style={{ background: "radial-gradient(closest-side, rgba(52,86,170,0.16), rgba(22,36,84,0.08) 50%, transparent 80%)" }}
        />
      </motion.div>
      <motion.div style={{ opacity: emerald }} className="absolute inset-0">
        <div
          className="absolute right-[-10%] bottom-[-20%] h-[80vh] w-[70vw]"
          style={{ background: "radial-gradient(closest-side, rgba(28,110,86,0.16), rgba(15,59,51,0.08) 55%, transparent 80%)" }}
        />
      </motion.div>

      {/* Night Study dimming sits under the stars so they read brighter */}
      <motion.div className="absolute inset-0 bg-black" style={{ opacity: dimOpacity }} />

      <StarCanvas />

      {/* distant planets + orbital lines, very slow parallax */}
      <motion.div style={{ y: farY }} className="absolute inset-x-0 top-0 h-[400vh]">
        <Planet size={520} rim="gold" className="-right-[260px] top-[92vh] opacity-80 max-md:scale-[0.6]" />
        <svg className="absolute -right-[420px] top-[70vh] h-[900px] w-[1100px] opacity-[0.18]" viewBox="0 0 1100 900" fill="none">
          <ellipse cx="660" cy="450" rx="520" ry="150" stroke="url(#orb1)" strokeWidth="1" transform="rotate(-14 660 450)" />
          <defs>
            <linearGradient id="orb1" x1="0" x2="1">
              <stop offset="0" stopColor="#F5C242" stopOpacity="0" />
              <stop offset="0.5" stopColor="#F5C242" stopOpacity="0.9" />
              <stop offset="1" stopColor="#6FD6E8" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <Planet size={180} rim="cyan" className="left-[6%] top-[190vh] opacity-70 max-md:scale-75" />
        <svg className="absolute left-[-160px] top-[178vh] h-[420px] w-[700px] opacity-[0.14]" viewBox="0 0 700 420" fill="none">
          <ellipse cx="260" cy="210" rx="250" ry="70" stroke="#6FD6E8" strokeWidth="1" transform="rotate(12 260 210)" />
        </svg>
        <Planet size={760} rim="emerald" className="-left-[420px] top-[300vh] opacity-60" />
        <div className="absolute right-[18%] top-[240vh] h-1.5 w-1.5 rounded-full bg-[#ffe7ae] shadow-[0_0_24px_6px_rgba(245,194,66,0.35)]" />
        <div className="absolute left-[30%] top-[40vh] h-1 w-1 rounded-full bg-[#dff3ff] shadow-[0_0_18px_4px_rgba(111,214,232,0.35)]" />
      </motion.div>

      {/* grain */}
      <div className="grain absolute inset-0 opacity-[0.035]" />
      {/* vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(130% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />

      {/* opening blackout: the page starts in near darkness */}
      <motion.div
        className="absolute inset-0 bg-[#020308]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.4, ease: EASE, delay: 0.1 }}
      />
    </div>
  );
}
